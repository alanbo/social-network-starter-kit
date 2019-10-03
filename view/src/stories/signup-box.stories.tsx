import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SignUpBox from '../components/SignUpBox';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


storiesOf('SignUpBox', module)
  .addDecorator(getSignUp => (<MuiPickersUtilsProvider utils={MomentUtils}>{getSignUp()}</MuiPickersUtilsProvider>))
  .add('standard', () => <SignUpBox
    onSubmit={action('submit')}
  />);
