import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

import Header from './Header';
import LoadingMask from './LoadingMask';

class ContainerComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            loading: false,
        }
    }

    componentWillReceiveProps(props){
        this.setState({loading: props.loadingMask});
    }

    render(){
        return (
            <div>
                {this.props.showHeader &&
                    <Header />
                }
                {this.props.renderTwoColGrid &&
                    <Grid fluid>
                        <Row>
                            <Col xs={12} md={this.props.leftWidth} lg={this.props.leftWidth}>
                                {this.props.left}
                            </Col>
                            <Col xs={12} md={this.props.rightWidth} lg={this.props.rightWidth}>
                                {this.props.right}
                            </Col>
                        </Row>
                    </Grid>
                }
                {this.props.renderOneMidColGrid &&
                    <Grid fluid>
                        <Row>
                            <Col smOffset={3} sm={6} >
                                {this.props.middle}
                            </Col>
                        </Row>
                    </Grid>
                }
                <LoadingMask active={this.state.loading} />
            </div>
        )
    }
}

export default ContainerComponent;