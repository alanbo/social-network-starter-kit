import React from 'react';

import Settings from '../screens/Settings';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Bookmarks from '../screens/Bookmarks';
import Login from '../screens/Login';
import { Router } from "@reach/router"


const main = () => (
  <Router>
    <Dashboard path='/' />
    <Profile path='/profile' />
    <Bookmarks path='/bookmarks' />
    <Settings path='/settings' />
    <Login path='/login' />
  </Router>
);

export default main;
