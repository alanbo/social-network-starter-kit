import {
  gql_loading,
  gql_loading_cancel
} from '../actions/gql-types';

import { $PropertyType, DeepReadonly } from 'utility-types';


import {
  GqlLoadingAction,
  GqlLoadingCancelAction
} from '../actions/gql-action-interfaces';

type Actions = GqlLoadingAction | GqlLoadingCancelAction;
type LoadingState = DeepReadonly<$PropertyType<GqlLoadingAction, 'meta'>[]>;


export default function (state: LoadingState = [], action: Actions): LoadingState {
  switch (action.type) {
    case gql_loading: {
      const new_state = Array.from(state);
      new_state.push(action.meta);

      return new_state;
    }

    case gql_loading_cancel:
      return state.filter(meta => meta.id !== action.meta.id);

    default:
      return state;
  }
};
