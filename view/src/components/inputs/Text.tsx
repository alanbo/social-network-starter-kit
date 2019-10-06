import React, { forwardRef } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import useStyles from './styles';

interface Props {
  error?: boolean,
  name: string
  label: string
}

export default forwardRef<HTMLInputElement, Props>((props, ref) => {
  const classes = useStyles();

  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor='input-with-icon-adornment' error={props.error}>{props.label}</InputLabel>
      <Input
        error={props.error}
        id='input-with-icon-adornment'
        inputRef={ref}
        name={props.name}
      />
    </FormControl>
  );
});