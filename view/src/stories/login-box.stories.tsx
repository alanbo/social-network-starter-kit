import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LoginBox from '../components/LoginBox';


storiesOf('LoginBox', module)
  .add('standard', () => <LoginBox
    onSubmit={action('submit')}
  />);
