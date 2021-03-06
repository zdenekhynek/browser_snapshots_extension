/* global chrome, SNAP_INTERVAL */

import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';
import { createSnapshot } from '../snapshots/action_creators';
import {
  getSnapshot,
  switchToTab,
  getActiveTabId,
} from '../utils/extension_utils.js';
import { startScenarioAlias, stopScenarioAlias } from '../aliases';

export const REQUEST_START_SESSION = 'REQUEST_START_SESSION';
export const RECEIVE_START_SESSION = 'RECEIVE_START_SESSION';
export const CLEAR_SESSIONS = 'CLEAR_SESSIONS';

export const INACTIVE_ICON = 'icon-camera-20.png';
export const ACTIVE_ICON = 'icon-camera-20-active.png';

//  after page loads, wait for a bit before taking screenshot
//  to allow for the page the fully load
export const SNAPSHOT_DELAY = 600;

let snapshotInterval;
let snapshotTimeout;
let activeSnapshots = false;
let snapshotObject = {};

export function makeSnapshot(dispatch, sessionId, agentId, recordedTabId) {
  let currentTab;

  getActiveTabId()
    .then((activeTab) => {
      //  switch to the tab where recording session
      currentTab = activeTab;
      return switchToTab(recordedTabId);
    })
    .then(() => {
      getSnapshot().then(({ title, url, sourceCode, image }) => {
        const action = createSnapshot(sessionId, agentId, title, url,
          sourceCode, image);
        dispatch(action);

        // switch back to where ever the tab was
        switchToTab(currentTab);
      });
    });
}

export function startInterval(dispatch, sessionId, agentId, recordedTabId,
  interval = 1000) {
  activeSnapshots = true;
  snapshotObject = { dispatch, sessionId, agentId, recordedTabId };

  // snapshotInterval = setInterval(() => {
  //   makeSnapshot(dispatch, sessionId, agentId, recordedTabId);
  // }, interval);

  // makeSnapshot(dispatch, sessionId, agentId, recordedTabId);
}

export function stopInterval() {
  activeSnapshots = false;

  //  clearInterval(snapshotInterval);
}


export function requestStartSession() {
  return {
    type: REQUEST_START_SESSION,
  };
}

export function receiveStartSession(response) {
  return {
    type: RECEIVE_START_SESSION,
    response,
  };
}

export function clearSessions() {
  return {
    type: CLEAR_SESSIONS,
  };
}

export function onLoadComplete(tabId, changeInfo) {
  if (changeInfo.status === 'complete') {
    if (activeSnapshots) {
      clearTimeout(snapshotTimeout);

      snapshotTimeout = setTimeout(() => {
        const { dispatch, sessionId, agentId, recordedTabId } = snapshotObject;
        makeSnapshot(dispatch, sessionId, agentId, recordedTabId);
      }, SNAPSHOT_DELAY);
    }
  }
}

export function startSession() {
  return (dispatch, getState) => {
    const { auth, agents } = getState();

    const activeAgent = agents.find((agent) => agent.get('active'));
    const agentId = activeAgent.get('id');

    //  update extension icon
    chrome.browserAction.setIcon({ path: ACTIVE_ICON });

    //  make sure we have callback
    //  TODO - do we need to do this?
    chrome.tabs.onUpdated.removeListener(onLoadComplete);
    chrome.tabs.onUpdated.addListener(onLoadComplete);

    getActiveTabId().then((activeTabId) => {
      //  SCENARIO - add scenario id
      dispatch(requestStartSession());
      dao.startSession(agentId, auth.get('token'))
        .then((response) => {
          response.recordedTabId = activeTabId;
          dispatch(receiveStartSession(response || {}));

          startInterval(dispatch, response.id, agentId, activeTabId,
            SNAP_INTERVAL);

          dispatch(startScenarioAlias(response.id));
        })
        .catch((error) => {
          console.error(error); //  eslint-disable-line no-console
          dispatch(raiseError(`Failed starting session:${error}`));
          return Promise.reject({ error });
        });
    }).catch();
  };
}

export const REQUEST_STOP_SESSION = 'REQUEST_STOP_SESSION';
export const RECEIVE_STOP_SESSION = 'RECEIVE_STOP_SESSION';

export function requestStopSession() {
  return {
    type: REQUEST_STOP_SESSION,
  };
}

export function receiveStopSession(response) {
  return {
    type: RECEIVE_STOP_SESSION,
    response,
  };
}

export function stopSession(sessionId, end) {
  return (dispatch, getState) => {
    const { auth } = getState();

    //  update extension icon
    chrome.browserAction.setIcon({ path: INACTIVE_ICON });

    dispatch(requestStopSession());
    dao.stopSession(sessionId, end, auth.get('token'))
      .then((response) => {
        dispatch(receiveStopSession(response || {}));
        stopInterval();

        dispatch(stopScenarioAlias());
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed stopping session'));
        return Promise.reject({ error });
      });
  };
}
