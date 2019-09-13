import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import root_reducer from './redux/reducers';
import resolvers from './apollo/resolvers';
import typeDefs from './apollo/client-schema';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({});

export type AppTheme = typeof theme;

const middleware = [
  thunk
];

const store = createStore(root_reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));

console.log(process.env.REACT_APP_API_URI);

export const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URI,
  clientState: {
    resolvers,
    typeDefs
  }
});


ReactDOM.render((
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme} >
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </ApolloProvider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
