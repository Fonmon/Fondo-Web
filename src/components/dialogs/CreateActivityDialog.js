import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';

import Utils from '../../utils/Utils';
import ContainerComponent from '../base/ContainerComponent';
import LoadingMaskComponent from '../base/LoadingMaskComponent';
import CurrencyField from '../fields/CurrencyField';

export default class CreateActivityDialog extends ContainerComponent{
    constructor(props){
        super(props);
        this.state = {
            creationOpen: false,
            name: '',
            value: null,
            date: null,
            loading: false,
            openMessage: false,
            errorMessage: ''
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState(nextProps);
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
                    scope.props.onActivityCreated();
                    scope.showMessageError('Actividad creada.')
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
            <FlatButton
                label="Cancelar"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Crear"
                primary={true}
                onClick={this.handleCreateActivity.bind(this)}
            />,
        ];
        return (
            <div>
                <Dialog title="Formulario creación de actividad"
                    actions={actions}
                    modal={false}
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleClose}
                    open={this.state.creationOpen}
                >
                    <LoadingMaskComponent active={this.state.loading} />
                    <TextField hintText="Ingresa el Nombre de la actividad"
                        floatingLabelText="Nombre Actividad"
                        required={true}
                        style={{width:'100%'}}
                        onChange = {(event,newValue) => this.setState({name:newValue})}
                    /><br/>
                    <CurrencyField value={this.state.value}
                        floatingLabelText="Valor"
                        required={true}
                        style={{width:'100%'}}
                        onChange = {(event,newValue) => this.setState({value:newValue})}
                    /><br/>
                    <DatePicker floatingLabelText="Fecha de la actividad"
                        minDate={new Date(this.props.year.year,0,1)}
                        maxDate={new Date(this.props.year.year,11,31)}
                        autoOk={true}
                        style={{width:'100%'}}
                        DateTimeFormat={Intl.DateTimeFormat}
                        locale={'es'}
                        formatDate={date => Utils.formatDateDisplay(date)}
                        onChange = {(event,newValue) => this.setState({date:Utils.formatDate(newValue)})}
                    />
                </Dialog>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={() => this.setState({openMessage: false})}
                />
            </div>
        )
    }
}