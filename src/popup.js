import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import makeStore from './store';
import App from './app.jsx';


function init() {
  const store = makeStore();

  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>),
    document.getElementById('root')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});
