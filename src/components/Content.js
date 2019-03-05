import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';
import UserInput from './UserInput'
import Topology from './Topology'
import StormOutput from './StormOutput'
import OpenInNew from '@material-ui/icons/OpenInNewOutlined'

const SERVER = 'http://18.233.192.106'
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
                <Typography variant="h6">1. User Input</Typography>
                <UserInput setTopologyAndStormCode={this.setTopologyAndStormCode} />
                {
                    this.state.data ?
                        <React.Fragment>
                            <Typography variant="h6">2. Stream Rule Graph</Typography>
                            <Topology topologyData={this.state.data} />
                            <Typography variant="h6">3. Storm Output (Storm UI <a target='blank' href={`${SERVER}:8080`}><OpenInNew /></a>)</Typography>
                            <StormOutput topologyData={this.state.data} />
                        </React.Fragment>
                        : null
                }
            </div>
        );
    }
}