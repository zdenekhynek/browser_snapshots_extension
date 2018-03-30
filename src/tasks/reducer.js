import { fromJS } from 'immutable';

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
    isEngaged: true,
    tasks: [],
  });
}

export function reduceTasks(state, response) {
  return state.set('tasks', fromJS(response));
}

export function setTaskMode(state, taskMode) {
  const newModes = state.modes.map((mode) => {
    return mode.set('active', mode.get('id') === taskMode);
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

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case RECEIVE_TASKS:
      let newState = reduceTasks(state, action.response);

      if (newState.get('list').size > 0 && !newState.set('isEngaged')) {
        //  we have some tasks and the extensions is not doing anything
        //  set tasks
        newState = setTaskActive(state);
      }

      return newState;
    case SET_TASK_MODE:
      return setTaskMode(state, action.taskMode);
    default:
      return state;
  }
}
