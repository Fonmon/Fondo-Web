import React, { Component } from 'react';
import Header from './Header';
import LoanListComponent from './LoanListComponent';
import { Grid, Row, Col } from 'react-flexbox-grid';

class LoansList extends Component {

    render() {
        return (
            <div>
                <Header />
                <Grid fluid>
                    <Row>
                        <Col xs={12} >
                            <LoanListComponent all={true} 
                                applicantColumn={true}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default LoansList;
