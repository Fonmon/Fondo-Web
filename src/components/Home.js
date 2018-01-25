import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FinanceInfo from './FinanceInfo';
import LoanListComponent from './LoanListComponent';
import Utils,{ID_KEY,ROLE_KEY} from '../utils/Utils';
import LoadingMask from './LoadingMask';

class Home extends Component {

    constructor(){
        super();
        this.state = {
            financeInfo : {
                contributions: '0',
                balance_contributions: '0',
                total_quota: '0',
                available_quota: '0',
                utilized_quota: '0'
            },
            loans : [],
            openMessage: false,
            errorMessage: '',
            loading: false
        }
    }

    componentDidMount = () => {
        let scope = this;
        this.setState({loading:true});
        Utils.getUser(-1)
            .then(function(response){
                localStorage.setItem(ID_KEY,response.data.id);
                localStorage.setItem(ROLE_KEY,response.data.role);
                scope.setState({financeInfo:{
                    contributions: response.data.contributions,
                    balance_contributions: response.data.balance_contributions,
                    total_quota: response.data.total_quota,
                    available_quota: response.data.available_quota,
                    last_modified:response.data.last_modified,
                    utilized_quota:response.data.utilized_quota
                }});
                scope.setState({loading:false});
            }).catch(function(error){
                scope.setState({loading:false});
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 401){
                    Utils.clearStorage();
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
                <LoadingMask active={this.state.loading} />
                <Grid fluid>
                    <Row>
                        <Col xs={12} md={3} lg={3}>
                            <FinanceInfo financeInfo={this.state.financeInfo}/>
                        </Col>
                        <Col xs={12} md={8} lg={8}>
                            <LoanListComponent all={false} 
                                applicantColumn={false}/>
                        </Col>
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={(event) => this.setState({openMessage: false})}
                    />
                <FloatingActionButton 
                    secondary={true} 
                    style={{
                        right: 20,
                        bottom:20,
                        position:'fixed'
                    }}
                    href="/request-loan">
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

export default Home;
