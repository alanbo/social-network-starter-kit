import { GetUserPosts_user_posts } from '../../graphql/operation-result-types';
import { addCommentReduce, removeCommentReduce, updateCommentReduce } from './shared/commentReduceFunctions';

import {
  GqlGetUserPostsAction,
  GqlLoginAction,
  GqlLogoutAction,
  GqlAddCommentAction,
  GqlRemoveCommentAction,
  GqlUpdateCommentAction
} from '../actions/gql-action-interfaces';

import {
  gql_user_posts,
  gql_logout,
  gql_add_comment,
  gql_remove_comment,
  gql_update_comment
} from '../actions/gql-types';


export type UserPostsState = GetUserPosts_user_posts[];

type Action = GqlGetUserPostsAction
  | GqlLoginAction
  | GqlLogoutAction
  | GqlAddCommentAction
  | GqlRemoveCommentAction
  | GqlUpdateCommentAction;

export default function (state: UserPostsState = [], action: Action): UserPostsState {
  switch (action.type) {
    case gql_user_posts:
      const user = action.payload.user;

      if (!user || !user.posts) {
        return state;
      }

      return user.posts;

    case gql_add_comment:
      return addCommentReduce(state, action);

    case gql_remove_comment:
      return removeCommentReduce(state, action);

    case gql_update_comment:
      return updateCommentReduce(state, action);

    case gql_logout:
      return [];

    default:
      return state
  }
};