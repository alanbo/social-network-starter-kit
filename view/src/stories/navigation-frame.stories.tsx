import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import NavigationFrame from '../components/NavigationFrame';
import { user } from './data/navigation-frame.data';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({});


storiesOf('NavigationFrame', module)
  .addDecorator(withKnobs)
  .addDecorator(getNavigation => (<ThemeProvider theme={theme}>{getNavigation()}</ThemeProvider>))
  .add('standard', () => (
    <NavigationFrame
      user={object('User', user)}
      signOut={action('Sign Out')}
    // loading={boolean('Is Loading', false)}
    >
      <div>NavigationFrame frame child</div>
    </NavigationFrame>
  ));