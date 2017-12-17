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

class LoanListHome extends Component{

    state = {
        selected: [1],
      };
    
      isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
      };
    
      handleRowSelection = (selectedRows) => {
        this.setState({
          selected: selectedRows,
        });
      };
    

    render(){
        return (
            <Paper className="TableLoan" zDepth={5}>
                <Table 
                    onRowSelection={this.handleRowSelection}
                    selectable={false}>
                    <TableHeader
                        adjustForCheckbox={false}
                        displaySelectAll={false}
                        >
                        <TableRow>
                            <TableHeaderColumn 
                                colSpan="4"
                                style={{textAlign: 'center'}}
                                >
                                Solicitudes de créditos
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Valor</TableHeaderColumn>
                            <TableHeaderColumn>Fecha creación</TableHeaderColumn>
                            <TableHeaderColumn>Acción</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        >
                        <TableRow selected={this.isSelected(0)}>
                            <TableRowColumn>1</TableRowColumn>
                            <TableRowColumn>John Smith</TableRowColumn>
                            <TableRowColumn>Employed</TableRowColumn>
                            <TableRowColumn>
                                <IconButton>
                                    <ActionOpenInNew />
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>
                        <TableRow selected={this.isSelected(1)}>
                            <TableRowColumn>2</TableRowColumn>
                            <TableRowColumn>Randal White</TableRowColumn>
                            <TableRowColumn>Unemployed</TableRowColumn>
                            <TableRowColumn>
                                <IconButton>
                                    <ActionOpenInNew />
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>
                        <TableRow selected={this.isSelected(2)}>
                            <TableRowColumn>3</TableRowColumn>
                            <TableRowColumn>Stephanie Sanders</TableRowColumn>
                            <TableRowColumn>Employed</TableRowColumn>
                            <TableRowColumn>
                                <IconButton>
                                    <ActionOpenInNew />
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>
                        <TableRow selected={this.isSelected(3)}>
                            <TableRowColumn>4</TableRowColumn>
                            <TableRowColumn>Steve Brown</TableRowColumn>
                            <TableRowColumn>Employed</TableRowColumn>
                            <TableRowColumn>
                                <IconButton>
                                    <ActionOpenInNew />
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
                <Divider />
                <center><Pagination
                    total = { 2 }
                    current = { 1 }
                    display = { 2 }
                    onChange = { number => this.setState({ number }) }
                    /></center>
            </Paper>
        );
    }
}

export default LoanListHome;