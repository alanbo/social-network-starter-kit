import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import resolvers from './apollo/resolvers';
import typeDefs from './apollo/client-schema';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { getUserToken } from './apollo/resolvers';

export const theme = createMuiTheme({});
export type AppTheme = typeof theme;


export const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URI,
  clientState: {
    resolvers,
    typeDefs
  },
  request: async (operation) => {
    const token = await getUserToken();

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
});


ReactDOM.render((
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme} >
      <App />
    </ThemeProvider>
  </ApolloProvider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
