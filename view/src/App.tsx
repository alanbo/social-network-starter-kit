import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import NavigationFrame from './components/NavigationFrame';
import { BrowserRouter as Router } from 'react-router-dom';
import { USER, LOGIN } from './graphql/user-queries';

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
            <Query query={USER}>
              {({ loading, error, data }) => {
                if (loading) return 'Loading...';
                if (error) {
                  if (error.message = 'NOT_LOGGED_IN') {
                    return <p>You need to log in</p>;
                  }
                };

                console.log(data);

                return (
                  <NavigationFrame signOut={this.signOut}>
                    {/* <Main /> */}
                    Hello {data && data.user.first_name}
                  </NavigationFrame>
                );
              }}
            </Query>
          </div>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;
