import React, { Fragment } from 'react';
import { Query } from "react-apollo";
import { USER } from '../graphql/user-queries';

interface Props {
  children: (data: any) => React.ReactNode
}

export default (props: Props) => {
  return (
    <Query query={USER}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';

        if (error) {
          if (error.message = 'NOT_LOGGED_IN') {
            return <p>You need to log in</p>;
          }
        };

        return (
          <Fragment>
            {props.children(data)}
          </Fragment>
        );
      }}
    </Query>
  )
}