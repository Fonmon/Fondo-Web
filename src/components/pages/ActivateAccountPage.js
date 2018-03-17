import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../base/ContainerComponent';
import Utils from '../../utils/Utils';
import banner from '../../resources/images/banner.png';
import '../../resources/styles/Login.css';

class ActivateAccountPage extends ContainerComponent{

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
            errorRepeatPsw:'',
            loading: false
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
            this.setState({loading:true});
            let obj = {
                key:this.state.key,
                identification:Number(this.state.identification),
                password: this.state.password
            };
            Utils.activateAccount(Number(this.state.id),obj)
                .then(function(response){
                    scope.setState({loading:false});
                    Utils.redirectTo("/");
                }).catch(function(error){
                    scope.setState({loading:false});
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

    render(){
        return (
            <div className="Login">
                <ContainerComponent loadingMask={this.state.loading} />
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
                        onRequestClose={(event) => this.setState({openMessage:false})}
                    />
                </Paper>
            </div>
        );
    }
}

export default ActivateAccountPage;