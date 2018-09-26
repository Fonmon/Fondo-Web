import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';

import ContainerComponent from '../base/ContainerComponent';
import CurrencyField from '../fields/CurrencyField';
import Utils from '../../utils/Utils';
import '../../resources/styles/UserDetail.css';

class UserDetailPage extends ContainerComponent{

    constructor(props){
        super(props);
        this.state = {
            openMessage: false,
            errorMessage: '',
            id:0,
            loading:false,
            user:{
                identification:0,
                first_name:'',
                last_name:'',
                email:'',
                role:-1,
                contributions:'',
                balance_contributions:'',
                total_quota:'',
                utilized_quota:'',
                last_modified:''
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
        this.setState({loading:true});
        Utils.getUser(id)
            .then(function(response){
                scope.setState({user:response.data});
                scope.setState({loading:false});
            }).catch(function(error){
                scope.setState({loading:false});
                scope.handleRequestError(error);
            });
    }

    allowToEditPersonal(){
        return (Utils.isAdmin() || Utils.currentId() === `${this.state.id}`);
    }

    handleUpdate(){
        let user = this.state.user;
        let scope = this;
        if(user.email === '' || user.identification === 0 || user.first_name === ''
            || user.last_name === '')
            this.showMessageError('Debe completar los campos faltantes.');
        else{
            this.setState({loading:true});
            Utils.updateUser(this.state.id,user)
                .then(function(response){
                    scope.setState({loading:false});
                    scope.showMessageError('Cambios guardados');
                }).catch(function(error){
                    scope.setState({loading:false});
                    scope.handleRequestError(error,[{
                        status: 409,
                        message: 'Email/Documento de identidad ya existe.'
                    }]);
                })
        }
    }

    setStateCustom(key,value){
        this.setState({user:{...this.state.user,[key]:value}});
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    orderRenderOneFullColGrid={0}
                    renderOneFullColGrid={true}
                    middle={
                        <Button color="secondary" variant="contained"
                            style={{marginTop: '30px',width:'100%'}}
                            onClick={this.handleUpdate.bind(this)}
                            disabled={!this.allowToEditPersonal() && !Utils.isAuthorizedEdit()}
                        >
                            Guardar cambios
                        </Button>
                    }
                    orderRenderTwoColGrid={1}
                    renderTwoColGrid={true}
                    leftWidth={6}
                    left={
                        <Paper className="UserInfo" elevation={20}>
                            <h2>Información personal</h2>
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <TextField placeholder="Ingresa el Documento de identidad"
                                        label="Identificación"
                                        value={this.state.user.identification}
                                        style={{width:'100%'}}
                                        type='number'
                                        disabled={!this.allowToEditPersonal()}
                                        onChange = {(event) => this.setStateCustom('identification',Number(event.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField placeholder="Ingresa tus nombres"
                                        label="Nombres"
                                        value={this.state.user.first_name}
                                        style={{width:'100%'}}
                                        disabled={!this.allowToEditPersonal()}
                                        onChange = {(event) => this.setStateCustom('first_name',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField placeholder="Ingresa tus apellidos"
                                        label="Apellidos"
                                        value={this.state.user.last_name}
                                        style={{width:'100%'}}
                                        disabled={!this.allowToEditPersonal()}
                                        onChange = {(event) => this.setStateCustom('last_name',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField placeholder="Ingresa tu email"
                                        label="Email"
                                        value={this.state.user.email}
                                        style={{width:'100%'}}
                                        disabled={!this.allowToEditPersonal()}
                                        onChange = {(event) => this.setStateCustom('email',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="role">Rol</InputLabel>
                                    <Select value={this.state.user.role}
                                        inputProps={{
                                            id: "role"
                                        }}
                                        style={{width:'100%'}}
                                        onChange={(event) => this.setStateCustom('role',event.target.value)}
                                        disabled={!Utils.isAdmin()}
                                    >
                                        <MenuItem value={3}>Miembro</MenuItem>
                                        <MenuItem value={2}>Tesorero</MenuItem>
                                        <MenuItem value={1}>Presidente</MenuItem>
                                        <MenuItem value={0}>Administrador</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Paper>
                    }
                    rightWidth={6}
                    right={
                        <Paper className="UserInfo" elevation={20}>
                            <h2>Información financiera</h2>
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <CurrencyField label="Aportes"
                                        value={this.state.user.contributions}
                                        style={{width:'100%'}}
                                        disabled={!Utils.isAuthorizedEdit()}
                                        onChange = {(event) => this.setStateCustom('contributions',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CurrencyField label="Saldo de aportes"
                                        value={this.state.user.balance_contributions}
                                        style={{width:'100%'}}
                                        disabled={!Utils.isAuthorizedEdit()}
                                        onChange = {(event) => this.setStateCustom('balance_contributions',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CurrencyField label="Cupo total"
                                        value={this.state.user.total_quota}
                                        style={{width:'100%'}}
                                        disabled={!Utils.isAuthorizedEdit()}
                                        onChange = {(event) => this.setStateCustom('total_quota',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CurrencyField label="Cupo utilizado"
                                        value={this.state.user.utilized_quota}
                                        style={{width:'100%'}}
                                        disabled={!Utils.isAuthorizedEdit()}
                                        onChange = {(event) => this.setStateCustom('utilized_quota',event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Actualizado"
                                        value={this.state.user.last_modified}
                                        style={{width:'100%'}}
                                        disabled={true}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    }
                />
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(_) => this.setState({openMessage: false})}
                />
            </div>
        );
    }
}

export default UserDetailPage;