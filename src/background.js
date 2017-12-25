import { applyMiddleware, createStore, compose } from 'redux';
import { alias, wrapStore } from 'react-chrome-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import reducer from './reducer';
import { login, logout } from './auth/action_creators';

export const LOGIN_ALIAS = 'LOGIN_ALIAS';
export const LOGOUT_ALIAS = 'LOGOUT_ALIAS';

let store = null;

export function loginAlias(username, password) {
  console.log('loginAlias');
  return login(store.dispatch, username, password);
}

export function logoutAlias() {
  console.log('logoutAlias');
  return logout();
}

const aliases = {
  // this key is the name of the action to proxy, the value is the action
  // creator that gets executed when the proxied action is received in the
  // background
  LOGIN_ALIAS: loginAlias,
  LOGOUT_ALIAS: logoutAlias,
};


const logger = createLogger({
  collapsed: true,
});

const finalCreateStore = compose(
  applyMiddleware(
    alias(aliases),
    thunk,
    logger,
  )
)(createStore);

store = finalCreateStore(reducer);
console.log('store !!!', store);

wrapStore(store, {
  portName: 'BROWSER_SNAPSHOTS',
});

export default store;
