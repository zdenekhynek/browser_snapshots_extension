import { Map } from 'immutable';
import Cookies from 'js-cookie';

import { RECEIVE_LOGIN, REQUEST_LOGIN, LOGOUT } from './action_creators';
import { RAISE_ERROR } from '../errors/action_creators';

export const TOKEN_COOKIE_NAME = 'browser-snapshot-auth-token';
export const NAME_COOKIE_NAME = 'browser-snapshot-auth-name';

export function getStoredToken() {
  return Cookies.get(TOKEN_COOKIE_NAME);
}

export function getStoredName() {
  return Cookies.get(NAME_COOKIE_NAME);
}

export function getInitialState() {
  //  do we have stored token in cookie?
  const token = getStoredToken();
  const isLogging = false;
  const username = getStoredName();
  const isAuthorized = !!token && token !== 'undefined';

  return Map({ isAuthorized, username, token, isLogging });
}

export function reduceLoginResp(state, response) {
  const { token, username } = response;

  let newState = state;

  if (token) {
    newState = newState
      .set('isLogging', false)
      .set('isAuthorized', true)
      .set('token', token)
      .set('username', username);
  }

  return newState;
}

export function reduceLogout(state) {
  return state
    .set('isAuthorized', false)
    .set('token', '')
    .set('username', '');
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return state.set('isLogging', true);
    case RECEIVE_LOGIN:
      return reduceLoginResp(state, action.response);
    case LOGOUT:
      return reduceLogout(state);
    case RAISE_ERROR:
      return state.set('isLogging', false);
    default:
      return state;
  }
}
