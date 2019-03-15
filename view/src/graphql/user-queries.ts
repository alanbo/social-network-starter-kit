import gql from 'graphql-tag';

export const user_fragment = gql`
  fragment UserFragment on User {
    _id
    last_name
    first_name
    email
    
    posts {
      message
      comments {
        _id
        user {
          first_name
          last_name
          email
        }
        message
      }
      tags
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    user: login(email: $email, password: $password) {
      ...UserFragment
    }
  }
  ${user_fragment}
`;

export const USER = gql`
  query UserQuery {
    user {
      ...UserFragment
    }
  }
  ${user_fragment}
`;


