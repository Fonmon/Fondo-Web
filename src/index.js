import React from 'react';
import ReactDOM from 'react-dom';
import './resources/styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';

// Components
import RouterMain from './components/RouterMain';

const Wrapper = () => (
    <BrowserRouter>
        <MuiThemeProvider>
            <RouterMain />
        </MuiThemeProvider>
    </BrowserRouter>
);

ReactDOM.render(<Wrapper />, document.getElementById('root'));
registerServiceWorker();
