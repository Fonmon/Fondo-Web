import React from 'react';
import ReactDOM from 'react-dom';
import './resources/styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';

// Components
import RouterMain from './components/RouterMain';

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#800000'
        },
        secondary: {
            main: '#c83737'
        }
    },
});

const Wrapper = () => (
    <BrowserRouter>
        <MuiThemeProvider theme={muiTheme}>
            <RouterMain />
        </MuiThemeProvider>
    </BrowserRouter>
);

ReactDOM.render(<Wrapper />, document.getElementById('root'));
registerServiceWorker({
    onActivated: (registration) => {
        console.log('worker activated')
        if(!registration.pushManager) {
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
