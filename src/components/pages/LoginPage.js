import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../base/ContainerComponent';
import Utils, {TOKEN_KEY} from '../../utils/Utils';
import {HOST_APP} from '../../utils/Constants';
import banner from '../../resources/images/banner.png';
import '../../resources/styles/Login.css';

class LoginPage extends ContainerComponent {

    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            openMessage: false,
            errorMessage: '',
            loading: false
        }
    }

    forgotPassword(event){
        Utils.redirectTo(HOST_APP+'password_reset');
    }

    submit(event){
        let scope = this;
        this.setState({loading:true});
        Utils.authenticate(this.state.email.toLowerCase(),this.state.password)
            .then(function (response){
                scope.setState({loading:false});
                localStorage.setItem(TOKEN_KEY,response.data.token);
                Utils.redirectTo('/home');
            }).catch(function(error){
                scope.setState({loading:false});
                scope.handleRequestError(error,[{
                    status: 400,
                    message: 'Email o contraseña incorrectos.'
                }]);
            });
    }

    render(){
        return (
            <div className="Login">
                <ContainerComponent loadingMask={this.state.loading} />
                <img className="banner" src={banner} alt=""/>
                <Paper className="LoginForm" zDepth={5}>
                    <h2>Iniciar Sesión</h2>
                    <TextField hintText="Ingresa tu email"
                        className="LoginFields"
                        floatingLabelText="Email"
                        type="email"
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
                        onRequestClose={(event) => this.setState({openMessage: false})}
                    />
                </Paper>
            </div>
        );
    }
}

export default LoginPage;