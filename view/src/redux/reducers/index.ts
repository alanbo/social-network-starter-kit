import { combineReducers } from 'redux';

import dashboard_posts from './dashboardPostsReducer';
import user from './userReducer';
import user_posts from './userPostsReducer';

const root_reducer = combineReducers({
  user,
  user_posts,
  dashboard_posts
});

export default root_reducer;

export type AppState = ReturnType<typeof root_reducer>;