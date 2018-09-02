import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';

import Utils from '../../utils/Utils';
import ffm from '../../resources/images/ffm_256.png';

/*
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

{Utils.isAuthorized() &&
    <IconButton iconStyle={{fill:'white'}}
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
    </IconButton>
}
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
*/

const RightElements = (props) => (
    <div>
        {Utils.isAuthenticated() &&
        <IconButton iconStyle={{fill:'white'}}
            onClick={props.handleSignOut}><ActionPowerSettingsNew /></IconButton>}
    </div>
);

const SidebarMenus = () => {
    let currentId = `/user/${Utils.currentId()}`;
    let items = (
        <div>
            <MenuItem href="/home">Inicio</MenuItem>
            <MenuItem href={currentId}>Mi Perfil</MenuItem>
            <MenuItem href="/tools">Herramientas</MenuItem>
            <MenuItem href="/info">Información del fondo</MenuItem>
        </div>
    );
    if(Utils.isAuthorized()){
        items = (
            <div>
                <MenuItem href="/home">Inicio</MenuItem>
                <MenuItem href={currentId} >Mi Perfil</MenuItem>
                <MenuItem href="/users">Usuarios</MenuItem>
                <MenuItem href="/loans">Solicitudes de créditos</MenuItem>
                <MenuItem href="/tools">Herramientas</MenuItem>
                <MenuItem href="/info">Información del fondo</MenuItem>
            </div>
        );
    }
    return (
        <div>
            <center><img style={{marginTop:'30px',width:'120px'}} src={ffm} alt=""/></center>
            {items}
        </div>
    )
}

class HeaderComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            open: false
        };
    }

    handleToggle = () => this.setState({open: !this.state.open});

    handleTitleClick = () => (Utils.redirectTo("/home"))

    handleSignOut(){
        // if(Utils.isAuthenticated()){
        //     Utils.logout()
        //         .then(function(response){
        //             Utils.clearStorage();
        //         }).catch(function(error){
        //             console.log(error);
        //         });
        // }else{
        //     Utils.clearStorage();
        // }
        Utils.clearStorage();
    }

    render(){
        return (
            <div>
                <AppBar
                    title="Fondo Montañez"
                    titleStyle={{cursor:'pointer'}}
                    iconElementRight={
                        <RightElements handleSignOut={this.handleSignOut.bind(this)}/>
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
  
export default HeaderComponent;
