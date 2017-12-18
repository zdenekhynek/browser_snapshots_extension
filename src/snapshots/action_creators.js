import * as dao from './dao.js';

export const REQUEST_CREATE_SNAPSHOT = 'REQUEST_CREATE_SNAPSHOT';
export const RECEIVE_CREATE_SNAPSHOT = 'RECEIVE_CREATE_SNAPSHOT';

export function requestCreateSnapshot() {
  return {
    type: REQUEST_CREATE_SNAPSHOT,
  }
}

export function receiveCreateSnapshot(response) {
  return {
    type: RECEIVE_CREATE_SNAPSHOT,
    response
  }
}

export function createSession(session, title, url) {
  return (dispatch, getState) => {
    const { auth } = getState();

    dispatch(requestCreateSnapshot());
    dao.fetch(agent, auth.get('token'))
      .then((response) => {
        dispatch(receiveCreateSnapshot(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  }
}
