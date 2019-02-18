import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';
import UserInput from './UserInput'
import Topology from './Topology'
import StormOutput from './StormOutput'

export default class Content extends Component {
    state = {
        data: null,
    }

    setTopologyAndStormCode = data => {
        this.setState({ data })
    }

    render() {
        return (
            <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                <Typography variant="h6">1. Scenario Input</Typography>
                <UserInput setTopologyAndStormCode={this.setTopologyAndStormCode} />
                {
                    this.state.data ?
                        <React.Fragment>
                            <Typography variant="h6">2. Stream Rule Graph</Typography>
                            <Topology topologyData={this.state.data} />
                            <Typography variant="h6">3. Storm Output</Typography>
                            <StormOutput topologyData={this.state.data} />
                        </React.Fragment>
                        : null
                }
            </div>
        );
    }
}