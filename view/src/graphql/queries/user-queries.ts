import gql from 'graphql-tag';

export const user_fragment = gql`
  fragment UserFragment on User {
    _id
    last_name
    first_name
    email
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

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const USER_FRIENDS = gql`
  query GetUserFriends {
    user {
      friends {
        _id
        first_name
        last_name
        email
      }
    }
  }
`;

export const USER_POSTS = gql`
  query GetUserPosts {
    user {
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
  }
`;

