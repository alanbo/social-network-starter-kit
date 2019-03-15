import React from 'react';
import { Switch, Route } from 'react-router-dom'

import Settings from '../screens/Settings';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Bookmarks from '../screens/Bookmarks';

const Main = () => (
  <Switch>
    <Route exact path='/' component={Dashboard} />
    <Route path='/profile' component={Profile} />
    <Route path='/bookmarks' component={Bookmarks} />
    <Route path='/settings' component={Settings} />
  </Switch>
)

export default Main;
