import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Utils from '../utils/Utils';
import '../styles/FinanceInfo.css';

class FinanceInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            financeInfo : props.financeInfo
        }
    }

    componentWillReceiveProps(nextValue){
        this.setState(nextValue);
    }

    render(){
        return (
            <Paper className="Info" zDepth={5}>
                <h2>Información financiera</h2>
                <p>
                    <span className="Labels"><strong>Aportes:</strong> ${Utils.parseNumberMoney(this.state.financeInfo.contributions)}</span><br/>
                    <span className="Labels"><strong>Saldo de aportes:</strong> ${Utils.parseNumberMoney(this.state.financeInfo.balance_contributions)}</span><br/>
                    <span className="Labels"><strong>Cupo total:</strong> ${Utils.parseNumberMoney(this.state.financeInfo.total_quota)}</span><br/>
                    <span className="Labels"><strong>Cupo disponible:</strong> ${Utils.parseNumberMoney(this.state.financeInfo.available_quota)}</span><br/>
                </p>
            </Paper>
        );
    }
}

export default FinanceInfo;