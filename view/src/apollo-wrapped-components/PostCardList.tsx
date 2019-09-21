import React from 'react';
import PostCardList from '../components/PostCardList';
import { GetPosts_posts } from '../graphql/operation-result-types';
import { User } from '../apollo/types/user';

interface Props {
  posts: GetPosts_posts[],
  user: User,
  is_owner: boolean
}


export default function PostcardListApollo(props: Props) {
  // TO DO: add apollo mutations
  const onAddComment = console.log;
  const onRemoveComment = console.log;
  const onUpdateComment = console.log;
  const onUpdatePost = console.log;
  const onDeletePost = console.log;
  const onLikePost = console.log;
  const onUnlikePost = console.log;

  return (
    <PostCardList
      onAddComment={onAddComment}
      onRemoveComment={onRemoveComment}
      onUpdateComment={onUpdateComment}
      onUpdatePost={onUpdatePost}
      onDeletePost={onDeletePost}
      onLikePost={onLikePost}
      onUnlikePost={onUnlikePost}
      posts={props.posts}
      user={props.user}
      is_owner={props.is_owner}
    />
  )
}
