import {
  gql_error,
} from '../actions/gql-types';

import {
  clear_error
} from '../actions/types';

import {
  ClearErrorAction
} from '../actions/actionCreators';

import { DeepReadonly } from 'utility-types';


import {
  GqlErrorAction,
} from '../actions/gql-action-interfaces';

type Actions = GqlErrorAction | ClearErrorAction;

export interface Notification {
  type: 'error' | 'warning' | 'info' | 'success',
  msg: string,
  id: string
}

type NotificationState = DeepReadonly<Notification[]>;


export default function (state: NotificationState = [], action: Actions): NotificationState {
  switch (action.type) {
    case gql_error: {
      const error_item: Notification = {
        msg: action.payload.message,
        type: 'error',
        id: `gql${action.meta.id}`
      };

      const new_state = Array.from(state);
      new_state.push(error_item);

      return new_state;
    }

    case clear_error:
      return state.filter(error => error.id !== action.payload);

    default:
      return state;
  }
};
