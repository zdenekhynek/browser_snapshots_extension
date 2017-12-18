import { List, Map } from 'immutable';
import Cookies from 'js-cookie';

import { RECEIVE_LOGIN } from './action_creators';

export const COOKIE_NAME = 'browser-snapshot-auth-token';

export function getStoredToken() {
  return Cookies.get(COOKIE_NAME);
}

export function getInitialState() {
  //  do we have stored token in cookie?
  const token = getStoredToken();
  const isAuthorized = !!token;

  return Map({ isAuthorized, token });
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
  switch(action.type) {
    case RECEIVE_LOGIN:
      return reduceLoginResp(state, action.response);
    default:
      return state;
  }
}
