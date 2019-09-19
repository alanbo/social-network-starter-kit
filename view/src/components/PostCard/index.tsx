import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommentList from '../CommentList';
import CommentInput from '../TextInput';
import MoreButtonMenu from '../MoreButtonMenu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import TextInput from '../TextInput';
import { User } from '../../apollo/client-schema';

import {
  AddCommentVariables,
  CommentsFragment_comments,
  RemoveCommentVariables,
  UpdateCommentVariables,
  LikePostVariables,
  UnlikePostVariables
} from '../../graphql/operation-result-types'

import styles, { PostCardStyles } from './styles';
import { DeepReadonly, $PropertyType } from 'utility-types';

interface BaseProps extends PostCardStyles {
  post_id: string,
  text: string,
  author: string,
  date: Date,
  comments: DeepReadonly<CommentsFragment_comments[]>,
  user: User,
  liked: boolean,
  onAddComment: (variables: AddCommentVariables) => void,
  onRemoveComment: (variables: RemoveCommentVariables) => void,
  onEditComment: (variables: UpdateCommentVariables) => void,
  onLikePost: () => void,
  onUnlikePost: () => void,
}

interface OwnerProps extends BaseProps {
  is_post_owner: true,
  onEditPost: (message: string) => void,
  onRemovePost: () => void
}

interface RegProps extends BaseProps {
  is_post_owner?: false
}

type Props = OwnerProps | RegProps;

interface State {
  expanded: boolean,
  is_edited: boolean
}

export class PostCard extends React.Component<Props, State> {
  state = {
    expanded: false,
    is_edited: false
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  onCommentSubmit = (message: string) => {
    this.props.onAddComment({ post_id: this.props.post_id, message });
  }

  onRemoveComment = (comment_id: string) => {
    const { post_id, onRemoveComment } = this.props;

    onRemoveComment({ post_id, comment_id });
  }

  onEditComment = (comment_id: string, message: string) => {
    const { post_id, onEditComment } = this.props;

    onEditComment({
      post_id,
      comment_id,
      message
    });
  }

  onEditPost = (message: string) => {
    if (this.props.is_post_owner) {
      this.props.onEditPost(message);
      this.setState({ is_edited: false });
    }
  }

  onRemovePost = () => {
    this.props.is_post_owner && this.props.onRemovePost();
  }

  onLikeClick() {
    if (this.props.liked) {
      this.props.onUnlikePost();
    } else {
      this.props.onLikePost();
    }
  }

  render() {
    const { classes, text, author, date, comments, user, is_post_owner, liked } = this.props;

    if (!user) {
      return null;
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          classes={{ avatar: classes.avatarRoot }}
          avatar={
            <Avatar aria-label="Author" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            is_post_owner && !this.state.is_edited && (
              <MoreButtonMenu>
                <MenuList>
                  <MenuItem onClick={() => this.setState({ is_edited: true })}>Edit</MenuItem>
                  <MenuItem onClick={this.onRemovePost}>Remove</MenuItem>
                </MenuList>
              </MoreButtonMenu>
            )
          }
          title={author}
          subheader={date.toDateString()}
        />
        <CardContent>
          {
            this.state.is_edited ? (
              <div className={classes.textInputWrapper} >
                <TextInput
                  label='Edit Post'
                  onSubmit={this.onEditPost}
                  message={text}
                  onCancel={() => this.setState({ is_edited: false })}
                />
              </div>
            ) : <Typography align="left" component="p">{text}</Typography>
          }
        </CardContent>
        <CardActions className={classes.actions} >
          <IconButton aria-label="Like" onClick={this.onLikeClick.bind(this)}>
            <FavoriteIcon color={liked ? 'secondary' : 'inherit'} />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Comments: </Typography>
            <CommentInput
              onSubmit={this.onCommentSubmit}
              label='Add Comment'
            />
            <CommentList
              comments={comments}
              user_id={user._id}
              handleEditComment={this.onEditComment}
              handleRemoveComment={this.onRemoveComment}
              is_post_owner={false}
            />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}


export default withStyles(styles)(PostCard);