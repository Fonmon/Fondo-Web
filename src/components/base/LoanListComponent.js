import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import Pagination from 'material-ui-pagination';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import LoadingMaskComponent from './LoadingMaskComponent';
import Utils from '../../utils/Utils';

class LoanListComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            loans:[],
            currentPage: 1,
            totalPages: 1,
            loading: false,
            filterValue: 1
        };
    }
    
    componentDidMount = () => {
        this.getLoanList(1,this.state.filterValue);
    }

    getLoanList(page,filterValue){
        let scope = this;
        this.setState({loading:true});
        this.setState({currentPage:page});
        Utils.getLoans(page,this.props.all,filterValue)
            .then(function(response){
                scope.setState({totalPages:response.data.num_pages});
                scope.setState({loans:response.data.list});
                scope.setState({loading:false});
            }).catch(function(error){
                scope.setState({loading:false});
                if(!error.response){
                    console.log(error);
                }else if(error.response.status === 401){
                    Utils.clearStorage();
                }else{
                    console.log(error.message);
                }
            });
    }
    
    getStateType(value){
        if(value === 0)
            return 'Esperando aprobación';
        if(value === 1)
            return 'Aprobada';
        if(value === 2)
            return 'Denegada';
        if(value === 3)
            return 'Finalizada';
    }
    
    onRowSelection(rows){
        if(rows.length){
            const id = this.state.loans[rows[0]].id;
            Utils.redirectTo(`/loan/${id}`);
        }
    }

    applyFilter = (event, index, value) => {
        this.setState({filterValue:value});
        this.getLoanList(1,value);
    }
    
    render(){
        return (
            <Paper className="TableLoan" zDepth={5}>
                <LoadingMaskComponent active={this.state.loading} />
                <Toolbar style={{background: 'white', overflow: 'hidden'}}>
                    <ToolbarGroup firstChild={true}>
                        <ToolbarTitle text="Filtrar por:" 
                            style={{marginLeft: '15px'}}/>
                        <DropDownMenu value={this.state.filterValue}
                            onChange={this.applyFilter}>
                            <MenuItem value={4} primaryText="Todas" />
                            <MenuItem value={0} primaryText="Esperando aprobación" />
                            <MenuItem value={1} primaryText="Aprobada" />
                            <MenuItem value={2} primaryText="Denegada" />
                            <MenuItem value={3} primaryText="Finalizada" />
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>
                <Table fixedHeader={false}
                    style={{ tableLayout: 'auto' }}
                    bodyStyle= {{ overflowX: undefined, overflowY: undefined }}
                    selectable={true}
                    onRowSelection={(rows) => this.onRowSelection(rows)}>
                    <TableHeader
                        adjustForCheckbox={false}
                        displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn 
                                colSpan={this.props.applicantColumn?'6':'5'}
                                style={{textAlign: 'center'}}
                                >
                                Solicitudes de créditos
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            {this.props.applicantColumn &&
                                <TableHeaderColumn>Solicitante</TableHeaderColumn>
                            }
                            <TableHeaderColumn>Valor</TableHeaderColumn>
                            <TableHeaderColumn>Fecha creación</TableHeaderColumn>
                            <TableHeaderColumn>Estado</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        showRowHover={true}
                        >
                        {this.state.loans.map((loan,i) => {
                            return (<TableRow key={i}>
                                <TableRowColumn>{loan.id}</TableRowColumn>
                                {this.props.applicantColumn &&
                                    <TableRowColumn>{loan.user_full_name}</TableRowColumn>
                                }
                                <TableRowColumn>${Utils.parseNumberMoney(loan.value)}</TableRowColumn>
                                <TableRowColumn>{loan.created_at}</TableRowColumn>
                                <TableRowColumn>{this.getStateType(loan.state)}</TableRowColumn>
                            </TableRow>);
                        })}
                    </TableBody>
                </Table>
                <Divider />
                <center><Pagination
                    total = { this.state.totalPages }
                    current = { this.state.currentPage }
                    display = { 10 }
                    onChange = { number => this.getLoanList( number,this.state.filterValue ) }
                    /></center>
            </Paper>
        );
    }
}

export default LoanListComponent;
