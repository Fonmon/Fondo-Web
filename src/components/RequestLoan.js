import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Utils from '../utils/Utils';
import LoadingMask from './LoadingMask';

class RequestLoan extends Component{
    constructor(){
        super();
        this.state = {
            openMessage:false,
            errorMessage:'',
            value:0,
            payment:0,
            timelimit:0,
            fee:0,
            comments: '',
            disbursement_date:null,
            value_error:'',
            timelimit_error:'',
            disbursement_date_error:'',
            loading:false
        }
    }

    handleSubmit(){
        let isError = false;
        if(!this.state.disbursement_date){
            isError = true;
            this.setState({disbursement_date_error:'Campo requerido'});
        }else
            this.setState({disbursement_date_error:''});
        if(!this.state.timelimit ){
            isError = true;
            this.setState({timelimit_error:'Campo requerido'});
        }else if(this.state.timelimit <= 0 || this.state.timelimit > 24){
            isError = true;
            this.setState({timelimit_error:'Valor debe ser entre 1 y 24'});
        }else
            this.setState({timelimit_error:''});
        if(!this.state.value){
            isError = true;
            this.setState({value_error:'Campo requerido'});
        }else if(this.state.value < 0){
            isError = true;
            this.setState({value_error:'Valor debe ser mayor a 0'});
        }else
            this.setState({value_error:''});
        if(!isError){
            let scope = this;
            this.setState({loading:true});
            this.setState({value_error:'',disbursement_date_error:'',timelimit_error:''});
            let loan = {
                value: Number(this.state.value),
                timelimit: Number(this.state.timelimit),
                disbursement_date: this.state.disbursement_date,
                fee: Number(this.state.fee),
                payment: Number(this.state.payment),
                comments: this.state.comments
            }
            Utils.createLoan(loan)
                .then(function(response){
                    scope.setState({loading:false});
                    let id = response.data.id;
                    Utils.redirectTo(`/loan/${id}`);
                }).catch(function(error){
                    scope.setState({loading:false});
                    if(!error.response){
                        scope.showMessageError('Error de conexión, inténtalo más tarde.');
                    }else if(error.response.status === 406){
                        scope.showMessageError(error.response.data.message);
                    }else if(error.response.status === 401){
                        Utils.clearStorage();
                    }else{
                        scope.showMessageError(error.message);
                    }
                });
        }
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    render(){
        return (
            <div>
                <Header />
                <LoadingMask active={this.state.loading} />
                <Grid fluid>
                    <Row>
                        <Col xs={3} />
                        <Col xs={6} >
                            <Paper className="UserInfo" zDepth={5}>
                                <h2 style={{textAlign:'center'}}>Solicitud de crédito</h2>
                                <TextField floatingLabelText="Valor a solicitar"
                                    required={true}
                                    style={{width:'100%'}}
                                    type='number'
                                    errorText={this.state.value_error}
                                    onChange = {(event,newValue) => this.setState({value:newValue})}
                                    />
                                <TextField hintText="Valor en meses"
                                    floatingLabelText="Plazo"
                                    required={true}
                                    style={{width:'100%'}}
                                    type='number'
                                    errorText={this.state.timelimit_error}
                                    onChange = {(event,newValue) => this.setState({timelimit:newValue})}
                                    />
                                <SelectField
                                    floatingLabelText="Cuota"
                                    value={this.state.fee}
                                    style={{width:'100%'}}
                                    onChange={(event,index,value) => this.setState({fee:value})}>
                                    <MenuItem value={0} primaryText="Mensual" />
                                    <MenuItem value={1} primaryText="Única" />
                                </SelectField>
                                <DatePicker hintText="Fecha de desembolso" 
                                    mode="landscape"
                                    style={{width:'100%'}}
                                    errorText={this.state.disbursement_date_error}
                                    formatDate={date => Utils.formatDate(date)}
                                    onChange = {(event,newValue) => this.setState({disbursement_date:Utils.formatDate(newValue)})}/>
                                <SelectField
                                    floatingLabelText="Abono en"
                                    value={this.state.payment}
                                    style={{width:'100%'}}
                                    onChange={(event,index,value) => this.setState({payment:value})}>
                                    <MenuItem value={0} primaryText="Efectivo" />
                                    <MenuItem value={1} primaryText="Cuenta" />
                                </SelectField>
                                <TextField
                                    hintText="Comentarios adicionales"
                                    multiLine={true}
                                    rows={2}
                                    style={{width:'100%'}}
                                    rowsMax={4}
                                    onChange = {(event,newValue) => this.setState({comments:newValue})}
                                    />
                                <RaisedButton
                                    style={{width:'100%'}}
                                    primary={true}
                                    label="Enviar solicitud"
                                    onClick={this.handleSubmit.bind(this)}
                                />
                            </Paper>
                        </Col>
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={(event) => this.setState({openMessage: false})}
                    />
            </div>
        );
    }
}

export default RequestLoan;