import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import styles, { CommentItemStyles } from './styles';
import MoreButtonMenu from '../MoreButtonMenu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import TextInput from '../TextInput';

interface Props extends CommentItemStyles {
  message: string,
  full_name: string,

  handleEditComment?: (message: string) => void,
  handleRemoveComment?: () => void,
}

interface State {
  is_edited: boolean
}

class CommentItem extends Component<Props, State> {
  state = {
    is_edited: false
  }

  onEdit(message: string) {
    if (message !== this.props.message && this.props.handleEditComment) {
      this.props.handleEditComment(message);
    }

    this.setState({ is_edited: false });
  }

  render() {
    const { classes, message, full_name, handleEditComment, handleRemoveComment } = this.props;
    const show_more_btn = !!(handleEditComment || handleRemoveComment);

    return (
      <ListItem alignItems='flex-start' className={classes.listItem}>
        <ListItemAvatar>
          <Avatar alt={full_name} src='https://picsum.photos/300/300' />
        </ListItemAvatar>

        {
          this.state.is_edited ? (
            <div className={classes.textInputWrapper} >
              <TextInput
                label='Edit Comment'
                onSubmit={this.onEdit.bind(this)}
                message={message}
                onCancel={() => this.setState({ is_edited: false })}
              />
            </div>
          )
            : (
              <ListItemText
                primary={full_name}
                secondary={message}
              />
            )
        }
        {
          show_more_btn && !this.state.is_edited && (
            <div className={classes.commentIconsWrapper}>
              <MoreButtonMenu>
                <MenuList>
                  {
                    handleEditComment && (
                      <MenuItem onClick={() => this.setState({ is_edited: true })}>Edit</MenuItem>
                    )}
                  {
                    handleRemoveComment && (
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
  }
}

export default withStyles(styles)(CommentItem);