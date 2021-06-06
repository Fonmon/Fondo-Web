import React from 'react';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

// templates
import history from '../../resources/templates/history.json';
import visionMision from '../../resources/templates/visionMision.json';
import statutes from '../../resources/templates/statutes.json';
import regulation from '../../resources/templates/regulation.json';
import directive from '../../resources/images/directive.jpg';
import power from '../../resources/templates/power.json';

import ContainerComponent from '../base/ContainerComponent';
import { HOST_APP } from '../../utils/Constants';
import ProceedingsDialog from '../dialogs/ProceedingsDialog.js';

class FondoInfoPage extends ContainerComponent{

    constructor(){
        super();
        this.state = {
            dialogOpen: false,
            dialogTitle: '',
            dialogContent: '',
            dialogOpenImg: false,
            dialogProceedingsOpen: false
        }
    }

    handlerClick(file){
        this.setState({
            dialogTitle: file.title,
            dialogOpen: true
        });

        this.resolveJsonVariables(file.body,'HOST_APP',HOST_APP);
    }

    resolveJsonVariables(content,from,to){
        let pattern = '{{'+from+'}}';
        content = content.replace(new RegExp(pattern,'g'),to);
        this.setState({dialogContent:content});
    }

    handlerClickImg(title,file){
        this.setState({
            dialogTitle:title,
            dialogOpenImg:true,
            dialogContent:file
        });
    }

    handleClose = () => {
        this.setState({dialogOpen: false});
    }

    handleCloseImg = () => {
        this.setState({dialogOpenImg: false});
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    renderOneMidColGrid={true}
                    middle={
                        <Paper className="UserInfo" elevation={20}>
                            <h2 style={{textAlign:'center'}}>Información del fondo</h2>
                            <MenuItem onClick={this.handlerClick.bind(this, history)} >Historia del fondo</MenuItem>
                            <MenuItem onClick={this.handlerClick.bind(this, visionMision)} >Visión y misión</MenuItem>
                            <MenuItem onClick={this.handlerClick.bind(this, statutes)} >Estatutos</MenuItem>
                            <MenuItem onClick={this.handlerClick.bind(this, regulation)} >Reglamento mesa directiva</MenuItem>
                            <MenuItem onClick={this.handlerClickImg.bind(this, "Mesa directiva", directive)} >Mesa directiva</MenuItem>
                            {/* <MenuItem onClick={this.handlerClick.bind(this, power)} >Poder asamblea</MenuItem> */}
                            <MenuItem onClick={() => this.setState({dialogProceedingsOpen: true})} >Copias de actas</MenuItem>
                        </Paper>
                    }
                />
                <Dialog onClose={this.handleClose}
                    open={this.state.dialogOpen}
                    aria-labelledby="dialog-text-info"
                >
                    <DialogTitle id="dialog-text-info">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <span dangerouslySetInnerHTML={{__html:this.state.dialogContent}} className="dialogContent">
                        </span>
                    </DialogContent>
                </Dialog>
                <Dialog aria-labelledby="dialog-img-info"
                    onClose={this.handleCloseImg}
                    open={this.state.dialogOpenImg}
                >
                    <DialogTitle id="dialog-img-info">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <center><img style={{width:'100%'}} src={this.state.dialogContent} alt="" /></center>
                    </DialogContent>
                </Dialog>
                <ProceedingsDialog open={this.state.dialogProceedingsOpen}
                    onClose={() => this.setState({dialogProceedingsOpen: false})} />
            </div>
        );
    }
}

export default FondoInfoPage;
