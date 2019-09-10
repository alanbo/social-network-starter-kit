import React from 'react';
import './App.css';
import NavigationFrame from './redux-wrapped-components/NavigationFrame';
import SnackbarNotification from './components/SnackbarNotification';
import Main from './Main';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { GET_USER } from './apollo/resolvers';
import { navigate } from '@reach/router';


const LOGOUT = gql`
  mutation Logout {
    logoutUser @client
  }
`;

export default () => {
  const [logoutUser] = useMutation(LOGOUT);
  const user = useQuery(GET_USER);

  if (!user.loading && (!user.data || !user.data.getUser)) {
    navigate('/login');
  };

  return (
    <div className="App">
      <NavigationFrame signOut={logoutUser}>
        <Main />
      </NavigationFrame>
      <SnackbarNotification />
    </div>
  );
}

