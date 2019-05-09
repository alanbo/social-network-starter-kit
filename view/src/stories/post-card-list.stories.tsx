import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, object, date } from '@storybook/addon-knobs';
import PostCardList from '../components/PostCardList';
import { UserQuery_user } from '../graphql/operation-result-types';
import { posts, user } from './data/post-card-list.data';


storiesOf('PostCardList', module)
  .addDecorator(withKnobs)
  .add('standard', () => (
    <PostCardList
      onAddComment={action('Add Comment')}
      onRemoveComment={action('Remove Comment')}
      onUpdateComment={action('Update comment')}
      onDeletePost={action('Delete Post')}
      onUpdatePost={action('Update Post')}

      user={object('User', user) as UserQuery_user}
      posts={object('Posts', posts)}
    />
  ));