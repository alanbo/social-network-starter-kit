import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles, { PostCardListStyles } from './styles';
import { DeepReadonly } from 'utility-types';
import PostCard from '../PostCard';
import { PostFragment } from '../../graphql/operation-result-types';

interface Props extends PostCardListStyles {
  posts: DeepReadonly<PostFragment[]>
}

function PostCardList(props: Props) {
  const { classes, posts } = props;

  return (
    <div className={classes.post_container}>
      {
        posts && posts.map(post => (
          <PostCard
            text={post.message}
            date={new Date(post.createdAt)}
            author={`${post.user.first_name} ${post.user.last_name}`}
            key={post._id}
          />
        ))
      }
    </div>
  )
}

export default withStyles(styles)(PostCardList);