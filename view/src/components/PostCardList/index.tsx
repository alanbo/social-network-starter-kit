import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles, { PostCardListStyles } from './styles';
import { DeepReadonly } from 'utility-types';
import PostCard from '../PostCard';
import { GetPosts_posts } from '../../graphql/operation-result-types';

interface Props extends PostCardListStyles {
  posts: DeepReadonly<GetPosts_posts[]>
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
            comments={post.comments || []}
          />
        ))
      }
    </div>
  )
}

export default withStyles(styles)(PostCardList);