import React from 'react';
import Paper from '@material-ui/core/Paper';

import Utils from '../../utils/Utils';
import '../../resources/styles/FinanceInfo.css';

export default function FinanceInfoComponent(props){
    return (
        <Paper className="Info" elevation={20}>
            <h2 style={{textAlign:'center'}}>Información financiera</h2>
            <p>
                <span className="Labels" ><strong>Aportes:</strong> <br />
                &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(props.financeInfo.contributions)}</span><br/>
                <span className="Labels"><strong>Saldo de aportes:</strong> <br />
                &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(props.financeInfo.balance_contributions)}</span><br/>
                <span className="Labels"><strong>Cupo total:</strong> <br />
                &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(props.financeInfo.total_quota)}</span><br/>
                <span className="Labels"><strong>Cupo utilizado:</strong> <br />
                &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(props.financeInfo.utilized_quota)}</span><br/>
                <span className="Labels"><strong>Cupo disponible:</strong> <br />
                &nbsp;&nbsp;&nbsp;&nbsp;${Utils.parseNumberMoney(props.financeInfo.available_quota)}</span><br/>
                <span className="Labels"><strong>Actualizado:</strong> <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{props.financeInfo.last_modified}</span><br/>
            </p>
        </Paper>
    );
}