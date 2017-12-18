import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';

export default function makeStore() {
  const  finalCreateStore = compose(
    applyMiddleware(thunk)
  )(createStore);

  const store = finalCreateStore(reducer);
  return store;
}
