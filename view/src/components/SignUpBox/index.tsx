import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles';
import { DatePicker } from "@material-ui/pickers";

import EmailInput from '../inputs/Email';
import PasswordInput from '../inputs/Password';
import Gender, { TGender } from '../inputs/Gender';
import TextInput from '../inputs/Text';

export interface UserInput {
  email: string,
  password: string,
  given_name: string | null,
  family_name: string | null,
  nickname: string | null,
  phone_number: string | null,
  gender: string | null,
  birthdate: string | null
  [ix: string]: string | null
}

interface Props {
  // TO DO: add proper type for variables
  onSubmit: (variables: UserInput) => void,
}

export default function SignUpBox(props: Props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password_confirmation, setPasswordConfirmation] = useState<string | null>(null);
  const [given_name, setGivenName] = useState<string | null>(null);
  const [family_name, setFamilyName] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [gender, setGender] = useState<TGender>('other');
  const [birthdate, setBirthdate] = useState<string | null>(null);


  const handleChangePassword = (pass: string) => {
    setPassword(pass);
    setError(false);
  };

  const handleChangePasswordConfirmation = (pass: string) => {
    setPasswordConfirmation(pass);
    setError(false);
  };

  const handleChangeEmail = (pass: string) => {
    setEmail(pass);
    setError(false);
  };

  const handleChangeGivenName = (pass: string) => {
    setGivenName(pass);
    setError(false);
  };

  const handleChangeFamilyName = (pass: string) => {
    setFamilyName(pass);
    setError(false);
  };

  const handleChangeNickname = (pass: string) => {
    setNickname(pass);
    setError(false);
  };

  const handleChangePhone = (pass: string) => {
    setPhone(pass);
    setError(false);
  };

  const handleChangeGender = (pass: TGender) => {
    setGender(pass);
    setError(false);
  };


  return (
    <div className={classes.wrapper}>
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

      <PasswordInput
        onChange={handleChangePasswordConfirmation}
        value={password_confirmation}
        error={error}
      />

      <TextInput
        onChange={handleChangeGivenName}
        value={given_name}
        error={error}
        label='Given Name'
      />

      <TextInput
        onChange={handleChangeFamilyName}
        value={family_name}
        error={error}
        label='Family Name'
      />

      <TextInput
        onChange={handleChangeNickname}
        value={nickname}
        error={error}
        label='Nickname'
      />

      <TextInput
        onChange={handleChangePhone}
        value={phone}
        error={error}
        label='Phone Number'
      />

      <Gender
        onChange={handleChangeGender}
        value={gender}
        error={error}
      />

      <DatePicker
        disableFuture
        openTo="year"
        format="DD/MM/YYYY"
        label="Date of birth"
        views={["year", "month", "date"]}
        value={birthdate}
        onChange={date => setBirthdate(date ? date.format('YYYY-MM-DD') : null)}
        className={classes.input}
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={() => props.onSubmit({
          email,
          password,
          birthdate,
          nickname,
          given_name,
          family_name,
          phone_number: phone,
          gender
        })}
      >
        Sign Up
        </Button>
    </div>
  )
}