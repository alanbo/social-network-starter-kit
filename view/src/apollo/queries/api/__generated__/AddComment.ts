/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddComment
// ====================================================

export interface AddComment_addComment_user {
  __typename: "UserBasic";
  _id: string;
  given_name: string | null;
  family_name: string | null;
  email: string;
}

export interface AddComment_addComment {
  __typename: "Comment";
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
