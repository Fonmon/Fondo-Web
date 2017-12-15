import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Drawer from 'material-ui/Drawer';

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
    <IconMenu
        iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
        <MenuItem primaryText="Sign out" />
    </IconMenu>
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