import { List, fromJS } from 'immutable';

import { RECEIVE_CREATE_SNAPSHOT, CLEAR_SNAPSHOTS } from './action_creators';

export const SNAPSHOT_LIMIT = 10;

export function reduceCreateSnapshot(state, response) {
  let newState = state.push(response);

  //  there's a limit on messaging queu
  if (newState.size > SNAPSHOT_LIMIT) {
    newState = newState.shift();
  }

  return newState;
}

export default function(state = List(), action) {
  switch (action.type) {
    case RECEIVE_CREATE_SNAPSHOT:
      return reduceCreateSnapshot(state, fromJS(action.response));
    case CLEAR_SNAPSHOTS:
      return List();
    default:
      return state;
  }
}
