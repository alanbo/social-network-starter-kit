import { client } from '../../index';
import { ApolloQueryResult } from 'apollo-client';
import * as gql_types from './gql-types';
import { ThunkAction } from 'redux-thunk';
import { $Values } from 'utility-types';
import { GqlErrorAction, GqlLoadingAction, GqlLoadingCancelAction } from './gql-action-interfaces';
import { AppState } from '../reducers';

type Types = $Values<typeof gql_types>;

export interface GqlAction {
  type: Types,
  payload: any,
  meta: {
    id: number,
    variables?: any,
    state: AppState
  }
}

type ActionType = GqlErrorAction | GqlLoadingAction | GqlLoadingCancelAction | GqlAction;


// initial value to incremental id that uniquely identifies each action. 
let id_counter = 0;

export default function gqlThunkCreator(
  opts: {
    query?: any,
    mutation?: any
    type: Types,
  }
) {
  // helps to uniquely identify each action.

  type Thunk = (variables: any) => ThunkAction<void, {}, null, ActionType>


  const thunk: Thunk = (variables: any) => async (dispatch, getState) => {
    const id = id_counter++;
    const state = getState() as AppState;

    dispatch({
      type: gql_types.gql_loading,
      meta: { type: opts.type, id, state }
    });

    try {
      let query: Promise<ApolloQueryResult<any>>;

      if (opts.query) {
        query = client.query({ query: opts.query, variables });
      } else {
        query = client.mutate({ mutation: opts.mutation, variables }) as Promise<ApolloQueryResult<any>>;
      }

      const { data: payload } = await query;

      const action: ActionType = {
        type: opts.type,
        payload,
        meta: { id, state }
      };

      if (variables) {
        action.meta.variables = variables;
      }

      dispatch(action);

    } catch (e) {
      dispatch({
        type: gql_types.gql_error,
        payload: e,
        meta: { type: opts.type, id, state }
      })
    }

    dispatch({
      type: gql_types.gql_loading_cancel,
      meta: { type: opts.type, id, state }
    });
  }

  return thunk;
};