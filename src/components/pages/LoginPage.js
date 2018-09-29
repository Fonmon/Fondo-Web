import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';

import ContainerComponent from '../base/ContainerComponent';
import Utils, { TOKEN_KEY } from '../../utils/Utils';
import { HOST_APP } from '../../utils/Constants';
import banner from '../../resources/images/banner.png';
import '../../resources/styles/Login.css';

class LoginPage extends ContainerComponent {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            openMessage: false,
            errorMessage: '',
            loading: false
        }
    }

    forgotPassword(event) {
        Utils.redirectTo(HOST_APP + 'password_reset');
    }

    submit(event) {
        let scope = this;
        this.setState({ loading: true });
        Utils.authenticate(this.state.email.toLowerCase(), this.state.password)
            .then(function (response) {
                scope.setState({ loading: false });
                localStorage.setItem(TOKEN_KEY, response.data.token);
                Utils.redirectTo('/home');
            }).catch(function (error) {
                scope.setState({ loading: false });
                scope.handleRequestError(error, [{
                    status: 400,
                    message: 'Email o contraseña incorrectos.'
                }]);
            });
    }

    render() {
        return (
            <div className="Login">
                <ContainerComponent loadingMask={this.state.loading} />
                <img className="banner" src={banner} alt="" />
                <Paper className="LoginForm" elevation={20}>
                    <h2>Iniciar Sesión</h2>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <TextField label="Email"
                                placeholder="Ingresa tu email"
                                margin="normal"
                                type="email"
                                style={{width: '70%'}}
                                onChange={(event) => this.setState({ email: event.target.value })}
                                onKeyPress={(event) => this.handleKeyPress(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Contraseña"
                                placeholder="Ingresa tu contraseña"
                                type="password"
                                style={{width: '70%'}}
                                onChange={(event) => this.setState({ password: event.target.value })}
                                onKeyPress={(event) => this.handleKeyPress(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained"
                                children="Ingresar"
                                color="primary"
                                onClick={(event) => this.submit(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained"
                                color="secondary"
                                children="¿Olvidaste tu contraseña?"
                                onClick={(event) => this.forgotPassword(event)}
                            />
                        </Grid>
                        <Snackbar open={this.state.openMessage}
                            message={this.state.errorMessage}
                            autoHideDuration={4000}
                            onClose={(event) => this.setState({ openMessage: false })}
                        />
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default LoginPage;