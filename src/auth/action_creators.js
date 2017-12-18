import Cookies from 'js-cookie';

import { COOKIE_NAME } from './reducer';
import * as dao from './dao.js';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';

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
        //  store cookie
        Cookies.set(COOKIE_NAME, response.token);

        dispatch(receiveLogin(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  }

}
