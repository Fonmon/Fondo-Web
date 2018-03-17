import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../base/ContainerComponent';
import FinanceInfoComponent from '../base/FinanceInfoComponent';
import LoanListComponent from '../base/LoanListComponent';
import Utils,{ID_KEY,ROLE_KEY} from '../../utils/Utils';

class HomePage extends ContainerComponent {

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

    render() {
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderTwoColGrid={true}
                    leftWidth={3}
                    left={
                        <FinanceInfoComponent financeInfo={this.state.financeInfo}/>
                    }
                    rightWidth={8}
                    right={
                        <LoanListComponent all={false} 
                            applicantColumn={false}/>
                    }
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

export default HomePage;