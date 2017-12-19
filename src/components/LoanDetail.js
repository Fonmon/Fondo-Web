import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
                    window.location = '/notfound';
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    render(){
        return (
            <div>
                <Header />
                <Grid fluid>
                    <Row>
                        <Col xs={12} >
                        </Col>
                    </Row>
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