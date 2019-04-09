import { USER, LOGIN, LOGOUT } from '../../graphql/queries/user-queries';
import gqlThunkCreator from './gqlThunkCreator';
import {
  gql_user,
  gql_login,
  gql_logout
} from './gql-types';
import { UserQuery, Logout, Login, LoginVariables } from '../../graphql/operation-result-types';


export const getUser = gqlThunkCreator<UserQuery, void>({
  query: USER,
  type: gql_user
});

export const loginUser = gqlThunkCreator<Login, LoginVariables>({
  mutation: LOGIN,
  type: gql_login
});

export const logoutUser = gqlThunkCreator<Logout, void>({
  mutation: LOGOUT,
  type: gql_logout
});
