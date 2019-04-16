import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles, { CommentListStyles } from './styles';
import { CommentsFragment_comments } from '../../graphql/operation-result-types';
import { DeepReadonly } from 'utility-types';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface Props extends CommentListStyles {
  comments: DeepReadonly<CommentsFragment_comments[]>
}

function CommentList(props: Props) {
  const { classes, comments } = props;
  return (
    <List className={classes.root}>
      {comments.map(comment => {
        const full_name = `${comment.user.first_name} ${comment.user.last_name}`

        return (
          <ListItem alignItems="flex-start" key={comment._id}>
            <ListItemAvatar>
              <Avatar alt={full_name} src="https://picsum.photos/300/300" />
            </ListItemAvatar>
            <ListItemText
              primary={full_name}
              secondary={comment.message}
            />
            <div className={classes.commentIconsWrapper}>
              <IconButton aria-label="Like" classes={{ root: classes.commentIcon }}>
                <MoreVertIcon />
              </IconButton>

              <IconButton aria-label="Like" classes={{ root: classes.commentIcon }}>
                <FavoriteIcon />
              </IconButton>
            </div>
          </ListItem>
        )
      })}
    </List>
  );
}

export default withStyles(styles)(CommentList);