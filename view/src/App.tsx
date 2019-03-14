import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import NavigationFrame from './components/NavigationFrame';
import { BrowserRouter as Router } from 'react-router-dom';

const client = new ApolloClient({
  uri: '/api'
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
              {/* <Main /> */}
              Hello
            </NavigationFrame>
          </div>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;
