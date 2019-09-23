/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPosts
// ====================================================

export interface GetPosts_posts_likes {
  __typename: "UserBasic";
  _id: string;
}

export interface GetPosts_posts_user {
  __typename: "UserBasic";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
}

export interface GetPosts_posts_comments_user {
  __typename: "UserBasic";
  given_name: string | null;
  family_name: string | null;
  _id: string;
}

export interface GetPosts_posts_comments {
  __typename: "Comment";
  message: string;
  _id: string;
  createdAt: any;
  user: GetPosts_posts_comments_user;
}

export interface GetPosts_posts {
  __typename: "Post";
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
