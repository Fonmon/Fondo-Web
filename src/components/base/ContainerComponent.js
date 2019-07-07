import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import HeaderComponent from './HeaderComponent';
import LoadingMaskComponent from './LoadingMaskComponent';
import Utils from '../../utils/Utils';

const gridItemStyles = {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 16,
    paddingLeft: 16,
}

class ContainerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ loading: props.loadingMask });
    }

    showMessageError(message) {
        this.setState({ openMessage: true, errorMessage: message });
    }

    handleKeyPress(event) {
        if (event.key === 'Enter')
            this.submit();
    }

    handleRequestError(error, messages = []) {
        if (!error.response) {
            return this.showMessageError('Error de conexión, inténtalo más tarde.');
        } else if (error.response.status === 401) {
            return Utils.clearStorage();
        } else if (error.response.status === 404) {
            return Utils.redirectTo('/error');
        } else {
            for (let message of messages) {
                if (message.status === error.response.status) {
                    return this.showMessageError(message.message);
                }
            }
        }
        this.showMessageError(error.message);
    }

    render() {
        let componentsGrid = new Array(4);
        let order = -1;
        if (this.props.renderTwoColGrid) {
            order = !isNaN(this.props.orderRenderTwoColGrid) ? this.props.orderRenderTwoColGrid : 0;
            componentsGrid[order] = (
                <React.Fragment key={order}>
                    <Grid item xs={12} md={this.props.leftWidth} lg={this.props.leftWidth}
                        style={gridItemStyles}
                    >
                        {this.props.left}
                    </Grid>
                    <Grid item xs={12} md={this.props.rightWidth} lg={this.props.rightWidth}
                        style={gridItemStyles}
                    >
                        {this.props.right}
                    </Grid>
                </React.Fragment>
            )
        }

        if (this.props.renderOneMidColGrid) {
            order = !isNaN(this.props.orderRenderOneMidColGrid) ? this.props.orderRenderOneMidColGrid : 1;
            componentsGrid[order] = (
                <Grid container item justify="center" key={order}>
                    <Grid item sm={6} xs={12} style={gridItemStyles}>
                        {this.props.middle}
                    </Grid>
                </Grid>
            )
        }

        if (this.props.renderOneFullColGrid) {
            order = !isNaN(this.props.orderRenderOneFullColGrid) ? this.props.orderRenderOneFullColGrid : 2;
            componentsGrid[order] = (
                <Grid item xs={12} key={order} style={gridItemStyles}>
                    {this.props.middle}
                </Grid>
            )
        }

        if (this.props.renderListColGrid) {
            order = !isNaN(this.props.orderRenderOneFullColGrid) ? this.props.orderRenderOneFullColGrid : 3;
            componentsGrid[order] = (
                <Grid container item key={order}>
                    {this.props.items.map((item, i) => {
                        return (
                            <Grid item xs={6} md={this.props.colsWidth} lg={this.props.colsWidth} key={i}
                                style={{ paddingRight: 10, paddingLeft: 10 }}
                            >
                                {item}
                            </Grid>
                        )
                    })}
                </Grid>
            )
        }

        return (
            <React.Fragment>
                {this.props.showHeader &&
                    <HeaderComponent />
                }
                {(order >= 0) &&
                    <Grid container style={{ flexGrow: 1 }}>
                        {componentsGrid.map((component, i) => {
                            return (component)
                        })}
                    </Grid>
                }
                <LoadingMaskComponent active={this.state.loading} />
            </React.Fragment>
        )
    }
}

export default ContainerComponent;