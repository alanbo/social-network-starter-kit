import { storiesOf } from '@storybook/react';
import React, { useState, Children } from 'react';
import { action } from '@storybook/addon-actions';
import Email from '../../components/inputs/Email';
import Password from '../../components/inputs/Password';
import Gender from '../../components/inputs/Gender';
import Text from '../../components/inputs/Text';

interface InputStringElemProps {
  onChange: (value: string) => void
  error?: boolean,
  value?: string,
}

interface Props {
  children: React.ReactElement<InputStringElemProps>
}



function InputStringDecorator(props: Props) {
  const [value, setValue] = useState('');

  return React.cloneElement(props.children, {
    value,
    onChange: v => {
      setValue(v);
      action('Input')(v);
    }
  })
}

storiesOf('inputs/Email', module)
  .addDecorator(getInput => (<InputStringDecorator>{getInput() as any}</InputStringDecorator>))
  // @ts-ignore
  .add('standard', () => <Email />);

storiesOf('inputs/Password', module)
  .addDecorator(getInput => (<InputStringDecorator>{getInput() as any}</InputStringDecorator>))
  // @ts-ignore
  .add('standard', () => <Password />);

storiesOf('inputs/Gender', module)
  .addDecorator(getInput => (<InputStringDecorator>{getInput() as any}</InputStringDecorator>))
  // @ts-ignore
  .add('standard', () => <Gender />);

storiesOf('inputs/Text', module)
  .addDecorator(getInput => (<InputStringDecorator>{getInput() as any}</InputStringDecorator>))
  // @ts-ignore
  .add('standard', () => <Text label='Text' />);