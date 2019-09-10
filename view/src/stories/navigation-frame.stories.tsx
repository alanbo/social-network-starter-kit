import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import NavigationFrame from '../components/NavigationFrame';
import { user } from './data/navigation-frame.data';

storiesOf('NavigationFrame', module)
  .addDecorator(withKnobs)
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