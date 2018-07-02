import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
                        <RaisedButton label="Guardar cambios" 
                            secondary={true} 
                            style={{marginTop: '30px',width:'100%'}}
                            onClick={this.handleUpdate.bind(this)}
                            disabled={!this.allowToEditPersonal() && !Utils.isAuthorizedEdit()} />
                    }
                    orderRenderTwoColGrid={1}
                    renderTwoColGrid={true}
                    leftWidth={6}
                    left={
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
                    }
                    rightWidth={6}
                    right={
                        <Paper className="UserInfo" zDepth={5}>
                            <h2>Información financiera</h2>
                            <CurrencyField floatingLabelText="Aportes"
                                required={true}
                                value={this.state.user.contributions}
                                style={{width:'100%'}}
                                disabled={!Utils.isAuthorizedEdit()}
                                onChange = {(event,newValue) => this.setStateCustom('contributions',newValue)}
                            />
                            <CurrencyField floatingLabelText="Saldo de aportes"
                                required={true}
                                value={this.state.user.balance_contributions}
                                style={{width:'100%'}}
                                disabled={!Utils.isAuthorizedEdit()}
                                onChange = {(event,newValue) => this.setStateCustom('balance_contributions',newValue)}
                            />
                            <CurrencyField floatingLabelText="Cupo total"
                                required={true}
                                value={this.state.user.total_quota}
                                style={{width:'100%'}}
                                disabled={!Utils.isAuthorizedEdit()}
                                onChange = {(event,newValue) => this.setStateCustom('total_quota',newValue)}
                            />
                            <CurrencyField floatingLabelText="Cupo utilizado"
                                required={true}
                                value={this.state.user.utilized_quota}
                                style={{width:'100%'}}
                                disabled={!Utils.isAuthorizedEdit()}
                                onChange = {(event,newValue) => this.setStateCustom('utilized_quota',newValue)}
                            />
                            <TextField floatingLabelText="Actualizado"
                                value={this.state.user.last_modified}
                                style={{width:'100%'}}
                                disabled={true}
                            />
                        </Paper>
                    }
                />
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

export default UserDetailPage;