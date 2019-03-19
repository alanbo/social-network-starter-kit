import { client } from '../../index';
import { Dispatch } from 'redux';
import { USER, LOGIN, LOGOUT } from '../../graphql/user-queries';

import {
  get_user_with_posts,
  get_user_with_posts_error,
  login,
  login_error,
  logout,
  logout_error
} from './types';


export const getUser = () => (dispatch: Dispatch<any>) => {
  client.query({ query: USER })
    .then(user => {
      dispatch({
        type: get_user_with_posts,
        payload: user.data
      });
    })
    .catch(e => {
      dispatch({
        type: get_user_with_posts_error,
        payload: e
      });
    });
};

export const loginUser = (email: string, password: string) => (dispatch: Dispatch<any>) => {
  client.mutate({ mutation: LOGIN, variables: { email, password } })
    .then((user) => {
      dispatch({
        type: login,
        payload: user.data
      });
    })
    .catch(e => {
      dispatch({
        type: login_error,
        payload: e
      });
    });
};

export const logoutUser = () => (dispatch: Dispatch<any>) => {
  client.mutate({ mutation: LOGOUT })
    .then(() => {
      dispatch({
        type: logout
      });
    })
    .catch(e => {
      dispatch({
        type: logout_error,
        payload: e
      });
    });
};