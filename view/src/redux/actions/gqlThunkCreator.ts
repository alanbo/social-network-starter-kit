import { client } from '../../index';
import { ApolloQueryResult } from 'apollo-client';
import types from './types';
import { ThunkAction } from 'redux-thunk';
import { $Values } from 'utility-types';

type Types = $Values<typeof types>;

interface ErrorAction<T extends Types> {
  type: 'ERROR',
  meta: {
    type: T,
    id: number
  }
}

interface LoadingAction<T extends Types> {
  type: 'LOADING',
  meta: {
    type: T,
    id: number
  }
}

interface LoadingCancelAction<T extends Types> {
  type: 'LOADING_CANCEL',
  meta: {
    type: T,
    id: number
  }
}

interface GqlAction<T extends Types, Q> {
  type: T,
  payload: Q,
  meta: {
    id: number
  }
}

type ActionType<T extends Types, Q> = ErrorAction<T>
  | ErrorAction<T>
  | LoadingAction<T>
  | LoadingCancelAction<T>
  | GqlAction<T, Q>;


// initial value to incremental id that uniquely identifies each action. 
let id_counter = 0;

export default function gqlThunkCreator<Q, V>(
  opts: {
    query?: any,
    mutation?: any
    type: Types
  }
) {
  // helps to uniquely identify each action.
  const id = id_counter++;

  type Thunk = (variables: V) => ThunkAction<void, {}, null, ActionType<typeof opts.type, Q>>


  const thunk: Thunk = (variables: V) => async dispatch => {
    dispatch({
      type: 'LOADING',
      meta: { type: opts.type, id }
    });

    try {
      let query: Promise<ApolloQueryResult<Q>>;

      if (opts.query) {
        query = client.query({ query: opts.query, variables });
      } else {
        query = client.mutate({ mutation: opts.mutation });
      }

      const { data: payload } = await query;

      dispatch({
        type: opts.type,
        payload,
        meta: { id }
      });

    } catch (e) {
      dispatch({
        type: 'ERROR',
        payload: e,
        meta: { type: opts.type, id }
      })
    }

    dispatch({
      type: 'LOADING_CANCEL',
      meta: { type: opts.type, id }
    });
  }

  return thunk;
};