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
import RequestPage from './pages/RequestPage';
import RequestCapPage from './pages/RequestCapPage';
import CapsListPage from './pages/CapsListPage';
import ToolsListPage from './pages/ToolsListPage';
    import SimulationPage from './pages/tools/SimulationPage';
    import ProjectionPage from './pages/tools/ProjectionPage';
    import ActivitiesPage from './pages/tools/ActivitiesPage';
    import BirthdatesPage from './pages/tools/BirthdatesPage';
    import PowerPage from './pages/tools/PowerPage';

import Utils from '../utils/Utils';

const PrivateRoute = ({ component: Component, rProps, ...rest }) => (
    <Route {...rest} render={(props) => (
        Utils.isAuthenticated()
        ? <Component {...props} {...rProps}/>
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }} />
    )} />
);

const NotValidRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        !Utils.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/home',
            state: { from: props.location }
        }} />
    )} />
);

const ManagementRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        Utils.isAuthenticated() && Utils.isAuthorized()
        ? <Component {...props} isManage={true} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }} />
    )} />
);

const RouterMain = (props) => (
    <main>
        <Switch>
            <Route exact path = '/error' component={NotFoundPage} />
            <NotValidRoute exact path='/' component={LoginPage}/>
            <NotValidRoute exact path='/login' component={LoginPage}/>
            <NotValidRoute exact path='/activate/:id/:key' component={ActivateAccountPage}/>
            <PrivateRoute rProps={props} exact path='/home' component={HomePage} />
            <PrivateRoute rProps={props} exact path='/user/:id(\d+)' component={UserDetailPage} />
            <PrivateRoute rProps={props} exact path='/user/caps' component={CapsListPage} />
            <PrivateRoute rProps={props} exact path='/request' component={RequestPage} />
            <PrivateRoute rProps={props} exact path='/request-cap' component={RequestCapPage} />
            <PrivateRoute rProps={props} exact path='/request-loan' component={RequestLoanPage} />
            <PrivateRoute rProps={props} exact path='/loan/:id' component={LoanDetailPage} />
            <PrivateRoute rProps={props} exact path='/info' component={FondoInfoPage} />
            <PrivateRoute rProps={props} exact path='/tools' component={ToolsListPage} />
            <PrivateRoute rProps={props} exact path='/tool/simulation' component={SimulationPage} />
            <PrivateRoute rProps={props} exact path='/tool/projection' component={ProjectionPage} />
            <PrivateRoute rProps={props} exact path='/tool/activities' component={ActivitiesPage} />
            <PrivateRoute rProps={props} exact path='/tool/birthdates' component={BirthdatesPage} />
            <PrivateRoute rProps={props} exact path='/tool/power' component={PowerPage} />
            <ManagementRoute exact path='/manage/users' component={UsersListPage} />
            <ManagementRoute exact path='/manage/loans' component={LoansListPage} />
            <ManagementRoute exact path='/manage/caps' component={CapsListPage} />
            <Redirect to="/error" />
        </Switch>
    </main>
)

export default RouterMain;