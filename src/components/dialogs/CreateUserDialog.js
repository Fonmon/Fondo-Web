import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Utils from '../../utils/Utils';
import ContainerComponent from '../base/ContainerComponent';
import LoadingMaskComponent from '../base/LoadingMaskComponent';

class CreateUserDialog extends ContainerComponent{
    constructor(props){
        super(props);
        this.state = {
            identification:0,
            first_name: '',
            last_name: '',
            email: '',
            role:3,
            openMessage: false,
            errorMessage: '',
            loading:false
        }
    }

    handleClose = () => {
        this.props.onClose();
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
                    scope.showMessageError('Usuario creado.');
                    scope.props.onUserCreated()
                }).catch(function(error){
                    scope.setState({loading:false});
                    scope.handleRequestError(error, [{
                        status: 409,
                        message: 'Email/Documento de identidad ya existe.'
                    }]);
                });
        }
    }

    render(){
        const actions = [
            <Button color='primary' key="cancel"
                onClick={this.handleClose}
            >
                Cancelar
            </Button>,
            <Button color="primary" key="create"
                variant="contained"
                onClick={this.handleCreateUser}
            >
                Crear
            </Button>,
        ];

        return (
            <div>
                <Dialog aria-labelledby="creation-dialog-title"
                    open={this.props.creationOpen}
                >
                    <DialogTitle id="creation-dialog-title">Formulario creación de usuario</DialogTitle>
                    <DialogContent>
                        <LoadingMaskComponent active={this.state.loading} />
                        <TextField placeholder="Ingresa el Documento de identidad"
                            label="Identificación"
                            style={{width:'100%'}}
                            type='number'
                            onChange = {(event) => this.setState({identification:event.target.value})}
                        /><br/><br/>
                        <TextField placeholder="Ingresa los nombres"
                            label="Nombres"
                            style={{width:'100%'}}
                            onChange = {(event) => this.setState({first_name:event.target.value})}
                        /><br/><br/>
                        <TextField placeholder="Ingresa los apellidos"
                            label="Apellidos"
                            style={{width:'100%'}}
                            onChange = {(event) => this.setState({last_name:event.target.value})}
                        /><br/><br/>
                        <TextField placeholder="Ingresa el email"
                            label="Email"
                            style={{width:'100%'}}
                            type="email"
                            onChange = {(event) => this.setState({email:event.target.value})}
                        /><br/><br/>
                        <InputLabel htmlFor="role">Rol</InputLabel>
                        <Select value={this.state.role}
                            inputProps={{
                                id:"role"
                            }}
                            style={{width:'100%'}}
                            onChange={(event) => this.setState({role:event.target.value})}
                        >
                            <MenuItem value={3}>Miembro</MenuItem>
                            <MenuItem value={2}>Tesorero</MenuItem>
                            <MenuItem value={1}>Presidente</MenuItem>
                            <MenuItem value={0}>Administrador</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>{actions}</DialogActions>
                </Dialog>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

export default CreateUserDialog;