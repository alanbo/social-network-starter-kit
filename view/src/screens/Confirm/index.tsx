import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';
import ConfirmBox, { ConfirmVariables } from '../../components/ConfirmBox';
import { useMutation } from '@apollo/react-hooks';
import { ConfirmUser, ConfirmUserVariables } from '../../apollo/queries/client/__generated__/ConfirmUser';
import { CONFIRM_USER } from '../../apollo/queries/client/user';

export default (props: RouteComponentProps) => {
  const [confirmUser] = useMutation<ConfirmUser, ConfirmUserVariables>(CONFIRM_USER);

  function onSubmit(variables: ConfirmUserVariables) {
    confirmUser({ variables }).then(console.log);
  };

  // CodeMismatchException

  return (
    <div>
      <div>Confirm User:</div>
      <ConfirmBox
        onSubmit={onSubmit}
      />
    </div>
  );
};