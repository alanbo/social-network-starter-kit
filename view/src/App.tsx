import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import './App.css';
import NavigationFrame from './redux-wrapped-components/NavigationFrame';
import SnackbarNotification from './components/SnackbarNotification';
import Main from './Main';
import { client } from './index';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';


interface Props extends RouteComponentProps<any> {
}

class App extends Component<Props> {

  async signOut() {

    try {
      await client.resetStore();
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this._redirect();
  }

  componentDidUpdate() {
    this._redirect();
  }

  // Redirect to the login page when user is not logged in.
  _redirect() {
    const is_login_route = this.props.location.pathname === '/login';

    // if (!this.props.is_logged_in && !is_login_route) {
    //   this.props.history.push('/login');
    // }
  }

  render() {
    return (
      <div className="App">
        <NavigationFrame signOut={this.signOut}>
          <Main />
        </NavigationFrame>
        <SnackbarNotification />
      </div>
    );
  }
}

export default withRouter(App);
