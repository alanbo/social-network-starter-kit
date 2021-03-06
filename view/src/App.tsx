import React from 'react';
import './App.css';
import NavigationFrame from './components/NavigationFrame';
import SnackbarNotification from './components/SnackbarNotification';
import Main from './Main';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetUser } from './apollo/resolvers/user';
import { LOGOUT, GET_USER } from './apollo/queries/client/user';
import { User } from './apollo/types/user';
import { navigate } from '@reach/router';



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
      {/* <SnackbarNotification /> */}
    </div>
  );
}

