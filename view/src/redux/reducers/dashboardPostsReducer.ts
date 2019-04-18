import {
  gql_posts
} from '../actions/gql-types';

import {
  GetPosts_posts
} from '../../graphql/operation-result-types';

import {
  GqlGetPostsAction
} from '../actions/gql-action-interfaces';

type Actions = GqlGetPostsAction;
type Posts = GetPosts_posts[] | null;


export default function (state: Posts = null, action: Actions): Posts {
  switch (action.type) {
    case gql_posts: {
      return action.payload.posts;
    }

    default:
      return state;
  }
};
