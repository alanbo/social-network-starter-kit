import { addCommentReduce, removeCommentReduce, updateCommentReduce } from './shared/commentReduceFunctions';

import { likePostReduce, unlikePostReduce } from './shared/likeReducerFunctions'


import {
  gql_posts,
  gql_add_comment,
  gql_remove_comment,
  gql_update_comment,
  gql_like_post,
  gql_unlike_post
} from '../actions/gql-types';

import {
  GetPosts_posts
} from '../../graphql/operation-result-types';

import {
  GqlGetPostsAction,
  GqlAddCommentAction,
  GqlRemoveCommentAction,
  GqlUpdateCommentAction,
  GqlLikePostAction,
  GqlUnlikePostAction
} from '../actions/gql-action-interfaces';


type Actions = GqlGetPostsAction
  | GqlAddCommentAction
  | GqlRemoveCommentAction
  | GqlUpdateCommentAction
  | GqlLikePostAction
  | GqlUnlikePostAction;

type Posts = GetPosts_posts[];


export default function (state: Posts = [], action: Actions): Posts {
  switch (action.type) {
    case gql_posts: {
      const posts = action.payload.posts;

      if (!posts) {
        return state;
      }

      return posts;
    }

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

    default:
      return state;
  }
};
