import React, { Component } from 'react';
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

const SidebarMenus = () => {
    let currentId = `/user/${Utils.currentId()}`;
    let items = (
        <div>
            <MenuItem component='a' href="/home">Inicio</MenuItem>
            <MenuItem component='a' href={currentId}>Mi Perfil</MenuItem>
            <MenuItem component='a' href="/tools">Herramientas</MenuItem>
            <MenuItem component='a' href="/info">Información del fondo</MenuItem>
        </div>
    );
    if (Utils.isAuthorized()) {
        items = (
            <div>
                <MenuItem component='a' href="/home">Inicio</MenuItem>
                <MenuItem component='a' href={currentId} >Mi Perfil</MenuItem>
                <MenuItem component='a' href="/users">Usuarios</MenuItem>
                <MenuItem component='a' href="/loans">Solicitudes de créditos</MenuItem>
                <MenuItem component='a' href="/tools">Herramientas</MenuItem>
                <MenuItem component='a' href="/info">Información del fondo</MenuItem>
            </div>
        );
    }
    return (
        <div>
            <center><img style={{ marginTop: '30px', width: '120px' }} src={ffm} alt="" /></center>
            {items}
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

    handleTitleClick = () => (Utils.redirectTo("/home"))

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
                            style={{ cursor: 'pointer' }}
                            onClick={this.handleTitleClick}
                        >
                            Fondo Montañez
                        </Typography>
                        {Utils.isAuthenticated() &&
                            <section className={classes.rightToolbar}>
                                <IconButton color="inherit" 
                                    href="/request-loan"
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
                    <SidebarMenus />
                </Drawer>
            </div>
        );
    }
}

export default withStyles(styles)(HeaderComponent);
