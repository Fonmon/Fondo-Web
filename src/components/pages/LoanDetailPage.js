import React from 'react';
import { Link } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import ContainerComponent from '../base/ContainerComponent';
import RefinanceDialog from '../dialogs/RefinanceDialog';
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
            },
            refinanceDialog: false
        }
        this.refinanceKey = 1;
    }

    componentDidMount = () =>{
        this.getLoan();
    }

    componentWillReceiveProps(nextProps) {
        this.getLoan(nextProps.match.params.id);
    }

    getLoan(loanId){
        let id = loanId || this.props.match.params.id;
        this.setState({
            id, 
            loading: true
        });
        Utils.getLoan(id)
            .then((response) => {
                this.setState({
                    loanDetail: response.data.loan_detail,
                    loan: response.data.loan,
                    loading: false
                });
            }).catch((error) => {
                this.setState({ loading:false });
                this.handleRequestError(error);
            });
    }

    updateState(value){
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
                .then((response) => {
                    this.showMessageError('Cambio de estado exitoso');
                    this.setState({
                        loading: false,
                        loanDetail: response.data,
                        loan: {
                            ...this.state.loan,
                            state: value
                        }
                    });
                }).catch((error) => {
                    this.setState({ loading:false });
                    this.handleRequestError(error);
                })
        }
    }

    getPaymentType(value){
        switch(value){
            case 0:
                return 'Efectivo'
            case 1:
                return 'Cuenta'
            default:
                return 'Refinanciado'
        }
    }

    getFeeType(value){
        return value === 0 ? 'Mensual':'Única';
    }

    handleRefinancedLoanCreated = (new_loan_id) => {
        this.refinanceKey++;
        this.setState({ refinanceDialog: false });
        this.props.history.push(`/loan/${new_loan_id}`);
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderOneFullColGrid={true}
                    middle={
                        <Paper className="UserInfo" elevation={20}>
                            <ContainerComponent orderRenderOneFullColGrid={0}
                                renderOneFullColGrid={true}
                                middle={
                                    <h2 style={{textAlign:'center'}}>Solicitud de crédito { this.state.loan.is_refinanced ? 'refinanciado':'' }</h2>
                                }
                                orderRenderTwoColGrid={1}
                                renderTwoColGrid={true}
                                leftWidth={6}
                                left={
                                    <React.Fragment>
                                        <span className="Labels"><strong>Número de crédito:</strong> {this.state.loan.id}</span><br/>
                                        <span className="Labels"><strong>Nombre:</strong> {this.state.loan.user_full_name}</span><br/>
                                        <span className="Labels"><strong>Fecha creación:</strong> {this.state.loan.created_at}</span><br/>
                                        <span className="Labels"><strong>Valor solicitado:</strong> ${Utils.parseNumberMoney(this.state.loan.value)}</span><br/>
                                        <span className="Labels"><strong>Plazo:</strong> {this.state.loan.timelimit} Meses</span><br/>
                                        <span className="Labels"><strong>Cuota:</strong> {this.getFeeType(this.state.loan.fee)}</span><br/>
                                        <span className="Labels"><strong>Tasa:</strong> {this.state.loan.rate*100}%</span><br/>
                                        <span className="Labels"><strong>Fecha de desembolso:</strong> {this.state.loan.disbursement_date}</span><br/>
                                        <span className="Labels"><strong>Abono en:</strong> {this.getPaymentType(this.state.loan.payment)}</span><br/>
                                        {this.state.loan.refinanced_loan &&
                                            <div>
                                                <span className="Labels">
                                                    <strong>Refinanciación:</strong> <Link to={`/loan/${this.state.loan.refinanced_loan}`}>crédito #{this.state.loan.refinanced_loan}</Link>
                                                </span><br/>
                                            </div>
                                        }
                                        <span className="Labels"><strong>Información adicional:</strong> {this.state.loan.comments}</span><br/>
                                    </React.Fragment>
                                }
                                rightWidth={6}
                                right={
                                    <React.Fragment>
                                        <InputLabel style={{ 
                                                fontWeight: 'bold', 
                                                color: 'rgba(0, 0, 0, 0.87)',
                                                lineHeight: 1.8,
                                            }} 
                                            htmlFor="state">Estado solicitud</InputLabel>
                                        <Select value={this.state.loan.state}
                                            inputProps={{
                                                id:"state"
                                            }}
                                            style={{width:'100%'}}
                                            onChange={(event) => this.updateState(event.target.value)}
                                            disabled={!(Utils.isAdmin() || Utils.isTreasurer()) || this.state.loan.state===3 ||  this.state.loan.state===2}
                                        >
                                            <MenuItem value={0}>Esperando aprobación</MenuItem>
                                            <MenuItem value={1}>Aprobada</MenuItem>
                                            <MenuItem value={2}>Denegada</MenuItem>
                                            <MenuItem value={3}>Finalizada</MenuItem>
                                        </Select>
                                        {this.state.loan.state === 1 && 
                                            <div>
                                                <span className="Labels"><strong>Valor capital:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.capital_balance)}</span><br/>
                                                <span className="Labels"><strong>Valor intereses:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.interests)}</span><br/>
                                                <span className="Labels"><strong>Valor pago total:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.total_payment)}</span><br/>
                                                <span className="Labels"><strong>Valor pago mínimo:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.minimum_payment)}</span><br/>
                                                <span className="Labels"><strong>Fecha límite de pago:</strong> {this.state.loanDetail.payday_limit}</span><br/>
                                                {(this.state.loan.user_id.toString() === Utils.currentId() && !this.state.loan.refinanced_loan) &&
                                                    <Button variant="contained"
                                                        children="Refinanciar"
                                                        color="primary"
                                                        style={{width: '100%', top: '30px'}}
                                                        onClick={(_) => this.setState({ refinanceDialog: true })}
                                                    />
                                                }
                                            </div>
                                        }
                                    </React.Fragment>
                                }
                            />
                        </Paper>
                    }
                />
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(_) => this.setState({openMessage: false})}
                />
                <RefinanceDialog key={this.refinanceKey}
                    loan_id={this.state.loan.id}
                    onLoanCreated={this.handleRefinancedLoanCreated}
                    refinanceOpen={this.state.refinanceDialog}
                    onClose={() => {
                        this.refinanceKey++;
                        this.setState({refinanceDialog: false})
                    }}
                />
            </div>
        );
    }
}

export default LoanDetailPage;