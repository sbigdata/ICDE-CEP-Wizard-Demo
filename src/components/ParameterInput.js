import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';

// class JSONData {
//     input_rates: [{ "At1": 0.1 }], stream_names: [{ "1", "At1" }], data_types: [{ "At1": "Double" }, number_of_streams: n, number_of_machines: m]
// }

export default class ParameterInput extends Component {
    render() {
        const { onSelectScenario, scenario } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>

                    <br />
                </Grid>
            </Grid>
        )
    }
}
