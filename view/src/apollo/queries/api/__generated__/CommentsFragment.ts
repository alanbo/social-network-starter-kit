/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CommentsFragment
// ====================================================

export interface CommentsFragment_comments_user {
  __typename: "UserBasic";
  given_name: string | null;
  family_name: string | null;
  _id: string;
}

export interface CommentsFragment_comments {
  __typename: "Comment";
  message: string;
  _id: string;
  createdAt: any;
  user: CommentsFragment_comments_user;
}

export interface CommentsFragment {
  __typename: "Post";
  comments: CommentsFragment_comments[] | null;
}
