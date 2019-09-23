
import gql from 'graphql-tag';
import { post_fragment, comments_fragment } from './post';

export const user_fragment = gql`
  fragment UserFragment on User {
    _id
    family_name
    given_name
    email,
    gender,
    birthdate,
    phone_number
  }
`;

export const USER = gql`
  query UserQuery {
    user {
      ...UserFragment
    }
  }
  ${user_fragment}
`;

export const USER_FRIENDS = gql`
  query GetUserFriends {
    user {
      friends {
        _id
        given_name
        family_name
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

