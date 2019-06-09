import React from 'react';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';

import ContainerComponent from '../../base/ContainerComponent';
import DateField from '../../fields/DateField';
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
            loanId: -1,
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
        if(!this.state.toDate || this.state.loanId < 0){
            return this.setState({
                openMessage: true,
                errorMessage: 'Por favor completar todos los campos'
            })
        }

        const toDate = new Date(this.state.toDate)
        const fromDate = new Date(this.state.fromDate)
        if(!isError && toDate < fromDate){
            this.setState({
                openMessage: true,
                errorMessage:'Fecha debe ser mayor a la fecha de desembolso del crédito actual.'
            });
            return isError = true;
        }

        if(!isError){
            const scope = this;
            this.setState({loading:true});
            Utils.loanApps(this.state.loanId,'paymentProjection',{'to_date':this.state.toDate})
                .then(response => {
                    scope.setState({
                        loading: false,
                        result: response.data
                    });
                }).catch(error => {
                    scope.setState({loading:false});
                    scope.handleRequestError(error);
                });
        }
    }

    onLoanChange(event){
        const scope = this;
        const loanId = event.target.value;
        if(loanId === -1)
            return

        this.setState({loanId:loanId,loading:true});
        Utils.getLoan(loanId)
            .then(response => {
                scope.setState({
                    loading:false,
                    fromDate: Utils.formatDate(new Date(response.data.loan.disbursement_date)),
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
                        <Paper className="UserInfo" elevation={20}>
                            <h3 style={{textAlign:'center'}}>Proyección de pago</h3>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="creditId">Crédito {this.state.loanIdError}</InputLabel>
                                    <Select style={{width:'100%'}}
                                        inputProps={{
                                            id: 'creditId'
                                        }}
                                        value={this.state.loanId}
                                        error={this.state.loanIdError !== ''}
                                        onChange = {this.onLoanChange.bind(this)}
                                    >
                                        <MenuItem value={-1}><em>Ninguno</em></MenuItem>
                                        {this.state.loanIds.map(loanId => {
                                            return (
                                                <MenuItem key={loanId} value={loanId}>{`Crédito número ${loanId}`}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.loanDetail && 
                                        <div>
                                            <span className="Labels"><strong>Valor capital:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.capital_balance)}</span><br/>
                                            <span className="Labels"><strong>Valor intereses:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.interests)}</span><br/>
                                            <span className="Labels"><strong>Valor pago total:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.total_payment)}</span><br/>
                                            <span className="Labels"><strong>Valor pago mínimo:</strong> ${Utils.parseNumberMoney(this.state.loanDetail.minimum_payment)}</span><br/>
                                            <span className="Labels"><strong>Fecha límite de pago:</strong> {this.state.loanDetail.payday_limit}</span><br/>
                                        </div>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <DateField min={this.state.fromDate}
                                        label="Nueva fecha de pago"
                                        style={{ width: '100%' }}
                                        onChange={(event) => this.setState({ toDate: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button style={{width:'100%'}}
                                        color='primary'
                                        variant="contained"
                                        onClick={this.onSubmit.bind(this)}
                                    >
                                        Calcular
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    }
                    right={
                        <div>
                            {this.state.result &&
                                <Paper style={styleRow} className="UserInfo" elevation={20}>
                                    <div style={styleColumn}>
                                        <strong>Valor Capital</strong><br/>${Utils.parseNumberMoney(this.state.result.capital_balance)}
                                    </div>
                                    <div style={styleColumn}>
                                        <strong>Intereses</strong><br/>${Utils.parseNumberMoney(this.state.result.interests)}
                                    </div>
                                    <div style={styleColumn}>
                                        <strong>Total a pagar</strong><br/>${Utils.parseNumberMoney(
                                            this.state.result.capital_balance + this.state.result.interests
                                        )}
                                    </div>
                                </Paper>
                            }
                        </div>
                    }
                />
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(_) => this.setState({openMessage: false})}
                />
            </div>
        );
    }
}