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
            <Table onRowSelection={this.handleRowSelection}>
                <TableHeader
                    adjustForCheckbox={false}
                    displaySelectAll={false}
                    >
                    <TableRow>
                        <TableHeaderColumn 
                            colSpan="4"
                            style={{textAlign: 'center'}}
                            >
                            Loans
                        </TableHeaderColumn>
                    </TableRow>
                    <TableRow>
                        <TableHeaderColumn>ID</TableHeaderColumn>
                        <TableHeaderColumn>Value</TableHeaderColumn>
                        <TableHeaderColumn>Created at</TableHeaderColumn>
                        <TableHeaderColumn>Action</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                    >
                    <TableRow selected={this.isSelected(0)}>
                        <TableRowColumn>1</TableRowColumn>
                        <TableRowColumn>John Smith</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center'}}>
                            <IconButton>
                                <ActionOpenInNew />
                            </IconButton>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow selected={this.isSelected(1)}>
                        <TableRowColumn>2</TableRowColumn>
                        <TableRowColumn>Randal White</TableRowColumn>
                        <TableRowColumn>Unemployed</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center'}}>
                            <IconButton>
                                <ActionOpenInNew />
                            </IconButton>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow selected={this.isSelected(2)}>
                        <TableRowColumn>3</TableRowColumn>
                        <TableRowColumn>Stephanie Sanders</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center'}}>
                            <IconButton>
                                <ActionOpenInNew />
                            </IconButton>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow selected={this.isSelected(3)}>
                        <TableRowColumn>4</TableRowColumn>
                        <TableRowColumn>Steve Brown</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center'}}>
                            <IconButton>
                                <ActionOpenInNew />
                            </IconButton>
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
            </Paper>
        );
    }
}

export default LoanListHome;