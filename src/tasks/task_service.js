import { fetchTasks } from './action_creators';

export const CHECK_INTERVAL = 1000;

let serviceInterval;
let dispatch;

export function checkTasks() {
  dispatch(fetchTasks());
}

export function startService(dispatchRef) {
  dispatch = dispatchRef;
  serviceInterval = setInterval(checkTasks, CHECK_INTERVAL);
}


export function stopService() {
  clearInterval(serviceInterval);
}
