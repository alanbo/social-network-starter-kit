import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, object } from '@storybook/addon-knobs';

import CommentList from '../components/CommentList';
import { comments } from './data/comment-list.data';


storiesOf('CommentList', module)
  .addDecorator(withKnobs)
  .add('standard', () => (
    <CommentList
      user_id={text('User ID:', '6039d177-8f5d-4883-83e0-3f82c1b4fxxx')}
      comments={object('Comments Array:', comments)}
      handleEditComment={action('Edit Comment')}
      handleRemoveComment={action('Remove Comment')}
      is_post_owner={false}
    />
  ))
  .add('comment owner', () => (
    <CommentList
      user_id={text('User ID:', '6039d177-8f5d-4883-83e0-3f82c1b4f392')}
      comments={object('Comments Array:', comments)}
      handleEditComment={action('Edit Comment')}
      handleRemoveComment={action('Remove Comment')}
      is_post_owner={false}
    />
  ))
  .add('post owner', () => (
    <CommentList
      user_id={text('User ID:', '6039d177-8f5d-4883-83e0-3f82c1b4fxxx')}
      comments={object('Comments Array:', comments)}
      handleEditComment={action('Edit Comment')}
      handleRemoveComment={action('Remove Comment')}
      is_post_owner={true}
    />
  ));