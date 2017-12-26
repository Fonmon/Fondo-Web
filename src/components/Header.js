import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Drawer from 'material-ui/Drawer';
import Utils from '../utils/Utils';
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import logo from '../images/logo_256.png';

const RightElements = (props) => (
    <div>
        {Utils.isAuthorized() &&
        <IconButton
            onClick={props.handleNotifications}>
            <NotificationsIcon />
            <Popover
                open={props.open}
                anchorEl={props.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={props.handleRequestClose}
                >
                <Menu>
                    <MenuItem disabled={props.newRequests === 0}
                        primaryText={`${props.newRequests} Solicitudes pendientes`} />
                </Menu>
            </Popover>
        </IconButton>}
        {Utils.isAuthenticated() &&
        <IconButton
            onClick={props.handleSignOut}><ActionPowerSettingsNew /></IconButton>}
    </div>
);

const SidebarMenus = () => {
    let currentId = `/user/${Utils.currentId()}`;
    if(Utils.isAuthorized())
        return (
            <div>
                <center><img style={{marginTop:'10px',width:'120px'}} src={logo} alt=""/></center>
                <MenuItem href="/home">Inicio</MenuItem>
                <MenuItem href={currentId} >Mi Perfil</MenuItem>
                <MenuItem href="/users">Usuarios</MenuItem>
                <MenuItem href="/loans">Solicitudes de créditos</MenuItem>
                <MenuItem>Información del fondo</MenuItem>
            </div>
        );
    else
        return (
            <div>
                <center><img style={{marginTop:'10px',width:'120px'}} src={logo} alt=""/></center>
                <MenuItem href="/home">Inicio</MenuItem>
                <MenuItem href={currentId}>Mi Perfil</MenuItem>
                <MenuItem>Información del fondo</MenuItem>
            </div>
        );
}

class Header extends Component{

    constructor(props){
        super(props);
        this.state = {
            open: false,
            notificationsOpen: false,
            requests:0
        };
    }

    handleToggle = () => this.setState({open: !this.state.open});

    handleTitleClick = () => (window.location = "/home")

    handleNotifications(event){
        event.preventDefault();
        
        this.setState({
            notificationsOpen: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose = () => {
        this.setState({
            notificationsOpen: false,
        });
    }

    handleSignOut(){
        Utils.clearStorage();
        window.location = "/";
        // Utils.logout()
        //     .then(function(response){
        //         Utils.clearStorage();
        //         window.location = "/";
        //     }).catch(function(error){
        //         console.log(error);
        //     });
    }

    render(){
        return (
            <div>
                <AppBar
                    title="Fondo Montañez"
                    titleStyle={{cursor:'pointer'}}
                    iconElementRight={
                        <RightElements handleNotifications={this.handleNotifications.bind(this)}
                            handleRequestClose={this.handleRequestClose.bind(this)}
                            open={this.state.notificationsOpen}
                            anchorEl={this.state.anchorEl}
                            newRequests={this.state.requests}
                            handleSignOut={this.handleSignOut.bind(this)}/>
                    }
                    onLeftIconButtonClick = {this.handleToggle}
                    onTitleClick={this.handleTitleClick}
                    showMenuIconButton={Utils.isAuthenticated()}
                    />
                <Drawer 
                    open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open})}
                    >
                    <SidebarMenus />
                </Drawer>
            </div>
        );
    }
}
  
export default Header;