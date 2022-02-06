import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

import ContentAdd from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import PowerOff from '@material-ui/icons/PowerSettingsNew';

import Utils from '../../utils/Utils';
import ffm from '../../resources/images/ffm_256.png';

const styles = {
    rightToolbar: {
        marginLeft: 'auto',
        marginRight: -12,
    }
};

const SidebarMenus = (props) => {
    return (
        <div>
            <center><img style={{ marginTop: '30px', width: '120px' }} src={ffm} alt="" /></center>
            <div>
                <MenuItem onClick={props.handleToggle} component={Link} to="/home">Inicio</MenuItem>
                <MenuItem onClick={props.handleToggle} component={Link} to={`/user/${Utils.currentId()}`}>Mi Perfil</MenuItem>
                <MenuItem onClick={props.handleToggle} component={Link} to={`/user/caps`}>CAPs</MenuItem>
                {Utils.isAuthorized() &&
                    <div>
                        <MenuItem onClick={props.handleToggle} component={Link} to="/users">Usuarios</MenuItem>
                        <MenuItem onClick={props.handleToggle} component={Link} to="/loans">Solicitudes de créditos</MenuItem>
                    </div>
                }
                <MenuItem onClick={props.handleToggle} component={Link} to="/tools">Herramientas</MenuItem>
                <MenuItem onClick={props.handleToggle} component={Link} to="/info">Información del fondo</MenuItem>
                {Utils.isAdmin() && 
                    <MenuItem onClick={async () => await Utils.adminTestEmail()}>Test Email</MenuItem>
                }
            </div>
        </div>
    )
}

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleToggle = () => this.setState({ open: !this.state.open });

    handleSignOut = () => {
        Utils.pushManagerUnsubscribe()
            .then(() => Utils.clearStorage())
            .catch(() => Utils.clearStorage())
    }

    render() {
        const classes = this.props.classes
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        {Utils.isAuthenticated() &&
                            <IconButton color="inherit"
                                onClick={this.handleToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
                        <Typography variant="h6"
                            color="inherit"
                            style={{ textDecoration: 'none' }}
                            component={Link} to="/home"
                        >
                            Fondo Montañez
                        </Typography>
                        {Utils.isAuthenticated() &&
                            <section className={classes.rightToolbar}>
                                <IconButton color="inherit"
                                    component={Link}
                                    to="/request"
                                >
                                    <ContentAdd />
                                </IconButton>
                                <IconButton color="inherit"
                                    onClick={this.handleSignOut}
                                >
                                    <PowerOff />
                                </IconButton>
                            </section>
                        }
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.open}
                    onClose={this.handleToggle}
                >
                    <SidebarMenus handleToggle={this.handleToggle} />
                </Drawer>
            </div>
        );
    }
}

export default withStyles(styles)(HeaderComponent);
