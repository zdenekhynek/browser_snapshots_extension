import { List, fromJS } from 'immutable';

import {
  RECEIVE_START_SESSION,
  RECEIVE_STOP_SESSION,
  CLEAR_SESSIONS,
} from './action_creators';

export function reduceStopSession(state, response) {
  return state.map((session) => {
    let newSession = session;

    if (session.get('id') === response.get('id')) {
      newSession = newSession.set('end', response.get('end'));
    }

    return newSession;
  });
}

export default function(state = List(), action) {
  switch (action.type) {
    case RECEIVE_START_SESSION:
      return state.push(fromJS(action.response));
    case RECEIVE_STOP_SESSION:
      return reduceStopSession(state, fromJS(action.response));
    case CLEAR_SESSIONS:
      return List();
    default:
      return state;
  }
}
