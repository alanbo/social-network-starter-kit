import { GetUserPosts } from '../../graphql/operation-result-types';
import { DeepReadonly } from 'utility-types';
import { UserActions } from '../actions/userActions'

import {
  get_user_with_posts,
  login,
  logout
} from '../actions/types';


export type UserPostsState = DeepReadonly<GetUserPosts>[] | null;

export default function (state: UserPostsState = [], action: UserActions) {
  switch (action.type) {
    case get_user_with_posts:
    case login:
      const user = action.payload.user;

      if (!user) {
        return state;
      }

      return user.

    case logout:
      return [];

    default:
      return state
  }
};