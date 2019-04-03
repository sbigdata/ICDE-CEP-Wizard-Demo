import React, { Component } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Folder from '@material-ui/icons/FolderOutlined'
import Casino from '@material-ui/icons/CasinoOutlined'
import InsertDriveFile from '@material-ui/icons/InsertDriveFileOutlined'
import Typography from '@material-ui/core/Typography'
import Highlight from 'react-highlight'
import Button from '@material-ui/core/Button'
import { database } from '../firebase'

const SERVER = 'http://18.233.192.106'
const IconWithText = ({ children, level }) => <div style={{ display: 'flex', paddingLeft: 24 * level }}>{children}</div>

export default class StormOutput extends Component {

	state = {
		isLoading: false,
		realtimeLogs: []
	}

	componentDidMount() {
		let realtimeLogs = this.state.realtimeLogs.slice()
		setInterval(() => {
			database.ref('/storm').orderByKey().once('value', snapshot => {
				realtimeLogs = []
				snapshot.forEach(log => {
					realtimeLogs.unshift(`${log.key} -> ${log.val().message}`)
				})
				this.setState({ realtimeLogs: realtimeLogs.slice(0, 500) })
			})
		}, 1000)
	}

	handleKillTopology = async () => {
		this.setState({ isLoading: true })
		let { data } = await axios.post(`${SERVER}/topology/kill`)
		if (data.status === 200) {
			alert('CEP-Wizard was successfully killed 😵!')
			window.location.reload()
		} else {
			alert(data.message)
		}
		this.setState({ isLoading: false })
	}

	renderResources = engine_num => {
		let resources = []
		for (let index = 0; index < engine_num; index++) {
			resources.push(<IconWithText level={3}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>rulesets{index}</Typography></IconWithText>)
		}

		return resources
	}

	render() {
		return (
			<React.Fragment>
				<Grid container spacing={24}>
					<Grid item xs={7}>
						<Typography variant='subtitle1'>RA Topology Source Code</Typography>
						<Highlight className='java'>
							{this.props.topologyData.topologyCode}
						</Highlight>
					</Grid>
					<Grid item xs={5}>
						<Typography variant='subtitle1'>Topology Specification</Typography>
						<Highlight className='javascript'>
							{JSON.stringify(this.props.topologyData.topology)}
						</Highlight>
						<Typography variant='subtitle2'>Project Structure</Typography>
						<IconWithText level={0}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>src</Typography></IconWithText>
						<IconWithText level={1}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>main</Typography></IconWithText>
						<IconWithText level={2}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>java</Typography></IconWithText>
						<IconWithText level={3}><Casino style={{ marginRight: 8 }} /> <Typography variant='body1'>com.yooju.storm.stormdrools</Typography></IconWithText>
						<IconWithText level={4}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>RATopology.java</Typography></IconWithText>
						<IconWithText level={2}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>resources</Typography></IconWithText>
						{
							this.renderResources(this.props.topologyData.topology.engine_num)
						}
						<IconWithText level={3}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>EngineDist.json</Typography></IconWithText>
						<IconWithText level={3}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>StreamDist.json</Typography></IconWithText>
						<IconWithText level={3}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>Topology.json</Typography></IconWithText>
					</Grid>

					<Grid item xs={12}>
						<Typography variant='h6'>Rule Output</Typography>
						<Highlight className='http'>
							{this.state.realtimeLogs.join('\n')}
						</Highlight>
					</Grid>
				</Grid>
				<Grid container spacing={24} justify="center" alignItems="center">
					<Grid item xs={4}>
						<Button style={{ marginBottom: 48 }} disabled={this.state.isLoading} variant="contained" color="secondary" onClick={this.handleKillTopology} fullWidth> {this.state.isLoading ? 'Killing in progress, Please Wait!' : 'Kill the Topology!'}</Button>
					</Grid>
				</Grid>
			</React.Fragment>
		)
	}
}
