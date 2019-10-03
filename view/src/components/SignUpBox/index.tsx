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
import { DatePicker } from "@material-ui/pickers";

import EmailInput from '../inputs/Email';
import PasswordInput from '../inputs/Password';
import Gender, { TGender } from '../inputs/Gender';

export interface UserInput {
  email: string,
  password: string,
  given_name: string,
  family_name: string,
  nickname: string,
  phone_number: string,
  gender: string,
  birthdate: string
  [ix: string]: string
}

interface Props {
  // TO DO: add proper type for variables
  onSubmit: (variables: any) => void,
}

interface StateCont {
  [ix: string]: string | number | Date;
}

// function stateContainer<T extends StateCont>(state: T) {
//   const internal: StateCont = {};

//   Object.keys(state).forEach(key => {
//     internal[key] = useState(state[key]);

//   });

// }

export default function SignUpBox(props: Props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [given_name, setGivenName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<TGender>('other');
  const [birthdate, setBirthdate] = useState<Date | null>(null);




  const handleChangePassword = (pass: string) => {
    setPassword(pass);
    setError(false);
  };

  const handleChangePasswordConfirmation = (pass: string) => {
    setPassword(pass);
    setError(false);
  };

  const handleChangeEmail = (pass: string) => {
    setEmail(pass);
    setError(false);
  };

  const handleChangeGender = (pass: TGender) => {
    setGender(pass);
    setError(false);
  };

  const handleBirthdateChange = (date: Date) => {
    setBirthdate(date);
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
        onChange={date => setBirthdate(date ? date.toDate() : null)}
        className={classes.input}
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={() => props.onSubmit({ email, password })}
      >
        Sign Up
        </Button>
    </div>
  )
}