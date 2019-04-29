import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import CommentInput from '../components/CommentInput';


storiesOf('CommentInput', module)
  .add('standard', () => <CommentInput onSubmit={action('submit')} />);
