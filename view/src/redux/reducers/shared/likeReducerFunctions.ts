import {
  GetUserPosts_user_posts
} from '../../../graphql/operation-result-types';

import {
  GqlLikePostAction,
  GqlUnlikePostAction
} from '../../actions/gql-action-interfaces';

import * as R from 'ramda';

export const likePostReduce = (state: GetUserPosts_user_posts[], action: GqlLikePostAction) => {
  const user = action.meta.state.user;

  if (!user) {
    return state;
  }

  const new_state = [...state];
  const user_basic = R.pick(['_id', 'email', 'first_name', 'last_name'], user);
  const { post_id } = action.meta.variables;
  const p_ix = new_state.findIndex(post => post._id === post_id);
  const post = new_state[p_ix];

  if (!post) {
    return state;
  }

  // if likes are null create a new array
  if (!post.likes) {
    post.likes = [user_basic];

    return new_state;
  }

  const liked = post.likes.some(liked_user => liked_user._id === user_basic._id)

  if (liked) {
    return state;
  }

  post.likes.push(user_basic);

  return new_state;

};

export const unlikePostReduce = (state: GetUserPosts_user_posts[], action: GqlUnlikePostAction) => {
  const user = action.meta.state.user;

  if (!user) {
    return state;
  }

  const new_state = [...state];
  const { post_id } = action.meta.variables;
  const p_ix = new_state.findIndex(post => post._id === post_id);
  const post = new_state[p_ix];

  if (!post || !post.likes) {
    return state;
  }

  post.likes = post.likes.filter(user_liked => user_liked._id !== user._id);

  return new_state;
};