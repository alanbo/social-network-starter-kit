import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import Settings from '../screens/Settings';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Bookmarks from '../screens/Bookmarks';
import Login from '../screens/Login';
import { getUser } from '../redux/actions/userActions';

interface Props {
  getUser: () => void,
  user: any
}

class Main extends Component<Props> {
  componentWillMount() {
    this.props.getUser();
  }

  render() {
    if (!this.props.user._id) {
      return <Login />

    }

    return (
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route path='/profile' component={Profile} />
        <Route path='/bookmarks' component={Bookmarks} />
        <Route path='/settings' component={Settings} />
        <Route path='/login' component={Login} />
      </Switch>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { getUser })(Main);
