import React from 'react';
import useStyles from './styles';
import LoginBox from '../../components/LoginBox';
import { LoginVariables } from '../../graphql/operation-result-types';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER } from '../../apollo/resolvers';
import { RouteComponentProps, Redirect, navigate } from '@reach/router';

const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) @client {
      gender
      given_name
      _id
    }
  }
`;

export default (props: RouteComponentProps) => {
  const classes = useStyles();
  const [loginUser] = useMutation<any, LoginVariables>(LOGIN);
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