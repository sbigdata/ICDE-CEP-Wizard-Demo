import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import 'filepond/dist/filepond.min.css';
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType)

export default class FileInput extends Component {
    detechFileType = (source, type) => new Promise((resolve, reject) => {
        if (['json'].includes(source.name.split('.')[1])) {
            resolve('.' + source.name.split('.')[1])
        } else {
            reject()
        }
    })

    render() {
        const { onUpdateFile, onInit, files, server } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <FilePond acceptedFileTypes={['.json']} fileValidateTypeDetectType={this.detechFileType} ref={ref => this.pond = ref} allowMultiple={true} maxFiles={1} server={server} oninit={onInit} onupdatefiles={onUpdateFile}>
                        {
                            files.map(file => (
                                <File key={file} src={file} origin="local" />
                            ))
                        }
                    </FilePond>
                    <br />
                </Grid>
            </Grid >
        )
    }
}
