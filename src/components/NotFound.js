import React, { Component } from 'react';
import Header from './Header';
import '../styles/index.css';

class NotFound extends Component{
    render(){
        return (
            <div>
                <Header />
                <center><img alt="" src={require("../images/not_found.png")} /></center>
            </div>
        );
    }
}

export default NotFound;