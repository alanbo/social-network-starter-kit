import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import './App.css';
import NavigationFrame from './redux-wrapped-components/NavigationFrame';
import SnackbarNotification from './components/SnackbarNotification';
import Main from './Main';
import { client } from './index';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';


const LOGOUT = gql`
  mutation Logout {
    logoutUser @client
  }
`;

export default () => {
  const [logoutUser] = useMutation(LOGOUT)

  function signOut() {
    logoutUser();
  }

  // componentDidMount() {
  //   this._redirect();
  // }

  // componentDidUpdate() {
  //   this._redirect();
  // }

  // Redirect to the login page when user is not logged in.
  // _redirect() {
  // const is_login_route = this.props.location.pathname === '/login';

  // if (!this.props.is_logged_in && !is_login_route) {
  //   this.props.history.push('/login');
  // }
  // }

  return (
    <div className="App">
      <NavigationFrame signOut={signOut}>
        <Main />
      </NavigationFrame>
      <SnackbarNotification />
    </div>
  );
}

