import { List, fromJS } from 'immutable';

import { RECEIVE_CREATE_SNAPSHOT } from './action_creators';

export default function(state = List(), action) {
  switch (action.type) {
    case RECEIVE_CREATE_SNAPSHOT:
      return state.push(fromJS(action.response));
    default:
      return state;
  }
}
