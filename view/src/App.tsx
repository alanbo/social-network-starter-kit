import React, { Component } from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import NavigationFrame from './components/NavigationFrame';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { USER, LOGIN, LOGOUT } from './graphql/user-queries';
import Main from './Main';

export const client = new ApolloClient({
  uri: '/api/'
});

class App extends Component {

  async signOut() {
    const logout = await client.mutate({ mutation: LOGOUT });

    if (logout.data) {
      try {
        await client.resetStore();
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <div className="App">
            <NavigationFrame signOut={this.signOut}>
              <Main />
            </NavigationFrame>
          </div>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;
