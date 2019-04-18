import { clear_error } from './types';

export interface ClearErrorAction {
  type: typeof clear_error,
  payload: string
}

export const clearNotification = (id: string): ClearErrorAction => {
  return {
    type: clear_error,
    payload: id
  }
};