import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import '../styles/Login.css';

// https://github.com/auth0-blog/reactjs-authentication-tutorial/blob/master/src/utils/chucknorris-api.js
class Login extends Component{

    constructor(){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    submit(event){
        console.log(`${this.state.email}`);
    }

    forgotPassword(event){
        console.log('forgot');
    }

    handleKeyPress(event){
        if(event.key === 'Enter')
            this.submit();
    }

    render(){
        return (
            <div className="Login">
                <Paper className="LoginForm" zDepth={5}>
                    <h2>Iniciar Sesión</h2>
                    <TextField hintText="Type your email"
                        className="LoginFields"
                        floatingLabelText="Email"
                        required={true}
                        onChange = {(event,newValue) => this.setState({email:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        />
                    <TextField hintText="Type your password"
                        className="LoginFields"
                        floatingLabelText="Password"
                        type="password"
                        required={true}
                        onChange = {(event,newValue) => this.setState({password:newValue})}
                        onKeyPress = {(event) => this.handleKeyPress(event)}
                        /><br/>
                    <RaisedButton 
                        className="LoginFields"
                        label="Sign in" 
                        primary={true} 
                        onClick={(event) => this.submit(event)}
                        /><br/>
                    <RaisedButton 
                        className="LoginFields"
                        label="Forgot Password?" 
                        secondary={true} 
                        onClick={(event) => this.forgotPassword(event)}
                        />
                </Paper>
            </div>
        );
    }
}

export default Login;