import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import UserDetailPage from './pages/UserDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import RequestLoanPage from './pages/RequestLoanPage';
import LoanDetailPage from './pages/LoanDetailPage';
import LoansListPage from './pages/LoansListPage';
import ActivateAccountPage from './pages/ActivateAccountPage';
import FondoInfoPage from './pages/FondoInfoPage';
import ToolsListPage from './pages/ToolsListPage';
    import SimulationPage from './pages/tools/SimulationPage';
    import ProjectionPage from './pages/tools/ProjectionPage';
    import ActivitiesPage from './pages/tools/ActivitiesPage';

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
            <Route exact path = '/error' component={NotFoundPage} />
            <NotValidRoute exact path='/' component={LoginPage}/>
            <NotValidRoute exact path='/login' component={LoginPage}/>
            <NotValidRoute exact path='/activate/:id/:key' component={ActivateAccountPage}/>
            <PrivateRoute exact path='/home' component={HomePage} />
            <PrivateRoute exact path='/user/:id' component={UserDetailPage} />
            <PrivateRoute exact path='/request-loan' component={RequestLoanPage} />
            <PrivateRoute exact path='/loan/:id' component={LoanDetailPage} />
            <PrivateRoute exact path='/info' component={FondoInfoPage} />
            <PrivateRoute exact path='/tools' component={ToolsListPage} />
            <PrivateRoute exact path='/tool/simulation' component={SimulationPage} />
            <PrivateRoute exact path='/tool/projection' component={ProjectionPage} />
            <PrivateRoute exact path='/tool/activities' component={ActivitiesPage} />
            <ManagementRoute exact path='/users' component={UsersListPage} />
            <ManagementRoute exact path='/loans' component={LoansListPage} />
            <Redirect to="/error" />
        </Switch>
    </main>
)

export default RouterMain;