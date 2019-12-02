
import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser {
    getUser @client {
      _id
      email
      given_name
      family_name
      nickname
      phone_number
      gender
      birthdate
      email_verified
    }
  }
`;

export const SIGN_UP_USER = gql`
  mutation CreateAuthUser($data: UserAuthInput!) {
    createAuthUser(data: $data) @client 
  }
`;

export const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) @client {
      ... on Error {
        __typename
        code
        message
      }

      ... on UserAuth {
        __typename
        gender
        given_name
        _id
      }
    }
  }
`;

export const CONFIRM_USER = gql`
  mutation ConfirmUser($code: String!) {
    confirmUser(code: $code) @client
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logoutUser @client
  }
`;