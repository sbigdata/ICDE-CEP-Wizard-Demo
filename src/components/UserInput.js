import React, { Component } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Highlight from 'react-highlight'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import ScenarioInput from './ScenarioInput'
import ParameterInput from './ParameterInput'
import FileInput from './FileInput'

const SERVER = 'http://18.233.192.106'


export default class UserInput extends Component {
    state = {
        files: [],
        acceptedFile: ['json', 'drl'],
        inputType: 'scenario',
        isLoading: false,
        scenario: -1,
        textStatus: '',
        dataPreview: '',
        clusterPreview: '',
        drlPreview: '',
        server: {
            url: `${SERVER}/upload`,
            process: {
                onload: res => this.handlePondFile(res)
            }
        }
    }

    handleInit() { }

    handleUpdateFile = fileItems => {
        let newFiles = fileItems.map(fileItem => fileItem.file)
        if (newFiles.length === 1) {
            newFiles.map(nf => {
                if (nf.file.name.split('.')[1] === 'drl') {
                    alert('drl!')
                    this.setState({ dataPreview: '', clusterPreview: '' })
                } else if (nf.file.name.split('.')[1] === 'json') {
                    alert('json')
                    this.setState({ drlPreview: '' })
                }
            })
        } else if (newFiles.length === 0) {
            this.setState({ dataPreview: '', clusterPreview: '', drlPreview: '' })
        }
        this.setState({ files: newFiles });
    }

    handleInputChange = ({ target }) => {
        this.setState({
            inputType: target.value, files: [], textStatus: '',
            dataPreview: '',
            clusterPreview: '',
            drlPreview: '',
        })
    }

    handleChange = async ({ target }) => {
        this.setState({ isLoading: true, [target.name]: target.value })
        if (target.value > 0) {
            let { data } = await axios.get(`${SERVER}/topology/scenario/${target.value}`)
            // let { data } = await axios.get(`http://dmserver3.kaist.ac.kr/topology/scenario/${target.value}`)
            if (data.status === 200) {
                data.files.map(file => this.handlePondFile(file))
                this.setState({ files: data.files })
            } else {
                alert(data.message)
            }
        }
        this.setState({ isLoading: false });
    }

    handleGenerateTopoloy = async () => {
        this.props.setTopologyAndStormCode(null)
        this.setState({ isLoading: true })
        // let second = 0
        // let statusInterval = setInterval(() => {
        //     second++
        //     if (second < 3) {
        //         this.setState({ textStatus: 'Rule Allocating...' })
        //     } else if (second < 11) {
        //         this.setState({ textStatus: 'Building Topology...' })
        //     } else if (second < 13) {
        //         this.setState({ textStatus: 'Submitting Topology...' })
        //     } else if (second < 15) {
        //         this.setState({ textStatus: 'Generating Sample streams...' })
        //     } else {
        //         this.setState({ textStatus: 'Finishing and Retrieving files...' })
        //     }
        // }, 1000)
        let { data } = await axios.post(`${SERVER}/topology`, { scenario: this.state.scenario })
        if (data.status === 200) {
            // clearInterval(statusInterval)
            this.props.setTopologyAndStormCode(data.data)
        } else {
            alert(data.message)
        }
        this.setState({ isLoading: false, textStatus: '' });
    }

    handlePondFile = file => {

        file = this.state.inputType === 'file-input' ? JSON.parse(file) : file

        switch (file.ext) {
            case 'json':
                let clusterPreview = JSON.parse(file.content)
                delete clusterPreview.input_rates
                delete clusterPreview.attribute_names
                delete clusterPreview.data_types
                this.setState({ dataPreview: file.content.replace(/,\s*"number_of_attributes":\s*\d*,.*\s*"number_of_workers":\s*\d*/ig, '').replace('attribute_names', 'stream_names'), clusterPreview: JSON.stringify(clusterPreview).replace('number_of_attributes', 'number_of_streams').replace('number_of_workers', 'number_of_machines') })
                break
            case 'drl':
                this.setState({ drlPreview: file.content })
                break
            default:
                break
        }
    }

    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Input Method</FormLabel>
                        <RadioGroup style={{ flexDirection: 'row' }} aria-label="Input Type" name="input-type" value={this.state.inputType} onChange={this.handleInputChange} >
                            <FormControlLabel value='scenario' control={<Radio />} label="Scenario" />
                            <FormControlLabel value='file-input' control={<Radio />} label="File Upload" />
                            <FormControlLabel value='form-input' control={<Radio />} label="Form Input" />
                        </RadioGroup>
                    </FormControl>
                    {
                        this.state.inputType === 'scenario' ? <ScenarioInput scenario={this.state.scenario} onSelectScenario={this.handleChange} />
                            : this.state.inputType === 'file-input' ? <FileInput files={this.state.files} server={this.state.server} onInit={this.handleInit} onUpdateFile={this.handleUpdateFile} />
                                : <ParameterInput />
                    }
                </Grid>
                <Grid container spacing={24} justify="center" alignItems="center">
                    <Grid container spacing={24} item xs={12}>
                        {
                            this.state.dataPreview !== '' ?
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography style={{ fontSize: 24 }} color="textSecondary" gutterBottom> Data Specification</Typography>
                                            <Highlight className="javascript input-preview">{this.state.dataPreview}</Highlight>
                                        </CardContent>
                                    </Card>
                                </Grid> : null
                        }

                        {
                            this.state.drlPreview !== '' ?
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography style={{ fontSize: 24 }} color="textSecondary" gutterBottom> Rule Definition </Typography>
                                            <Highlight className="java input-preview">{this.state.drlPreview}</Highlight>
                                        </CardContent>
                                    </Card>
                                </Grid> : null
                        }

                        {
                            this.state.clusterPreview !== '' ?
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography style={{ fontSize: 24 }} color="textSecondary" gutterBottom> Cluster Specification</Typography>
                                            <Highlight className="javascript input-preview">{this.state.clusterPreview}</Highlight>
                                        </CardContent>
                                    </Card>
                                </Grid> : null
                        }
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.textStatus}
                        <Button style={{ marginBottom: 48 }} disabled={(this.state.dataPreview === '' && this.state.drlPreview === '') || this.state.isLoading} variant="contained" color="primary" onClick={this.handleGenerateTopoloy} fullWidth> {this.state.isLoading ? 'Generating Topology, Please Wait!' : 'Generate Topology!'}</Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
