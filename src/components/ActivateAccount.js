import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Utils from '../utils/Utils';
import {HOST_APP} from '../utils/Constants';
import Snackbar from 'material-ui/Snackbar';
import banner from '../resources/images/banner.png';
import '../resources/styles/Login.css';

class ActivateAccount extends Component{

    constructor(){
        super();
        this.state = {
            identification: 0,
            password: '',
            repeatPsw: '',
            openMessage: false,
            errorMessage: '',
            errorIdentification:'',
            errorPassword:'',
            errorRepeatPsw:''
        }
    }

    componentDidMount = () =>{
        this.setState({
            id:this.props.match.params.id,
            key:this.props.match.params.key
        });

    }

    submit(event){
        let scope = this,
            error = false;
        if(!this.state.identification){
            this.setState({errorIdentification:'Campo requerido'});
            error = true;
        }else 
            this.setState({errorIdentification:''});
        if(!this.state.password){
            this.setState({errorPassword:'Campo requerido'});
            error = true;
        }else
            this.setState({errorPassword:''});
        if(!this.state.repeatPsw){
            this.setState({errorRepeatPsw:'Campo requerido'});
            error = true;
        }else if(this.state.password !== this.state.repeatPsw){
            this.setState({errorRepeatPsw:'Las contraseñas deben coincidir'});
            error = true;
        }else
            this.setState({errorRepeatPsw:''});
        if(!error){
            this.setState({errorIdentification:'',errorPassword:'',errorRepeatPsw:''});
            let obj = {
                key:this.state.key,
                identification:Number(this.state.identification),
                password: this.state.password
            };
            Utils.activateAccount(Number(this.state.id),obj)
                .then(function(response){
                    window.location = "/";
                }).catch(function(error){
                    if(!error.response){
                        scope.showMessageError('Error de conexión, inténtalo más tarde.');
                    }else if(error.response.status === 404){
                        scope.showMessageError('Identificación incorrecta');
                    }else{
                        scope.showMessageError(error);
                    }
                });
        }
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    forgotPassword(event){
        Utils.redirectTo(HOST_APP+'password_reset');
    }

    handleKeyPress(event){
        if(event.key === 'Enter')
            this.submit();
    }

    handleRequestClose = () => {
        this.setState({
            openMessage: false
        });
    }

    render(){
        return (
            <div className="Login">
                <img className="banner" src={banner} alt=""/>
                <Paper className="LoginForm" zDepth={5}>
                    <h2>Activación de cuenta</h2>
                    <TextField hintText="Escribe tu documento de identidad"
                        className="LoginFields"
                        floatingLabelText="Documento de identidad"
                        required={true}
                        type="number"
                        style={{width:'100%'}}
                        errorText={this.state.errorIdentification}
                        onChange = {(event,newValue) => this.setState({identification:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        />
                    <TextField hintText="Ingresa tu contraseña"
                        className="LoginFields"
                        floatingLabelText="Nueva contraseña"
                        type="password"
                        required={true}
                        errorText={this.state.errorPassword}
                        style={{width:'100%'}}
                        onChange = {(event,newValue) => this.setState({password:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        />
                    <TextField hintText="Ingresa tu contraseña"
                        className="LoginFields"
                        floatingLabelText="Repite contraseña"
                        type="password"
                        required={true}
                        errorText={this.state.errorRepeatPsw}
                        style={{width:'100%'}}
                        onChange = {(event,newValue) => this.setState({repeatPsw:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        />
                    <RaisedButton 
                        className="LoginFields"
                        label="Activar" 
                        primary={true} 
                        style={{width:'100%'}}
                        onClick={(event) => this.submit(event)}
                        />
                    <Snackbar
                        open={this.state.openMessage}
                        message={this.state.errorMessage}
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                        />
                </Paper>
            </div>
        );
    }
}

export default ActivateAccount;