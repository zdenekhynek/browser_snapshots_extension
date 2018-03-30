import * as dao from './dao.js';
import { raiseError } from '../errors/action_creators';
import { startService, stopService } from './task_service';
import { getActivateAgent } from '../agents/utils';

export const SET_TASK_MODE = 'SET_TASK_MODE';

export const AUTOMATIC_MODE = 'AUTOMATIC_MODE';
export const MANUAL_MODE = 'MANUAL_MODE';

export function setTaskMode(mode) {
  return (dispatch) => {
    if (mode === AUTOMATIC_MODE) {
      startService(dispatch);
    } else {
      stopService();
    }

    dispatch({
      type: SET_TASK_MODE,
      mode,
    });
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

export function getTasks() {
  return (dispatch, getState) => {
    console.log('dispatching get tasks');
    const { auth, agents } = getState();

    //  get active agent
    const agent = getActivateAgent(agents);
    const agentId = agent.get('id', 0);

    dispatch(requestTasks());
    dao.getTasks(agentId, auth.get('token'))
      .then((response) => {
        dispatch(receiveTasks(response || {}));
      })
      .catch((error) => {
        console.error('Failed getting tasks'); //  eslint-disable-line no-console, max-len
        console.error(error); //  eslint-disable-line no-console
        dispatch(raiseError('Failed getting tasks'));
        return Promise.reject({ error });
      });
  };
}
