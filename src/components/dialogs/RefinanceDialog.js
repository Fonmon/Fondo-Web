import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Utils from '../../utils/Utils';
import ContainerComponent from '../base/ContainerComponent';
import DateField from '../fields/DateField';
import LoadingMaskComponent from '../base/LoadingMaskComponent';

class RefinanceDialog extends ContainerComponent{
    constructor(props){
        super(props);
        this.state = {
            openMessage: false,
            errorMessage: '',
            loading: false,
            timelimit: 0,
            fee: 0,
            comments: '',
            disbursement_date: null,
            includeInterests: false,

            timelimit_error: ''
        }
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleRequestClose = () => {
        this.setState({
            openMessage: false
        });
    }

    handleRefinance = () => {
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
        if (!isError) {
            const scope = this,
                  loan = {
                      timelimit: Number(this.state.timelimit),
                      disbursement_date: this.state.disbursement_date,
                      fee: Number(this.state.fee),
                      comments: this.state.comments,
                      includeInterests: this.state.includeInterests
                  };
            this.setState({ 
                loading: true,
                timelimit_error: ''
            });

            Utils.loanApps(this.props.loan_id, 'refinance', loan)
                .then( (response) => {
                    scope.setState({ loading: false });
                    scope.showMessageError('Refinanciamiento creado.');
                    scope.props.onLoanCreated(response.data.id)
                }).catch(function(error){
                    scope.setState({loading:false});
                    scope.handleRequestError(error);
                });
        }
    }

    render(){
        const actions = [
            <Button color='primary' key="cancel"
                onClick={this.handleClose}
            >
                Cancelar
            </Button>,
            <Button color="primary" key="create"
                variant="contained"
                onClick={this.handleRefinance}
            >
                Enviar
            </Button>,
        ];

        return (
            <div>
                <Dialog aria-labelledby="creation-dialog-title"
                    open={this.props.refinanceOpen}
                >
                    <DialogTitle id="creation-dialog-title">Refinanciación de crédito</DialogTitle>
                    <DialogContent>
                        <LoadingMaskComponent active={this.state.loading} />
                        <DateField min={Utils.formatDate(new Date())}
                            label="Nueva fecha del crédito"
                            style={{ width: '100%' }}
                            onChange={(event) => this.setState({ disbursement_date: event.target.value })}
                        /><br/>
                        <InputLabel htmlFor="interests">Incluir valor</InputLabel>
                        <Select value={this.state.includeInterests}
                            inputProps={{
                                id:"interests"
                            }}
                            style={{ width: '100%' }}
                            onChange={(event) => this.setState({ includeInterests: event.target.value })}>
                            <MenuItem value={true}>Con intereses</MenuItem>
                            <MenuItem value={false}>Sin intereses</MenuItem>
                        </Select><br/><br/>
                        <TextField placeholder="Valor en meses"
                            label="Plazo"
                            style={{ width: '100%' }}
                            type='number'
                            helperText={this.state.timelimit_error}
                            error={this.state.timelimit_error !== ''}
                            onChange={(event) => this.setState({ timelimit: event.target.value })}
                        /><br/><br/>
                        <InputLabel htmlFor="fee">Cuota</InputLabel>
                        <Select value={this.state.fee}
                            inputProps={{
                                id:"fee"
                            }}
                            style={{ width: '100%' }}
                            onChange={(event) => this.setState({ fee: event.target.value })}>
                            <MenuItem value={0}>Mensual</MenuItem>
                            <MenuItem value={1}>Única</MenuItem>
                        </Select><br/><br/>
                        <TextField placeholder="Comentarios adicionales"
                            multiline
                            rows={2}
                            style={{ width: '100%' }}
                            rowsMax={4}
                            onChange={(event) => this.setState({ comments: event.target.value })}
                        /><br/>
                    </DialogContent>
                    <DialogActions>{actions}</DialogActions>
                </Dialog>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

export default RefinanceDialog;