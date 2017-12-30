import { Store } from 'react-chrome-redux';

export let store;

export function createChromeStore() {
  //  https://github.com/tshaddix/react-chrome-redux#overview
  return new Store({
    portName: 'BROWSER_SNAPSHOTS', // communication port name
  });
}

export default function makeStore() {
  store = createChromeStore();
  return store;
}
