import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import '../styles/FinanceInfo.css';

class FinanceInfo extends Component {

    constructor(props){
        super(props);
        this.financeInfo = {
            contributions: '0',
            balance_contributions: '0',
            total_quota: '0',
            available_quota: '0'
        }
    }

    render(){
        return (
            <Paper className="Info" zDepth={5}>
                <h2>Finance Information</h2>
                <p>
                    <span className="Labels"><strong>Contributions:</strong> ${this.financeInfo.contributions}</span><br/>
                    <span className="Labels"><strong>Balance contributions:</strong> ${this.financeInfo.balance_contributions}</span><br/>
                    <span className="Labels"><strong>Total quota:</strong> ${this.financeInfo.total_quota}</span><br/>
                    <span className="Labels"><strong>Available quota:</strong> ${this.financeInfo.available_quota}</span><br/>
                </p>
            </Paper>
        );
    }
}

export default FinanceInfo;