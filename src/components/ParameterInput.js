import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Highlight from 'react-highlight'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip'

export default class ParameterInput extends Component {

    handleStreamChange = event => {
        let newValue = Math.abs(Number(event.target.value))
        let { specification } = this.props
        if (newValue > specification['number_of_streams']) {
            let diff = newValue - specification['number_of_streams']
            for (let i = 0; i < diff; i++) {
                specification['input_rates'].push({ [`At${specification['number_of_streams'] + i}`]: 0.05 })
                specification['stream_names'].push({ [`At${specification['number_of_streams'] + i}_Name`]: `At${specification['number_of_streams'] + i}` })
                // specification['data_types'].push({ [`At${specification['number_of_streams'] + i}`]: 'Double' })
            }
        } else {
            let diff = specification['number_of_streams'] - newValue
            for (let i = 0; i < diff; i++) {
                specification['input_rates'].pop()
                specification['stream_names'].pop()
                // specification['data_types'].pop()
            }
        }
        specification['number_of_streams'] = newValue
        this.props.onConfirmData(specification)
    }

    handleMachineChange = event => {
        let { specification } = this.props
        specification['number_of_machines'] = Number(event.target.value)
        this.props.onConfirmData(specification)
    }

    // handleDataTypeChange = index => event => {
    //     let { specification } = this.props
    //     specification['data_types'][index]['At' + index] = event.target.value
    //     this.props.onConfirmData(specification)
    // }

    handleInputRateChange = index => event => {
        let { specification } = this.props
        specification['input_rates'][index]['At' + index] = +event.target.value
        this.props.onConfirmData(specification)
    }

    handleStreamNameChange = index => event => {
        let { specification } = this.props
        delete specification['stream_names'][index][Object.keys(specification['stream_names'][index])]
        specification['stream_names'][index][event.target.value] = "At" + index
        this.props.onConfirmData(specification)
    }

    renderStreamAttribute = n => {
        let { specification } = this.props
        let attributes = []
        for (let i = 0; i < n; i++) {
            attributes.push(<div key={`stream-${i}`} style={{ display: 'flex' }}>
                <label style={{ marginRight: 16, marginTop: 16 }}>At{i}</label>
                <Tooltip title='Fixed by the dataset (DTG)' placement="top">
                    <FormControl autoComplete='off' noValidate>
                        <TextField disabled={true} style={{ marginRight: 16, marginTop: 0 }} id={`stream-${i}-name`} label={`Name of At ${i}`} value={Object.keys(specification.stream_names[i])} onChange={this.handleStreamNameChange(i)} margin='normal' />
                    </FormControl>
                </Tooltip>
                <FormControl autoComplete='off' noValidate>
                    <TextField type='number' style={{ marginRight: 16, marginTop: 0, width: 200 }} id={`stream-${i}-input-rate`} label={`Input Rate of At ${i} (Sec)`} value={specification.input_rates[i]['At' + i]} onChange={this.handleInputRateChange(i)} margin='normal' inputProps={{ max: 1, min: 0, step: 0.001 }} />
                </FormControl>
                {/* <FormControl style={{ width: 200 }} autoComplete='off' noValidate>
                    <InputLabel shrink htmlFor="number-of-machine-label"> Data Type </InputLabel>
                    <Select value={specification.data_types[i]['At' + i]} onChange={this.handleDataTypeChange(i)} input={<Input name="number-of-machine" id="number-of-machine-label" />} displayEmpty name="number-of-machine" >
                        <MenuItem disabled value={-1}>Select Data Type of At{i}</MenuItem>
                        <MenuItem value={'Double'}>Double</MenuItem>
                        <MenuItem value={'Integer'}>Integer</MenuItem>
                        <MenuItem value={'String'}>String</MenuItem>
                    </Select>
                </FormControl> */}
            </div >)
        }
        return attributes
    }

    render() {
        const { specification } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Cluster Specification</Typography>
                            <Tooltip title='Fixed by the dataset (DTG)' placement="top">
                                <FormControl autoComplete='off' noValidate>
                                    <TextField disabled={true} style={{ marginRight: 16, marginTop: 0 }} inputProps={{ min: 1 }} id='number-of-stream' type='number' label='Number of Streams' value={specification.number_of_streams} onChange={this.handleStreamChange} margin='normal' />
                                </FormControl>
                            </Tooltip>
                            <FormControl style={{ width: 240 }} autoComplete='off' noValidate>
                                <InputLabel shrink htmlFor="number-of-machine-label"> Number of Machines </InputLabel>
                                <Select value={specification.number_of_machines} onChange={this.handleMachineChange} input={<Input name="number-of-machine" id="number-of-machine-label" />} displayEmpty name="number-of-machine" >
                                    <MenuItem disabled value={-1}>Select Number of Machines</MenuItem>
                                    <MenuItem value={1}>1 Machine</MenuItem>
                                    <MenuItem value={2}>2 Machines</MenuItem>
                                    <MenuItem value={3}>3 Machines</MenuItem>
                                    <MenuItem value={4}>4 Machines</MenuItem>
                                    <MenuItem value={5}>5 Machines</MenuItem>
                                </Select>
                            </FormControl>

                            {this.renderStreamAttribute(specification.number_of_streams)}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Cluster Specification</Typography>
                            <Highlight className="javascript">{JSON.stringify(specification, null, 2)}</Highlight>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}
