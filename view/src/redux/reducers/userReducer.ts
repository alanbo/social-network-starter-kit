import { UserQuery_user } from '../../graphql/operation-result-types';
import { Omit } from 'utility-types';
import { UserActions } from '../actions/userActions'

export type UserState = Omit<UserQuery_user, 'posts'> | null;

import {
  get_user_with_posts,
  login,
  logout
} from '../actions/types';


export default function (state: UserState = null, action: UserActions): UserState {
  switch (action.type) {
    case get_user_with_posts:
    case login: {
      const user = Object.assign({}, action.payload.user);
      delete user.posts;

      return user;
    }

    case logout:
      return null;

    default:
      return state
  }
};