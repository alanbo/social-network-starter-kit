import { client } from '../../index';
import { USER, LOGIN, LOGOUT } from '../../graphql/user-queries';
import { ApolloQueryResult } from 'apollo-client';

import {
  get_user_with_posts,
  get_user_with_posts_error,
  login,
  login_error,
  logout,
  logout_error
} from './types';

import { ThunkAction } from 'redux-thunk';

import { UserQuery, Logout } from '../../graphql/operation-result-types';

type UserQueryResult = Promise<ApolloQueryResult<UserQuery>>;
type LogoutResult = Promise<ApolloQueryResult<Logout>>;

interface GetUserAction {
  type: typeof get_user_with_posts,
  payload: UserQuery
}

interface GetUserActionError {
  type: typeof get_user_with_posts_error,
  payload: Error
}

interface LoginAction {
  type: typeof login,
  payload: UserQuery
}

interface LoginActionError {
  type: typeof login_error,
  payload: Error
}

interface LogoutAction {
  type: typeof logout
}

interface LogoutActionError {
  type: typeof logout_error,
  payload: Error
}

export type UserActions = GetUserAction | LoginAction | LogoutAction;


type GetUserThunk = () => ThunkAction<void, {}, null, GetUserAction | GetUserActionError>;

export const getUser: GetUserThunk = () => dispatch => {
  const query: UserQueryResult = client.query({ query: USER });

  query.then(user => {
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


type LoginUserThunk = (
  email: string,
  password: string
) => ThunkAction<void, {}, null, LoginAction | LoginActionError>;

export const loginUser: LoginUserThunk = (email: string, password: string) => dispatch => {
  const mutation: UserQueryResult = client.mutate({ mutation: LOGIN, variables: { email, password } });

  mutation.then((user) => {
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


type LogoutUserThunk = () => ThunkAction<void, {}, null, LogoutAction | LogoutActionError>;
export const logoutUser: LogoutUserThunk = () => dispatch => {
  const mutation: LogoutResult = client.mutate({ mutation: LOGOUT });

  mutation.then(() => {
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