import React, { FunctionComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles, { PostCardListStyles } from './styles';
import PostCard from '../PostCard';
import { GetPosts_posts } from '../../apollo/queries/api/__generated__/GetPosts';

import { User } from '../../apollo/types/user';

import {
  AddCommentVariables,
} from '../../apollo/queries/api/__generated__/AddComment';

import {
  UpdatePostVariables
} from '../../apollo/queries/api/__generated__/UpdatePost';

import {
  DeletePostVariables
} from '../../apollo/queries/api/__generated__/DeletePost';

import {
  RemoveCommentVariables
} from '../../apollo/queries/api/__generated__/RemoveComment';

import {
  UpdateCommentVariables
} from '../../apollo/queries/api/__generated__/UpdateComment';

import {
  LikePostVariables
} from '../../apollo/queries/api/__generated__/LikePost';

import {
  UnlikePostVariables
} from '../../apollo/queries/api/__generated__/UnlikePost';


interface Props extends PostCardListStyles {
  posts: GetPosts_posts[],
  user: User,
  is_owner: boolean
  onAddComment: (variables: AddCommentVariables) => void,
  onRemoveComment: (variables: RemoveCommentVariables) => void,
  onUpdateComment: (variables: UpdateCommentVariables) => void
  onUpdatePost?: (variables: UpdatePostVariables) => void,
  onDeletePost?: (variables: DeletePostVariables) => void,
  onLikePost: (variables: LikePostVariables) => void,
  onUnlikePost: (variables: UnlikePostVariables) => void,
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
    onLikePost,
    onUnlikePost,
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
            author: `${post.user.given_name} ${post.user.family_name}`,
            key: post._id,
            comments: post.comments || [],
            post_id: post._id,
            onAddComment: onAddComment,
            onRemoveComment: onRemoveComment,
            onEditComment: onUpdateComment,
            liked: !!post.likes && post.likes.some(likedby => likedby._id === user!._id),
            onLikePost: () => onLikePost({ post_id: post._id }),
            onUnlikePost: () => onUnlikePost({ post_id: post._id }),
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