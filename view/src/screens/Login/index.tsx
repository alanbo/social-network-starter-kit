import React, { useState } from 'react';
import useStyles from './styles';
import LoginBox, { LoginVariables } from '../../components/LoginBox';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER, LOGIN } from '../../apollo/queries/client/user';
import { RouteComponentProps, Redirect, navigate } from '@reach/router';
import { LoginUser, LoginUserVariables } from '../../apollo/queries/client/__generated__/LoginUser';
import routes from '../../constants/routes';



export default (props: RouteComponentProps) => {
  const classes = useStyles();
  const [loginUser] = useMutation<LoginUser, LoginUserVariables>(LOGIN);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useQuery(GET_USER);

  if (user && user.data && user.data.getUser) {
    navigate(routes.HOME);
  }

  async function onLoginSubmit(variables: LoginVariables) {
    const result = await loginUser({ variables })

    if (result.data && result.data.loginUser && result.data.loginUser.__typename === 'Error') {
      const error = result.data.loginUser;

      console.log(error);

      if (["UserNotFoundException", "NetworkError", "NotAuthorizedException"].includes(error.code)) {
        setErrorMessage(error.message);
      }

      if (error.code === "UserNotConfirmedException") {
        navigate(routes.CONFIRM);
      }
    }
  }

  return (
    <div className={classes.login_form_outer}>
      <LoginBox onSubmit={onLoginSubmit} />
      <p>{errorMessage}</p>
    </div>
  );
};