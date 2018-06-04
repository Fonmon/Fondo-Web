import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ContainerComponent from '../base/ContainerComponent';
import Utils from '../../utils/Utils';

class LoanDetailPage extends ContainerComponent{
    
    constructor(){
        super();
        this.state = {
            id:-1,
            openMessage:false,
            errorMessage:'',
            loading: false,
            loan:{
                id:-1,
                value:'',
                timelimit:0,
                disbursement_date:'',
                payment:0,
                created_at:'',
                fee:0,
                comments:'',
                state:0,
                user_full_name:'',
                rate:0
            },
            loanDetail:{
                total_payment:0,
                minimum_payment:0,
                payday_limit:''
            }
        }
    }

    componentDidMount = () =>{
        this.getLoan();
    }

    getLoan(){
        let id = this.props.match.params.id;
        this.setState({id:id});
        let scope = this;
        this.setState({loading:true});
        Utils.getLoan(id)
            .then(function(response){
                scope.setState({loan:response.data.loan});
                scope.setState({loanDetail:response.data.loan_detail})
                scope.setState({loading:false});
            }).catch(function(error){
                scope.setState({loading:false});
                scope.handleRequestError(error);
            });
    }

    updateState(value){
        let scope = this;
        if(this.state.loan.state === value)
            return;
        if(this.state.loan.state === 0 && value === 3){
            this.showMessageError('No se puede actualizar de estado.');
            return;
        }
        else if(this.state.loan.state === 1 && value !== 3){
            this.showMessageError('No se puede actualizar de estado.');
            return;
        }else{
            this.setState({loading:true});
            Utils.updateLoan(this.state.loan.id,value)
                .then(function(response){
                    scope.setState({loading:false});
                    scope.showMessageError('Cambio de estado exitoso');
                    scope.setState({loanDetail:response.data});
                    scope.setState({loan:{...scope.state.loan,state:value}});
                }).catch(function(error){
                    scope.setState({loading:false});
                    scope.handleRequestError(error);
                })
        }
    }

    getPaymentType(value){
        return value === 0 ? 'Efectivo':'Cuenta';
    }

    getFeeType(value){
        return value === 0 ? 'Mensual':'Única';
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderOneFullColGrid={true}
                    middle={
                        <Paper className="UserInfo" zDepth={5}>
                            <ContainerComponent orderRenderOneFullColGrid={0}
                                renderOneFullColGrid={true}
                                middle={
                                    <h2 style={{textAlign:'center'}}>Solicitud de crédito</h2>
                                }
                                orderRenderTwoColGrid={1}
                                renderTwoColGrid={true}
                                leftWidth={6}
                                left={
                                    <p>
                                        <span className="Labels"><strong>Número de crédito:</strong> {this.state.loan.id}</span><br/>
                                        <span className="Labels"><strong>Nombre:</strong> {this.state.loan.user_full_name}</span><br/>
                                        <span className="Labels"><strong>Fecha creación:</strong> {this.state.loan.created_at}</span><br/>
                                        <span className="Labels"><strong>Valor solicitado:</strong> ${Utils.parseNumberMoney(this.state.loan.value)}</span><br/>
                                        <span className="Labels"><strong>Plazo:</strong> {this.state.loan.timelimit} Meses</span><br/>
                                        <span className="Labels"><strong>Cuota:</strong> {this.getFeeType(this.state.loan.fee)}</span><br/>
                                        <span className="Labels"><strong>Tasa:</strong> {this.state.loan.rate*100}%</span><br/>
                                        <span className="Labels"><strong>Fecha de desembolso:</strong> {this.state.loan.disbursement_date}</span><br/>
                                        <span className="Labels"><strong>Abono en:</strong> {this.getPaymentType(this.state.loan.payment)}</span><br/>
                                        <span className="Labels"><strong>Información adicional:</strong> {this.state.loan.comments}</span><br/>
                                    </p>
                                }
                                rightWidth={6}
                                right={
                                    <div>
                                        <SelectField
                                            floatingLabelText="Estado solicitud"
                                            value={this.state.loan.state}
                                            style={{width:'100%'}}
                                            onChange={(event,index,newValue) => this.updateState(newValue)}
                                            disabled={!(Utils.isAdmin() || Utils.isTreasurer()) || this.state.loan.state===3 ||  this.state.loan.state===2}
                                        >
                                            <MenuItem value={0} primaryText="Esperando aprobación" />
                                            <MenuItem value={1} primaryText="Aprobada" />
                                            <MenuItem value={2} primaryText="Denegada" />
                                            <MenuItem value={3} primaryText="Finalizada" />
                                        </SelectField>
                                        {this.state.loan.state === 1 && 
                                            <div>
                                                <span className="Labels"><strong>Valor capital:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.capital_balance)}</span><br/>
                                                <span className="Labels"><strong>Valor intereses:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.interests)}</span><br/>
                                                <span className="Labels"><strong>Valor pago total:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.total_payment)}</span><br/>
                                                <span className="Labels"><strong>Valor pago mínimo:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.minimum_payment)}</span><br/>
                                                <span className="Labels"><strong>Fecha límite de pago:</strong> {this.state.loanDetail.payday_limit}</span><br/>
                                            </div>
                                        }
                                    </div>
                                }
                            />
                        </Paper>
                    }
                />
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={(event) => this.setState({openMessage: false})}
                    />
            </div>
        );
    }
}

export default LoanDetailPage;