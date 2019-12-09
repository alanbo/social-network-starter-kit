import React from 'react';

import Settings from '../screens/Settings';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Bookmarks from '../screens/Bookmarks';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Confirm from '../screens/Confirm';
import { Router } from "@reach/router";

import routes from '../constants/routes';


const main = () => (
  <Router>
    <Dashboard path={routes.HOME} />
    <Profile path={routes.PROFILE} />
    <Bookmarks path={routes.BOOKMARKS} />
    <Settings path={routes.SETTINGS} />
    <Login path={routes.LOGIN} />
    <SignUp path={routes.SIGNUP} />
    <Confirm path={routes.CONFIRM} />
  </Router>
);

export default main;
