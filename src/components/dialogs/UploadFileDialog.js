import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core';

import ContainerComponent from '../base/ContainerComponent';
import LoadingMaskComponent from '../base/LoadingMaskComponent';
import Utils from '../../utils/Utils';

const styles = {
    uploadBtn: {
      float: 'right'
    },
};

class UploadFileDialog extends ContainerComponent {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            loading: false
        }
    }

    uploadFile = (file) => {
        const regex = new RegExp(`(${this.props.allowedFiles.join("|")})$`, "i");
        if (!file) {
            return;
        } else if (!file.name.match(regex)) {
            return this.showMessageError(`El archivo a subir debe ser ${this.props.allowedFiles.join(",")}`);
        } else {
            this.setState({ loading: true });
            let formData = new FormData();
            formData.append('file', file);
            formData.append('name', this.state.displayName);
            formData.append('type', this.props.type);
            Utils.saveFile(formData)
                .then((_) => {
                    this.setState({ loading: false });
                    this.showMessageError('Archivo cargado.');
                    this.props.onClose();
                }).catch((error) => {
                    this.setState({ loading: false });
                    this.handleRequestError(error);
                });
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Dialog open={this.props.open}
                    onClose={this.props.onClose}>
                    <DialogTitle>
                        Subir archivo
                    </DialogTitle>
                    <DialogContent>
                        <LoadingMaskComponent active={this.state.loading} />
                        <TextField placeholder="Nombre del archivo"
                            label="Nombre"
                            style={{width:'80%'}}
                            onChange = {(event) => this.setState({displayName: event.target.value})}
                        />
                        <React.Fragment>
                            <input type="file"
                                accept={this.props.allowedFiles.join(",")}
                                onChange={e => this.uploadFile(e.target.files[0])}
                                style={{ display: 'none' }}
                                id="upload-file"
                            />
                            <label htmlFor="upload-file">
                                <IconButton className={classes.uploadBtn}
                                    component="span">
                                    <CloudUploadIcon />
                                </IconButton>
                            </label>
                        </React.Fragment>
                    </DialogContent>
                </Dialog>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={() => this.setState({openMessage: false})}
                />
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(UploadFileDialog);