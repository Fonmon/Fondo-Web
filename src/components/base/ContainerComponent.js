import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

import HeaderComponent from './HeaderComponent';
import LoadingMaskComponent from './LoadingMaskComponent';

class ContainerComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            loading: false
        }
    }

    componentWillReceiveProps(props){
        this.setState({loading: props.loadingMask});
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    handleKeyPress(event){
        if(event.key === 'Enter')
            this.submit();
    }

    render(){
        let componentsGrid = new Array(4);
        let order = -1;
        if(this.props.renderTwoColGrid){
            order = !isNaN(this.props.orderRenderTwoColGrid) ? this.props.orderRenderTwoColGrid : 0;
            componentsGrid[order] = (
                <Row key={order}>
                    <Col xs={12} md={this.props.leftWidth} lg={this.props.leftWidth}>
                        {this.props.left}
                    </Col>
                    <Col xs={12} md={this.props.rightWidth} lg={this.props.rightWidth}>
                        {this.props.right}
                    </Col>
                </Row>
            )
        }

        if(this.props.renderOneMidColGrid){
            order = !isNaN(this.props.orderRenderOneMidColGrid) ? this.props.orderRenderOneMidColGrid : 1;
            componentsGrid[order] = (
                <Row key={order}>
                    <Col smOffset={3} sm={6} xs={12}>
                        {this.props.middle}
                    </Col>
                </Row>
            )
        }

        if(this.props.renderOneFullColGrid){
            order = !isNaN(this.props.orderRenderOneFullColGrid) ? this.props.orderRenderOneFullColGrid : 2;
            componentsGrid[order] = (
                <Row key={order}>
                    <Col xs={12} >
                        {this.props.middle}
                    </Col>
                </Row>
            )
        }

        if(this.props.renderListColGrid){
            order = !isNaN(this.props.orderRenderOneFullColGrid) ? this.props.orderRenderOneFullColGrid : 3;
            componentsGrid[order] = (
                <Row key={order}>
                    {this.props.items.map((item,i)=>{
                        return (
                            <Col xs={6} md={this.props.colsWidth} lg={this.props.colsWidth} key={i}>
                                {item}
                            </Col>
                        )
                    })}
                </Row>
            )
        }
            
        return (
            <div>
                {this.props.showHeader &&
                    <HeaderComponent />
                }
                {(order >= 0) &&
                    <Grid fluid>
                    {componentsGrid.map((component,i) => {
                        return (component)
                    })}
                    </Grid>
                }
                <LoadingMaskComponent active={this.state.loading} />
            </div>
        )
    }
}

export default ContainerComponent;