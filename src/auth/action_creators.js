import Cookies from 'js-cookie';

import { NAME_COOKIE_NAME, TOKEN_COOKIE_NAME } from './reducer';
import { clearSnapshots } from '../snapshots/action_creators';
import { clearSessions } from '../sessions/action_creators';
import { raiseError } from '../errors/action_creators';
import * as dao from './dao.js';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const LOGOUT = 'LOGOUT';

export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
  };
}

export function receiveLogin(response) {
  return {
    type: RECEIVE_LOGIN,
    response,
  };
}

export function login(username, password) {
  return (dispatch) => {
    dispatch(requestLogin());
    dao.fetch(username, password)
      .then((response) => {
        if (!response.token) {
          throw new Error('Login failed');
        }

        //  store cookie
        Cookies.set(TOKEN_COOKIE_NAME, response.token);
        Cookies.set(NAME_COOKIE_NAME, username);

        response.username = username;

        dispatch(clearSnapshots());
        dispatch(clearSessions());

        dispatch(receiveLogin(response || {}));
      })
      .catch((error) => {
        console.error('Login failed');
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Login failed'));
        return Promise.reject({ error });
      });
  };
}

export function logout() {
  Cookies.remove(NAME_COOKIE_NAME);
  Cookies.remove(TOKEN_COOKIE_NAME);

  return {
    type: LOGOUT,
  };
}
