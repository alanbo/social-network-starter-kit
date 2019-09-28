/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
  __typename: "User";
  _id: string;
  family_name: string;
  given_name: string;
  email: string;
  gender: string;
  birthdate: string;
  phone_number: string;
}

export interface UserQuery {
  user: UserQuery_user | null;
}
