import { Map } from 'immutable';

export function getActivateAgent(state) {
  return state.find((a) => a.get('active', false), null, Map());
}
