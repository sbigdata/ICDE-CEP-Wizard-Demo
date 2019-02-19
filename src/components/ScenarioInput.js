import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import 'filepond/dist/filepond.min.css';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default class ScenarioInput extends Component {
    render() {
        const { onSelectScenario, scenario } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <form autoComplete="off">
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel shrink htmlFor="scenario-label"> Scenario </InputLabel>
                            <Select value={scenario} onChange={onSelectScenario} input={<Input name="scenario" id="scenario-label" />} displayEmpty name="scenario" >
                                <MenuItem disabled value={-1}>Select a Scenario</MenuItem>
                                <MenuItem value={2}>Scenario 1 (DTG Data)</MenuItem>
                                <MenuItem value={1}>Scenario 2 (Synthetic Data)</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                    <br />
                </Grid>
            </Grid>
        )
    }
}
