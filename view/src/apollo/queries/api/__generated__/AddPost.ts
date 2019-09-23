/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PostInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AddPost
// ====================================================

export interface AddPost_addPost_likes {
  __typename: "UserBasic";
  _id: string;
}

export interface AddPost_addPost_user {
  __typename: "UserBasic";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
}

export interface AddPost_addPost {
  __typename: "Post";
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
