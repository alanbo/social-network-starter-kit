import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles, { PostCardListStyles } from './styles';
import PostCard from '../PostCard';
import { GetPosts_posts } from '../../graphql/operation-result-types';
import {
  AddCommentVariables,
  RemoveCommentVariables
} from '../../graphql/operation-result-types'

import { DeepReadonly, $PropertyType } from 'utility-types';
import { AppState } from '../../redux/reducers';

interface Props extends PostCardListStyles {
  posts: DeepReadonly<GetPosts_posts[]>
  gqlAddComment: (variables: AddCommentVariables) => void,
  gqlRemoveComment: (variables: RemoveCommentVariables) => void
  user: $PropertyType<AppState, 'user'>,
}

function PostCardList(props: Props) {
  const { classes, posts, gqlAddComment, gqlRemoveComment, user } = props;

  return (
    <div className={classes.post_container}>
      {
        posts && posts.map(post => (
          <PostCard
            text={post.message}
            date={new Date(post.createdAt)}
            author={`${post.user.first_name} ${post.user.last_name}`}
            key={post._id}
            comments={post.comments || []}
            post_id={post._id}
            onAddComment={gqlAddComment}
            onRemoveComment={gqlRemoveComment}
            user={user}
            is_post_owner={!!user && user._id === post.user._id}
          />
        ))
      }
    </div>
  )
}

export default withStyles(styles)(PostCardList);