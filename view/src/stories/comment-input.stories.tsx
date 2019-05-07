import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import CommentInput from '../components/TextInput';


storiesOf('CommentInput', module)
  .addDecorator(withKnobs)
  .add('standard', () => <CommentInput
    label={text('label', 'Add Comment')}
    onSubmit={action('submit')} />);
