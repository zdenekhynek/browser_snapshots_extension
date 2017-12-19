import { List, Map } from 'immutable';

import { RAISE_ERROR, HIDE_ERROR } from './action_creators';

export function getInitialState() {
  return Map({
    displayedError: false,
    error: '',
  });
}

export function reduceError(state, action) {
  return state.set('displayedError', true).set('error', action.msg);
}

export default function(state = getInitialState(), action) {
  console.log('reducer initial state');
  switch (action.type) {
    case RAISE_ERROR:
      return reduceError(state, action);
      break;
    case HIDE_ERROR:
      return state.set('displayedError', false);
    default:
      return state;
  }
}
