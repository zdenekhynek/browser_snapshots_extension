import { List, Map } from 'immutable';

import { RECEIVE_LOGIN } from './action_creators';

export function getInitialState() {
  return Map({
    isAuthorized: false,
    token: '',
  });
}

export function reduceLoginResp(state, resp) {
  let newState = state;

  if (resp.token) {
    newState = newState
      .set('isAuthorized', true)
      .set('token', resp.token);
  }

  return newState;
}

export default function(state = getInitialState(), action) {
  console.log('action', action)
  switch(action.type) {
    case RECEIVE_LOGIN:
      return reduceLoginResp(state, action.response);
    default:
      return state;
  }
}
