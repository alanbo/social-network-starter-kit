/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_getUser {
  __typename: "UserAuth";
  _id: string;
  email: string;
  given_name: string | null;
  family_name: string | null;
  nickname: string | null;
  phone_number: string | null;
  gender: string | null;
  birthdate: string | null;
  email_verified: boolean | null;
}

export interface GetUser {
  getUser: GetUser_getUser | null;
}
