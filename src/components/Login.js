import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Utils, {TOKEN_KEY} from '../utils/Utils';
import {HOST_APP} from '../utils/Constants';
import Snackbar from 'material-ui/Snackbar';
import banner from '../resources/images/banner.png';
import '../resources/styles/Login.css';

class Login extends Component{

    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            openMessage: false,
            errorMessage: ''
        }
    }

    submit(event){
        let scope = this;
        Utils.authenticate(this.state.email.toLowerCase(),this.state.password)
            .then(function (response){
                localStorage.setItem(TOKEN_KEY,response.data.token);
                Utils.redirectTo('/home');
            }).catch(function(error){
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 400){
                    scope.showMessageError('Email o contraseña incorrectos.');
                }else{
                    scope.showMessageError(error);
                }
            });
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
                    <h2>Iniciar Sesión</h2>
                    <TextField hintText="Ingresa tu email"
                        className="LoginFields"
                        floatingLabelText="Email"
                        required={true}
                        onChange = {(event,newValue) => this.setState({email:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        />
                    <TextField hintText="Ingresa tu contraseña"
                        className="LoginFields"
                        floatingLabelText="Contraseña"
                        type="password"
                        required={true}
                        onChange = {(event,newValue) => this.setState({password:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        /><br/>
                    <RaisedButton 
                        className="LoginFields"
                        label="Ingresar" 
                        primary={true} 
                        onClick={(event) => this.submit(event)}
                        /><br/>
                    <RaisedButton 
                        className="LoginFields"
                        label="¿Olvidaste tu contraseña?" 
                        secondary={true} 
                        onClick={(event) => this.forgotPassword(event)}
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

export default Login;
