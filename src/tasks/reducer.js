import { fromJS, List } from 'immutable';

import {
  SET_IS_ENGAGED,
  SET_TASK_MODE,
  RECEIVE_TASKS,
  SET_NEXT_TASK_ACTIVE,
  SET_TASK_SESSION,
  CHANGE_TASK_STATUS,
  MANUAL_MODE,
  AUTOMATIC_MODE,
  AUTOMATIC_MODE_RACE,
} from './action_creators';

export function getInitialState() {
  return fromJS({
    modes: [
      { id: MANUAL_MODE, name: 'manual', active: true },
      { id: AUTOMATIC_MODE, name: 'automatic', active: false },
      { id: AUTOMATIC_MODE_RACE, name: 'automatic race', active: false },
    ],
    isEngaged: false,
    tasks: [],
  });
}

export function reduceTasks(state, response) {
  const existingTasks = state.get('tasks');
  const newTasks = fromJS(response);

  //  make sure we don't get duplicates
  const tasks = newTasks.reduce((acc, task) => {
    const itemExists = acc.find((t) => {
      return t.get('id') === task.get('id');
    });
    if (!itemExists) {
      return acc.push(task);
    }

    return acc;
  }, existingTasks);

  return state.set('tasks', tasks);
}

export function setTaskMode(state, modeId) {
  const newModes = state.get('modes').map((mode) => {
    return mode.set('active', mode.get('id') === modeId);
  });
  return state.set('modes', newModes);
}

export function setEngagement(state, isEngaged) {
  return state.set('isEngaged', isEngaged);
}

export function setNextTaskActive(state) {
  console.log('setNextTaskActive');
  let newTasks = state.get('tasks');

  let activeIndex = newTasks.findIndex((t) => t.get('active', false));
  activeIndex++;

  newTasks = newTasks.map((t, i) => {
    const isQueued = t.get('status') === 1;
    const shouldBeActive = i === activeIndex;

    //  is active
    if (isQueued && shouldBeActive) {
      return t.set('active', shouldBeActive);
    } else if (shouldBeActive) {
      activeIndex++;
    }

    return t.set('active', false);
  });

  const newState = state.set('tasks', newTasks);

  //  find out if we have an active task
  const isEngaged = (activeIndex < newTasks.size);
  return setEngagement(newState, isEngaged);
}

export function clearTasks(state) {
  return state.set('tasks', List());
}

export function changeTaskStatus(state, id, status) {
  const index = state.get('tasks').findIndex((t) => t.get('id') === id);
  if (index > -1) {
    return state.setIn(['tasks', index, 'status'], status);
  }

  return state;
}

export function setTaskSession(state, id, sessionId) {
  const index = state.get('tasks').findIndex((t) => t.get('id') === id);
  if (index > -1) {
    return state.setIn(['tasks', index, 'session'], sessionId);
  }

  return state;
}

export default function(state = getInitialState(), action) {
  let newState;

  switch (action.type) {
    case RECEIVE_TASKS:
      newState = reduceTasks(state, action.response);
      return newState;
    case SET_TASK_MODE:
      newState = setTaskMode(state, action.mode);

      //  if manual mode, clear tasks
      if (action.mode === MANUAL_MODE) {
        newState = clearTasks(newState);
      }

      return newState;
    case SET_NEXT_TASK_ACTIVE:
      return setNextTaskActive(state);
    case SET_IS_ENGAGED:
      return state.set('isEngaged', action.isEngaged);
    case CHANGE_TASK_STATUS:
      return changeTaskStatus(state, action.id, action.status);
    case SET_TASK_SESSION:
      return setTaskSession(state, action.id, action.sessionId);
    default:
      return state;
  }
}
