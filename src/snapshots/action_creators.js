import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';

export const REQUEST_CREATE_SNAPSHOT = 'REQUEST_CREATE_SNAPSHOT';
export const RECEIVE_CREATE_SNAPSHOT = 'RECEIVE_CREATE_SNAPSHOT';
export const CLEAR_SNAPSHOTS = 'CLEAR_SNAPSHOTS';

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

export function clearSnapshots() {
  return {
    type: CLEAR_SNAPSHOTS,
  };
}

export function createSnapshot(session, agent, title, url, sourceCode, image) {
  return (dispatch, getState) => {
    const { auth, snapshots } = getState();

    //  do not do anything if last snapshot had the same url and title
    const lastSnapshot = snapshots.last();

    if (lastSnapshot) {
      if (
        lastSnapshot.get('agent') === agent &&
        lastSnapshot.get('title') === title &&
        lastSnapshot.get('url') === url
      ) {
        console.log('Do not track, same page'); // eslint-disable-line no-console, max-len
        return;
      }
    }

    console.log('Track, new page'); // eslint-disable-line no-console

    dispatch(requestCreateSnapshot());
    dao.createSnapshot(session, agent, title, url, sourceCode, image,
      auth.get('token'))
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
