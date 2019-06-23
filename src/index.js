import React from 'react';
import ReactDOM from 'react-dom';
import './resources/styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';

import loadingGif from './resources/images/loading_logo_512.gif';

// Components
import RouterMain from './components/RouterMain';

import Utils,{ID_KEY,ROLE_KEY,NOTIFICATIONS_KEY} from './utils/Utils';

registerServiceWorker({
    onActivated: (registration) => {
        console.log('worker activated')
        if (!registration.pushManager) {
            return console.log('Unable to install push manager')
        }
    },
    onSuccess: (registration) => {
        console.log('success callback', registration);
    },
    onUpdate: (registration) => {
        console.log('update callback', registration);
    },
});

const loadApp = (financeInfo, palettePrimary = '#800000', paletteSecondary = '#c83737') => {
    const muiTheme = createMuiTheme({
        palette: {
            primary: {
                main: palettePrimary
            },
            secondary: {
                main: paletteSecondary
            }
        },
    });
    
    const Wrapper = () => (
        <BrowserRouter>
            <MuiThemeProvider theme={muiTheme}>
                <RouterMain financeInfo={financeInfo} />
            </MuiThemeProvider>
        </BrowserRouter>
    );
    
    ReactDOM.render(<Wrapper />, document.getElementById('root'));
}

if (Utils.isAuthenticated()) {
    ReactDOM.render(<img className="index-loading" src={loadingGif} alt=""/>, document.getElementById('root'));
    Utils.getUser(-1)
        .then(function (response) {
            localStorage.setItem(ID_KEY, response.data.user.id);
            localStorage.setItem(ROLE_KEY, response.data.user.role);
            localStorage.setItem(NOTIFICATIONS_KEY, response.data.preferences.notifications);

            if (Utils.hasNotificationsEnabled()) {
                Utils.pushManagerSubscribe();
            } else {
                Utils.pushManagerUnsubscribe(false)
            }

            loadApp(
                response.data.finance, 
                response.data.preferences.primary_color, 
                response.data.preferences.secondary_color
            );
        }).catch(function (error) {
            console.error('Error on index.js: ', error);
            loadApp();
        });
} else {
    loadApp();
}