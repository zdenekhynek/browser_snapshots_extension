import { fetchTasks } from './action_creators';

export const CHECK_INTERVAL = 1000;

let serviceInterval;
let dispatch;

export function checkTasks() {
  //  select type of task to fetch
  dispatch(fetchTasks());
}

export function stopService() {
  clearInterval(serviceInterval);
}

export function startService(dispatchRef) {
  dispatch = dispatchRef;

  //  just in case the old is still running
  stopService();

  serviceInterval = setInterval(checkTasks, CHECK_INTERVAL);

  //  check for tasks immediatelly
  checkTasks();
}
