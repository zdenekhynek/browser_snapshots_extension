import { Store } from 'react-chrome-redux';

export function createChromeStore() {
  //  https://github.com/tshaddix/react-chrome-redux#overview
  return new Store({
    portName: 'BROWSER_SNAPSHOTS', // communication port name
  });
}

export default function makeStore() {
  return createChromeStore();
}
