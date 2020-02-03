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
import LoadingMaskComponent from '../base/LoadingMaskComponent';

class LoginPage extends ContainerComponent {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            openMessage: false,
            errorMessage: '',
            loading: false,
            redirectToReferrer: false
        }
    }

    forgotPassword(event) {
        Utils.redirectTo(HOST_APP + 'password_reset');
    }

    submit(event) {
        this.setState({ loading: true });
        Utils.authenticate(this.state.email.toLowerCase(), this.state.password)
        .then((response) => {
                localStorage.setItem(TOKEN_KEY, response.data.token);
                this.setState({ loading: false, redirectToReferrer: true });
            }).catch((error) => {
                this.setState({ loading: false });
                this.handleRequestError(error, [{
                    status: 400,
                    message: 'Email o contraseña incorrectos.'
                }]);
            });
    }

    render() {
        let { from } = this.props.location.state || { from: { pathname: '/home' } };
        if (this.state.redirectToReferrer) 
            return Utils.redirectTo(from.pathname);

        return (
            <div className="Login">
                <LoadingMaskComponent active={this.state.loading} />
                <img className="banner" src={banner} alt="" />
                <Paper className="LoginForm" elevation={20}>
                    <h2>Iniciar Sesión</h2>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField label="Email"
                                placeholder="Ingresa tu email"
                                margin="normal"
                                type="email"
                                autoFocus={true}
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