import { USER, LOGIN, LOGOUT } from '../../graphql/queries/user-queries';
import gqlThunkCreator from './gqlThunkCreator';

import types from './types';


import { UserQuery, Logout, Login, LoginVariables } from '../../graphql/operation-result-types';

export const getUser = gqlThunkCreator<UserQuery, void>({
  query: USER,
  type: types.get_user
});

export const loginUser = gqlThunkCreator<Login, LoginVariables>({
  mutation: LOGIN,
  type: types.login
});

export const logoutUser = gqlThunkCreator<Logout, void>({
  mutation: LOGOUT,
  type: types.logout
});
