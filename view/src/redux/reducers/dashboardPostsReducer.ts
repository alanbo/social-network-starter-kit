import {
  gql_posts,
  gql_add_comment
} from '../actions/gql-types';

import {
  GetPosts_posts
} from '../../graphql/operation-result-types';

import {
  GqlGetPostsAction,
  GqlAddCommentAction
} from '../actions/gql-action-interfaces';

function deepcopy(obj: any): any {
  if (obj === null) {
    return null;
  } else if (Array.isArray(obj)) {
    return [...obj].map(deepcopy);


  } else if (typeof obj === 'object') {
  }
}

type Actions = GqlGetPostsAction | GqlAddCommentAction;
type Posts = GetPosts_posts[] | null;


export default function (state: Posts = [], action: Actions): Posts {
  switch (action.type) {
    case gql_posts: {
      return action.payload.posts;
    }

    case gql_add_comment: {
    }

    default:
      return state;
  }
};
