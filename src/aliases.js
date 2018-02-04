import { login, logout } from './auth/action_creators';
import { startSession, stopSession } from './sessions/action_creators';
import {
  startScenario,
  stopScenario,
  changeScenario,
} from './scenarios/action_creators';
import { createSnapshot } from './snapshots/action_creators';
import { fetchAgents, activateAgent } from './agents/action_creators';

export const LOGIN_ALIAS = 'LOGIN_ALIAS';
export const LOGOUT_ALIAS = 'LOGOUT_ALIAS';
export const START_SESSION_ALIAS = 'START_SESSION_ALIAS';
export const STOP_SESSION_ALIAS = 'STOP_SESSION_ALIAS';
export const CREATE_SNAPSHOT_ALIAS = 'CREATE_SNAPSHOT_ALIAS';
export const FETCH_AGENTS_ALIAS = 'FETCH_AGENTS_ALIAS';
export const ACTIVATE_AGENT_ALIAS = 'ACTIVATE_AGENT_ALIAS';
export const START_SCENARIO_ALIAS = 'START_SCENARIO_ALIAS';
export const STOP_SCENARIO_ALIAS = 'STOP_SCENARIO_ALIAS';
export const CHANGE_SCENARIO_ALIAS = 'CHANGE_SCENARIO_ALIAS';

export function loginAlias(username, password) {
  return {
    type: LOGIN_ALIAS,
    username,
    password,
  };
}

export function loginAliasValue(action) {
  return login(action.username, action.password);
}

export function logoutAlias() {
  return {
    type: LOGOUT_ALIAS,
  };
}

export function logoutAliasValue() {
  return logout();
}

export function startSessionAlias(agent) {
  return {
    type: START_SESSION_ALIAS,
    agent,
  };
}

export function startSessionAliasValue(action) {
  return startSession(action.agent);
}

export function stopSessionAlias(sessionId, end) {
  return {
    type: STOP_SESSION_ALIAS,
    sessionId,
    end,
  };
}

export function stopSessionAliasValue(action) {
  return stopSession(action.sessionId, action.end);
}

export function fetchAgentsAlias() {
  return {
    type: FETCH_AGENTS_ALIAS,
  };
}

export function fetchAgentsAliasValue() {
  return fetchAgents();
}


export function activeAgentAlias(agentId) {
  return {
    type: ACTIVATE_AGENT_ALIAS,
    agentId,
  };
}

export function activateAgentAliasValue(action) {
  return activateAgent(action.agentId);
}

export function createSnapshotAlias(session, agent, title, url, sourceCode,
  image) {
  return {
    type: CREATE_SNAPSHOT_ALIAS,
    session,
    agent,
    title,
    url,
    sourceCode,
    image,
  };
}

export function createSnapshotAliasValue(action) {
  return createSnapshot(action.session, action.agent, action.title,
    action.url, action.sourceCode, action.image);
}

export function startScenarioAlias() {
  return {
    type: START_SCENARIO_ALIAS,
  };
}

export function startScenarioAliasValue() {
  return startScenario();
}

export function stopScenarioAlias() {
  return {
    type: STOP_SCENARIO_ALIAS,
  };
}

export function stopScenarioAliasValue() {
  return stopScenario();
}

export function changeScenarioAlias(scenarioId) {
  return {
    type: CHANGE_SCENARIO_ALIAS,
    scenarioId,
  };
}

export function changeScenarioAliasValue(action) {
  return changeScenario(action.scenarioId);
}

export const aliases = {
  // this key is the name of the action to proxy, the value is the action
  // creator that gets executed when the proxied action is received in the
  // background
  LOGIN_ALIAS: loginAliasValue,
  LOGOUT_ALIAS: logoutAliasValue,
  START_SESSION_ALIAS: startSessionAliasValue,
  STOP_SESSION_ALIAS: stopSessionAliasValue,
  CREATE_SNAPSHOT_ALIAS: createSnapshotAliasValue,
  FETCH_AGENTS_ALIAS: fetchAgentsAliasValue,
  ACTIVATE_AGENT_ALIAS: activateAgentAliasValue,
  START_SCENARIO_ALIAS: startScenarioAliasValue,
  STOP_SCENARIO_ALIAS: stopScenarioAliasValue,
  CHANGE_SCENARIO_ALIAS: changeScenarioAliasValue,
};
