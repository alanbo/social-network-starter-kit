/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePost
// ====================================================

export interface DeletePost_deletePost_likes {
  __typename: "UserBasic";
  _id: string;
}

export interface DeletePost_deletePost_user {
  __typename: "UserBasic";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
}

export interface DeletePost_deletePost {
  __typename: "Post";
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
