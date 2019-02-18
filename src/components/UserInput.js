import React, { Component } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Highlight from 'react-highlight'

export default class ScenarioInput extends Component {
    state = {
        files: [],
        isLoading: false,
        scenario: -1,
        textStatus: '',
        dataPreview: '',
        clusterPreview: '',
        drlPreview: '',
        server: {
            url: '/upload',
            process: {
                onload: res => this.handlePondFile(res)
            }
        }
    }

    handleInit() {
    }

    handleUpdateFile = fileItems => {
        this.setState({ files: fileItems.map(fileItem => fileItem.file) });
    }

    handleChange = async ({ target }) => {
        this.setState({ isLoading: true, [target.name]: target.value })
        if (target.value > 0) {
            let { data } = await axios.get(`http://dmserver3.kaist.ac.kr/topology/scenario/${target.value}`)
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
        let second = 0
        let statusInterval = setInterval(() => {
            second++
            if (second < 3) {
                this.setState({ textStatus: 'Rule Allocating...' })
            } else if (second < 11) {
                this.setState({ textStatus: 'Building Topology...' })
            } else if (second < 13) {
                this.setState({ textStatus: 'Submitting Topology...' })
            } else if (second < 15) {
                this.setState({ textStatus: 'Generating Sample streams...' })
            } else {
                this.setState({ textStatus: 'Finishing and Retrieving files...' })
            }
        }, 1000)
        let { data } = await axios.post('http://dmserver3.kaist.ac.kr/topology', { scenario: this.state.scenario })
        if (data.status === 200) {
            clearInterval(statusInterval)
            this.props.setTopologyAndStormCode(data)
        } else {
            alert(data.message)
        }
        this.setState({ isLoading: false, textStatus: '' });
    }

    handlePondFile = file => {
        // file = JSON.parse(file)
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
                    <form autoComplete="off">
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel shrink htmlFor="scenario-label"> Scenario </InputLabel>
                            <Select value={this.state.scenario} onChange={this.handleChange} input={<Input name="scenario" id="scenario-label" />} displayEmpty name="scenario" >
                                <MenuItem disabled value={-1}>Select a Scenario</MenuItem>
                                {/* <MenuItem value={0}>User Defined Scenario</MenuItem> */}
                                <MenuItem value={2}>Scenario 1 (DTG Data)</MenuItem>
                                <MenuItem value={1}>Scenario 2 (Synthetic Data)</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                    <br />
                </Grid>
                <Grid container spacing={24} justify="center" alignItems="center">
                    {this.state.dataPreview !== '' && this.state.drlPreview !== '' && this.state.clusterPreview !== '' ? <React.Fragment>
                        <Grid item xs={4}>
                            <Card>
                                <CardContent>
                                    <Typography style={{ fontSize: 24 }} color="textSecondary" gutterBottom> Data Specification</Typography>
                                    <Highlight className="javascript input-preview">{this.state.dataPreview}</Highlight>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                                <CardContent>
                                    <Typography style={{ fontSize: 24 }} color="textSecondary" gutterBottom> Rule Definition </Typography>
                                    <Highlight className="java input-preview">{this.state.drlPreview}</Highlight>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                                <CardContent>
                                    <Typography style={{ fontSize: 24 }} color="textSecondary" gutterBottom> Cluster Specification</Typography>
                                    <Highlight className="javascript input-preview">{this.state.clusterPreview}</Highlight>
                                </CardContent>
                            </Card>
                        </Grid>
                    </React.Fragment> : null
                    }

                    <Grid item xs={4}>
                        {this.state.textStatus}
                        {/* {this.state.isLoading ? <LinearProgress /> : null} */}
                        <Button style={{ marginBottom: 48 }} disabled={(this.state.dataPreview === '' && this.state.drlPreview === '') || this.state.isLoading} variant="contained" color="primary" onClick={this.handleGenerateTopoloy} fullWidth> {this.state.isLoading ? 'Generating Topology, Please Wait!' : 'Generate Topology!'}</Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
