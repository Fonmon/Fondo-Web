import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import Utils from '../../utils/Utils';
import LoadingMaskComponent from '../base/LoadingMaskComponent';

class CreateUserDialog extends Component{

    constructor(props){
        super(props);
        this.state = {
            identification:0,
            first_name: '',
            last_name: '',
            email: '',
            role:3,
            creationOpen: false,
            openMessage: false,
            errorMessage: '',
            loading:false
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState(nextProps);
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    handleClose = () => {
        this.setState({creationOpen: false});
    }

    handleRequestClose = () => {
        this.setState({
            openMessage: false
        });
    }

    handleCreateUser = () => {
        let scope = this;
        if(this.state.identification === 0 || 
            this.state.first_name === '' ||
            this.state.last_name === '' || 
            this.state.email === '')
            this.showMessageError('Por favor llenar todos los campos.')
        else{
            let user = {
                identification: this.state.identification,
                role: this.state.role,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email
            }
            this.setState({loading:true});
            Utils.createUser(user)
                .then(function(response){
                    scope.setState({loading:false});
                    scope.setState({
                        creationOpen: false
                    });
                    scope.showMessageError('Usuario creado.');
                    scope.props.onUserCreated()
                }).catch(function(error){
                    scope.setState({loading:false});
                    if(!error.response){
                        scope.showMessageError('Error de conexión, inténtalo más tarde.');
                    }else if(error.response.status === 409){
                        scope.showMessageError('Email/Documento de identidad ya existe.');
                    }else if(error.response.status === 401){
                        Utils.clearStorage();
                    }else{
                        scope.showMessageError(error.message);
                    }
                });
        }
    }

    render(){
        const actions = [
            <FlatButton
                label="Cancelar"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Crear"
                primary={true}
                onClick={this.handleCreateUser}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Formulario creación de usuario"
                    actions={actions}
                    modal={false}
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleClose}
                    open={this.state.creationOpen}>
                        <div>
                            <LoadingMaskComponent active={this.state.loading} />
                            <TextField hintText="Ingresa el Documento de identidad"
                                floatingLabelText="Identificación"
                                required={true}
                                style={{width:'100%'}}
                                type='number'
                                onChange = {(event,newValue) => this.setState({identification:newValue})}
                                /><br/>
                            <TextField hintText="Ingresa los nombres"
                                floatingLabelText="Nombres"
                                required={true}
                                style={{width:'100%'}}
                                onChange = {(event,newValue) => this.setState({first_name:newValue})}
                                /><br/>
                            <TextField hintText="Ingresa los apellidos"
                                floatingLabelText="Apellidos"
                                required={true}
                                style={{width:'100%'}}
                                onChange = {(event,newValue) => this.setState({last_name:newValue})}
                                /><br/>
                            <TextField hintText="Ingresa el email"
                                floatingLabelText="Email"
                                style={{width:'100%'}}
                                required={true}
                                onChange = {(event,newValue) => this.setState({email:newValue})}
                                />
                            <SelectField
                                floatingLabelText="Rol"
                                value={this.state.role}
                                style={{width:'100%'}}
                                onChange={(event,index,value) => this.setState({role:value})}
                                >
                                <MenuItem value={3} primaryText="Miembro" />
                                <MenuItem value={2} primaryText="Tesorero" />
                                <MenuItem value={1} primaryText="Presidente" />
                                <MenuItem value={0} primaryText="Administrador" />
                            </SelectField>
                        </div>
                </Dialog>
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

export default CreateUserDialog;