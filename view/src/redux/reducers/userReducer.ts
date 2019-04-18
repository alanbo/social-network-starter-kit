import { UserQuery_user } from '../../graphql/operation-result-types';
import { DeepReadonly } from 'utility-types';
import {
  GqlUserQueryAction,
  GqlLoginAction,
  GqlLogoutAction
} from '../actions/gql-action-interfaces';

import {
  gql_user,
  gql_login,
  gql_logout
} from '../actions/gql-types';

export type UserState = DeepReadonly<UserQuery_user | null>;
type Action = GqlLoginAction | GqlLogoutAction | GqlUserQueryAction;

export default function (state: UserState = null, action: Action): UserState {
  switch (action.type) {
    case gql_user:
    case gql_login: {
      const user = Object.assign({}, action.payload.user);

      return user;
    }

    case gql_logout:
      return null;

    default:
      return state
  }
};