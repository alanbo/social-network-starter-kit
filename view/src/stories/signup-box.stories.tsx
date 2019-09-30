import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SignUpBox from '../components/SignUpBox';


storiesOf('SignUpBox', module)
  .add('standard', () => <SignUpBox
  />);
