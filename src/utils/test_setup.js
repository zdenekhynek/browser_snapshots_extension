import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

import reducer from '../reducer';

chai.use(chaiImmutable);

global.chrome = {
  tabs: {
    executeScript: () => {},
    update: () => {},
    query: () => {},
    onUpdated: {
      addListener: () => {},
      removeListener: () => {},
    },
  },

  //  mock react-chrome-redux
  runtime: {
    connect() {
      return {
        onMessage: {
          addListener() {},
        },
      };
    },
    onConnect: {
      addListener() {},
    },
    sendMessage(data, cb) {
      cb();
    },
    onMessage: {
      addListener() {
      },
    },
  },

  browserAction: {
    setIcon() {},
  },
};

global.API_URL = '';
global.SOCKET_URL = '';

const jsonFetch = () => Promise.resolve({});
global.fetch = () => Promise.resolve({ json: jsonFetch });

global.WebSocket = () => {};

export function createTestStore() {
  const finalCreateStore = compose(
    applyMiddleware(
      thunk,
    )
  )(createStore);

  return finalCreateStore(reducer);
}
