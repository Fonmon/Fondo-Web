import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid'

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

    submit(_){
        let scope = this,
            error = false;
        this.setState({errorIdentification:'',errorPassword:'',errorRepeatPsw:''});
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
                <Paper className="LoginForm" elevation={20}>
                    <h2>Activación de cuenta</h2>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField placeholder="Escribe tu documento de identidad"
                                className="LoginFields"
                                label="Documento de identidad"
                                type="number"
                                style={{width:'100%'}}
                                error={this.state.errorIdentification !== ''}
                                helperText={this.state.errorIdentification}
                                onChange = {(event) => this.setState({identification:event.target.value})}
                                onKeyPress = {(event) => this.handleKeyPress(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField placeholder="Ingresa tu contraseña"
                                className="LoginFields"
                                label="Nueva contraseña"
                                type="password"
                                error={this.state.errorPassword !== ''}
                                helperText={this.state.errorPassword}
                                style={{width:'100%'}}
                                onChange = {(event) => this.setState({password:event.target.value})}
                                onKeyPress = {(event) => this.handleKeyPress(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField placeholder="Ingresa tu contraseña"
                                className="LoginFields"
                                label="Repite contraseña"
                                type="password"
                                error={this.state.errorRepeatPsw !== ''}
                                helperText={this.state.errorRepeatPsw}
                                style={{width:'100%'}}
                                onChange = {(event) => this.setState({repeatPsw:event.target.value})}
                                onKeyPress = {(event) => this.handleKeyPress(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button className="LoginFields"
                                variant="contained"
                                color="primary"
                                style={{width:'100%'}}
                                onClick={(event) => this.submit(event)}
                            >
                                Activar
                            </Button>
                        </Grid>
                    </Grid>
                    <Snackbar open={this.state.openMessage}
                        message={this.state.errorMessage}
                        autoHideDuration={4000}
                        onClose={(event) => this.setState({openMessage:false})}
                    />
                </Paper>
            </div>
        );
    }
}

export default ActivateAccountPage;