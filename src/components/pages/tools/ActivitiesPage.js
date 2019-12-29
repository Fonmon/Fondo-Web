import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import OmitIcon from  '@material-ui/icons/MoneyOff';

import ContainerComponent from '../../base/ContainerComponent';
import CreateActivityDialog from '../../dialogs/CreateActivityDialog';
import CurrencyField from '../../fields/CurrencyField';
import DateField from '../../fields/DateField';
import Utils from '../../../utils/Utils';
import LoadingMaskComponent from '../../base/LoadingMaskComponent';

const ButtonsActions = (props) => {
    return (
        <div>
            <IconButton onClick={props.onClick.bind(this,props.id, 1)}><DoneIcon /></IconButton>
            <IconButton onClick={props.onClick.bind(this,props.id, 0)}><CancelIcon /></IconButton>
            <IconButton onClick={props.onClick.bind(this,props.id, 2)}><OmitIcon /></IconButton>
        </div>
    );
}

export default class ActivitiesPage extends ContainerComponent{
    constructor(){
        super();
        this.state = {
            openMessage: false,
            removeOpen: false,
            prevIndex: -1,
            errorMessage: '',
            loading: false,
            creationOpen: false,
            year: {
                id: "",
                enable: false
            },
            years: [],
            activities: [],
            activity: null
        }
        this.createActivityKey = 1;
    }

    componentDidMount(){
        this.getYears();
    }

    getYears(){
        const scope = this;
        this.setState({loading: true});
        Utils.getActivityYears()
            .then( response => {
                if(response.status === 204){
                    scope.setState({years:[],year: { id: '' }});
                }else{
                    const years = response.data,
                          year = years[0].id;
                    scope.setState({years:years,year: years[0]});
                    return Utils.getActivities(year);
                }
            }).then(response => this.handleRequestActivities(response))
            .catch( error => {
                scope.setState({loading: false});
                scope.handleRequestError(error);
            });
    }

    handleRequestActivities(response){
        this.setState({loading: false});
        if(response)
            this.setState({activities:response.data,prevIndex:-1,activity:null});
    }

    onNewYear(){
        const scope = this;
        this.setState({loading:true});
        Utils.createActivityYear()
            .then(response => {
                scope.setState({loading:false});
                scope.getYears();
            }).catch(error => {
                scope.setState({loading:false});
                scope.handleRequestError(error,[{
                    status: 304,
                    message: 'Año actual ya creado'
                }]);
            })
    }

    onActivitySelect = (event, index) => {
        let prevIndex = -1;
        const activities = this.state.activities;
        if(this.state.prevIndex >= 0)
            activities[this.state.prevIndex].selected = false;
        if(index >= 0){
            const id = this.state.activities[index].id;
            activities[index].selected = true;
            this.getActivity(id);
            prevIndex = index;
        }else{
            this.setState({activity: null});
        }
        this.setState({
            prevIndex: prevIndex,
            activities
        })
    }

    getActivity = (id) => {
        const scope = this;
        scope.setState({loading: true});
        Utils.getActivity(id)
            .then(response => {
                scope.setState({loading:false, activity: response.data});
            }).catch(error => {
                scope.setState({loading:false});
                scope.handleRequestError(error);
            });
    }

    onYearChange = (event) => {
        const yearSelected = this.getYear(event.target.value),
              scope = this;
        scope.setState({loading: true, year:yearSelected});
        Utils.getActivities(yearSelected.id)
            .then(response => this.handleRequestActivities(response))
            .catch( error => {
                scope.setState({loading: false});
                scope.handleRequestError(error);
            });
    }

    getYear(yearId) {
        return this.state.years.find( year => year.id === yearId)
    }

    handleActivityCreation = () => {
        const scope = this;
        this.createActivityKey++;
        scope.setState({loading: true, creationOpen: false});
        Utils.getActivities(this.state.year.id)
            .then(response => this.handleRequestActivities(response))
            .catch( error => {
                scope.setState({loading: false});
                scope.handleRequestError(error);
            });
    }

    setStateCustom(key,value){
        this.setState({activity:{...this.state.activity,[key]:value}});
    }

    onDeleteActivity = () => {
        const scope = this;
        scope.setState({loading: true, removeOpen: false});
        Utils.deleteActivity(this.state.activity.id)
            .then(response => Utils.getActivities(scope.state.year.id))
            .then(response => this.handleRequestActivities(response))
            .catch(error => {
                scope.setState({loading: false});
                scope.handleRequestError(error);
            });
    }

    onSaveActivity = () => {
        const isFormValid = this.state.activity.name && 
                        this.state.activity.value && 
                        this.state.activity.date;
        if(!isFormValid)
            return this.showMessageError('Por favor llenar todos los campos.');

        const activityData = {
            name: this.state.activity.name,
            value: this.state.activity.value,
            date: this.state.activity.date
        };
        this.setState({loading:true});
        Utils.updateActivity(this.state.activity.id,'activity',activityData)
            .then(response => this.handleUpdateActivity(response))
            .catch(error => this.handleUpdateActivity(null,error));
    }

    resolveState = (state) => {
        if(state === 0)
            return 'No ha pagado';
        else if(state === 1)
            return 'Ya pagó';
        return 'Exento';
    }

    handleUpdateActivity = (response,error) => {
        this.setState({loading:false});
        if(response){
            this.state.activities[this.state.prevIndex].name = response.data.name;
            this.setState({activity:response.data});
        }else{
            this.handleRequestError(error);
        }
    }

    // ----------
    // User list actions

    onUserAction = (activityUserId, state) => {
        const userData = {
            id: activityUserId,
            state
        };
        this.setState({loading:true});
        Utils.updateActivity(this.state.activity.id,'user',userData)
            .then(response => this.handleUpdateActivity(response))
            .catch(error => this.handleUpdateActivity(null,error));
    }

