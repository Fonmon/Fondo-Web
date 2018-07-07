import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import OmitIcon from  'material-ui/svg-icons/editor/money-off';

import ContainerComponent from '../../base/ContainerComponent';
import CreateActivityDialog from '../../dialogs/CreateActivityDialog';
import CurrencyField from '../../fields/CurrencyField';
import Utils from '../../../utils/Utils';

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
            year: {},
            years: [],
            activities: [],
            activity: null
        }
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
                    scope.setState({years:[],year: {}});
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

    onActivitySelect = (rows) => {
        let prevIndex = -1;
        if(this.state.prevIndex >= 0)
            this.state.activities[this.state.prevIndex].selected = false;
        if(rows.length){
            const id = this.state.activities[rows[0]].id;
            this.state.activities[rows[0]].selected = true;
            this.getActivity(id);
            prevIndex = rows[0];
        }else{
            this.setState({activity: null});
        }
        this.setState({prevIndex: prevIndex})
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

    onYearChange = (event, index, value) => {
        const yearSelected = this.state.years[index],
              scope = this;
        scope.setState({loading: true, year:yearSelected});
        Utils.getActivities(yearSelected.id)
            .then(response => this.handleRequestActivities(response))
            .catch( error => {
                scope.setState({loading: false});
                scope.handleRequestError(error);
            });
    }

    handleActivityCreation = () => {
        const scope = this;
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

    render(){
        const actions = [
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({removeOpen:false})}
            />,
            <RaisedButton
                label="Si"
                primary={true}
                onClick={this.onDeleteActivity}
            />,
        ];
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderTwoColGrid={true}
                    leftWidth={4}
                    left={
                        <Paper className="UserInfo" zDepth={5}>
                            <h3 style={{textAlign:'center'}}>Actividades</h3>
                            <DropDownMenu value={this.state.year.id}
                                onChange={this.onYearChange}>
                                {this.state.years.map((year, index) => {
                                    return <MenuItem key={year.id} value={year.id} primaryText={year.year} />
                                })}
                            </DropDownMenu>
                            {Utils.isAdmin() &&
                                <RaisedButton style={{
                                        width:'100%',
                                        marginBottom:10
                                    }}
                                    secondary={true}
                                    label='Nuevo año de actividades'
                                    onClick={this.onNewYear.bind(this)}
                                />
                            }
                            {(Utils.isAdmin() || Utils.isPresident()) &&
                                <RaisedButton style={{width:'100%'}}
                                    primary={true}
                                    label='Agregar Actividad'
                                    onClick={() => this.setState({creationOpen: true})}
                                />
                            }
                            <Table fixedHeader={false}
                                style={{ tableLayout: 'auto'}}
                                bodyStyle={{overflowX: undefined, overflowY: undefined}}
                                selectable={true}
                                onRowSelection={(rows) => this.onActivitySelect(rows)}
                                height='300px'
                            >
                                <TableBody displayRowCheckbox={true}
                                    deselectOnClickaway={false}
                                    showRowHover={true}>
                                    {this.state.activities.map((activity, index) => {
                                        return (<TableRow key={activity.id} selected={activity.selected}>
                                            <TableRowColumn>{activity.name}</TableRowColumn>
                                        </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    }
                    rightWidth={8}
                    right={
                        <div>
                            <Paper className="UserInfo" zDepth={5}>
                                <h3 style={{textAlign:'center'}}>Detalle de actividad</h3>
                                {!this.state.activity &&
                                    <h4 style={{textAlign:'center', fontWeight:'normal'}}>Ninguna actividad seleccionada</h4>
                                }
                                {this.state.activity &&
                                    <div>
                                        {(Utils.isAdmin() || Utils.isPresident()) &&
                                            <div>
                                                <RaisedButton label="Guardar" 
                                                    primary={true} 
                                                    onClick={this.onSaveActivity}
                                                    style={{width:'100%'}} />
                                                <RaisedButton label="Eliminar" 
                                                    secondary={true}
                                                    onClick={() => this.setState({removeOpen:true})}
                                                    style={{marginTop: '10px',width:'100%'}} />
                                            </div>
                                        }
                                        <TextField floatingLabelText="Nombre"
                                            value={this.state.activity.name}
                                            style={{width:'100%'}}
                                            disabled={!Utils.isAdmin() && !Utils.isPresident()}
                                            onChange = {(event,newValue) => this.setStateCustom('name',newValue)}
                                        />
                                        <CurrencyField floatingLabelText="Valor"
                                            disabled={!Utils.isAdmin() && !Utils.isPresident()}
                                            style={{width:'100%'}}
                                            onChange = {(event,newValue) => this.setStateCustom('value',newValue)} 
                                            value={this.state.activity.value}
                                        />
                                        <DatePicker floatingLabelText="Fecha de la actividad"
                                            minDate={new Date(this.state.year.year,0,1)}
                                            maxDate={new Date(this.state.year.year,11,31)}
                                            autoOk={true}
                                            disabled={!Utils.isAdmin() && !Utils.isPresident()}
                                            value={Utils.convertToDate(this.state.activity.date)}
                                            style={{width:'100%'}}
                                            DateTimeFormat={Intl.DateTimeFormat}
                                            locale={'es'}
                                            formatDate={date => Utils.formatDateDisplay(date)}
                                            onChange = {(event,newValue) => this.setStateCustom('date',Utils.formatDate(newValue))}
                                        />
                                    </div>
                                }
                            </Paper>
                            <Paper className="UserInfo" zDepth={5}>
                                <h3 style={{textAlign:'center'}}>Lista de miembros</h3>
                                {!this.state.activity &&
                                    <h4 style={{textAlign:'center', fontWeight:'normal'}}>Ninguna actividad seleccionada</h4>
                                }
                                {this.state.activity &&
                                    <Table fixedHeader={false} 
                                        style={{ tableLayout: 'auto' }}
                                        bodyStyle= {{ overflowX: undefined, overflowY: undefined }}
                                        selectable={false}>
                                        <TableHeader
                                            adjustForCheckbox={false}
                                            displaySelectAll={false}>
                                            <TableRow>
                                                <TableHeaderColumn>Nombre</TableHeaderColumn>
                                                <TableHeaderColumn>Estado</TableHeaderColumn>
                                                {(Utils.isAdmin() || Utils.isPresident()) &&
                                                    <TableHeaderColumn>Acciones</TableHeaderColumn>
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody
                                            displayRowCheckbox={false}>
                                            {this.state.activity.users.map((user,i) => {
                                                return (<TableRow key={i}>
                                                    <TableRowColumn>{user.user.full_name}</TableRowColumn>
                                                    <TableRowColumn>{this.resolveState(user.state)}</TableRowColumn>
                                                    {(Utils.isAdmin() || Utils.isPresident()) &&
                                                        <TableRowColumn >
                                                            <ButtonsActions 
                                                                id={user.id} 
                                                                onClick={this.onUserAction}
                                                            />
                                                        </TableRowColumn>
                                                    }
                                                </TableRow>);
                                            })}
                                        </TableBody>
                                    </Table>
                                }
                            </Paper>
                        </div>
                    }
                />
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={(event) => this.setState({openMessage: false})}
                />
                <CreateActivityDialog creationOpen={this.state.creationOpen} 
                    year={this.state.year}
                    onClose={() => this.setState({creationOpen: false})}
                    onActivityCreated={this.handleActivityCreation}/>
                <Dialog
                    title="Confirmación"
                    actions={actions}
                    modal={false}
                    onRequestClose={() => this.setState({removeOpen:false})}
                    open={this.state.removeOpen}
                >
                    ¿Seguro que desea eliminar esta actividad?
                </Dialog>
            </div>
        );
    }
}