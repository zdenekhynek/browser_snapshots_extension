import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';

export const REQUEST_LIST_AGENTS = 'REQUEST_LIST_AGENTS';
export const RECEIVE_LIST_AGENTS = 'RECEIVE_LIST_AGENTS';

export function requestListAgents() {
  return {
    type: REQUEST_LIST_AGENTS,
  };
}

export function receiveListAgents(response) {
  return {
    type: RECEIVE_LIST_AGENTS,
    response,
  };
}

export function fetchAgents() {
  return (dispatch, getState) => {
    const { auth } = getState();

    dispatch(requestListAgents());
    dao.fetchAgents(auth.get('token'))
      .then((response) => {
        dispatch(receiveListAgents(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed getting agents'));
        return Promise.reject({ error });
      });
  };
}

export const ACTIVATE_AGENT = 'ACTIVATE_AGENT';

export function activateAgent(agentId) {
  return {
    type: ACTIVATE_AGENT,
    agentId,
  };
}
