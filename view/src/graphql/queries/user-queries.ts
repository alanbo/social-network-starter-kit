import gql from 'graphql-tag';
import { post_fragment, comments_fragment } from './post-queries';

export const user_fragment = gql`
  fragment UserFragment on User {
    _id
    last_name
    first_name
    email,
    gender,
    createdAt,
    phone_number
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
        ...PostFragment
        ...CommentsFragment
      }
    }
  }
  ${post_fragment}
  ${comments_fragment}
`;

export const CREATE_USER = gql`
  mutation CreateUser($data: UserInput!) {
    createUser(data: $data) {
      ...UserFragment
    }
  }
  ${user_fragment}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UserInputOpt!) {
    updateUser(data: $data) {
      ...UserFragment
    }
  }
  ${user_fragment}
`;


export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      ...UserFragment
    }
  }
  ${user_fragment}
`;

