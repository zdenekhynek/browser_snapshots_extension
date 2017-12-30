import { Map } from 'immutable';

import {
  REQUEST_START_SESSION,
  REQUEST_STOP_SESSION,
} from '../sessions/action_creators';

export function getInitialState() {
  return Map({
    sessionRunning: false,
  });
}


export default function(state = getInitialState(), action) {
  switch (action.type) {
    case REQUEST_START_SESSION:
      return state.set('sessionRunning', true);
    case REQUEST_STOP_SESSION:
      return state.set('sessionRunning', false);
    default:
      return state;
  }
}
