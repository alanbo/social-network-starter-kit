import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, object } from '@storybook/addon-knobs';

import CommentItem from '../components/CommentItem';
import { comments } from './data/comment-list.data';

const comment = comments[0];
const full_name = `${comment.user.first_name} ${comment.user.last_name}`;


storiesOf('CommentItem', module)
  .addDecorator(withKnobs)
  .add('standard', () => {

    return (
      <CommentItem
        full_name={text('Full Name', full_name)}
        message={text('Message', comment.message)}
      />
    )
  })
  .add('removable', () => (
    <CommentItem
      full_name={text('Full Name', full_name)}
      handleRemoveComment={action('Remove Comment')}
      message={text('Message', comment.message)}
    />
  ))
  .add('editable & removable', () => (
    <CommentItem
      full_name={text('Full Name', full_name)}
      handleEditComment={action('Edit Comment')}
      handleRemoveComment={action('Remove Comment')}
      message={text('Message', comment.message)}
    />
  ));