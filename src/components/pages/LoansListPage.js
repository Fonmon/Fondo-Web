import React, { Component } from 'react';
import Header from '../base/Header';
import LoanListComponent from '../base/LoanListComponent';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import LoadingMask from '../base/LoadingMask';
import Utils from '../../utils/Utils';

class LoansList extends Component {

    constructor(){
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            loading:false
        }
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    handleUpdateLoad = (file) =>{
        let scope = this;
        if(!file)
            return;
        if(!file.name.match(/.(txt)$/i)){
            this.showMessageError("El archivo a subir debe ser .txt");
            return;
        }else{
            this.setState({loading:true});
            let formData = new FormData();
            formData.append('file',file);
            Utils.updateLoansLoad(formData)
            .then(function(response){
                scope.setState({loading:false});
                scope.showMessageError('Actualización realizada.');
            }).catch(function(error){
                scope.setState({loading:false});
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 401){
                    Utils.clearStorage();
                }else{
                    scope.showMessageError(error.message);
                }
            });
        }
    }

    handleRequestClose = () => {
        this.setState({
            openMessage: false
        });
    }

    render() {
        return (
            <div>
                <Header />
                <LoadingMask active={this.state.loading} />
                <Grid fluid>
                    <Row>
                        <Col xs={12} >
                            <RaisedButton label="Cargar información" 
                                primary={true} 
                                style={{marginTop:'30px',width:'100%'}}
                                disabled={!Utils.isAuthorized()}
                                containerElement='label'>
                                <input type="file" 
                                    onChange={e => this.handleUpdateLoad(e.target.files[0])}
                                    style={{ display: 'none' }} />
                            </RaisedButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} >
                            <LoanListComponent all={true} 
                                applicantColumn={true}/>
                        </Col>
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                    />
            </div>
        );
    }
}

export default LoansList;
