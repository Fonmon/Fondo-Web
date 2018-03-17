import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import UserDetail from './pages/UserDetailPage';
import NotFound from './pages/NotFoundPage';
import RequestLoanPage from './pages/RequestLoanPage';
import LoanDetail from './pages/LoanDetailPage';
import LoansList from './pages/LoansListPage';
import ActivateAccount from './pages/ActivateAccountPage';
import FondoInfo from './pages/FondoInfoPage';
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
            <NotValidRoute exact path='/' component={LoginPage}/>
            <NotValidRoute exact path='/login' component={LoginPage}/>
            <NotValidRoute exact path='/activate/:id/:key' component={ActivateAccount}/>
            <PrivateRoute exact path='/home' component={HomePage} />
            <PrivateRoute exact path='/user/:id' component={UserDetail} />
            <PrivateRoute exact path='/request-loan' component={RequestLoanPage} />
            <PrivateRoute exact path='/loan/:id' component={LoanDetail} />
            <PrivateRoute exact path='/info' component={FondoInfo} />
            <ManagementRoute exact path='/users' component={UsersListPage} />
            <ManagementRoute exact path='/loans' component={LoansList} />
            <Redirect to="/error" />
        </Switch>
    </main>
)

export default RouterMain;