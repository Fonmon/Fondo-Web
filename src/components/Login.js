import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Utils, {TOKEN_KEY,HOST_APP} from '../utils/Utils';
import '../styles/Login.css';

class Login extends Component{

    constructor(){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    submit(event){
        Utils.authenticate(this.state.email,this.state.password)
            .then(function (response){
                localStorage.setItem(TOKEN_KEY,response.data.token);
            }).catch(function(error){
                if(error.response.status === 400){

                }else{

                }
            });
    }

    forgotPassword(event){
        window.location = HOST_APP+'password_reset';
    }

    handleKeyPress(event){
        if(event.key === 'Enter')
            this.submit();
    }

    render(){
        return (
            <div className="Login">
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
                </Paper>
            </div>
        );
    }
}

export default Login;