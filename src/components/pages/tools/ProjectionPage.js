import React from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../../base/ContainerComponent';
import Utils from '../../../utils/Utils';

export default class ProjectionPage extends ContainerComponent {

    constructor(){
        super();
        this.state = {
            loading: false,
            openMessage: false,
            loanId: null,
            loanIds: [],
            toDate: null,
            loanIdError: '',
            toDateError: '',
            errorMessage: ''
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
        // const toDate = new Date(this.state.toDate);
        // if(!isError && fromDate >= toDate){
        //     this.showMessageError('"Desde" debe ser menor a "Hasta');
        //     isError = true;
        // }

        if(!isError){

        }
    }

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderOneMidColGrid={true}
                    middle={
                        <div>
                            <Paper className="UserInfo" zDepth={5}>
                                <h3 style={{textAlign:'center'}}>Proyección de pago</h3>
                                <SelectField floatingLabelText="Crédito"
                                    style={{width:'100%'}}
                                    value={this.state.loanId}
                                    errorText={this.state.loanIdError}
                                    onChange = {(event,index,newValue) => this.setState({loanId:newValue})}
                                >
                                    {this.state.loanIds.map(loanId => {
                                        return (
                                            <MenuItem key={loanId} value={loanId}
                                                primaryText={`Crédito número ${loanId}`} />
                                        )
                                    })}
                                </SelectField>
                                <DatePicker floatingLabelText="Hasta"
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