
import React, { useState, forwardRef } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton'
import useStyles from './styles';

interface Props {
  error?: boolean,
  name: string
}

export default forwardRef<HTMLInputElement, Props>((props, ref) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor='adornment-password' error={props.error}>Password</InputLabel>
      <Input
        error={props.error}
        name={props.name}
        className={classes.input}
        id='adornment-password'
        type={showPassword ? 'text' : 'password'}
        inputRef={ref}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='Toggle password visibility'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
});