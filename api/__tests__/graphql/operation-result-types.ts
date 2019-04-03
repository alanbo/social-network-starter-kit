

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPosts
// ====================================================

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
  user: GetPosts_posts_comments_user;
}

export interface GetPosts_posts {
  _id: string;
  message: string;
  tags: string[] | null;
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

export interface AddComment_addComment_comments_user {
  first_name: string;
  last_name: string;
  _id: string;
}

export interface AddComment_addComment_comments {
  message: string;
  _id: string;
  user: AddComment_addComment_comments_user;
}

export interface AddComment_addComment {
  comments: AddComment_addComment_comments[] | null;
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

export interface RemoveComment_removeComment_comments_user {
  first_name: string;
  last_name: string;
  _id: string;
}

export interface RemoveComment_removeComment_comments {
  message: string;
  _id: string;
  user: RemoveComment_removeComment_comments_user;
}

export interface RemoveComment_removeComment {
  comments: RemoveComment_removeComment_comments[] | null;
}

export interface RemoveComment {
  removeComment: RemoveComment_removeComment;
}

export interface RemoveCommentVariables {
  post_id: string;
  comment_id: string;
  post_owner?: boolean | null;
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

export interface GetUserPosts_user_posts_comments_user {
  first_name: string;
  last_name: string;
  email: string;
}

export interface GetUserPosts_user_posts_comments {
  _id: string;
  user: GetUserPosts_user_posts_comments_user;
  message: string;
}

export interface GetUserPosts_user_posts {
  message: string;
  comments: GetUserPosts_user_posts_comments[] | null;
  tags: string[] | null;
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
// GraphQL fragment: PostFragment
// ====================================================

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

//==============================================================
// END Enums and Input Objects
//==============================================================