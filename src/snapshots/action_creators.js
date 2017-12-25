import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';

export const REQUEST_CREATE_SNAPSHOT = 'REQUEST_CREATE_SNAPSHOT';
export const RECEIVE_CREATE_SNAPSHOT = 'RECEIVE_CREATE_SNAPSHOT';

export function requestCreateSnapshot() {
  return {
    type: REQUEST_CREATE_SNAPSHOT,
  };
}

export function receiveCreateSnapshot(response) {
  return {
    type: RECEIVE_CREATE_SNAPSHOT,
    response,
  };
}

export function createSnapshot(session, agent, title, url, sourceCode, image) {
  return (dispatch, getState) => {
    const { auth, snapshots } = getState();

    //  do not do anything if last snapshot had the same url and title
    const lastSnapshot = snapshots.last();

    if (lastSnapshot) {
      if (
        lastSnapshot.agent === agent &&
        lastSnapshot.title === title &&
        lastSnapshot.url === url
      ) {
        console.log('Do not track, same page');
        return;
      }
    }

    console.log('Track, new page');

    dispatch(requestCreateSnapshot());
    dao.createSnapshot(session, agent, title, url, sourceCode, image,
      auth.token)
      .then((response) => {
        dispatch(receiveCreateSnapshot(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed creating snapshot'));
        return Promise.reject({ error });
      });
  };
}
