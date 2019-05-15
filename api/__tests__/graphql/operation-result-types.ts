

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPosts
// ====================================================

export interface GetPosts_posts_likes {
  _id: string;
}

export interface GetPosts_posts_user {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface GetPosts_posts_comments_user {
  first_name: string;
  last_name: string;
  _id: string;
}

export interface GetPosts_posts_comments {
  message: string;
  _id: string;
  createdAt: any;
  user: GetPosts_posts_comments_user;
}

export interface GetPosts_posts {
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: GetPosts_posts_likes[] | null;
  user: GetPosts_posts_user;
  comments: GetPosts_posts_comments[] | null;
}

export interface GetPosts {
  posts: GetPosts_posts[] | null;
}

export interface GetPostsVariables {
  search?: string | null;
  tags?: string[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPost
// ====================================================

export interface AddPost_addPost_likes {
  _id: string;
}

export interface AddPost_addPost_user {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AddPost_addPost {
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: AddPost_addPost_likes[] | null;
  user: AddPost_addPost_user;
}

export interface AddPost {
  addPost: AddPost_addPost;
}

export interface AddPostVariables {
  data: PostInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePost
// ====================================================

export interface DeletePost_deletePost_likes {
  _id: string;
}

export interface DeletePost_deletePost_user {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface DeletePost_deletePost {
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: DeletePost_deletePost_likes[] | null;
  user: DeletePost_deletePost_user;
}

export interface DeletePost {
  deletePost: DeletePost_deletePost;
}

export interface DeletePostVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePost
// ====================================================

export interface UpdatePost_updatePost_likes {
  _id: string;
}

export interface UpdatePost_updatePost_user {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UpdatePost_updatePost {
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: UpdatePost_updatePost_likes[] | null;
  user: UpdatePost_updatePost_user;
}

export interface UpdatePost {
  updatePost: UpdatePost_updatePost;
}

export interface UpdatePostVariables {
  data: PostInputUpdate;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddComment
// ====================================================

export interface AddComment_addComment_user {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AddComment_addComment {
  _id: string;
  message: string;
  createdAt: any;
  user: AddComment_addComment_user;
}

export interface AddComment {
  addComment: AddComment_addComment;
}

export interface AddCommentVariables {
  post_id: string;
  message: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveComment
// ====================================================

export interface RemoveComment {
  removeComment: string;
}

export interface RemoveCommentVariables {
  post_id: string;
  comment_id: string;
  post_owner?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateComment
// ====================================================

export interface UpdateComment {
  updateComment: boolean;
}

export interface UpdateCommentVariables {
  message: string;
  comment_id: string;
  post_id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LikePost
// ====================================================

export interface LikePost {
  likePost: boolean;
}

export interface LikePostVariables {
  post_id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnlikePost
// ====================================================

export interface UnlikePost {
  unlikePost: boolean;
}

export interface UnlikePostVariables {
  post_id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_user {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  gender: string;
  createdAt: any;
  phone_number: string;
}

export interface Login {
  user: Login_user;
}

export interface LoginVariables {
  email: string;
  password: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  gender: string;
  createdAt: any;
  phone_number: string;
}

export interface UserQuery {
  user: UserQuery_user | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Logout
// ====================================================

export interface Logout {
  logout: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserFriends
// ====================================================

export interface GetUserFriends_user_friends {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface GetUserFriends_user {
  friends: GetUserFriends_user_friends[] | null;
}

export interface GetUserFriends {
  user: GetUserFriends_user | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserPosts
// ====================================================

export interface GetUserPosts_user_posts_likes {
  _id: string;
}

export interface GetUserPosts_user_posts_user {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface GetUserPosts_user_posts_comments_user {
  first_name: string;
  last_name: string;
  _id: string;
}

export interface GetUserPosts_user_posts_comments {
  message: string;
  _id: string;
  createdAt: any;
  user: GetUserPosts_user_posts_comments_user;
}

export interface GetUserPosts_user_posts {
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: GetUserPosts_user_posts_likes[] | null;
  user: GetUserPosts_user_posts_user;
  comments: GetUserPosts_user_posts_comments[] | null;
}

export interface GetUserPosts_user {
  posts: GetUserPosts_user_posts[] | null;
}

export interface GetUserPosts {
  user: GetUserPosts_user | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUser
// ====================================================

export interface CreateUser_createUser {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  gender: string;
  createdAt: any;
  phone_number: string;
}

export interface CreateUser {
  createUser: CreateUser_createUser;
}

export interface CreateUserVariables {
  data: UserInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  gender: string;
  createdAt: any;
  phone_number: string;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser;
}

export interface UpdateUserVariables {
  data: UserInputOpt;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUser
// ====================================================

export interface DeleteUser_deleteUser {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  gender: string;
  createdAt: any;
  phone_number: string;
}

export interface DeleteUser {
  deleteUser: DeleteUser_deleteUser;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostFragment
// ====================================================

export interface PostFragment_likes {
  _id: string;
}

export interface PostFragment_user {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface PostFragment {
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: PostFragment_likes[] | null;
  user: PostFragment_user;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CommentsFragment
// ====================================================

export interface CommentsFragment_comments_user {
  first_name: string;
  last_name: string;
  _id: string;
}

export interface CommentsFragment_comments {
  message: string;
  _id: string;
  createdAt: any;
  user: CommentsFragment_comments_user;
}

export interface CommentsFragment {
  comments: CommentsFragment_comments[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  gender: string;
  createdAt: any;
  phone_number: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

// null
export interface PostInput {
  message: string;
  tags: string[];
  visible_to?: string[] | null;
}

// null
export interface PostInputUpdate {
  _id: string;
  message?: string | null;
  tags_add?: string[] | null;
  tags_replace?: string[] | null;
  tags_delete?: string[] | null;
  visible_to_add?: string[] | null;
  visible_to_delete?: string[] | null;
  visible_to_replace?: string[] | null;
}

// null
export interface UserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  password: string;
}

// null
export interface UserInputOpt {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  gender?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================