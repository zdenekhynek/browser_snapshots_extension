import { Map } from 'immutable';

import { SET_SNAPSHOT_INTERVAL } from './action_creators';

export function getInitialState() {
  return Map({
    snapshotInterval: 1000, //  in mls
  });
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case SET_SNAPSHOT_INTERVAL:
      return state.set('snapshotInterval', action.snapshotInterval);
    default:
      return state;
  }
}
