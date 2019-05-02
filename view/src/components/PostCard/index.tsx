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
import { AppState } from '../../redux/reducers';
import CommentList from '../CommentList';
import CommentInput from '../CommentInput';
import MoreButtonMenu from '../MoreButtonMenu';

import {
  AddCommentVariables,
  CommentsFragment_comments,
  RemoveCommentVariables,
} from '../../graphql/operation-result-types'

import styles, { PostCardStyles } from './styles';
import { DeepReadonly, $PropertyType } from 'utility-types';

interface Props extends PostCardStyles {
  post_id: string,
  text: string,
  author: string,
  date: Date,
  is_post_owner: boolean,
  comments: DeepReadonly<CommentsFragment_comments[]>,
  user: $PropertyType<AppState, 'user'>,
  onAddComment: (variables: AddCommentVariables) => void,
  onRemoveComment: (variables: RemoveCommentVariables) => void,
  // onEditComment: (variables: RemoveCommentVariables) => void
}

interface State {
  expanded: Boolean
}

export class PostCard extends React.Component<Props, State> {
  static defaultProps = {
    is_post_owner: false
  }

  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  onCommentSubmit = (message: string) => {
    this.props.onAddComment({ post_id: this.props.post_id, message });
  }

  onRemoveComment = (comment: CommentsFragment_comments) => {
    const { post_id, onRemoveComment } = this.props;

    onRemoveComment({ post_id, comment_id: comment._id });
  }

  onEditComment = (comment: CommentsFragment_comments) => {
    console.log(comment);
  }

  render() {
    const { classes, text, author, date, comments, user, is_post_owner } = this.props;

    if (!user) {
      return null;
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Author" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            is_post_owner && (
              <MoreButtonMenu>
                hey
              </MoreButtonMenu>
            )
          }
          title={author}
          subheader={date.toDateString()}
        />
        <CardContent>
          <Typography align="left" component="p">{text}</Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Like">
            <FavoriteIcon />
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
            <CommentInput onSubmit={this.onCommentSubmit} />
            <CommentList
              comments={comments}
              user_id={user._id}
              handleEditComment={this.onEditComment}
              handleRemoveComment={this.onRemoveComment}
            />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}


export default withStyles(styles)(PostCard);