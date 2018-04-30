import { Map } from 'immutable';

import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';
import { startService, stopService } from './task_service';
import { getActivateAgent } from '../agents/utils';
import { getActiveTask } from './utils';
import { activateScenarioFromTask } from '../scenarios/action_creators';

export const SET_IS_ENGAGED = 'SET_IS_ENGAGED';

export function setIsEngaged(isEngaged) {
  return {
    type: SET_IS_ENGAGED,
    isEngaged,
  };
}

export const CHANGE_TASK_STATUS = 'CHANGE_TASK_STATUS';

export function changeTaskStatus(status) {
  return (dispatch, getState) => {
    const { auth, tasks } = getState();
    const token = auth.get('token');

    const activeTask = getActiveTask(tasks);

    if (activeTask) {
      const id = activeTask.get('id');
      dao.changeStatus(id, status, token)
        .then(() => {
          dispatch({ type: CHANGE_TASK_STATUS, id, status });
        })
        .catch((error) => {
          console.error('Failed changing task status'); //  eslint-disable-line no-console, max-len
          console.error(error); //  eslint-disable-line no-console
          dispatch(raiseError('Failed changing task status'));
          return Promise.reject({ error });
        });
    }

    //  active tasks
    dispatch({ type: '' });
  };
}

export function activateScenarioForTask(tasks, dispatch) {
  //  TODO - what is extension was switched to the manual mode
  //  in the meantime
  if (tasks.get('isEngaged')) {
    //  no need to search for new ones
    stopService();

    const activeTask = getActiveTask(tasks);

    if (activeTask) {
      dispatch(activateScenarioFromTask(activeTask));

      // mark task as in progress
      dispatch(changeTaskStatus(2));
    }
  } else {
    //  there are not active tasks to work on
    //  switch engagedment and start looking for new ones
    dispatch(setIsEngaged(false));
    startService(dispatch);
  }
}

export const SET_TASK_MODE = 'SET_TASK_MODE';

export const AUTOMATIC_MODE = 'AUTOMATIC_MODE';
export const AUTOMATIC_MODE_RACE = 'AUTOMATIC_MODE_RACE';
export const MANUAL_MODE = 'MANUAL_MODE';

//  for tests shouldStartService flag
export function setTaskMode(mode, shouldStartService = true) {
  return (dispatch) => {
    dispatch({
      type: SET_TASK_MODE,
      mode,
    });

    if (shouldStartService) {
      if (mode === AUTOMATIC_MODE || mode === AUTOMATIC_MODE_RACE) {
        startService(dispatch);
      } else {
        stopService();
      }
    }
  };
}

export const SET_NEXT_TASK_ACTIVE = 'SET_NEXT_TASK_ACTIVE';

export function setNextTaskActive() {
  return {
    type: SET_NEXT_TASK_ACTIVE,
  };
}

export const REQUEST_TASKS = 'REQUEST_TASKS';
export const RECEIVE_TASKS = 'RECEIVE_TASKS';

export function requestTasks() {
  return {
    type: REQUEST_TASKS,
  };
}

export function receiveTasks(response) {
  return {
    type: RECEIVE_TASKS,
    response,
  };
}

export function fetchTasks() {
  return (dispatch, getState) => {
    const { auth, agents } = getState();

    //  get active agent
    const agent = getActivateAgent(agents);
    const agentId = agent.get('id', 0);
    const token = auth.get('token');

    //  find out which type of tasks to fetch
    const modes = getState().tasks.get('modes');
    const activeMode = modes.find((m) => m.get('active'), null, Map());
    const type = (activeMode.get('id') === AUTOMATIC_MODE_RACE) ? 1 : 2;

    dispatch(requestTasks());
    dao.fetch(agentId, token, type)
      .then((response) => {
        dispatch(receiveTasks(response || {}));

        let tasks = getState().tasks;
        if (response.length > 0 && !tasks.get('isEngaged')) {
          //  we have some new tasks and the extensions is not doing anything
          //  active first task
          dispatch(setNextTaskActive());

          tasks = getState().tasks;

          //  do we need to update scenario
          activateScenarioForTask(tasks, dispatch);
        }
      })
      .catch((error) => {
        console.error('Failed getting tasks'); //  eslint-disable-line no-console, max-len
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed getting tasks'));
        return Promise.reject({ error });
      });
  };
}

export const SET_TASK_SESSION = 'SET_TASK_SESSION';

export function setTaskSession(sessionId) {
  return (dispatch, getState) => {
    const { auth, tasks } = getState();

    const token = auth.get('token');

    const activeTask = getActiveTask(tasks);

    if (activeTask) {
      const id = activeTask.get('id');
      dao.changeSessionId(id, sessionId, token)
        .then(() => {
          dispatch({ type: SET_TASK_SESSION, sessionId });
        })
        .catch((error) => {
          console.error('Failed changing task session id'); //  eslint-disable-line no-console, max-len
          console.error(error); //  eslint-disable-line no-console
          dispatch(raiseError('Failed changing task session'));
          return Promise.reject({ error });
        });
    }
  };
}

