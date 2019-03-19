import * as R from 'ramda';

import {
  get_user_with_posts,
  login,
  logout
} from '../actions/types';


export default function (state = {}, action: any) {
  switch (action.type) {
    case get_user_with_posts:
    case login:
      return R.dissoc('posts', action.payload.user);

    case logout:
      return {};

    default:
      return state
  }
};