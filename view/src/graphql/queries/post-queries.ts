import gql from 'graphql-tag';

export const post_fragment = gql`
  fragment PostFragment on Post {
    _id
    message
    tags
    createdAt
    likes {
      _id
    }

    user {
      _id
      email
      given_name
      family_name
    }
  }
`;

export const comments_fragment = gql`
  fragment CommentsFragment on Post {
    comments {
      message
      _id
      createdAt
      user {
        given_name
        family_name
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
  ${post_fragment}
  ${comments_fragment}
`;

export const ADD_POST = gql`
  mutation AddPost($data: PostInput!) {
    addPost(data: $data) {
      ...PostFragment
    }
  }
  ${post_fragment}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...PostFragment
    }
  }
  ${post_fragment}
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($data: PostInputUpdate!) {
    updatePost(data: $data) {
      ...PostFragment
    }
  }
  ${post_fragment}
`;

export const ADD_COMMENT = gql`
  mutation AddComment($post_id: ID!, $message: String!) {
    addComment(post_id: $post_id, message: $message) {
      _id
      message
      createdAt
      user {
        _id
        given_name
        family_name
        email
      }
    }
  }
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
    )
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment(
    $message: String!,
    $comment_id: ID!,
    $post_id: ID!
  ) {
    updateComment(
      message: $message,
      comment_id: $comment_id,
      post_id: $post_id
    )
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($post_id: String!) {
    likePost(post_id: $post_id)
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($post_id: String!) {
    unlikePost(post_id: $post_id)
  }
`;