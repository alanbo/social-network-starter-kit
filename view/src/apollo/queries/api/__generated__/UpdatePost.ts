/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PostInputUpdate } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePost
// ====================================================

export interface UpdatePost_updatePost_likes {
  __typename: "UserBasic";
  _id: string;
}

export interface UpdatePost_updatePost_user {
  __typename: "UserBasic";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
}

export interface UpdatePost_updatePost {
  __typename: "Post";
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
