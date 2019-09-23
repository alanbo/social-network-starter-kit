import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import styles, { CommentListStyles } from './styles';
import { DeepReadonly } from 'utility-types';
import { CommentsFragment_comments } from '../../apollo/queries/api/__generated__/CommentsFragment';

import CommentItem from '../CommentItem';


interface Props extends CommentListStyles {
  comments: DeepReadonly<CommentsFragment_comments[]>
  user_id: string,
  is_post_owner: boolean,
  handleEditComment: (id: string, message: string) => void,
  handleRemoveComment: (id: string) => void,
}

function CommentList(props: Props) {
  const {
    classes,
    comments,
    handleEditComment,
    handleRemoveComment,
    user_id,
    is_post_owner
  } = props;

  return (
    <List className={classes.root}>
      {comments.map(comment => {
        const full_name = `${comment.user.given_name} ${comment.user.family_name}`;
        const is_editable = user_id === comment.user._id;
        const is_removable = is_editable || is_post_owner;

        return (
          <CommentItem
            key={comment._id}
            full_name={full_name}
            handleEditComment={is_editable ? message => handleEditComment(comment._id, message) : undefined}
            handleRemoveComment={is_removable ? () => handleRemoveComment(comment._id) : undefined}
            message={comment.message}
          />
        )
      })}
    </List>
  );
}

export default withStyles(styles)(CommentList);