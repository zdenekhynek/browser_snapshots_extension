import { login, logout } from './auth/action_creators';
import { startSession, stopSession } from './sessions/action_creators';
import { createSnapshot } from './snapshots/action_creators';

export const LOGIN_ALIAS = 'LOGIN_ALIAS';
export const LOGOUT_ALIAS = 'LOGOUT_ALIAS';
export const START_SESSION_ALIAS = 'START_SESSION_ALIAS';
export const STOP_SESSION_ALIAS = 'STOP_SESSION_ALIAS';
export const CREATE_SNAPSHOT_ALIAS = 'CREATE_SNAPSHOT_ALIAS';

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

export const aliases = {
  // this key is the name of the action to proxy, the value is the action
  // creator that gets executed when the proxied action is received in the
  // background
  LOGIN_ALIAS: loginAliasValue,
  LOGOUT_ALIAS: logoutAliasValue,
  START_SESSION_ALIAS: startSessionAliasValue,
  STOP_SESSION_ALIAS: stopSessionAliasValue,
  CREATE_SNAPSHOT_ALIAS: createSnapshotAliasValue,
};
