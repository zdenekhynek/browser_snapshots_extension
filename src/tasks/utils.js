import { List } from 'immutable';

export function getActiveTask(state) {
  const tasks = state.get('tasks', List());
  return tasks.find((t) => t.get('active', false));
}
