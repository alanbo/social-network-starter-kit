/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserPosts
// ====================================================

export interface GetUserPosts_user_posts_likes {
  __typename: "UserBasic";
  _id: string;
}

export interface GetUserPosts_user_posts_user {
  __typename: "UserBasic";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
}

export interface GetUserPosts_user_posts_comments_user {
  __typename: "UserBasic";
  given_name: string | null;
  family_name: string | null;
  _id: string;
}

export interface GetUserPosts_user_posts_comments {
  __typename: "Comment";
  message: string;
  _id: string;
  createdAt: any;
  user: GetUserPosts_user_posts_comments_user;
}

export interface GetUserPosts_user_posts {
  __typename: "Post";
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: GetUserPosts_user_posts_likes[] | null;
  user: GetUserPosts_user_posts_user;
  comments: GetUserPosts_user_posts_comments[] | null;
}

export interface GetUserPosts_user {
  __typename: "User";
  posts: GetUserPosts_user_posts[] | null;
}

export interface GetUserPosts {
  user: GetUserPosts_user | null;
}
