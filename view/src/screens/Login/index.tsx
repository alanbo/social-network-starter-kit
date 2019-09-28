import React from 'react';
import useStyles from './styles';
import LoginBox, { LoginVariables } from '../../components/LoginBox';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER, LOGIN } from '../../apollo/queries/client/user';
import { RouteComponentProps, Redirect, navigate } from '@reach/router';



export default (props: RouteComponentProps) => {
  const classes = useStyles();
  const [loginUser] = useMutation<unknown, LoginVariables>(LOGIN);
  const user = useQuery(GET_USER);


  if (user && user.data && user.data.getUser) {
    navigate('/');
  }

  async function onLoginSubmit(variables: LoginVariables) {
    await loginUser({ variables })
  }

  return (
    <div className={classes.login_form_outer}>
      <LoginBox onSubmit={onLoginSubmit} />
    </div>
  );
};