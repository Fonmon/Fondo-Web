import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ContainerComponent from '../base/ContainerComponent';
import CurrencyField from '../fields/CurrencyField';
import Utils, {NOTIFICATIONS_KEY} from '../../utils/Utils';
import '../../resources/styles/UserDetail.css';

class UserDetailPage extends ContainerComponent{

    constructor(props){
        super(props);
        this.state = {
            openMessage: false,
            errorMessage: '',
            expanded: null,
            id:0,
            loading:false,
            user: {
                identification:0,
                first_name:'',
                last_name:'',
                email:'',
                role:-1
            },
            finance:{
                contributions:'',
                balance_contributions:'',
                total_quota:'',
                utilized_quota:'',
                last_modified:''
            },
            preferences: {
                notifications: false
            }
        }
    }

    componentDidMount = () =>{
        this.getUser();
    }

    getUser(){
        let id = this.props.match.params.id;
        let scope = this;
        this.setState({
            id,
            loading:true
        });
        Utils.getUser(id)
            .then(function(response){
                scope.setState({
                    user:response.data.user,
                    finance:response.data.finance,
                    preferences: response.data.preferences,
                    loading: false
                });
            }).catch(function(error){
                scope.setState({loading:false});
                scope.handleRequestError(error);
            });
    }

    allowToEditPersonal(){
        return (Utils.isAdmin() || Utils.currentId() === `${this.state.id}`);
    }

    handleUpdate(){
        let obj;
        if(this.state.expanded === 'personal') {
            obj = this.state.user;
            if(obj.email === '' || obj.identification === 0 || obj.first_name === '' || obj.last_name === '')
                return this.showMessageError('Debe completar los campos faltantes.');
        } else if(this.state.expanded === 'finance') {
            obj = this.state.finance
        }

        let requestBody = {
            type: this.state.expanded,
            [this.state.expanded]: obj
        }, scope = this;
        
        this.setState({loading:true});
        Utils.updateUser(this.state.id,requestBody)
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

    setStateFinanceInfo(key,value){
        this.setState({finance:{...this.state.finance,[key]:value}});
    }

    setStateUserInfo(key,value){
        this.setState({user:{...this.state.user,[key]:value}});
    }

    onExpand = panel => (event, expanded) => {
        this.setState({ 
            expanded: expanded ? panel : null
        });
    }

    onNotifications = (event) => {
        // call endpoint
        this.setState({ loading: true });
        const targetValue = event.target.checked;
        let requestBody = {
            type: this.state.expanded,
            [this.state.expanded]: {
                notifications: targetValue
            }
        }, scope = this;
        
        Utils.updateUser(this.state.id,requestBody)
            .then(function(response){
                localStorage.setItem(NOTIFICATIONS_KEY, targetValue)
                scope.setState({
                    loading:false,
                    preferences:{...scope.state.preferences, notifications: targetValue}
                });
                if (targetValue) {
                    Utils.pushManagerSubscribe();
                } else {
                    Utils.pushManagerUnsubscribe(false);
                }
                scope.showMessageError('Cambios guardados');
            }).catch(function(error){
                scope.setState({loading:false});
                scope.handleRequestError(error);
            })
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderOneFullColGrid={true}
                    middle={
                        <div className="UserInfo">
                            <h2>Perfil de {this.state.user.first_name}</h2>
                            <ExpansionPanel expanded={this.state.expanded === 'personal'} onChange={this.onExpand('personal')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <strong>Información personal</strong>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={16}>
                                        <Button color="secondary" variant="contained"
                                            style={{width:'100%'}}
                                            onClick={this.handleUpdate.bind(this)}
                                            disabled={!this.allowToEditPersonal()}
                                        >
                                            Guardar cambios
                                        </Button>
                                        <Grid item xs={12}>
                                            <TextField placeholder="Ingresa el Documento de identidad"
                                                label="Identificación"
                                                value={this.state.user.identification}
                                                style={{width:'100%'}}
                                                type='number'
                                                disabled={!this.allowToEditPersonal()}
                                                onChange = {(event) => this.setStateUserInfo('identification',Number(event.target.value))}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField placeholder="Ingresa tus nombres"
                                                label="Nombres"
                                                value={this.state.user.first_name}
                                                style={{width:'100%'}}
                                                disabled={!this.allowToEditPersonal()}
                                                onChange = {(event) => this.setStateUserInfo('first_name',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField placeholder="Ingresa tus apellidos"
                                                label="Apellidos"
                                                value={this.state.user.last_name}
                                                style={{width:'100%'}}
                                                disabled={!this.allowToEditPersonal()}
                                                onChange = {(event) => this.setStateUserInfo('last_name',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField placeholder="Ingresa tu email"
                                                label="Email"
                                                value={this.state.user.email}
                                                style={{width:'100%'}}
                                                disabled={!this.allowToEditPersonal()}
                                                onChange = {(event) => this.setStateUserInfo('email',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel htmlFor="role">Rol</InputLabel>
                                            <Select value={this.state.user.role}
                                                inputProps={{
                                                    id: "role"
                                                }}
                                                style={{width:'100%'}}
                                                onChange={(event) => this.setStateUserInfo('role',event.target.value)}
                                                disabled={!Utils.isAdmin()}
                                            >
                                                <MenuItem value={3}>Miembro</MenuItem>
                                                <MenuItem value={2}>Tesorero</MenuItem>
                                                <MenuItem value={1}>Presidente</MenuItem>
                                                <MenuItem value={0}>Administrador</MenuItem>
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'finance'} onChange={this.onExpand('finance')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <strong>Información financiera</strong>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={16}>
                                        <Button color="secondary" variant="contained"
                                            style={{width:'100%'}}
                                            onClick={this.handleUpdate.bind(this)}
                                            disabled={!Utils.isAuthorizedEdit()}
                                        >
                                            Guardar cambios
                                        </Button>
                                        <Grid item xs={12}>
                                            <CurrencyField label="Aportes"
                                                value={this.state.finance.contributions}
                                                style={{width:'100%'}}
                                                disabled={!Utils.isAuthorizedEdit()}
                                                onChange = {(event) => this.setStateFinanceInfo('contributions',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CurrencyField label="Saldo de aportes"
                                                value={this.state.finance.balance_contributions}
                                                style={{width:'100%'}}
                                                disabled={!Utils.isAuthorizedEdit()}
                                                onChange = {(event) => this.setStateFinanceInfo('balance_contributions',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CurrencyField label="Cupo total"
                                                value={this.state.finance.total_quota}
                                                style={{width:'100%'}}
                                                disabled={!Utils.isAuthorizedEdit()}
                                                onChange = {(event) => this.setStateFinanceInfo('total_quota',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CurrencyField label="Cupo utilizado"
                                                value={this.state.finance.utilized_quota}
                                                style={{width:'100%'}}
                                                disabled={!Utils.isAuthorizedEdit()}
                                                onChange = {(event) => this.setStateFinanceInfo('utilized_quota',event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label="Actualizado"
                                                value={this.state.finance.last_modified}
                                                style={{width:'100%'}}
                                                disabled={true}
                                            />
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'preferences'} onChange={this.onExpand('preferences')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <strong>Preferencias</strong>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <FormControlLabel label="Habilitar notificaciones"
                                        control={
                                            <Switch onChange={this.onNotifications}
                                                checked={this.state.preferences.notifications}
                                                disabled={Utils.currentId() !== this.state.id}
                                            />
                                        }
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
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