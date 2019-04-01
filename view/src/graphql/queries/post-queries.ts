import gql from 'graphql-tag';

const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    message
    tags
    user {
      email
      first_name
      last_name
    }
  }
`;

const COMMENTS_FRAGMENT = gql`
  fragment CommentsFragment on Post {
    comments {
      message
      _id
      user {
        first_name
        last_name
        _id
      }
    }
  }
`;

export const POSTS = gql`
  query GetPosts($search: String, $tags: [String!]) {
    posts(search: $search, tags: $tags) {
      ...PostFragment
      ...CommentsFragment
    }
  }
  ${POST_FRAGMENT}
  ${COMMENTS_FRAGMENT}
`;

export const ADD_POST = gql`
  mutation AddPost($data: PostInput!) {
    addPost(data: $data) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...PostFragment
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($data: PostInputUpdate!) {
    updatePost(data: $data) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const ADD_COMMENT = gql`
  mutation AddComment($post_id: ID!, $message: String!) {
    addComment(post_id: $post_id, message: $message) {
      ...CommentsFragment
    }
  }
  ${COMMENTS_FRAGMENT}
`;

export const REMOVE_COMMENT = gql`
  mutation RemoveComment(
    $post_id: ID!,
    $comment_id: ID!,
    $post_owner: Boolean
  ) {
    removeComment(
      post_id: $post_id
      comment_id: $comment_id
      post_owner: $post_owner
    ) {
      ...CommentsFragment
    }
  }
  ${COMMENTS_FRAGMENT}
`;