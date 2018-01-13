import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Utils from '../utils/Utils';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LoadingMask from './LoadingMask';

class LoanDetail extends Component{
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
        Utils.getLoan(id)
            .then(function(response){
                scope.setState({loan:response.data.loan});
                scope.setState({loanDetail:response.data.loan_detail})
            }).catch(function(error){
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 404){
                    Utils.redirectTo('/error');
                }else if(error.response.status === 401){
                    Utils.clearStorage();
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
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
                    if(!error.response){
                        scope.showMessageError('Error de conexión, inténtalo más tarde.');
                    }else if(error.response.status === 404){
                        Utils.redirectTo('/error');
                    }else if(error.response.status === 401){
                        Utils.clearStorage();
                    }else{
                        scope.showMessageError(error.message);
                    }
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
                <Header />
                <LoadingMask active={this.state.loading} />
                <Grid fluid>
                    <Row>
                        <Col xs={12} >
                            <Paper className="UserInfo" zDepth={5}>
                                <Grid fluid>
                                    <Row>
                                        <Col xs={12}>
                                            <h2 style={{textAlign:'center'}}>Solicitud de crédito</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6} >
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
                                        </Col>
                                        <Col sm={6} >
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
                                            {this.state.loan.state === 1 && <div>
                                                <span className="Labels"><strong>Valor pago total:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.total_payment)}</span><br/>
                                                <span className="Labels"><strong>Valor pago mínimo:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.minimum_payment)}</span><br/>
                                                <span className="Labels"><strong>Fecha límite de pago:</strong> {this.state.loanDetail.payday_limit}</span><br/>
                                            </div>}
                                        </Col>
                                    </Row>
                                </Grid>
                            </Paper>
                        </Col>
                    </Row>
                </Grid>
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

export default LoanDetail;