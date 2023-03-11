import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

import ContainerComponent from '../base/ContainerComponent';
import FinanceInfoComponent from '../base/FinanceInfoComponent';
import LoanListComponent from '../base/LoanListComponent';

class HomePage extends ContainerComponent {

  constructor() {
    super();
    this.state = {
      financeInfo: {
        contributions: '0',
        balance_contributions: '0',
        total_quota: '0',
        available_quota: '0',
        utilized_quota: '0'
      },
      loans: [],
      openMessage: false,
      errorMessage: '',
    }
  }

  onRowSelection = (loanId) => {
    if (loanId) {
      this.props.history.push(`/loan/${loanId}`)
    }
  }

  render() {
    const financeInfo = this.props.financeInfo ? this.props.financeInfo : this.state.financeInfo;
    return (
      <div>
        <ContainerComponent showHeader={true}
          renderTwoColGrid={true}
          leftWidth={3}
          left={
            <FinanceInfoComponent financeInfo={financeInfo} />
          }
          rightWidth={9}
          right={
            <LoanListComponent all={false}
              onRowSelection={this.onRowSelection}
              applicantColumn={false} />
          }
        />
        <Snackbar
          open={this.state.openMessage}
          message={this.state.errorMessage}
          autoHideDuration={4000}
          onClose={(event) => this.setState({ openMessage: false })}
        />
      </div>
    );
  }
}

export default HomePage;
