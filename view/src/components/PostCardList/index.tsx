import React, { FunctionComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles, { PostCardListStyles } from './styles';
import PostCard from '../PostCard';
import { GetPosts_posts } from '../../graphql/operation-result-types';
import {
  AddCommentVariables,
  RemoveCommentVariables,
  UpdatePostVariables,
  DeletePostVariables,
  UpdateCommentVariables
} from '../../graphql/operation-result-types'

import { DeepReadonly, $PropertyType } from 'utility-types';
import { AppState } from '../../redux/reducers';

interface Props extends PostCardListStyles {
  posts: DeepReadonly<GetPosts_posts[]>
  onAddComment: (variables: AddCommentVariables) => void,
  onRemoveComment: (variables: RemoveCommentVariables) => void,
  onUpdateComment: (variables: UpdateCommentVariables) => void
  onUpdatePost?: (variables: UpdatePostVariables) => void,
  onDeletePost?: (variables: DeletePostVariables) => void
  user: $PropertyType<AppState, 'user'>,
  is_owner: boolean
}

function PostCardList(props: Props) {
  const {
    classes,
    posts,
    onAddComment,
    onRemoveComment,
    onUpdateComment,
    onUpdatePost,
    onDeletePost,
    user,
    is_owner
  } = props;

  return (
    <div className={classes.post_container}>
      {
        posts && posts.map(post => {
          const post_card_props = {
            text: post.message,
            date: new Date(post.createdAt),
            author: `${post.user.first_name} ${post.user.last_name}`,
            key: post._id,
            comments: post.comments || [],
            post_id: post._id,
            onAddComment: onAddComment,
            onRemoveComment: onRemoveComment,
            onEditComment: onUpdateComment,
            user: user,
          }

          if (onUpdatePost && onDeletePost && is_owner) {
            return (
              <PostCard
                {...post_card_props}
                is_post_owner={true}
                onEditPost={message => onUpdatePost({
                  data: {
                    _id: post._id,
                    message
                  }
                })}
                onRemovePost={() => onDeletePost({ id: post._id })}
              />
            )
          } else {
            return (
              <PostCard
                {...post_card_props}
              />
            )
          }
        })
      }
    </div>
  )
}

export default withStyles(styles)(PostCardList);