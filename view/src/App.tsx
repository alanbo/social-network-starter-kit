import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";

const client = new ApolloClient({
  uri: '/api'
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Query
            query={gql`
              {
                user(email: "cbrim1@nymag.com") {
                  email
                  first_name
                  last_name
                  gender
                  createdAt
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              const { first_name, last_name, email } = data.user;
                return (<p>Hello {first_name} {last_name}. Your email is: {email}</p>)
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
