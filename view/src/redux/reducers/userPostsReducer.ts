import {
  get_user_with_posts,
  login,
  logout
} from '../actions/types';


export default function (state = {}, action: any) {
  switch (action.type) {
    case get_user_with_posts:
      return state;

    default:
      return state
  }
};