import React, { Component } from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import NavigationFrame from './components/NavigationFrame';
import { BrowserRouter as Router } from 'react-router-dom';
import { USER, LOGIN } from './graphql/user-queries';
import Main from './Main';

const client = new ApolloClient({
  uri: '/api/'
});

class App extends Component {

  signOut() {
    console.log('Signing Out');
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
