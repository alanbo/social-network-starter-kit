import {
  gql_error,
  gql_loading,
  gql_loading_cancel,
  gql_posts,
  gql_add_post,
  gql_delete_post,
  gql_update_post,
  gql_add_comment,
  gql_remove_comment,
  gql_login,
  gql_user,
  gql_logout,
  gql_user_friends,
  gql_user_posts,
  gql_create_user,
  gql_update_user,
  gql_delete_user,
} from './gql-types';

import gql_queries from '../../graphql/queries';
import gqlThunkCreator from './gqlThunkCreator';


export const gqlPosts = gqlThunkCreator({
  query: gql_queries.POSTS,
  type: gql_posts
});

export const gqlAddPost = gqlThunkCreator({
  mutation: gql_queries.ADD_POST,
  type: gql_add_post
});

export const gqlDeletePost = gqlThunkCreator({
  mutation: gql_queries.DELETE_POST,
  type: gql_delete_post
});

export const gqlUpdatePost = gqlThunkCreator({
  mutation: gql_queries.UPDATE_POST,
  type: gql_update_post
});

export const gqlAddComment = gqlThunkCreator({
  mutation: gql_queries.ADD_COMMENT,
  type: gql_add_comment
});

export const gqlRemoveComment = gqlThunkCreator({
  mutation: gql_queries.REMOVE_COMMENT,
  type: gql_remove_comment
});

export const gqlLogin = gqlThunkCreator({
  mutation: gql_queries.LOGIN,
  type: gql_login
});

export const gqlUser = gqlThunkCreator({
  query: gql_queries.USER,
  type: gql_user
});

export const gqlLogout = gqlThunkCreator({
  mutation: gql_queries.LOGOUT,
  type: gql_logout
});

export const gqlUserFriends = gqlThunkCreator({
  query: gql_queries.USER_FRIENDS,
  type: gql_user_friends
});

export const gqlUserPosts = gqlThunkCreator({
  query: gql_queries.USER_POSTS,
  type: gql_user_posts
});

export const gqlCreateUser = gqlThunkCreator({
  mutation: gql_queries.CREATE_USER,
  type: gql_create_user
});

export const gqlUpdateUser = gqlThunkCreator({
  mutation: gql_queries.UPDATE_USER,
  type: gql_update_user
});

export const gqlDeleteUser = gqlThunkCreator({
  mutation: gql_queries.DELETE_USER,
  type: gql_delete_user
});

