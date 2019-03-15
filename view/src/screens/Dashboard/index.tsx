import React, { Component } from 'react';
import UserQuery from '../../apollo-wrappers/UserQuery';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Dashboard</h1>

        <UserQuery>
          {data => {
            const { first_name, last_name } = data.user;
            return (
              <div>Hello {first_name} {last_name}</div>
            )
          }}
        </UserQuery>

      </div>
    );
  }
};