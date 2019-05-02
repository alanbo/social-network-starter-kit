import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, object, date, boolean } from '@storybook/addon-knobs';
import PostCard from '../components/PostCard';
import { UserQuery_user } from '../graphql/operation-result-types';
import { text_content, default_date, comments, user } from './data/post-card.data';


function myDateKnob(name: string, defaultValue: Date) {
  const stringTimestamp = date(name, defaultValue)
  return new Date(stringTimestamp)
}

storiesOf('PostCard', module)
  .addDecorator(withKnobs)
  .add('standard', () => (
    <PostCard
      author={text('Author', 'Benjamin Franklin')}
      text={text('Text Content', text_content)}
      date={myDateKnob('Created At', default_date)}
      comments={object('Comments', comments)}
      onAddComment={action('Add Comment')}
      onRemoveComment={action('Remove Comment')}
      post_id={text('ID', 'a26b84b7-a498-4231-9280-bf820ab5c43e')}
      user={object('User', user) as UserQuery_user}
    />
  ))
  .add('post owner post', () => (
    <PostCard
      author={text('Author', 'Benjamin Franklin')}
      text={text('Text Content', text_content)}
      date={myDateKnob('Created At', default_date)}
      comments={object('Comments', comments)}
      onAddComment={action('Add Comment')}
      onRemoveComment={action('Remove Comment')}
      post_id={text('ID', 'a26b84b7-a498-4231-9280-bf820ab5c43e')}
      user={object('User', user) as UserQuery_user}
      is_post_owner={boolean('Is Post Owner', true)}
    />
  ));