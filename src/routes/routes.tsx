import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutPage from '../components/about';
import Home from '../components/home';
import LoginPage from '../components/login';
import NoMatch from '../components/no_match';
import RegisterPage from '../components/register';
import UserPage from '../components/user';
import WelcomePage from '../components/welcome';
import { IndexedObject } from '../utils/type';
import PrivateRoute from './private-route';
import PublicRoute from './publicRoute';

const Routes: React.FC<IndexedObject> = () => (
  <Switch>
    <Route exact path="/" component={WelcomePage} />
    <PublicRoute exact path="/login" component={LoginPage} />
    <PublicRoute exact path="/register" component={RegisterPage} />
    <Route exact path="/about" component={AboutPage} />
    <PrivateRoute exact path="/user" component={UserPage} />
    <PrivateRoute exact path="/home" component={Home} />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
