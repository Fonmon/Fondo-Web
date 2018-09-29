import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Utils from '../../utils/Utils';
import ContainerComponent from '../base/ContainerComponent';
import LoadingMaskComponent from '../base/LoadingMaskComponent';
import CurrencyField from '../fields/CurrencyField';
import DateField from '../fields/DateField';

export default class CreateActivityDialog extends ContainerComponent{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            value: null,
            date: null,
            loading: false,
            openMessage: false,
            errorMessage: ''
        }
    }

    handleClose = () => {
        this.props.onClose();
    }

    isFormValid = () => this.state.name && this.state.value && this.state.date

    handleCreateActivity(){
        if(this.isFormValid()){
            const activity = {
                name: this.state.name,
                value: this.state.value,
                date: this.state.date
            }, scope = this;
            scope.setState({loading: true});
            Utils.createActivity(this.props.year.id, activity)
                .then(response => {
                    scope.setState({loading: false});
                    scope.showMessageError('Actividad creada.')
                    scope.props.onActivityCreated();
                }).catch(error => {
                    scope.setState({loading: false});
                    scope.handleRequestError(error);
                });
        }else{
            this.showMessageError('Por favor llenar todos los campos.');
        }
    }
    
    render(){
        const actions = [
            <Button key={1}
                color="primary"
                onClick={this.handleClose}
            >
                Cancelar
            </Button>,
            <Button key={2}
                color="primary"
                variant="contained"
                onClick={this.handleCreateActivity.bind(this)}
            >
                Crear
            </Button>,
        ];
        return (
            <div>
                <Dialog aria-labelledby="creation-activity-dialog"
                    open={this.props.creationOpen}
                >
                    <DialogTitle id="creation-activity-dialog">Formulario creación de actividad</DialogTitle>
                    <DialogContent>
                        <LoadingMaskComponent active={this.state.loading} />
                        <TextField placeholder="Ingresa el Nombre de la actividad"
                            label="Nombre Actividad"
                            style={{width:'100%'}}
                            onChange = {(event) => this.setState({name:event.target.value})}
                        /><br/><br/>
                        <CurrencyField value={this.state.value}
                            label="Valor"
                            style={{width:'100%'}}
                            onChange = {(event) => this.setState({value:event.target.value})}
                        /><br/><br/>
                        <DateField label="Fecha de la actividad"
                            style={{width:'100%'}}
                            onChange = {(event) => this.setState({date: event.target.value})}
                            min={Utils.formatDate(new Date(this.props.year.year,0,1))}
                            max={Utils.formatDate(new Date(this.props.year.year,11,31))}
                        />
                    </DialogContent>
                    <DialogActions>{actions}</DialogActions>
                </Dialog>
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={() => this.setState({openMessage: false})}
                />
            </div>
        )
    }
}