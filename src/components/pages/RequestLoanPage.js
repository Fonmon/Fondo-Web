import React from 'react';
import { FormControlLabel,
  Snackbar,
  Paper,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid,
  InputLabel,
  FormHelperText,
  Radio,
  RadioGroup } from '@material-ui/core';

import ContainerComponent from '../base/ContainerComponent';
import CurrencyField from '../fields/CurrencyField';
import DateField from '../fields/DateField'
import Utils from '../../utils/Utils';
import LoadingMaskComponent from '../base/LoadingMaskComponent';

class RequestLoanPage extends ContainerComponent {

    constructor() {
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            value: null,
            payment: 0,
            timelimit: 0,
            fee: -1,
            comments: '',
            disbursement_date: null,
            include_tax: 1,
            disbursement_value: null,

            value_error: '',
            timelimit_error: '',
            fee_error: '',
            loading: false,
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
        } else {
            this.setState({ timelimit_error: '' });
        }

        if (!this.state.value) {
            isError = true;
            this.setState({ value_error: 'Campo requerido' });
        } else if (this.state.value < 0) {
            isError = true;
            this.setState({ value_error: 'Valor debe ser mayor a 0' });
        } else {
            this.setState({ value_error: '' });
        }

        if (this.state.fee === -1) {
            isError = true;
            this.setState({ fee_error: 'Campo requerido' });
        } else {
            this.setState({ fee_error: '' });
        }

        if (!this.isBoolean(this.state.include_tax)) {
            isError = true;
            this.setState({ openMessage: true, errorMessage: 'Debe indicar si incluir o no 4x1.000' });
        }

        if (!isError) {
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
                comments: this.state.comments,
                disbursement_value: Number(this.state.disbursement_value),
            }
            Utils.createLoan(loan)
                .then((response) => {
                    this.setState({ loading: false });
                    let id = response.data.id;
                    this.props.history.push(`/loan/${id}`);
                }).catch((error) => {
                    this.setState({ loading: false });
                    this.handleRequestError(error, [{
                        status: 406,
                        message: error.response.data.message
                    }]);
                });
        }
    }

    getDisbursementValue(value, include_tax = undefined) {
        let includeTax = include_tax === undefined ? this.state.include_tax : include_tax;
        if (includeTax === true) {
            return value - value*0.004;
        } else if (includeTax === false) {
            return value * 1.004;
        }
        return value;
    }

    onTaxChange(event) {
        let value, disbursement_value, include_tax = event.target.value === "true";
        if (include_tax) {
            value = this.state.value;
            disbursement_value = this.getDisbursementValue(this.state.value, include_tax);
        } else {
            value = this.state.value * 1.004;
            disbursement_value = this.state.value;
        }
        this.setState({
            value,
            disbursement_value,
            include_tax,
        });
    }

    onChangeValue(value) {
        if (this.state.value !== Number(value)) {
            this.setState({ 
                value,
                disbursement_value: this.getDisbursementValue(value)
            });
        }
    }

    isBoolean(value) {
        return typeof value === 'boolean'
    }

    render() {
        return (
            <div>
                <LoadingMaskComponent active={this.state.loading} />
                <ContainerComponent showHeader={true}
                    renderOneMidColGrid={true}
                    middle={
                        <Paper className="UserInfo" elevation={20}>
                            <h2 style={{ textAlign: 'center' }}>Solicitud de crédito</h2>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <CurrencyField label="Valor a solicitar"
                                        style={{ width: '100%' }}
                                        value={this.state.value}
                                        helperText={this.state.value_error}
                                        error={this.state.value_error !== ''}
                                        disabled={this.isBoolean(this.state.include_tax)}
                                        onChange={(event) => this.onChangeValue(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="tax">Incluye 4x1.000</InputLabel>
                                    <RadioGroup aria-label="position" name="position" value={this.state.include_tax} onChange={event => this.onTaxChange(event)} row>
                                        <FormControlLabel
                                            value={true}
                                            control={<Radio />}
                                            label="Si"
                                            labelPlacement="start"
                                        />
                                        <FormControlLabel
                                            value={false}
                                            control={<Radio />}
                                            label="No"
                                            labelPlacement="start"
                                        />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12}>
                                    <CurrencyField label="Valor a desembolsar"
                                        style={{ width: '100%' }}
                                        value={this.state.disbursement_value}
                                        disabled
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
                                    <InputLabel error={this.state.fee_error !== ''}
                                        htmlFor="fee"
                                    >
                                        Cuota
                                    </InputLabel>
                                    <Select value={this.state.fee}
                                        inputProps={{
                                            id:"fee"
                                        }}
                                        error={this.state.fee_error !== ''}
                                        style={{ width: '100%' }}
                                        onChange={(event) => this.setState({ fee: event.target.value })}>
                                        <MenuItem value={-1}>Seleccione un valor</MenuItem>
                                        <MenuItem value={0}>Mensual</MenuItem>
                                        <MenuItem value={1}>Única</MenuItem>
                                    </Select>
                                    {this.state.fee_error !== '' &&
                                        <FormHelperText error>{this.state.fee_error}</FormHelperText>
                                    }
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