import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FinanceInfo from './FinanceInfo';
import LoanListHome from './LoanListHome';
import Utils,{ID_KEY,ROLE_KEY} from '../utils/Utils';

class Home extends Component {

    constructor(){
        super();
        this.state = {
            financeInfo : {
                contributions: '0',
                balance_contributions: '0',
                total_quota: '0',
                available_quota: '0'
            },
            loans : [],
            openMessage: false,
            errorMessage: ''
        }
    }

    componentDidMount = () => {
        let scope = this;
        Utils.getUser(-1)
            .then(function(response){
                localStorage.setItem(ID_KEY,response.data.id);
                localStorage.setItem(ROLE_KEY,response.data.role);
                scope.setState({financeInfo:{
                    contributions: response.data.contributions,
                    balance_contributions: response.data.balance_contributions,
                    total_quota: response.data.total_quota,
                    available_quota: response.data.available_quota
                }});
            }).catch(function(error){
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    render() {
        return (
            <div>
                <Header />
                <Grid fluid>
                    <Row>
                        <Col xs={3} >
                            <FinanceInfo financeInfo={this.state.financeInfo}/>
                        </Col>
                        <Col xs={8} >
                            <LoanListHome />
                        </Col>
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={(event) => this.setState({openMessage: false})}
                    />
                <FloatingActionButton secondary={true} 
                    style={{
                        right: 20,
                        bottom:20,
                        position:'absolute'
                    }}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

export default Home;
