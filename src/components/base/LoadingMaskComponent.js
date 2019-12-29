import React from 'react';

function LoadingMaskComponent(props) {
    return (
        <div>
            {props.active &&
                <div className="loading"></div>
            }
        </div>
    );
}

export default LoadingMaskComponent;