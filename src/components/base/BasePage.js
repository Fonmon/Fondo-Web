import React, { Component } from 'react';

export default class BasePage extends Component{

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }
}