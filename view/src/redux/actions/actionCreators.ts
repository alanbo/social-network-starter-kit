import { clear_error } from './types';

export interface ClearErrorAction {
  type: typeof clear_error,
  payload: number
}

export const clearError = (id: number): ClearErrorAction => {
  return {
    type: clear_error,
    payload: id
  }
};