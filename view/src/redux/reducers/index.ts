import { combineReducers } from 'redux';

import dashboard_posts from './dashboardPostsReducer';
import user from './userReducer';
import user_posts from './userPostsReducer';
import loading from './loadingReducer';
import errors from './errorsReducer';

const root_reducer = combineReducers({
  user,
  user_posts,
  dashboard_posts,
  loading,
  errors
});

export default root_reducer;

export type AppState = ReturnType<typeof root_reducer>;