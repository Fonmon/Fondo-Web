import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import ContainerComponent from '../base/ContainerComponent';
import CurrencyField from '../fields/CurrencyField';
import DateField from '../fields/DateField'
import Utils from '../../utils/Utils';

class RequestLoanPage extends ContainerComponent {
    constructor() {
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            value: null,
            payment: 0,
            timelimit: 0,
            fee: 0,
            comments: '',
            disbursement_date: null,
            value_error: '',
            timelimit_error: '',
            loading: false
        }
    }

    handleSubmit() {
        let isError = false;
        if (!this.state.disbursement_date) {
            isError = true;
            this.setState({ openMessage: true, errorMessage: 'Fecha de desembolso requerida o inválida' });
        }
        if (!this.state.timelimit) {
            isError = true;
            this.setState({ timelimit_error: 'Campo requerido' });
        } else if (this.state.timelimit <= 0 || this.state.timelimit > 24) {
            isError = true;
            this.setState({ timelimit_error: 'Valor debe ser entre 1 y 24' });
        } else
            this.setState({ timelimit_error: '' });
        if (!this.state.value) {
            isError = true;
            this.setState({ value_error: 'Campo requerido' });
        } else if (this.state.value < 0) {
            isError = true;
            this.setState({ value_error: 'Valor debe ser mayor a 0' });
        } else
            this.setState({ value_error: '' });
        if (!isError) {
            let scope = this;
            this.setState({ 
                loading: true,
                value_error: '', 
                timelimit_error: ''
            });
            let loan = {
                value: Number(this.state.value),
                timelimit: Number(this.state.timelimit),
                disbursement_date: this.state.disbursement_date,
                fee: Number(this.state.fee),
                payment: Number(this.state.payment),
                comments: this.state.comments
            }
            Utils.createLoan(loan)
                .then(function (response) {
                    scope.setState({ loading: false });
                    let id = response.data.id;
                    Utils.redirectTo(`/loan/${id}`);
                }).catch(function (error) {
                    scope.setState({ loading: false });
                    scope.handleRequestError(error, [{
                        status: 406,
                        message: error.response.data.message
                    }]);
                });
        }
    }

    render() {
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderOneMidColGrid={true}
                    middle={
                        <Paper className="UserInfo" elevation={20}>
                            <h2 style={{ textAlign: 'center' }}>Solicitud de crédito</h2>
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <CurrencyField label="Valor a solicitar"
                                        style={{ width: '100%' }}
                                        value={this.state.value}
                                        helperText={this.state.value_error}
                                        error={this.state.value_error !== ''}
                                        onChange={(event) => this.setState({ value: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField placeholder="Valor en meses"
                                        label="Plazo"
                                        style={{ width: '100%' }}
                                        type='number'
                                        helperText={this.state.timelimit_error}
                                        error={this.state.timelimit_error !== ''}
                                        onChange={(event) => this.setState({ timelimit: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="fee">Cuota</InputLabel>
                                    <Select value={this.state.fee}
                                        inputProps={{
                                            id:"fee"
                                        }}
                                        style={{ width: '100%' }}
                                        onChange={(event) => this.setState({ fee: event.target.value })}>
                                        <MenuItem value={0}>Mensual</MenuItem>
                                        <MenuItem value={1}>Única</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <DateField min={Utils.formatDate(new Date())}
                                        label="Fecha de desembolso"
                                        style={{ width: '100%' }}
                                        onChange={(event) => this.setState({ disbursement_date: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="payment">Abono en</InputLabel>
                                    <Select value={this.state.payment}
                                        inputProps={{
                                            id:"payment"
                                        }}
                                        style={{ width: '100%' }}
                                        onChange={(event) => this.setState({ payment: event.target.value })}>
                                        <MenuItem value={0}>Efectivo</MenuItem>
                                        <MenuItem value={1}>Cuenta</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField placeholder="Comentarios adicionales"
                                        multiline
                                        rows={2}
                                        style={{ width: '100%' }}
                                        rowsMax={4}
                                        onChange={(event) => this.setState({ comments: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button color='primary'
                                        variant="contained"
                                        style={{ width: '100%' }}
                                        onClick={this.handleSubmit.bind(this)}
                                    >
                                        Enviar solicitud
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    }
                />
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(event) => this.setState({ openMessage: false })}
                />
            </div>
        );
    }
}

export default RequestLoanPage;