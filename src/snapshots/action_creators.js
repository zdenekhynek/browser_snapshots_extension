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

export function isDefined(obj) {
  return (typeof obj !== 'undefined');
}

export function validateSnapshot(session, agent, title, url) {
  return (
    isDefined(session) &&
    isDefined(agent) &&
    isDefined(title) &&
    isDefined(url)
  );
}

export function createSnapshot(session, agent, title, url, sourceCode, image) {
  return (dispatch, getState) => {
    const { auth, snapshots } = getState();

     console.log('agent', session, agent, title, url);

    //  do we have a valid screenshot
    const validSnapshot = validateSnapshot(session, agent, title, url);

    if (!validSnapshot) {
      //  not a valid snapshot, dispatch a empty action;
      console.log('Not a valid snapshot!!');
      dispatch({ type: '' });
      return;
    }

    console.log('Valid snapshot!!');

    //  do not do anything if last snapshot had the same url and title
    const lastSnapshot = snapshots.last();

    if (lastSnapshot) {
      console.log('lastSnapshot', lastSnapshot.toJS());
    }


    if (lastSnapshot) {
      if (
        lastSnapshot.get('session') === session &&
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
        console.error('Failed creating snapshot'); //  eslint-disable-line no-console, max-len
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed creating snapshot'));
        return Promise.reject({ error });
      });
  };
}
