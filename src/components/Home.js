import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';

import FinanceInfo from './FinanceInfo';
import LoanListHome from './LoanListHome';

class Home extends Component {
    render() {
        return (
            <div>
                <Header />
                <Grid fluid>
                    <Row>
                        <Col xs={4} >
                            <FinanceInfo />
                        </Col>
                        <Col xs={8} >
                            <LoanListHome />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Home;
