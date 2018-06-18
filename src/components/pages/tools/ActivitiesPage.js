import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../../base/ContainerComponent';
import CreateActivityDialog from '../../dialogs/CreateActivityDialog';
import Utils from '../../../utils/Utils';

export default class ActivitiesPage extends ContainerComponent{
    constructor(){
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            loading: false,
            creationOpen: false,
            currentYearId: 0,
            currentYear: 0,
            years: [],
            activities: []
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
                    scope.setState({
                        years:[],
                        currentYearId:0,
                        currentYear:0
                    });
                }else{
                    const years = response.data,
                          year = years[0].id;
                    scope.setState({
                        years:years,
                        currentYearId:year,
                        currentYear: years[0].year
                    });
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
            this.setState({activities:response.data});
    }

    onAddNewActivity(){
        this.setState({creationOpen: true});
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

    onActivitySelect(rows){
        // if(rows.length){
        //     this.setState({activateDetail:true});
        // }else
        //     this.setState({activateDetail:false});
    }

    onYearChange = (event, index, value) => {
        const year = this.state.years[index].year;
        this.setState({currentYearId:value, currentYear:year});
        // load activities from value
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderTwoColGrid={true}
                    leftWidth={4}
                    left={
                        <Paper className="UserInfo" zDepth={5}>
                            <h3 style={{textAlign:'center'}}>Actividades</h3>
                            <DropDownMenu value={this.state.currentYearId}
                                onChange={this.onYearChange}>
                                {this.state.years.map((year, index) => {
                                    return <MenuItem key={year.id} value={year.id} primaryText={year.year} />
                                })}
                            </DropDownMenu>
                            {Utils.isAdmin() &&
                                <RaisedButton style={{
                                        width:'100%',
                                        paddingBottom:10
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
                                    onClick={this.onAddNewActivity.bind(this)}
                                />
                            }
                            <Table fixedHeader={false}
                                style={{ tableLayout: 'auto'}}
                                bodyStyle={{overflowX: undefined, overflowY: undefined}}
                                selectable={true}
                                onRowSelection={(rows) => this.onActivitySelect(rows)}
                            >
                                <TableBody displayRowCheckbox={true}
                                    deselectOnClickaway={false}
                                    showRowHover={true}>
                                    {this.state.activities.map((activity, index) => {
                                        return (<TableRow key={activity.id}>
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
                    year={this.state.currentYear}/>
            </div>
        );
    }
}