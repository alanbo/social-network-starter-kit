import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';

import EmailInput from '../inputs/Email';
import PasswordInput from '../inputs/Password';

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
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const handleChangePassword = (pass: string) => {
    setPassword(pass);
    setError(false);
  };
  const handleChangeEmail = (email: string) => {
    setEmail(email);
    setError(false);
  };

  return (
    <div className={classes.login_form_wrapper}>
      {error && <FormHelperText error={true}>Invalid Password Or Email</FormHelperText>}
      <EmailInput
        onChange={handleChangeEmail}
        value={email}
        error={error}
      />

      <PasswordInput
        onChange={handleChangePassword}
        value={password}
        error={error}
      />

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