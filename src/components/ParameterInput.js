import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

// class JSONData {
//     input_rates: [{ "At1": 0.1 }], stream_names: [{ "1", "At1" }], data_types: [{ "At1": "Double" }, number_of_streams: n, number_of_machines: m]
// }

export default class ParameterInput extends Component {
    state = {
        numberOfStream: 1,
        numberOfMachine: 1
    }

    handleChange = name => event => {
        switch (name) {
            case 'numberOfMachine':
                if (event.target.value > 5) {
                    this.setState({ [name]: 5 });
                } else if (event.target.value < 0) {
                    this.setState({ [name]: 1 });
                } else {
                    this.setState({ [name]: event.target.value });
                }
                break;
            default:
                this.setState({ [name]: event.target.value });
                break;
        }
    }

    renderStreamAttribute = n => {
        let attributes = []
        for (let i = 0; i < n; i++) {
            attributes.push(<div key={`stream-${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ marginRight: 16 }}>At{i}</label>
                <TextField style={{ marginRight: 16 }} id={`stream-${i}-name`} label={`Name of At ${i}`} value={this.state.numberOfMachine} onChange={this.handleChange('numberOfMachine')} margin='normal' />
                <TextField style={{ marginRight: 16 }} id={`stream-${i}-input-rate`} label={`Input Rate of At ${i}`} value={this.state.numberOfMachine} onChange={this.handleChange('numberOfMachine')} margin='normal' />
                <TextField id={`stream-${i}-date-type`} label={`Data Type of At ${i}`} value={this.state.numberOfMachine} onChange={this.handleChange('numberOfMachine')} margin='normal' />
            </div >)
        }
        return attributes
    }

    render() {
        const { onSelectScenario, scenario } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Cluster Specification</Typography>
                            <form autoComplete='off' noValidate>
                                <TextField style={{ marginRight: 16 }} id='number-of-stream' type='number' label='Number of Streams' value={this.state.numberOfStream} onChange={this.handleChange('numberOfStream')} margin='normal' />
                                <TextField id='number-of-machine' type='number' label='Number of Machines' value={this.state.numberOfMachine} onChange={this.handleChange('numberOfMachine')} margin='normal' />
                                {this.renderStreamAttribute(this.state.numberOfStream)}
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Rule Definition</Typography>
                            <form autoComplete='off' noValidate>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}
