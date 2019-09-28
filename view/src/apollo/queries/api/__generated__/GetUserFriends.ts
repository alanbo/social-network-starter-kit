/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserFriends
// ====================================================

export interface GetUserFriends_user_friends {
  __typename: "UserBasic";
  _id: string;
  given_name: string | null;
  family_name: string | null;
  email: string;
}

export interface GetUserFriends_user {
  __typename: "User";
  friends: GetUserFriends_user_friends[] | null;
}

export interface GetUserFriends {
  user: GetUserFriends_user | null;
}
