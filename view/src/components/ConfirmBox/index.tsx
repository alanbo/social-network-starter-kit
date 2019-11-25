import React from 'react';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';
import useForm from 'react-hook-form';
import { email_regex, pass_regex } from '../../constants/regex';

import TextInput from '../inputs/Text';


export interface ConfirmVariables {
  code: string
}

interface Props {
  onSubmit: (variables: ConfirmVariables) => void,
  error?: boolean
}

export default function LoginBox(props: Props) {
  const classes = useStyles();
  const { register, handleSubmit, watch, errors } = useForm<ConfirmVariables>();

  const error = props.error || Object.values(errors).some(val => !!val);

  return (
    <div className={classes.confirm_form_wrapper}>
      <form onSubmit={handleSubmit(props.onSubmit)}>

        {error && <FormHelperText error={true}>Invalid confirmation code</FormHelperText>}
        <TextInput
          ref={register({ required: true, pattern: /[0-9]{6}/ })}
          name='code'
          error={errors.code}
          label='Confirmation Code'
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