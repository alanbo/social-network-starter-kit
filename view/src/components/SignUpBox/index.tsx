import React, { useState, useRef } from 'react';
import useForm from 'react-hook-form';
import { email_regex, pass_regex } from '../../constants/regex';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';
import { DatePicker } from "@material-ui/pickers";

import EmailInput from '../inputs/Email';
import PasswordInput from '../inputs/Password';
import Gender, { TGender } from '../inputs/Gender';
import TextInput from '../inputs/Text';
import MomentUtils from '@date-io/moment';
import { birthdate_format } from '../../constants';
import * as R from 'ramda';

const moment = new MomentUtils();

export interface UserInput {
  email: string,
  password: string,
  given_name?: string,
  family_name?: string,
  nickname?: string,
  phone_number?: string,
  gender?: TGender,
  birthdate?: string
  [ix: string]: string | undefined
}

interface Props {
  // TO DO: add proper type for variables
  onSubmit: (variables: UserInput) => void,
}

export default function SignUpBox(props: Props) {
  const classes = useStyles();
  const { register, handleSubmit, watch, errors, getValues, setValue } = useForm<UserInput>();
  const gender_ref = useRef(null);
  const onSubmit = (data: UserInput) => {
    props.onSubmit(R.dissoc('password_confirm', data));
  }

  const [error, setError] = useState(false);
  const [gender, setGender] = useState<TGender>('other');

  React.useEffect(() => {
    register({ name: 'gender' })
  }, [register]);

  const [birthdate, setBirthdate] = useState<string | null>(null);

  React.useEffect(() => {
    register({ name: 'birthdate' })
  }, [register]);

  function onGenderChange(val: TGender) {
    setValue('gender', val);
    setGender(val);
    console.log('val', val);

  }


  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <FormHelperText error={true}>Invalid Password Or Email</FormHelperText>}
        <EmailInput
          name='email'
          ref={register}
          error={error}
        />

        <PasswordInput
          name='password'
          ref={register}
          error={error}
        />

        <PasswordInput
          name='password_confirm'
          ref={register({
            validate: (value) => {
              return value === watch('password');
            }
          })}
          error={error}
        />

        <TextInput
          error={error}
          ref={register}
          label='Given Name'
          name='given_name'
        />

        <TextInput
          ref={register}
          error={error}
          label='Family Name'
          name='family_name'
        />

        <TextInput
          ref={register}
          error={error}
          label='Nickname'
          name='nickname'
        />

        <TextInput
          ref={register}
          error={error}
          label='Phone Number'
          name='phone_number'
        />

        <Gender
          onChange={onGenderChange}
          value={gender}
          ref={gender_ref}
          error={error}
        />

        <DatePicker
          disableFuture
          openTo="year"
          format={birthdate_format}
          label="Date of birth"
          views={["year", "month", "date"]}
          value={birthdate ? moment.parse(birthdate, birthdate_format).toDate() : null}
          onChange={date => setBirthdate(date ? date.format(birthdate_format) : '')}
          className={classes.input}
          emptyLabel={birthdate_format}
        />

        <Button
          variant="contained"
          className={classes.button}
          type='submit'
        >
          Sign Up
        </Button>
      </ form>
    </div>
  )
}