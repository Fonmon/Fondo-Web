import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Drawer from 'material-ui/Drawer';

import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';

const Notifications = () => (
    <div>
        <Badge
            badgeContent={10}
            secondary={true}
            badgeStyle={{top: 12, right: 12}}
            >
            <IconButton tooltip="Notifications">
                <NotificationsIcon />
            </IconButton>
        </Badge>
    </div>
);

const ContextMenu = () => (
    <IconButton><ActionPowerSettingsNew /></IconButton>
);
// <Notifications />
const RightElements = () => (
    <div>
        <ContextMenu />
    </div>
);

class Header extends Component{

    constructor(props){
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => this.setState({open: !this.state.open});

    render(){
        return (
            <div>
                <AppBar
                    title="Fondo Montañez"
                    iconElementRight={<RightElements />}
                    onLeftIconButtonClick = {this.handleToggle}
                    />
                <Drawer 
                    open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open})}
                    >
                    <MenuItem>Menu Item 2</MenuItem>
                </Drawer>
            </div>
        );
    }
}
  
export default Header;