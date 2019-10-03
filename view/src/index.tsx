import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import createApolloClient from './apollo/client';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

export const theme = createMuiTheme({});
export type AppTheme = typeof theme;


ReactDOM.render((
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <ApolloProvider client={createApolloClient()}>
      <ThemeProvider theme={theme} >
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </MuiPickersUtilsProvider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
