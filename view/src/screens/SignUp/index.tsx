import React from 'react';
import useStyles from './styles';
import LoginBox, { LoginVariables } from '../../components/LoginBox';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER, SIGN_UP_USER } from '../../apollo/queries/client/user';
import { CreateAuthUserVariables, CreateAuthUser } from '../../apollo/queries/client/__generated__/CreateAuthUser';
import { RouteComponentProps, Redirect, navigate } from '@reach/router';
import SignUpBox from '../../components/SignUpBox';
import routes from '../../constants/routes';



export default (props: RouteComponentProps) => {
  const classes = useStyles();
  const [signUpUser] = useMutation<CreateAuthUser, CreateAuthUserVariables>(SIGN_UP_USER);
  const user = useQuery(GET_USER);


  if (user && user.data && user.data.getUser) {
    navigate(routes.HOME);
  }

  async function onLoginSubmit(variables: CreateAuthUserVariables) {
    const result = await signUpUser({ variables });

    if (result.data && result.data.createAuthUser === true) {
      navigate(routes.CONFIRM);
    }
  }

  return (
    <div className={classes.login_form_outer}>
      <SignUpBox onSubmit={input => onLoginSubmit({ data: input })} />
    </div>
  );
};