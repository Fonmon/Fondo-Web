import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';

// templates
import history from '../resources/templates/history.json';
import visionMision from '../resources/templates/visionMision.json';
import statutes from '../resources/templates/statutes.json';
import regulation from '../resources/templates/regulation.json';
import directive from '../resources/images/directive.jpg';
import proceedings from '../resources/templates/proceedings.json';
import power from '../resources/templates/power.json';

class FondoInfo extends Component{
    constructor(){
        super();
        this.state = {
            dialogOpen: false,
            dialogTitle: '',
            dialogContent: '',
            dialogOpenImg:false
        }
    }

    handlerClick(file){
        this.setState({
            dialogTitle:file.title,
            dialogOpen:true,
            dialogContent:file.body
        });
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
                <Header />
                <Grid fluid>
                    <Row>
                        <Col smOffset={3} sm={6} >
                            <Paper className="UserInfo" zDepth={5}>
                                <h2 style={{textAlign:'center'}}>Información del fondo</h2>
                                <MenuItem onClick={this.handlerClick.bind(this,history)} primaryText="Historia del fondo" />
                                <MenuItem onClick={this.handlerClick.bind(this,visionMision)} primaryText="Visión y misión" />
                                <MenuItem onClick={this.handlerClick.bind(this,statutes)} primaryText="Estatutos" />
                                <MenuItem onClick={this.handlerClick.bind(this,regulation)} primaryText="Reglamento mesa directiva" />
                                <MenuItem onClick={this.handlerClickImg.bind(this,"Mesa directiva",directive)} primaryText="Mesa directiva" />
                                <MenuItem onClick={this.handlerClick.bind(this,power)} primaryText="Poder asamblea" />
                                <MenuItem onClick={this.handlerClick.bind(this,proceedings)} primaryText="Copias de actas" />
                            </Paper>
                        </Col>
                    </Row>
                </Grid>
                <Dialog
                    title={this.state.dialogTitle}
                    modal={false}
                    autoScrollBodyContent={true}
                    contentStyle={{width:'95%',maxWidth:'none'}}
                    onRequestClose={this.handleClose}
                    open={this.state.dialogOpen}>
                    <span dangerouslySetInnerHTML={{__html:this.state.dialogContent}} className="dialogContent">
                    </span>
                </Dialog>
                <Dialog
                    title={this.state.dialogTitle}
                    modal={false}
                    autoScrollBodyContent={true}
                    contentStyle={{width:'95%',maxWidth:'none'}}
                    onRequestClose={this.handleCloseImg}
                    className="dialogImage"
                    open={this.state.dialogOpenImg}>
                    <center><img src={this.state.dialogContent} alt="" /></center>
                </Dialog>
            </div>
        );
    }
}

export default FondoInfo;