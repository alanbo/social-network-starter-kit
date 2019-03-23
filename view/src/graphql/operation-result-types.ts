

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_user_posts_comments_user {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Login_user_posts_comments {
  _id: string;
  user: Login_user_posts_comments_user;
  message: string;
}

export interface Login_user_posts {
  message: string;
  comments: Login_user_posts_comments[] | null;
  tags: string[] | null;
}

export interface Login_user {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  posts: Login_user_posts[] | null;
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

export interface UserQuery_user_posts_comments_user {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserQuery_user_posts_comments {
  _id: string;
  user: UserQuery_user_posts_comments_user;
  message: string;
}

export interface UserQuery_user_posts {
  message: string;
  comments: UserQuery_user_posts_comments[] | null;
  tags: string[] | null;
}

export interface UserQuery_user {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  posts: UserQuery_user_posts[] | null;
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
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment_posts_comments_user {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserFragment_posts_comments {
  _id: string;
  user: UserFragment_posts_comments_user;
  message: string;
}

export interface UserFragment_posts {
  message: string;
  comments: UserFragment_posts_comments[] | null;
  tags: string[] | null;
}

export interface UserFragment {
  _id: string;
  last_name: string;
  first_name: string;
  email: string;
  posts: UserFragment_posts[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================