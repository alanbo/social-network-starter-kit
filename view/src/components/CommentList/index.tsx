import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import styles, { CommentListStyles } from './styles';
import { DeepReadonly } from 'utility-types';
import MoreButtonMenu from '../MoreButtonMenu';
import { CommentsFragment_comments } from '../../graphql/operation-result-types';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

interface Props extends CommentListStyles {
  comments: DeepReadonly<CommentsFragment_comments[]>
  user_id: string,
  handleEditComment: (comment: CommentsFragment_comments) => void,
  handleRemoveComment: (comment: CommentsFragment_comments) => void,
}

function CommentList(props: Props) {
  const { classes, comments } = props;

  return (
    <List className={classes.root}>
      {comments.map(comment => {
        const full_name = `${comment.user.first_name} ${comment.user.last_name}`;
        const is_user_comment = props.user_id === comment.user._id;

        return (
          <ListItem alignItems="flex-start" key={comment._id} className={classes.listItem}>
            <ListItemAvatar>
              <Avatar alt={full_name} src="https://picsum.photos/300/300" />
            </ListItemAvatar>
            <ListItemText
              primary={full_name}
              secondary={comment.message}
            />
            <div className={classes.commentIconsWrapper}>
              <MoreButtonMenu>
                <MenuList>
                  {is_user_comment && (
                    <MenuItem onClick={() => props.handleEditComment(comment)}>Edit</MenuItem>
                  )}
                  <MenuItem onClick={() => props.handleRemoveComment(comment)}>Remove</MenuItem>
                </MenuList>
              </MoreButtonMenu>
            </div>
          </ListItem>
        )
      })}
    </List>
  );
}

export default withStyles(styles)(CommentList);