import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles, Link } from '@material-ui/core';

import ContainerComponent from '../base/ContainerComponent';
import UploadFileDialog from './UploadFileDialog';
import Utils from '../../utils/Utils';
import LoadingMaskComponent from '../base/LoadingMaskComponent';

const styles = {
    uploadBtn: {
      float: 'right'
    },
};

class ListFilesDialog extends ContainerComponent {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            openUploadFile: false,
            loading: false
        }
    }

    componentDidMount() {
        this.getFiles();
    }

    getFiles() {
        this.setState({loading: true});
        Utils.getFiles(this.props.fileType)
            .then((response) => {
                this.setState({
                    loading: false,
                    files: response.data
                })
            }).catch((error) => {
                this.setState({ loading: false });
                this.handleRequestError(error);
            });
    }

    fileUploadedClose = () => {
        this.setState({openUploadFile: false});
        this.getFiles();
    }

    openFile(fileId) {
        this.setState({loading: true});
        Utils.getFileUrl(fileId)
            .then((response) => {
                this.setState({
                    loading: false
                });
                window.open(response.data.url, '_blank');
            }).catch((error) => {
                this.setState({ loading: false });
                this.handleRequestError(error);
            });
    }

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Dialog open={this.props.open}
                    onClose={this.props.onClose}>
                    <DialogTitle>
                        {this.props.title}
                        {Utils.isAdmin() && 
                            <IconButton className={classes.uploadBtn}
                                onClick={() => this.setState({openUploadFile: true})} 
                                component="span">
                                <CloudUploadIcon />
                            </IconButton>
                        }
                    </DialogTitle>
                    <DialogContent>
                        <LoadingMaskComponent active={this.state.loading} />
                        {this.state.files.length === 0 && 
                            <center><p>No hay archivos cargados aún</p></center>
                        }
                        {this.state.files.map((file) => (
                            <div key={file.id}>
                                <Link component="button"
                                    onClick={() => this.openFile(file.id)}
                                >
                                    {file.display_name}
                                </Link>
                                <br />
                            </div>
                        ))}
                    </DialogContent>
                </Dialog>
                <UploadFileDialog open={this.state.openUploadFile}
                    onClose={() => this.fileUploadedClose()} 
                    type={this.props.fileType} allowedFiles={[".pdf"]}/>
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

export default withStyles(styles)(ListFilesDialog);