import { fetchTasks } from './action_creators';

export const CHECK_INTERVAL = 1000;

let serviceInterval;
let dispatch;

export function checkTasks() {
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
}
