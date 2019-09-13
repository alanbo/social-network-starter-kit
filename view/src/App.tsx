import React from 'react';
import './App.css';
import NavigationFrame from './components/NavigationFrame';
import SnackbarNotification from './components/SnackbarNotification';
import Main from './Main';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { GET_USER, GetUser } from './apollo/resolvers';
import { User } from './apollo/client-schema';
import { navigate } from '@reach/router';


const LOGOUT = gql`
  mutation Logout {
    logoutUser @client
  }
`;

export default () => {
  const [logoutUser] = useMutation(LOGOUT);
  const user_query = useQuery<GetUser>(GET_USER);
  const user = user_query.data ? user_query.data.getUser : null;

  if (!user_query.loading && (!user_query.data || !user_query.data.getUser)) {
    navigate('/login');
  };

  return (
    <div className="App">
      <NavigationFrame signOut={logoutUser} user={user}>
        <Main />
      </NavigationFrame>
      <SnackbarNotification />
    </div>
  );
}

