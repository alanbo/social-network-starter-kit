import React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import useStyles from './styles';

interface Props {
  onChange: (value: string) => void
  error?: boolean,
  value?: string | null,
  label: string
}

export default (props: Props) => {
  const classes = useStyles();

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };


  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor='input-with-icon-adornment' error={props.error}>{props.label}</InputLabel>
      <Input
        error={props.error}
        onChange={handleChangeEmail}
        value={props.value}
        id='input-with-icon-adornment'
      />
    </FormControl>
  )
}