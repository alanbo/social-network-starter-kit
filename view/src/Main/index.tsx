import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import Settings from '../screens/Settings';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Bookmarks from '../screens/Bookmarks';
import Login from '../screens/Login';


const main = () => (
  <Switch>
    <Route exact path='/' component={Dashboard} />
    <Route path='/profile' component={Profile} />
    <Route path='/bookmarks' component={Bookmarks} />
    <Route path='/settings' component={Settings} />
    <Route path='/login' component={Login} />
  </Switch>
);

export default main;
