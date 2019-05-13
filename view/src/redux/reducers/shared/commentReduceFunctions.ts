import {
  GetUserPosts_user_posts_comments,
  GetUserPosts_user_posts
} from '../../../graphql/operation-result-types';

import {
  GqlAddCommentAction,
  GqlRemoveCommentAction,
  GqlUpdateCommentAction
} from '../../actions/gql-action-interfaces';


export const addCommentReduce = (state: GetUserPosts_user_posts[], action: GqlAddCommentAction) => {
  if (!state.length) {
    return state;
  }

  const { post_id } = action.meta.variables;

  const new_state = [...state];
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
  const new_state = [...state];
  const ix = new_state.findIndex(post => post._id === post_id);

  if (ix < 0) {
    return state;
  }

  const comment_id = action.payload.removeComment;
  const comments = new_state[ix].comments || [];

  new_state[ix].comments = comments.filter(comment => comment._id !== comment_id);

  return new_state;
}

export const updateCommentReduce = (state: GetUserPosts_user_posts[] = [], action: GqlUpdateCommentAction) => {
  if (!state.length) {
    return state;
  }

  const { post_id, comment_id, message } = action.meta.variables;
  const new_state = [...state];

  // find index of the post
  const ix = new_state.findIndex(post => post._id === post_id);

  if (ix < 0) {
    return state;
  }

  // retrieve comments of the post
  const comments = new_state[ix].comments || [];
  // find index of the comment
  const c_ix = comments.findIndex(comment => comment._id === comment_id);

  if (c_ix < 0) {
    return state;
  }

  // update the message of the give comment
  comments[c_ix].message = message;

  return new_state;
}