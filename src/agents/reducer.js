import { List, Map, fromJS } from 'immutable';

import { RECEIVE_LIST_AGENTS, ACTIVATE_AGENT } from './action_creators';

export function activateAgent(state, agentId) {
  return state.map((agent) => {
    const active = (agent.get('id') === +agentId);
    return agent.set('active', active);
  });
}

export function reduceAgentsList(state, agents) {
  // see if agents have changed
  const activeAgentId = state.find((a) => {
    return a.get('active');
  }, null, Map()).get('id', 0);

  // activate the first agent
  let newState = fromJS(agents);

  newState = newState.map((agent) => {
    const active = (agent.get('id') === activeAgentId);
    return agent.set('active', active);
  });

  return newState;
}

export default function(state = List(), action) {
  switch (action.type) {
    case RECEIVE_LIST_AGENTS:
      return reduceAgentsList(state, action.response);
    case ACTIVATE_AGENT:
      return activateAgent(state, action.agentId);
    default:
      return state;
  }
}
