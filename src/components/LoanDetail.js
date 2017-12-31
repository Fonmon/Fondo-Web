import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Utils from '../utils/Utils';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class LoanDetail extends Component{
    constructor(){
        super();
        this.state = {
            id:-1,
            openMessage:false,
            errorMessage:'',
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
                scope.setState({loan:response.data});
            }).catch(function(error){
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 404){
                    window.location = '/error';
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    updateState(value){
        console.log(value);
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
                                        <Col xs={6} >
                                            <p>
                                                <span className="Labels"><strong>ID:</strong> {this.state.loan.id}</span><br/>
                                                <span className="Labels"><strong>Nombre:</strong> {this.state.loan.user_full_name}</span><br/>
                                                <span className="Labels"><strong>Fecha creación:</strong> {this.state.loan.created_at}</span><br/>
                                                <span className="Labels"><strong>Valor solicitado:</strong> ${Utils.parseNumberMoney(this.state.loan.value)}</span><br/>
                                                <span className="Labels"><strong>Plazo:</strong> {this.state.loan.timelimit} Meses</span><br/>
                                                <span className="Labels"><strong>Cuota:</strong> {this.getFeeType(this.state.loan.fee)}</span><br/>
                                                <span className="Labels"><strong>Fecha de desembolso:</strong> {this.state.loan.disbursement_date}</span><br/>
                                                <span className="Labels"><strong>Abono en:</strong> {this.getPaymentType(this.state.loan.payment)}</span><br/>
                                            </p>
                                        </Col>
                                        <Col xs={6} >
                                            <SelectField
                                                floatingLabelText="Estado solicitud"
                                                value={this.state.loan.state}
                                                style={{width:'100%'}}
                                                onChange={(event,index,newValue) => this.updateState(newValue)}
                                                disabled={!(Utils.isAdmin() || Utils.isTreasurer())}
                                                >
                                                <MenuItem value={0} primaryText="Esperando aprobación" />
                                                <MenuItem value={1} primaryText="Aprobada" />
                                                <MenuItem value={2} primaryText="Denegada" />
                                                <MenuItem value={3} primaryText="Finalizada" />
                                            </SelectField>
                                            <span className="Labels"><strong>Información adicional:</strong> {this.state.loan.comments}</span><br/>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Paper>
                        </Col>
                    </Row>
                    {this.state.loan.state === 1 && <Row>
                        <Col xs={12} >
                            <Paper className="UserInfo" zDepth={5}>
                            
                            </Paper>
                        </Col>
                    </Row>
                    }
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