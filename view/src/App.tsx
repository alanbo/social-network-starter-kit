import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import './App.css';
import NavigationFrame from './components/NavigationFrame';
import SnackbarNotification from './components/SnackbarNotification';
import Main from './Main';
import { client } from './index';

interface Props extends RouteComponentProps<any> { }

class App extends Component<Props> {

  async signOut() {

    try {
      await client.resetStore();
    } catch (e) {
      console.log(e);
    }
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
