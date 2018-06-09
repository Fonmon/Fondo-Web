import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import ContainerComponent from '../../base/ContainerComponent';
import Utils from '../../../utils/Utils';

export default class ActivitiesPage extends ContainerComponent{
    constructor(){
        super();
        this.state = {
            loading: false,
        }
    }

    onAddNewActivity(){
        // open a modal with the form related to
        // model
    }

    onNewYear(){
        // add a new year to the model.
    }

    onActivitySelect(rows){
        console.log(rows);
        // if(rows.length){
        //     this.setState({activateDetail:true});
        // }else
        //     this.setState({activateDetail:false});
    }

    render(){
        return (
            <ContainerComponent showHeader={true}
                loadingMask={this.state.loading}
                renderTwoColGrid={true}
                leftWidth={4}
                left={
                    <Paper className="UserInfo" zDepth={5}>
                        <h3 style={{textAlign:'center'}}>Actividades</h3>
                        {Utils.isAdmin() &&
                            <RaisedButton style={{
                                    width:'100%',
                                    paddingBottom:10
                                }}
                                secondary={true}
                                label='Nuevo año de actividades'
                                onClick={this.onNewYear}
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
                                <TableRow>
                                    <TableRowColumn>Act long name</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Act 2</TableRowColumn>
                                </TableRow>
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
        );
    }
}