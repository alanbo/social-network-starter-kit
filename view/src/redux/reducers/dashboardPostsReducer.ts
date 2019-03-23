import {
  get_dashboard_posts
} from '../actions/types';


export default function (state = {}, action: any) {
  switch (action.type) {
    case get_dashboard_posts:
      return state;

    default:
      return state
  }
};
