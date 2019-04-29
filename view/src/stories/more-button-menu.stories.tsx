import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { PopperPlacementType } from '@material-ui/core/Popper';

import MoreButtonMenu from '../components/MoreButtonMenu';

const options = [
  'bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top'
];

const wrapper_style = {
  height: '300px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}


storiesOf('MoreButtonMenu', module)
  .addDecorator(withKnobs)
  .addDecorator(storyFn => <div style={wrapper_style}>{storyFn()}</div>)
  .add('standard', () => (
    <MoreButtonMenu>
      <ul>
        <li>first item</li>
        <li>second item</li>
        <li>third item</li>
      </ul>
    </MoreButtonMenu>
  ))
  .add('custom placement', () => (
    <MoreButtonMenu placement={select('Placement', options, options[2]) as PopperPlacementType}>
      <ul>
        <li>first item</li>
        <li>second item</li>
        <li>third item</li>
      </ul>
    </MoreButtonMenu>
  ));