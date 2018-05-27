import React from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../../base/ContainerComponent';
import Utils from '../../../utils/Utils';

const styleColumn = {
    flex: '50%'
}

const styleRow = {
    display: 'flex'
}

export default class ProjectionPage extends ContainerComponent {

    constructor(){
        super();
        this.state = {
            loading: false,
            openMessage: false,
            loanId: null,
            loanIds: [],
            toDate: null,
            fromDate: new Date(),
            loanIdError: '',
            toDateError: '',
            errorMessage: '',
            loanDetail: null,
            result: null
        }
    }

    componentDidMount(){
        const scope = this;
        this.setState({loading: true});
        Utils.getLoans(1,false,1,false)
            .then(response => {
                const loans = response.data.list;
                scope.setState({loanIds:loans.map(loan => loan.id)});
                scope.setState({loading:false});
            }).catch(error => {
                scope.setState({loading:false});
                scope.handleRequestError(error);
            });
    }

    onSubmit(){
        let isError = false;
        const requiredField = 'Campo requerido';
        if(!this.state.toDate){
            this.setState({toDateError:requiredField});
            isError = true;
        }else{
            this.setState({toDateError:''});
        }
        if(!this.state.loanId){
            this.setState({loanIdError:requiredField});
            isError = true;
        }else{
            this.setState({loanIdError: ''});
        }

        const toDate = new Date(this.state.toDate)
        if(!isError && toDate < this.state.fromDate){
            this.setState({toDateError:'Fecha debe ser mayor a la fecha de desembolso del crédito actual.'});
            return isError = true;
        }
        // TODO: validate toDate and fromDate
        if(!isError){
            const scope = this;
            this.setState({loading:true});
            Utils.loanApps(this.state.loanId,'paymentProjection',{'to_date':this.state.toDate})
                .then(response => {
                    scope.setState({loading:false});
                    scope.setState({result:response.data});
                }).catch(error => {
                    scope.setState({loading:false});
                    scope.handleRequestError(error);
                });
        }
    }

    onLoanChange(event,index,newValue){
        const scope = this;
        this.setState({loanId:newValue,loading:true});
        Utils.getLoan(newValue)
            .then(response => {
                scope.setState({loading:false});
                scope.setState({
                    fromDate: new Date(response.data.loan.disbursement_date),
                    loanDetail: response.data.loan_detail
                });
            }).catch(error => {
                scope.setState({loading:false});
                scope.handleRequestError(error);
            });
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderTwoColGrid={true}
                    left={
                        <div>
                            <Paper className="UserInfo" zDepth={5}>
                                <h3 style={{textAlign:'center'}}>Proyección de pago</h3>
                                <SelectField floatingLabelText="Crédito"
                                    style={{width:'100%'}}
                                    value={this.state.loanId}
                                    errorText={this.state.loanIdError}
                                    onChange = {this.onLoanChange.bind(this)}
                                >
                                    {this.state.loanIds.map(loanId => {
                                        return (
                                            <MenuItem key={loanId} value={loanId}
                                                primaryText={`Crédito número ${loanId}`} />
                                        )
                                    })}
                                </SelectField>
                                {this.state.loanDetail && 
                                    <div>
                                        <span className="Labels"><strong>Valor capital:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.capital_balance)}</span><br/>
                                        <span className="Labels"><strong>Valor intereses:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.interests)}</span><br/>
                                        <span className="Labels"><strong>Valor pago total:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.total_payment)}</span><br/>
                                        <span className="Labels"><strong>Valor pago mínimo:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.minimum_payment)}</span><br/>
                                        <span className="Labels"><strong>Fecha límite de pago:</strong> {this.state.loanDetail.payday_limit}</span><br/>
                                    </div>
                                }
                                <DatePicker floatingLabelText="Nueva fecha de pago"
                                    minDate={this.state.fromDate}
                                    autoOk={true}
                                    style={{width:'100%'}}
                                    locale={'es'}
                                    errorText={this.state.toDateError}
                                    DateTimeFormat={Intl.DateTimeFormat}
                                    formatDate={date => Utils.formatDateDisplay(date)}
                                    onChange = {(event,newValue) => this.setState({toDate:Utils.formatDate(newValue)})}
                                />
                                <RaisedButton
                                    style={{width:'100%'}}
                                    primary={true}
                                    label="Calcular"
                                    onClick={this.onSubmit.bind(this)}
                                />
                            </Paper>
                        </div>
                    }
                    right={
                        <div>
                            {this.state.result &&
                                <Paper style={styleRow} className="UserInfo" zDepth={5}>
                                    <div style={styleColumn}>
                                        <strong>Valor Capital</strong><br/>${Utils.parseNumberMoney(this.state.result.capital_balance)}
                                    </div>
                                    <div style={styleColumn}>
                                        <strong>Intereses</strong><br/>${Utils.parseNumberMoney(this.state.result.interests)}
                                    </div>
                                </Paper>
                            }
                        </div>
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