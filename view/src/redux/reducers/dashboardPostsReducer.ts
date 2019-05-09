import { addCommentReduce, removeCommentReduce, updateCommentReduce } from './shared/commentReduceFunctions';

import {
  gql_posts,
  gql_add_comment,
  gql_remove_comment,
  gql_update_comment
} from '../actions/gql-types';

import {
  GetPosts_posts
} from '../../graphql/operation-result-types';

import {
  GqlGetPostsAction,
  GqlAddCommentAction,
  GqlRemoveCommentAction,
  GqlUpdateCommentAction
} from '../actions/gql-action-interfaces';

function deepcopy(obj: any): any {
  if (obj === null) {
    return null;
  } else if (Array.isArray(obj)) {
    return [...obj].map(deepcopy);


  } else if (typeof obj === 'object') {
  }
}

type Actions = GqlGetPostsAction | GqlAddCommentAction | GqlRemoveCommentAction | GqlUpdateCommentAction;
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

    default:
      return state;
  }
};
