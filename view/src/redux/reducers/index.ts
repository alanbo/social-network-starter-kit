import { combineReducers } from 'redux';
import { DeepReadonly } from 'utility-types';

import dashboard_posts from './dashboardPostsReducer';
import user from './userReducer';
import user_posts from './userPostsReducer';
import loading from './loadingReducer';
import notifications from './notificationsReducer';

const root_reducer = combineReducers({
  user,
  user_posts,
  dashboard_posts,
  loading,
  notifications
});

export default root_reducer;

export type AppState = DeepReadonly<ReturnType<typeof root_reducer>>;