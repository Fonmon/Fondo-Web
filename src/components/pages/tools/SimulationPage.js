import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import ContainerComponent from '../../base/ContainerComponent';
import CurrencyField from '../../fields/CurrencyField';
import Utils from '../../../utils/Utils';

class LoanData {
    fee_value;
    interests_value;
    payment_value;
    final_balance;
}

class SimulationPage extends ContainerComponent{
    constructor(){
        super();
        this.state = {
            value:0,
            fee:0,
            timelimit:0
        }
    }

    getRate(){
        if(6 < this.state.timelimit && this.state.timelimit <= 12)
            return 0.025;
        if(12 < this.state.timelimit && this.state.timelimit <= 24)
            return 0.03;
        return 0.02;
    }

    buildTable(){
        if(this.state.value >= 0 && this.state.timelimit){
            let timelimit_fee = this.state.fee ? 1 : this.state.timelimit;
            let fee_value = this.state.value / timelimit_fee;
            let rate = this.getRate();
            let balance = this.state.value;
            let loan_data_list = [];
            for(var i = 1 ; i <= timelimit_fee ; i++){
                let loanData = new LoanData();
                let interests_value = 0;
                loanData.fee_value = Utils.parseNumberMoney(Math.round(fee_value,1));
                interests_value = balance * rate;
                if(this.state.fee)
                    interests_value *= this.state.timelimit;
                loanData.interests_value = Utils.parseNumberMoney(Math.round(interests_value,1));
                loanData.payment_value = Utils.parseNumberMoney(Math.round(fee_value+interests_value,1));
                balance -= fee_value;
                loanData.final_balance = Utils.parseNumberMoney(Math.round(balance,1));
                loan_data_list.push(loanData);
            }
            return loan_data_list;
        }
        return [];
    }

    render(){
        return (
            <ContainerComponent showHeader={true}
                renderOneMidColGrid={true}
                middle={
                    <div>
                        <Paper className="UserInfo" zDepth={5}>
                            <h3 style={{textAlign:'center'}}>Simulador de crédito</h3>
                            <CurrencyField floatingLabelText="Valor a solicitar"
                                style={{width:'100%'}}
                                value={this.state.value}
                                errorText={this.state.value_error}
                                onChange = {(event,newValue) => this.setState({value:Number(newValue)})}
                            />
                            <TextField hintText="Valor en meses"
                                floatingLabelText="Plazo"
                                style={{width:'100%'}}
                                type='number'
                                min={1}
                                errorText={this.state.timelimit_error}
                                onChange = {(event,newValue) => this.setState({timelimit:Number(newValue)})}
                            />
                            <SelectField
                                floatingLabelText="Cuota"
                                value={this.state.fee}
                                style={{width:'100%'}}
                                onChange={(event,index,value) => this.setState({fee:value})}>
                                <MenuItem value={0} primaryText="Mensual" />
                                <MenuItem value={1} primaryText="Única" />
                            </SelectField>
                        </Paper>
                        <Paper className="UserInfo" zDepth={5}>
                            <Table fixedHeader={false}
                                style={{ tableLayout: 'auto' }}
                                bodyStyle= {{ overflowX: undefined, overflowY: undefined }}
                                selectable={false}>
                                <TableHeader
                                    adjustForCheckbox={false}
                                    displaySelectAll={false}>
                                    <TableRow>
                                        <TableHeaderColumn>Cuota</TableHeaderColumn>
                                        <TableHeaderColumn>Valor cuota</TableHeaderColumn>
                                        <TableHeaderColumn>Valor intereses</TableHeaderColumn>
                                        <TableHeaderColumn>Valor a pagar</TableHeaderColumn>
                                        <TableHeaderColumn>Saldo</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}>
                                    {this.buildTable().map((loanData,i) => {
                                        return (<TableRow key={i}>
                                            <TableRowColumn>{i+1}</TableRowColumn>
                                            <TableRowColumn>{loanData.fee_value}</TableRowColumn>
                                            <TableRowColumn>{loanData.interests_value}</TableRowColumn>
                                            <TableRowColumn>{loanData.payment_value}</TableRowColumn>
                                            <TableRowColumn>{loanData.final_balance}</TableRowColumn>
                                        </TableRow>);
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                }
            />
        )
    }
}

export default SimulationPage;