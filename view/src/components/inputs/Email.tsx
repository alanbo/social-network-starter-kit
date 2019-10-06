import React, { forwardRef } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useStyles from './styles';

interface Props {
  error?: boolean,
  name: string
}


export default forwardRef<HTMLInputElement, Props>((props, ref) => {
  const classes = useStyles();

  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor="input-with-icon-adornment" error={props.error}>Email</InputLabel>
      <Input
        name={props.name}
        inputRef={ref}
        error={props.error}
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        }
      />
    </FormControl>
  )
})