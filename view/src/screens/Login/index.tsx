import React from 'react';
import useStyles from './styles';
import LoginBox from '../../components/LoginBox';
import { LoginVariables } from '../../graphql/operation-result-types';

export default function Login() {
  // const { classes, is_logged_in } = props;
  // if (is_logged_in) {
  //   return <Redirect to='/' />
  // }
  const classes = useStyles();

  function onLoginSubmit(variables: LoginVariables) {
    console.log(variables);
  }

  return (
    <div className={classes.login_form_outer}>
      <LoginBox onSubmit={onLoginSubmit} />
    </div>
  );
};