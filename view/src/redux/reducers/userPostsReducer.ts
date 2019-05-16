import * as R from 'ramda';
import { GetUserPosts_user_posts } from '../../graphql/operation-result-types';
import { addCommentReduce, removeCommentReduce, updateCommentReduce } from './shared/commentReduceFunctions';
import { likePostReduce, unlikePostReduce } from './shared/likeReducerFunctions'

import {
  GqlGetUserPostsAction,
  GqlLoginAction,
  GqlLogoutAction,
  GqlAddCommentAction,
  GqlRemoveCommentAction,
  GqlUpdateCommentAction,
  GqlUpdatePostAction,
  GqlDeletePostAction,
  GqlLikePostAction,
  GqlUnlikePostAction
} from '../actions/gql-action-interfaces';

import {
  gql_user_posts,
  gql_logout,
  gql_add_comment,
  gql_remove_comment,
  gql_update_comment,
  gql_update_post,
  gql_delete_post,
  gql_like_post,
  gql_unlike_post
} from '../actions/gql-types';


export type UserPostsState = GetUserPosts_user_posts[];

type Action = GqlGetUserPostsAction
  | GqlLoginAction
  | GqlLogoutAction
  | GqlAddCommentAction
  | GqlRemoveCommentAction
  | GqlUpdateCommentAction
  | GqlUpdatePostAction
  | GqlDeletePostAction
  | GqlLikePostAction
  | GqlUnlikePostAction;

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

    case gql_like_post: {
      return likePostReduce(state, action);
    }

    case gql_unlike_post: {
      return unlikePostReduce(state, action);
    }

    case gql_delete_post: {
      const post_id = action.meta.variables.id;

      return R.reject(R.propEq('_id', post_id), state);
    }

    case gql_update_post: {
      const { message, tags } = action.payload.updatePost;
      const post_id = action.meta.variables.data._id;

      const new_state = R.map(
        R.ifElse(
          R.propEq('_id', post_id),
          R.mergeDeepLeft({ message, tags }
          ),
          R.identity),
        state
      ) as UserPostsState;

      return new_state;

    }

    case gql_logout:
      return [];

    default:
      return state
  }
};