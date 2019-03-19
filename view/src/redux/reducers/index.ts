import { combineReducers } from 'redux';

import dashboard_posts from './dashboardPostsReducer';
import user from './userReducer';
import user_posts from './userPostsReducer';

const serverless = combineReducers({
  user,
  user_posts,
  dashboard_posts
});

export default serverless;