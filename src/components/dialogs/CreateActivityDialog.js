import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import Utils from '../../utils/Utils';
import LoadingMaskComponent from '../base/LoadingMaskComponent';

export default class CreateActivityDialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            creationOpen: false,
            name: '',
            value: 0,
            date: null,
            loading: false
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState(nextProps);
    }

    handleClose = () => {
        this.setState({creationOpen: false});
    }

    handleCreateActivity(){
        // TODO: validate all fields are filled
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
                onClick={this.handleCreateActivity}
            />,
        ];
        return (
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
                <TextField hintText="Ingresa el valor de la actividad"
                    floatingLabelText="Valor"
                    required={true}
                    type="number"
                    style={{width:'100%'}}
                    onChange = {(event,newValue) => this.setState({value:newValue})}
                /><br/>
                <DatePicker floatingLabelText="Fecha de la actividad"
                    minDate={new Date(this.props.year,0,1)}
                    maxDate={new Date(this.props.year,11,31)}
                    autoOk={true}
                    style={{width:'100%'}}
                    DateTimeFormat={Intl.DateTimeFormat}
                    locale={'es'}
                    formatDate={date => Utils.formatDateDisplay(date)}
                    onChange = {(event,newValue) => this.setState({date:Utils.formatDate(newValue)})}
                />
            </Dialog>
        )
    }
}