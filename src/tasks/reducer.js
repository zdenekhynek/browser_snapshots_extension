import { fromJS, List } from 'immutable';

import {
  SET_TASK_MODE,
  RECEIVE_TASKS,
  MANUAL_MODE,
  AUTOMATIC_MODE,
} from './action_creators';

export function getInitialState() {
  return fromJS({
    modes: [
      { id: MANUAL_MODE, name: 'manual', active: true },
      { id: AUTOMATIC_MODE, name: 'automatic', active: false },
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
  let newTasks = state.get('tasks');

  let activeIndex = newTasks.findIndex((t) => t.get('active', false));
  activeIndex++;

  newTasks = newTasks.map((t, i) => {
    return t.set('active', i === activeIndex);
  });

  const newState = state.set('tasks', newTasks);
  return setEngagement(newState, true);
}

export function clearTasks(state) {
  return state.set('tasks', List());
}

export default function(state = getInitialState(), action) {
  let newState;

  switch (action.type) {
    case RECEIVE_TASKS:
      newState = reduceTasks(state, action.response);

      if (newState.get('tasks').size > 0 && !newState.get('isEngaged')) {
        //  we have some tasks and the extensions is not doing anything
        //  set tasks
        newState = setNextTaskActive(newState);
      }

      return newState;
    case SET_TASK_MODE:
      newState = setTaskMode(state, action.mode);

      //  if manual mode, clear tasks
      if (action.mode === MANUAL_MODE) {
        newState = clearTasks(newState);
      }

      return newState;
    default:
      return state;
  }
}
