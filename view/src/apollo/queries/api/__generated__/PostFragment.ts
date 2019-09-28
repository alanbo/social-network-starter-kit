/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostFragment
// ====================================================

export interface PostFragment_likes {
  __typename: "UserBasic";
  _id: string;
}

export interface PostFragment_user {
  __typename: "UserBasic";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
}

export interface PostFragment {
  __typename: "Post";
  _id: string;
  message: string;
  tags: string[] | null;
  createdAt: any;
  likes: PostFragment_likes[] | null;
  user: PostFragment_user;
}
