import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Utils from '../utils/Utils';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import '../styles/UserDetail.css';

class UserDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            openMessage: false,
            errorMessage: '',
            id:0,
            user:{
                identification:0,
                first_name:'',
                last_name:'',
                email:'',
                role:-1,
                contributions:'',
                balance_contributions:'',
                total_quota:'',
                available_quota:''
            }
        }
    }

    componentDidMount = () =>{
        this.getUser();
    }

    getUser(){
        let id = this.props.match.params.id;
        this.setState({id:id});
        let scope = this;
        Utils.getUser(id)
            .then(function(response){
                scope.setState({user:response.data});
            }).catch(function(error){
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 404){
                    window.location = '/notfound';
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    allowToEditPersonal(){
        return (Utils.isAdmin() || Utils.currentId() === `${this.state.id}`);
    }

    allowToEditFinance(){
        return (Utils.isAdmin() || Utils.isTreasurer());
    }

    handleUpdate(){
        let user = this.state.user;
        let scope = this;
        if(user.email === '' || user.identification === 0 || user.first_name === ''
            || user.last_name === '')
            this.showMessageError('Debe completar los campos faltantes.');
        else{
            Utils.updateUser(this.state.id,user)
                .then(function(response){
                    scope.showMessageError('Cambios guardados');
                }).catch(function(error){
                    if(!error.response){
                        scope.showMessageError('Error de conexión, inténtalo más tarde.');
                    }else if(error.response.status === 404){
                        window.location = '/notfound';
                    }else if(error.response.status === 409){
                        scope.showMessageError('Email/Documento de identidad ya existe.');
                    }else
                        scope.showMessageError(error.message);
                })
        }
    }

    setStateCustom(key,value){
        this.setState({user:{...this.state.user,[key]:value}});
    }

    render(){
        return (
            <div>
                <Header />
                <Grid fluid>
                    <Row>
                        <Col xs={12} >
                            <RaisedButton label="Guardar cambios" 
                                secondary={true} 
                                style={{marginTop: '30px',width:'100%'}}
                                onClick={this.handleUpdate.bind(this)}
                                disabled={!this.allowToEditPersonal() && !this.allowToEditFinance()} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} >
                            <Paper className="UserInfo" zDepth={5}>
                                <h2>Información personal</h2>
                                <TextField hintText="Ingresa el Documento de identidad"
                                    floatingLabelText="Identificación"
                                    required={true}
                                    value={this.state.user.identification}
                                    style={{width:'100%'}}
                                    type='number'
                                    disabled={!this.allowToEditPersonal()}
                                    onChange = {(event,newValue) => this.setStateCustom('identification',Number(newValue))}
                                    />
                                <TextField hintText="Ingresa tus nombres"
                                    floatingLabelText="Nombres"
                                    required={true}
                                    value={this.state.user.first_name}
                                    style={{width:'100%'}}
                                    disabled={!this.allowToEditPersonal()}
                                    onChange = {(event,newValue) => this.setStateCustom('first_name',newValue)}
                                    />
                                <TextField hintText="Ingresa tus apellidos"
                                    floatingLabelText="Apellidos"
                                    required={true}
                                    value={this.state.user.last_name}
                                    style={{width:'100%'}}
                                    disabled={!this.allowToEditPersonal()}
                                    onChange = {(event,newValue) => this.setStateCustom('last_name',newValue)}
                                    />
                                <TextField hintText="Ingresa tu email"
                                    floatingLabelText="Email"
                                    required={true}
                                    value={this.state.user.email}
                                    style={{width:'100%'}}
                                    disabled={!this.allowToEditPersonal()}
                                    onChange = {(event,newValue) => this.setStateCustom('email',newValue)}
                                    />
                                <SelectField
                                    floatingLabelText="Rol"
                                    value={this.state.user.role}
                                    style={{width:'100%'}}
                                    onChange={(event,index,newValue) => this.setStateCustom('role',newValue)}
                                    disabled={!Utils.isAdmin()}
                                    >
                                    <MenuItem value={3} primaryText="Miembro" />
                                    <MenuItem value={2} primaryText="Tesorero" />
                                    <MenuItem value={1} primaryText="Presidente" />
                                    <MenuItem value={0} primaryText="Administrador" />
                                </SelectField>
                            </Paper>
                        </Col>
                        <Col xs={6} >
                            <Paper className="UserInfo" zDepth={5}>
                                <h2>Información financiera</h2>
                                <TextField floatingLabelText="Aportes"
                                    required={true}
                                    value={this.state.user.contributions}
                                    style={{width:'100%'}}
                                    type='number'
                                    disabled={!this.allowToEditFinance()}
                                    onChange = {(event,newValue) => this.setStateCustom('contributions',newValue)}
                                    />
                                <TextField floatingLabelText="Saldo de aportes"
                                    required={true}
                                    value={this.state.user.balance_contributions}
                                    style={{width:'100%'}}
                                    type='number'
                                    disabled={!this.allowToEditFinance()}
                                    onChange = {(event,newValue) => this.setStateCustom('balance_contributions',newValue)}
                                    />
                                <TextField floatingLabelText="Cupo total"
                                    required={true}
                                    value={this.state.user.total_quota}
                                    style={{width:'100%'}}
                                    type='number'
                                    disabled={!this.allowToEditFinance()}
                                    onChange = {(event,newValue) => this.setStateCustom('total_quota',newValue)}
                                    />
                                <TextField floatingLabelText="Cupo disponible"
                                    required={true}
                                    value={this.state.user.available_quota}
                                    style={{width:'100%'}}
                                    type='number'
                                    disabled={!this.allowToEditFinance()}
                                    onChange = {(event,newValue) => this.setStateCustom('available_quota',newValue)}
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

export default UserDetail;