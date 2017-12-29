import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import UsersList from './UsersList';
import UserDetail from './UserDetail';
import NotFound from './NotFound';
import RequestLoan from './RequestLoan';
import LoanDetail from './LoanDetail';
import LoansList from './LoansList';
import ActivateAccount from './ActivateAccount';
import FondoInfo from './FondoInfo';
import Utils from '../utils/Utils';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        Utils.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
);

const NotValidRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        !Utils.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to='/home' />
    )} />
);

const ManagementRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        Utils.isAuthenticated() && Utils.isAuthorized()
        ? <Component {...props} />
        : <Redirect to='/home' />
    )} />
);

const RouterMain = () => (
    <main>
        <Switch>
            <Route exact path = '/error' component={NotFound} />
            <NotValidRoute exact path='/' component={Login}/>
            <NotValidRoute exact path='/login' component={Login}/>
            <NotValidRoute exact path='/activate/:id/:key' component={ActivateAccount}/>
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/user/:id' component={UserDetail} />
            <PrivateRoute exact path='/request-loan' component={RequestLoan} />
            <PrivateRoute exact path='/loan/:id' component={LoanDetail} />
            <PrivateRoute exact path='/info' component={FondoInfo} />
            <ManagementRoute exact path='/users' component={UsersList} />
            <ManagementRoute exact path='/loans' component={LoansList} />
            <Redirect to="/error" />
        </Switch>
    </main>
)

export default RouterMain;