import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import NavigationFrame from '../components/NavigationFrame';
import { user } from './data/navigation-frame.data';
import { BrowserRouter as Router } from 'react-router-dom';

storiesOf('NavigationFrame', module)
  .addDecorator(withKnobs)
  .addDecorator(storyFn => <Router>{storyFn()}</Router>)
  .add('standard', () => (
    <NavigationFrame
      user={object('User', user)}
      signOut={action('Sign Out')}
      gqlLogout={action('Gql Logout')}
      loading={boolean('Is Loading', false)}
    >
      <div>NavigationFrame frame child</div>
    </NavigationFrame>
  ));