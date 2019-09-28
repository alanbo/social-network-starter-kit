/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveComment
// ====================================================

export interface RemoveComment {
  removeComment: string;
}

export interface RemoveCommentVariables {
  post_id: string;
  comment_id: string;
  post_owner?: boolean | null;
}
