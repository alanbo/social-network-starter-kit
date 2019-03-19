import React, { Component } from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import NavigationFrame from './components/NavigationFrame';
import { BrowserRouter as Router } from 'react-router-dom';
import Main from './Main';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import root_reducer from './redux/reducers';

const middleware = [
  thunk
];

const store = createStore(root_reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));

export const client = new ApolloClient({
  uri: '/api/'
});

class App extends Component {

  async signOut() {

    try {
      await client.resetStore();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="App">
            <NavigationFrame signOut={this.signOut}>
              <Main />
            </NavigationFrame>
          </div>
        </Provider>
      </Router>
    );
  }
}

export default App;
