import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';

export const REQUEST_START_SESSION = 'REQUEST_START_SESSION';
export const RECEIVE_START_SESSION = 'RECEIVE_START_SESSION';

export function requestStartSession() {
  return {
    type: REQUEST_START_SESSION,
  };
}

export function receiveStartSession(response) {
  return {
    type: RECEIVE_START_SESSION,
    response,
  };
}

export function startSession(agent) {
  return (dispatch, getState) => {
    const { auth } = getState();

    dispatch(requestStartSession());
    dao.startSession(agent, auth.token)
      .then((response) => {
        dispatch(receiveStartSession(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed starting session'));
        return Promise.reject({ error });
      });
  };
}

export const REQUEST_STOP_SESSION = 'REQUEST_STOP_SESSION';
export const RECEIVE_STOP_SESSION = 'RECEIVE_STOP_SESSION';

export function requestStopSession() {
  return {
    type: REQUEST_STOP_SESSION,
  }
}

export function receiveStopSession(response) {
  return {
    type: RECEIVE_STOP_SESSION,
    response,
  };
}

export function stopSession(sessionId, end) {
  return (dispatch, getState) => {
    const { auth } = getState();

    dispatch(requestStopSession());
    dao.stopSession(sessionId, end, auth.token)
      .then((response) => {
        dispatch(receiveStopSession(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed stopping session'));
        return Promise.reject({ error });
      });
  };
}
