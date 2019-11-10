import React, { forwardRef } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';

interface Props {
  error?: {
    message?: string
  },
  name: string,
  label: string
}


export default forwardRef<HTMLInputElement, Props>((props, ref) => {
  const classes = useStyles();

  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor="input-with-icon-adornment" error={!!props.error}>{props.label}</InputLabel>
      <Input
        name={props.name}
        type='input'
        inputRef={ref}
        error={!!props.error}
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        }

      />
      {
        props.error && props.error.message &&
        <FormHelperText error={true}>{props.error.message}</FormHelperText>
      }
    </FormControl>
  )
})