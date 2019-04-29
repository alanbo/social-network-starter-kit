import cloneDeep from 'lodash/cloneDeep';

import {
  GetUserPosts_user_posts_comments,
  GetUserPosts_user_posts
} from '../../../graphql/operation-result-types';

import {
  GqlAddCommentAction,
  GqlRemoveCommentAction
} from '../../actions/gql-action-interfaces';

interface StateItem {
  _id: string,
  comments: GetUserPosts_user_posts_comments[]
}

export const addCommentReduce = (state: GetUserPosts_user_posts[], action: GqlAddCommentAction) => {
  if (!state.length) {
    return state;
  }

  const { post_id } = action.meta.variables;

  const new_state = cloneDeep(state);
  const ix = new_state.findIndex(post => post._id === post_id);

  if (ix < 0) {
    return state;
  }

  const comments = new_state[ix].comments || [];

  comments
    .unshift(action.payload.addComment);

  new_state[ix].comments = comments;

  return new_state;
}


export const removeCommentReduce = (state: GetUserPosts_user_posts[], action: GqlRemoveCommentAction) => {
  if (!state.length) {
    return state;
  }

  const { post_id } = action.meta.variables;
  const new_state = cloneDeep(state);
  const ix = new_state.findIndex(post => post._id === post_id);

  if (ix < 0) {
    return state;
  }

  const comment_id = action.payload.removeComment;
  const comments = new_state[ix].comments || [];

  new_state[ix].comments = comments.filter(comment => comment._id !== comment_id);

  return new_state;
}