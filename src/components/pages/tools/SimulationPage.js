import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid'
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@material-ui/core';

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
                        <Paper className="UserInfo" elevation={20}>
                            <h3 style={{textAlign:'center'}}>Simulador de crédito</h3>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <CurrencyField label="Valor a solicitar"
                                        style={{width:'100%'}}
                                        value={this.state.value}
                                        onChange = {(event) => this.setState({value:Number(event.target.value)})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField placeholder="Valor en meses"
                                        label="Plazo"
                                        style={{width:'100%'}}
                                        type='number'
                                        min={1}
                                        onChange = {(event) => this.setState({timelimit:Number(event.target.value)})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="fee" style={{marginRight: 10}}>Cuota</InputLabel>
                                    <Select value={this.state.fee}
                                        inputProps={{
                                            id: "fee"
                                        }}
                                        style={{width:'100%'}}
                                        onChange={(event) => this.setState({fee:event.target.value})}>
                                        <MenuItem value={0}>Mensual</MenuItem>
                                        <MenuItem value={1}>Única</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper className="UserInfo" elevation={20}>
                            <div style={{ overflowX: 'auto'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cuota</TableCell>
                                            <TableCell>Valor cuota</TableCell>
                                            <TableCell>Valor intereses</TableCell>
                                            <TableCell>Valor a pagar</TableCell>
                                            <TableCell>Saldo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.buildTable().map((loanData,i) => {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell>{i+1}</TableCell>
                                                    <TableCell>{loanData.fee_value}</TableCell>
                                                    <TableCell>{loanData.interests_value}</TableCell>
                                                    <TableCell>{loanData.payment_value}</TableCell>
                                                    <TableCell>{loanData.final_balance}</TableCell>
                                                </TableRow>);
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </Paper>
                    </div>
                }
            />
        )
    }
}

export default SimulationPage;