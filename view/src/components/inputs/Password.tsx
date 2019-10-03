
import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton'
import useStyles from './styles';

interface Props {
  onChange: (value: string) => void
  error?: boolean,
  value?: string | null,
}

export default (props: Props) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };


  return (
    <FormControl classes={{ root: classes.input }}>
      <InputLabel htmlFor='adornment-password' error={props.error}>Password</InputLabel>
      <Input
        error={props.error}
        className={classes.input}
        id='adornment-password'
        type={showPassword ? 'text' : 'password'}
        value={props.value}
        onChange={handleChangePassword}
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
}