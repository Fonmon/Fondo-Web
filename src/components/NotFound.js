import React, { Component } from 'react';
import Header from './Header';

class NotFound extends Component{
    render(){
        return (
            <div>
                <Header />
                Página no encontrada.
            </div>
        );
    }
}

export default NotFound;