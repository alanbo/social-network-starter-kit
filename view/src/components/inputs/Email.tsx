import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useStyles from './styles';

interface Props {
  onChange: (value: string) => void
  error?: boolean,
  value?: string,
}

export default (props: Props) => {
  const classes = useStyles();

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };


  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor="input-with-icon-adornment" error={props.error}>Email</InputLabel>
      <Input
        error={props.error}
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        }
        onChange={handleChangeEmail}
      />
    </FormControl>
  )
}