    ableToEdit = () => {
        return Utils.isAdmin() || (this.state.year.enable && Utils.isPresident());
    }

    render(){
        const actions = [
            <Button color="primary" key={1}
                onClick={() => this.setState({removeOpen:false})}
            >No</Button>,
            <Button color="primary"
                variant="contained" key={2}
                onClick={this.onDeleteActivity}
            >Si</Button>,
        ];
        return (
            <div>
                <LoadingMaskComponent active={this.state.loading} />
                <ContainerComponent showHeader={true}
                    renderTwoColGrid={true}
                    leftWidth={4}
                    left={
                        <Paper className="UserInfo" elevation={20}>
                            <h3 style={{textAlign:'center'}}>Actividades</h3>
                            <Select value={this.state.year.id}
                                onChange={this.onYearChange}
                            >
                                {this.state.years.map((year, index) => {
                                    return <MenuItem key={year.id} value={year.id}>{year.year}</MenuItem>
                                })}
                            </Select><br /><br />
                            {Utils.isAdmin() &&
                                <Button style={{
                                        width:'100%',
                                        marginBottom:10
                                    }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.onNewYear.bind(this)}
                                >
                                    Nuevo año de actividades
                                </Button>
                            }
                            {this.ableToEdit() &&
                                <Button style={{width:'100%'}}
                                    color="primary"
                                    variant="contained"
                                    onClick={() => this.setState({creationOpen: true})}
                                >
                                    Agregar Actividad
                                </Button>
                            }
                            <div style={{ overflowX: 'auto'}}>
                                <Table>
                                    <TableBody>
                                        {this.state.activities.map((activity, index) => {
                                            return (
                                                <TableRow key={activity.id} hover
                                                    selected={activity.selected === true}
                                                    onClick={(event) => this.onActivitySelect(event, index)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={activity.selected === true}/>
                                                        {activity.name}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </Paper>
                    }
                    rightWidth={8}
                    right={
                        <div>
                            <Paper className="UserInfo" elevation={20}>
                                <h3 style={{textAlign:'center'}}>Detalle de actividad</h3>
                                {!this.state.activity &&
                                    <h4 style={{textAlign:'center', fontWeight:'normal'}}>Ninguna actividad seleccionada</h4>
                                }
                                {this.state.activity &&
                                    <div>
                                        {this.ableToEdit() &&
                                            <div>
                                                <Button color="primary"
                                                    variant="contained"
                                                    onClick={this.onSaveActivity}
                                                    style={{width:'100%'}}
                                                >
                                                    Guardar
                                                </Button>
                                                <Button color="secondary"
                                                    variant="contained"
                                                    onClick={() => this.setState({removeOpen:true})}
                                                    style={{marginTop: '10px',width:'100%'}}
                                                >
                                                    Eliminar
                                                </Button><br /><br />
                                            </div>
                                        }
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField label="Nombre"
                                                    value={this.state.activity.name}
                                                    style={{width:'100%'}}
                                                    disabled={!this.ableToEdit()}
                                                    onChange = {(event) => this.setStateCustom('name',event.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CurrencyField label="Valor"
                                                    disabled={!this.ableToEdit()}
                                                    style={{width:'100%'}}
                                                    onChange = {(event) => this.setStateCustom('value',event.target.value)} 
                                                    value={this.state.activity.value}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <DateField label="Fecha de la actividad" 
                                                    disabled={!this.ableToEdit()}
                                                    style={{width:'100%'}}
                                                    value={this.state.activity.date}
                                                    onChange = {(event) => this.setStateCustom('date',event.target.value)}
                                                    min={Utils.formatDate(new Date(this.state.year.year,0,1))}
                                                    max={Utils.formatDate(new Date(this.state.year.year,11,31))}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                }
                            </Paper>
                            <Paper className="UserInfo" elevation={20}>
                                <h3 style={{textAlign:'center'}}>Lista de miembros</h3>
                                {!this.state.activity &&
                                    <h4 style={{textAlign:'center', fontWeight:'normal'}}>Ninguna actividad seleccionada</h4>
                                }
                                {this.state.activity &&
                                    <div style={{ overflowX: 'auto'}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nombre</TableCell>
                                                    <TableCell>Estado</TableCell>
                                                    {this.ableToEdit() &&
                                                        <TableCell>Acciones</TableCell>
                                                    }
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.activity.users.map((user,i) => {
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>{user.user.full_name}</TableCell>
                                                            <TableCell>{this.resolveState(user.state)}</TableCell>
                                                            {this.ableToEdit() &&
                                                                <TableCell >
                                                                    <ButtonsActions 
                                                                        id={user.id} 
                                                                        onClick={this.onUserAction}
                                                                    />
                                                                </TableCell>
                                                            }
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                }
                            </Paper>
                        </div>
                    }
                />
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(_) => this.setState({openMessage: false})}
                />
                <CreateActivityDialog creationOpen={this.state.creationOpen} 
                    year={this.state.year}
                    onClose={() => {
                        this.createActivityKey++;
                        this.setState({creationOpen: false})
                    }}
                    onActivityCreated={this.handleActivityCreation}
                    key={this.createActivityKey}
                />
                <Dialog aria-labelledby="confirmation-dialog-activity"
                    open={this.state.removeOpen}
                >
                    <DialogTitle id="confirmation-dialog-activity">Confirmación</DialogTitle>
                    <DialogContent>¿Seguro que desea eliminar esta actividad?</DialogContent>
                    <DialogActions>{actions}</DialogActions>
                </Dialog>
            </div>
        );
    }
}