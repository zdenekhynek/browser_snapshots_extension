import { getTasks } from './action_creators';

export const CHECK_INTERVAL = 1000;

let serviceInterval;
let dispatch;

export function checkTasks() {
  dispatch(getTasks());
}

export function startService(dispatchRef) {
  dispatch = dispatchRef;
  serviceInterval = setInterval(checkTasks, CHECK_INTERVAL);
}


export function stopService() {
  clearInterval(serviceInterval);
}
