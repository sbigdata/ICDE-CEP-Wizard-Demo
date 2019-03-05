import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal'
import Highlight from 'react-highlight'
import { DiagramEngine, DiagramModel, DefaultNodeModel, DiagramWidget } from 'storm-react-diagrams'
require("storm-react-diagrams/dist/style.min.css");

export default class Topology extends Component {

  state = {
    openRuleModal: false,
    currentRuleDetail: null,
    // roundRobin: {
    //   engine: new DiagramEngine(),
    //   model: new DiagramModel(),
    //   nodes: [],
    //   links: [],
    // },
    greedy: {
      engine: new DiagramEngine(),
      model: new DiagramModel(),
      nodes: [],
      links: [],
    },
    topologyData: this.props.topologyData
  }

  componentWillMount() {
    const { greedy } = this.state

    // roundRobin.engine.installDefaultFactories()
    greedy.engine.installDefaultFactories()

    // let roundRobinModels = this.buildTopology('roundRobin')
    let greedyModels = this.buildTopology('greedy')

    // roundRobinModels.forEach(item => { item.addListener({ selectionChanged: this.onSelectRoundRobinNode }) })
    greedyModels.forEach(item => { item.addListener({ selectionChanged: this.onSelectGreedyNode }) })

    // roundRobin.engine.setDiagramModel(roundRobin.model)
    greedy.engine.setDiagramModel(greedy.model)
  }

  componentDidMount() {
    // this.state.roundRobin.engine.zoomToFit()
    this.state.greedy.engine.zoomToFit()
  }

  buildTopology = algo => {
    let { nodes, links, model } = this.state[algo]
    let { streamDist, topology, jsonFile } = this.state.topologyData
    let ports = []

    for (let index = 0; index < topology.engine_num; index++) {
      let node = new DefaultNodeModel(`Machine ${index}`, 'rgb(220,20,60)')
      let port = node.addInPort(`Rule Sets ${index}`)
      node.setPosition(200 * (index + 1), 580)
      nodes.push(node)
      ports.push(port)
    }

    for (let index = 0; index < jsonFile.number_of_attributes; index++) {
      let node = new DefaultNodeModel(`Stream ${index}`, 'rgb(0,155,52)')
      node.setPosition(40 * (index + 1), 80 + (index % 5 * 80))
      jsonFile.attribute_names.forEach(attribute => {
        if (Object.values(attribute)[0] === Object.keys(jsonFile.input_rates[index])[0]) {
          let port = node.addOutPort(`${Object.keys(attribute)[0]}: ${Object.values(jsonFile.input_rates[index])[0]}`)
          ports.push({ index, element: port })
        }
      })
      nodes.push(node)
    }

    ports.map(port => {
      if (port.index !== undefined) {
        if (streamDist[port.index.toString()]) {
          streamDist[port.index.toString()].map(engine => {
            let link = port.element.link(ports[engine])
            return links.push(link)
          })
        }
      }
      return null
    })

    return model.addAll(...nodes, ...links)
  }

  // onSelectRoundRobinNode = ({ entity: { name, selected } }) => {
  //   if (selected && name) {
  //     let { ruleSets } = this.state.topologyData.roundRobin
  //     if (name.indexOf('Machine') !== -1 && ruleSets[Number(name.split(' ')[1])]) {
  //       this.handleOpenModal(ruleSets[Number(name.split(' ')[1])].replace(/\n{5}/g, '\n'))
  //     }
  //   }
  // }

  onSelectGreedyNode = ({ entity: { name, selected } }) => {
    if (selected && name) {
      let { ruleSets } = this.state.topologyData
      if (name.indexOf('Machine') !== -1 && ruleSets[Number(name.split(' ')[1])]) {
        this.handleOpenModal(ruleSets[Number(name.split(' ')[1])].replace(/\n{5}/g, '\n'))
      }
    }
  }

  handleOpenModal = rule => {
    if (rule) {
      this.setState({ currentRuleDetail: rule, openRuleModal: true })
    }
  }

  handleCloseModal = () => {
    this.setState({ openRuleModal: false })
  }

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={24} style={{ marginBottom: 24 }}>
          <Grid item xs={12}>
            <DiagramWidget maxNumberPointsPerLink={0} diagramEngine={this.state.greedy.engine} />
          </Grid>
        </Grid>
        <Modal aria-labelledby="rule-detail-modal" aria-describedby="show-rule-detail" open={this.state.openRuleModal} onClose={this.handleCloseModal} >
          <div style={{ top: '50% - 480px', left: '25%', position: 'absolute' }}>
            <Highlight className="java">{this.state.currentRuleDetail}</Highlight>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}
