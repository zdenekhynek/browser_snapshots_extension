import { applyMiddleware, createStore, compose } from 'redux';
import { alias, wrapStore } from 'react-chrome-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { aliases } from './aliases';
import reducer from './reducer';

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

export const store = finalCreateStore(reducer);

wrapStore(store, {
  portName: 'BROWSER_SNAPSHOTS',
});
