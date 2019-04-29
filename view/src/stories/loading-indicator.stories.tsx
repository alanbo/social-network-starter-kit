import React from 'react';
import { storiesOf } from '@storybook/react';
import LoadingIndicator from '../components/LoadingIndicator';

storiesOf('LoadingIndicator', module)
  .add('standard', () => <LoadingIndicator />);