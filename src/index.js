import React from 'react';
import ReactDOM from 'react-dom';
import './resources/styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Components
import RouterMain from './components/RouterMain';
//#009688
const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#216778',
        accent1Color: '#0B2228'
    },
});

const Wrapper = () => (
    <BrowserRouter>
        <MuiThemeProvider muiTheme={muiTheme}>
            <RouterMain />
        </MuiThemeProvider>
    </BrowserRouter>
);

ReactDOM.render(<Wrapper />, document.getElementById('root'));
registerServiceWorker();
