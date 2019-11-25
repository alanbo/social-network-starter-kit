import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';
import ConfirmBox from '../../components/ConfirmBox';

export default (props: RouteComponentProps) => {
  return (
    <div>
      <div>Confirm User:</div>
      <ConfirmBox
        onSubmit={console.log}
      />
    </div>
  );
};