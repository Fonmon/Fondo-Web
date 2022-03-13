import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    withStyles,
    AppBar,
    IconButton,
    MenuItem,
    Drawer,
    Toolbar,
    Typography,
    Collapse,
    ListItemText,
} from '@material-ui/core';
import ContentAdd from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import PowerOff from '@material-ui/icons/PowerSettingsNew';
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Utils from '../../utils/Utils';
import ffm from '../../resources/images/ffm_256.png';
import '../../resources/styles/Header.css'

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
                <MenuItem onClick={props.handleToggle} component={Link} to='/user/caps'>CAPs</MenuItem>
                <MenuItem onClick={props.handleToggle} component={Link} to="/tools">Herramientas</MenuItem>
                <MenuItem onClick={props.handleToggle} component={Link} to="/info">Información del fondo</MenuItem>
                {Utils.isAuthorized() &&
                    <MenuListItem label={'Gestion'}>
                        <MenuItem onClick={props.handleToggle} component={Link} to="/manage/caps">CAPs</MenuItem>
                        <MenuItem onClick={props.handleToggle} component={Link} to="/manage/users">Usuarios</MenuItem>
                        <MenuItem onClick={props.handleToggle} component={Link} to="/manage/loans">Solicitudes de créditos</MenuItem>
                    </MenuListItem>
                }
                {Utils.isAdmin() &&
                    <MenuListItem label={'Admin'}>
                        <MenuItem onClick={async () => await Utils.adminTestEmail()}>Test Email</MenuItem>
                    </MenuListItem>
                }
            </div>
        </div>
    )
}

function ListItemLink(props) {
    const { open, ...other } = props;

    return (
        <MenuItem {...other}>
            <ListItemText primary={props.label} />
            {open != null ? open ? <ExpandLess /> : <ExpandMore /> : null}
        </MenuItem>
    );
}

const MenuListItem = (props) => {
    const [open, setOpen] = React.useState(false)
    return (
        <div className='HeaderMenuListItemRoot'>
            <ListItemLink
                open={open}
                label={props.label}
                onClick={() => setOpen((prevOpen) => !prevOpen)}
            />
            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className='HeaderMenuListItem'>
                    {props.children}
                </div>
            </Collapse>
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
