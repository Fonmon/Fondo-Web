import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

import Utils from '../../utils/Utils';
import '../../resources/styles/FinanceInfo.css';

class FinanceInfoComponent extends Component {

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
            <Paper className="Info" elevation={20}>
                <h2 style={{textAlign:'center'}}>Información financiera</h2>
                <p>
                    <span className="Labels" ><strong>Aportes:</strong> <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(this.state.financeInfo.contributions)}</span><br/>
                    <span className="Labels"><strong>Saldo de aportes:</strong> <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(this.state.financeInfo.balance_contributions)}</span><br/>
                    <span className="Labels"><strong>Cupo total:</strong> <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(this.state.financeInfo.total_quota)}</span><br/>
                    <span className="Labels"><strong>Cupo utilizado:</strong> <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(this.state.financeInfo.utilized_quota)}</span><br/>
                    <span className="Labels"><strong>Cupo disponible:</strong> <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(this.state.financeInfo.available_quota)}</span><br/>
                    <span className="Labels"><strong>Actualizado:</strong> <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{this.state.financeInfo.last_modified}</span><br/>
                </p>
            </Paper>
        );
    }
}

export default FinanceInfoComponent;