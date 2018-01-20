import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Pagination from 'material-ui-pagination';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import LoadingMask from './LoadingMask';
import Utils from '../utils/Utils';

class LoanListComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            loans:[],
            currentPage: 1,
            totalPages: 1,
            loading: false
        };
    }
    
    componentDidMount = () => {
        this.getLoanList(1);
    }

    getLoanList(page){
        let scope = this;
        this.setState({loading:true});
        Utils.getLoans(page,this.props.all)
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

    onEdit(id){
        Utils.redirectTo(`/loan/${id}`);
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
    
    render(){
        return (
            <Paper className="TableLoan" zDepth={5}>
                <LoadingMask active={this.state.loading} />
                <Table fixedHeader={false}
                    style={{ tableLayout: 'auto' }}
                    bodyStyle= {{ overflowX: undefined, overflowY: undefined }}
                    selectable={false}>
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
                            <TableHeaderColumn>Acción</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
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
                                <TableRowColumn >
                                    <IconButton onClick={this.onEdit.bind(this,loan.id)}><ActionOpenInNew /></IconButton>
                                </TableRowColumn>
                            </TableRow>);
                        })}
                    </TableBody>
                </Table>
                <Divider />
                <center><Pagination
                    total = { this.state.totalPages }
                    current = { this.state.currentPage }
                    display = { 10 }
                    onChange = { number => this.getLoanList( number ) }
                    /></center>
            </Paper>
        );
    }
}

export default LoanListComponent;