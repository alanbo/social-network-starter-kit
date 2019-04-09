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


import {
  GetPosts,
  AddPost,
  DeletePost,
  UpdatePost,
  AddComment,
  RemoveComment,
  Login,
  UserQuery,
  Logout,
  GetUserFriends,
  GetUserPosts,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from '../../graphql/operation-result-types';



export interface GqlErrorAction {
  type: typeof gql_error,
  meta: {
    type: string,
    id: number
  }
}

export interface GqlLoadingAction {
  type: typeof gql_loading,
  meta: {
    type: string,
    id: number
  }
}

export interface GqlLoadingCancelAction {
  type: typeof gql_loading_cancel,
  meta: {
    type: string,
    id: number
  }
}

export interface GqlGetPostsAction {
  type: typeof gql_posts,
  payload: GetPosts,
  meta: {
    id: number
  }
}

export interface GqlAddPostAction {
  type: typeof gql_add_post,
  payload: AddPost,
  meta: {
    id: number
  }
}

export interface GqlDeletePostAction {
  type: typeof gql_delete_post,
  payload: DeletePost,
  meta: {
    id: number
  }
}

export interface GqlUpdatePostAction {
  type: typeof gql_update_post,
  payload: UpdatePost,
  meta: {
    id: number
  }
}

export interface GqlAddCommentAction {
  type: typeof gql_add_comment,
  payload: AddComment,
  meta: {
    id: number
  }
}

export interface GqlRemoveCommentAction {
  type: typeof gql_remove_comment,
  payload: RemoveComment,
  meta: {
    id: number
  }
}

export interface GqlLoginAction {
  type: typeof gql_login,
  payload: Login,
  meta: {
    id: number
  }
}

export interface GqlUserQueryAction {
  type: typeof gql_user,
  payload: UserQuery,
  meta: {
    id: number
  }
}

export interface GqlLogoutAction {
  type: typeof gql_logout,
  payload: Logout,
  meta: {
    id: number
  }
}

export interface GqlGetUserFriendsAction {
  type: typeof gql_user_friends,
  payload: GetUserFriends,
  meta: {
    id: number
  }
}

export interface GqlGetUserPostsAction {
  type: typeof gql_user_posts,
  payload: GetUserPosts,
  meta: {
    id: number
  }
}

export interface GqlCreateUserAction {
  type: typeof gql_create_user,
  payload: CreateUser,
  meta: {
    id: number
  }
}

export interface GqlUpdateUserAction {
  type: typeof gql_update_user,
  payload: UpdateUser,
  meta: {
    id: number
  }
}

export interface GqlDeleteUserAction {
  type: typeof gql_delete_user,
  payload: DeleteUser,
  meta: {
    id: number
  }
}

