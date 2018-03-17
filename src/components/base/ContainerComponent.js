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
                {(this.props.renderTwoColGrid || this.props.renderOneMidColGrid || this.props.renderOneFullColGrid) &&
                    <Grid fluid>
                    {this.props.renderTwoColGrid &&
                        <Row>
                            <Col xs={12} md={this.props.leftWidth} lg={this.props.leftWidth}>
                                {this.props.left}
                            </Col>
                            <Col xs={12} md={this.props.rightWidth} lg={this.props.rightWidth}>
                                {this.props.right}
                            </Col>
                        </Row>
                    }
                    {this.props.renderOneMidColGrid &&
                        <Row>
                            <Col smOffset={3} sm={6} >
                                {this.props.middle}
                            </Col>
                        </Row>
                    }
                    {this.props.renderOneFullColGrid &&
                        <Row>
                            <Col xs={12} >
                                {this.props.middle}
                            </Col>
                        </Row>
                    }
                    </Grid>
                }
                <LoadingMask active={this.state.loading} />
            </div>
        )
    }
}

export default ContainerComponent;