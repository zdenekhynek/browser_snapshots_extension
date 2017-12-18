import { List, fromJS } from 'immutable';

import { RECEIVE_START_SESSION } from './action_creators';

export default function(state = List(), action) {
  switch (action.type) {
    case RECEIVE_START_SESSION:
      console.log('pushing new action response');
      return state.push(fromJS(action.response));
    default:
      return state;
  }
}
