import { GetUserPosts_user_posts, Logout } from '../../graphql/operation-result-types';
import { DeepReadonly } from 'utility-types';
import {
  GqlGetUserPostsAction,
  GqlLoginAction,
  GqlLogoutAction
} from '../actions/gql-action-interfaces';

import {
  gql_user_posts,
  gql_logout,
} from '../actions/gql-types';


export type UserPostsState = DeepReadonly<GetUserPosts_user_posts>[] | null;

type Action = GqlGetUserPostsAction | GqlLoginAction | GqlLogoutAction;

export default function (state: UserPostsState = [], action: Action): UserPostsState {
  switch (action.type) {
    case gql_user_posts:
      const user = action.payload.user;

      if (!user || !user.posts) {
        return state;
      }

      return user.posts;

    case gql_logout:
      return [];

    default:
      return state
  }
};