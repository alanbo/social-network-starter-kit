/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginUser
// ====================================================

export interface LoginUser_loginUser_Error {
  __typename: "Error";
  code: string;
  message: string;
}

export interface LoginUser_loginUser_UserAuth {
  __typename: "UserAuth";
  gender: string | null;
  given_name: string | null;
  _id: string;
}

export type LoginUser_loginUser = LoginUser_loginUser_Error | LoginUser_loginUser_UserAuth;

export interface LoginUser {
  loginUser: LoginUser_loginUser | null;
}

export interface LoginUserVariables {
  email: string;
  password: string;
}
