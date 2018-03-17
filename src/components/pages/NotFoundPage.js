import React, { Component } from 'react';
import Header from '../base/Header';
import '../../resources/styles/index.css';

class NotFound extends Component{
    render(){
        return (
            <div>
                <Header />
                <center><img alt="" src={require("../../resources/images/not_found.png")} /></center>
            </div>
        );
    }
}

export default NotFound;