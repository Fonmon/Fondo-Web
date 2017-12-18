import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import UsersList from './UsersList';
import UserDetail from './UserDetail';
import NotFound from './NotFound';
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
            <Route exact path = '/notfound' component={NotFound} />
            <NotValidRoute exact path='/' component={Login}/>
            <NotValidRoute exact path='/login' component={Login}/>
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/user/:id' component={UserDetail} />
            <ManagementRoute exact path='/users' component={UsersList} />
        </Switch>
    </main>
)

export default RouterMain;