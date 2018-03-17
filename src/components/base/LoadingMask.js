import React, { Component } from 'react';

class LoadingMask extends Component {

    constructor(props){
        super(props);
        this.state = {
            active : props.active
        }
    }

    componentWillReceiveProps(nextValue){
        this.setState(nextValue);
    }

    render(){
        return (
            <div>
                {this.state.active &&
                    <div className="loading"></div>
                }
            </div>
        );
    }
}

export default LoadingMask;