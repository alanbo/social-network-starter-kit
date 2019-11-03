import React from 'react';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';
import useForm from 'react-hook-form';
import EmailInput from '../inputs/Email';
import { email_regex, pass_regex } from '../../constants/regex';

import PasswordInput from '../inputs/Password';


export interface LoginVariables {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (variables: LoginVariables) => void,
  error?: boolean
}

export default function LoginBox(props: Props) {
  const classes = useStyles();
  const { register, handleSubmit, watch, errors } = useForm<LoginVariables>();

  const error = props.error || Object.values(errors).some(val => !!val);

  return (
    <div className={classes.login_form_wrapper}>
      <form onSubmit={handleSubmit(props.onSubmit)}>

        {error && <FormHelperText error={true}>Invalid Password Or Email</FormHelperText>}
        <EmailInput
          ref={register({ required: true, pattern: email_regex })}
          name='email'
          error={!!errors.email}
        />

        <PasswordInput
          ref={register({ required: true, pattern: pass_regex })}
          name='password'
          error={!!errors.password}
        />

        <Button
          variant="contained"
          className={classes.button}
          type='submit'
        >
          Login
        </Button>
      </form>
    </div>
  )
}