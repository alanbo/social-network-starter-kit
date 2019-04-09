import {
  gql_error,
} from '../actions/gql-types';

import {
  clear_error
} from '../actions/types';

import {
  ClearErrorAction
} from '../actions/actionCreators';

import { $PropertyType, DeepReadonly } from 'utility-types';


import {
  GqlErrorAction,
} from '../actions/gql-action-interfaces';

type Actions = GqlErrorAction | ClearErrorAction;
interface ErrorItem extends $PropertyType<GqlErrorAction, 'meta'> {
  message: string
};

type ErrorsState = DeepReadonly<ErrorItem[]>;


export default function (state: ErrorsState = [], action: Actions): ErrorsState {
  switch (action.type) {
    case gql_error: {
      const error_item = {
        message: action.payload.message,
        ...action.meta
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
