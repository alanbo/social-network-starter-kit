import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';

export interface LoginVariables {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (variables: LoginVariables) => void,
}

export default function LoginBox(props: Props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError(false);
  };
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(false);
  };

  return (
    <div className={classes.login_form_wrapper}>
      {error && <FormHelperText error={true}>Invalid Password Or Email</FormHelperText>}
      <FormControl classes={{ root: classes.input }}>
        <InputLabel htmlFor="input-with-icon-adornment" error={error}>Email</InputLabel>
        <Input
          error={error}
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
          onChange={handleChangeEmail}
        />
      </FormControl>

      <FormControl classes={{ root: classes.input }}>
        <InputLabel htmlFor="adornment-password" error={error}>Password</InputLabel>
        <Input
          error={error}
          className={classes.input}
          id="adornment-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChangePassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        variant="contained"
        className={classes.button}
        onClick={() => props.onSubmit({ email, password })}
      >
        Login
        </Button>
    </div>
  )
}