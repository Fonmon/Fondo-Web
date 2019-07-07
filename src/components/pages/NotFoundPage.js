import React from 'react';

import ContainerComponent from '../base/ContainerComponent';
import '../../resources/styles/index.css';

class NotFoundPage extends ContainerComponent{

    render(){
        return (
            <React.Fragment>
                <ContainerComponent showHeader={true}/>
                <center><img className="notFound" alt="" src={require("../../resources/images/not_found.png")} /></center>
            </React.Fragment>
        );
    }
}

export default NotFoundPage;