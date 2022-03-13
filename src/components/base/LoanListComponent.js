import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TablePagination
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Toolbar from '@material-ui/core/Toolbar';

import LoadingMaskComponent from './LoadingMaskComponent';
import Utils from '../../utils/Utils';

class LoanListComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            loans:[],
            currentPage: 1,
            totalPages: 1,
            count: 0,
            loading: false,
            filterValue: 1
        };
    }
    
    componentDidMount = () => {
        this.getLoanList(1, this.state.filterValue);
    }

    getLoanList(page,filterValue){
        this.setState({ 
            loading:true, 
            currentPage:page
        });
        Utils.getLoans(page, this.props.all, filterValue)
            .then((response) => {
                this.setState({
                    totalPages:response.data.num_pages, 
                    count: response.data.count,
                    loans:response.data.list,
                    loading:false
                });
            }).catch((error) => {
                this.setState({ loading:false });
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
    
    applyFilter = (event) => {
        this.setState({ filterValue: event.target.value });
        this.getLoanList(1, event.target.value);
    }
    
    render(){
        return (
            <Paper className="TableLoan" elevation={20}>
                <LoadingMaskComponent active={this.state.loading} />
                <Toolbar style={{background: 'white', overflow: 'hidden'}}> 
                    <InputLabel htmlFor="filter" style={{marginRight: 10}}>Filtrar por: </InputLabel>
                    <Select value={this.state.filterValue}
                        onChange={this.applyFilter}
                        inputProps={{
                            id:"filter"
                        }}
                    >
                        <MenuItem value={4}>Todas</MenuItem>
                        <MenuItem value={0}>Esperando aprobación</MenuItem>
                        <MenuItem value={1}>Aprobada</MenuItem>
                        <MenuItem value={2}>Denegada</MenuItem>
                        <MenuItem value={3}>Finalizada</MenuItem>
                    </Select>
                </Toolbar>
                <div style={{ overflowX: 'auto'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell 
                                    colSpan={this.props.applicantColumn?'6':'5'}
                                    style={{textAlign: 'center'}}
                                >
                                    Solicitudes de créditos
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                {this.props.applicantColumn &&
                                    <TableCell>Solicitante</TableCell>
                                }
                                <TableCell>Valor</TableCell>
                                <TableCell>Fecha creación</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.loans.map((loan,i) => {
                                return (
                                    <TableRow key={i} hover={true}
                                        onClick={(_) => this.props.onRowSelection(loan.id)}
                                    >
                                        <TableCell>{loan.id}</TableCell>
                                        {this.props.applicantColumn &&
                                            <TableCell>{loan.user_full_name}</TableCell>
                                        }
                                        <TableCell>${Utils.parseNumberMoney(loan.value)}</TableCell>
                                        <TableCell>{loan.created_at}</TableCell>
                                        <TableCell>{this.getStateType(loan.state)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={this.state.count}
                    rowsPerPage={10}
                    rowsPerPageOptions={[]}
                    page={this.state.currentPage - 1}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
                    onChangePage={(event, page) => this.getLoanList( page+1,this.state.filterValue )}
                />
            </Paper>
        );
    }
}

export default LoanListComponent;
