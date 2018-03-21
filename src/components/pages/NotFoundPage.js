import React from 'react';

import ContainerComponent from '../base/ContainerComponent';
import '../../resources/styles/index.css';

class NotFoundPage extends ContainerComponent{

    render(){
        return (
            <div>
                <ContainerComponent showHeader={true}/>
                <center><img alt="" src={require("../../resources/images/not_found.png")} /></center>
            </div>
        );
    }
}

export default NotFoundPage;