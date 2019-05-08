import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import styles, { CommentItemStyles } from './styles';
import MoreButtonMenu from '../MoreButtonMenu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

interface Props extends CommentItemStyles {
  message: string,
  full_name: string,

  handleEditComment?: () => void,
  handleRemoveComment?: () => void,
}

const CommentItem = (props: Props) => {
  const { classes, message, full_name, handleEditComment, handleRemoveComment } = props;
  const show_more_btn = !!(handleEditComment || handleRemoveComment);

  return (
    <ListItem alignItems='flex-start' className={props.classes.listItem}>
      <ListItemAvatar>
        <Avatar alt={full_name} src='https://picsum.photos/300/300' />
      </ListItemAvatar>
      <ListItemText
        primary={full_name}
        secondary={message}
      />
      {
        show_more_btn && (
          <div className={classes.commentIconsWrapper}>
            <MoreButtonMenu>
              <MenuList>
                {
                  props.handleEditComment && (
                    <MenuItem onClick={() => handleEditComment!()}>Edit</MenuItem>
                  )}
                {
                  props.handleRemoveComment && (
                    <MenuItem onClick={() => handleRemoveComment!()}>Remove</MenuItem>
                  )
                }
              </MenuList>
            </MoreButtonMenu>
          </div>
        )
      }
    </ListItem>
  )
};

export default withStyles(styles)(CommentItem);