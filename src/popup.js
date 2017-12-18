import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import makeStore from './store';
import App from './app.jsx';

// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTab(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const title = tab.title;
    const url = tab.url;

    callback(title, url);
  });
}

function makeRequest(apiUrl, params, method = 'post') {
  console.log('making request', params);

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const options = {
    method,
    headers,
    body: JSON.stringify(params)
  };

  return fetch(apiUrl, options).then((resp) => {
    return resp.json().then((data) => {
      return data;
    });
  }).catch((err) => {
    console.error('err', err);
  });

  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', apiUrl, true);
  // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState == 4) {
  //     console.log('request finished');
  //     console.log(xhr.responseText);
  //   }
  // }

  // xhr.send(params)
}

function createParams(title, url, source_code, image) {
  return { title, url, source_code, image };
}

function saveSnapshot(agent, session, title, url, source_code, image) {
  const apiUrl = 'http://127.0.0.1:8000/snapshots/';
  const params = { agent, session, title, url, source_code, image };

  makeRequest(apiUrl, params);
}

function startSession(agent) {
  const apiUrl = 'http://127.0.0.1:8000/sessions/';
  const params = { agent };

  return makeRequest(apiUrl, params);
}

function stopSession(session, agent, end) {
  const apiUrl = `http://127.0.0.1:8000/sessions/${session}/`;
  const params = { agent, end };

  return makeRequest(apiUrl, params, 'put');
}

function getBodyHtmlFn() {
  return 'document.querySelector("html").innerHTML;';
}

function makeUrlSnapshot(agent, session, title, url) {
  const scripts = [getBodyHtmlFn()];
  const script = scripts.reduce((acc, script) => {
     return acc + script
  }, '');

  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  }, function(data) {
    const sourceCode = data[0];

    //  capture screenshot
    chrome.tabs.captureVisibleTab(null, {}, (image) => {
      saveSnapshot(agent, session, title, url, sourceCode, image);
    });
  });
}

function makeSnapshot(agent, session) {
  getCurrentTab((title, url) => {
    makeUrlSnapshot(agent, session, title, url);
  });
}

function getDate() {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

//  hardcoded agent it for now
const agent = 0;
let session;

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

  // const startBtn = document.getElementById('startBtn');
  // const stopBtn = document.getElementById('stopBtn');
  // const saveBtn = document.getElementById('saveBtn');

  // let intervalId;

  // saveBtn.addEventListener('click', () => {
  //   makeSnapshot();
  // });
  // startBtn.addEventListener('click', () => {
  //   stopBtn.disabled = false;
  //   startBtn.disabled = true;

  //   //  hardcode agent id 0
  //   startSession(agent).then((data) => {
  //     console.log('data', data);
  //     //  get newly created session id
  //     session = data.id;
  //     makeSnapshot(agent, session);

  //     intervalId = setInterval(() => {
  //       makeSnapshot(agent, session);
  //     }, 1000 * 60);
  //   });
  // });
  // stopBtn.addEventListener('click', () => {
  //   clearInterval(intervalId);
  //   stopSession(session, agent, getDate());

  //   stopBtn.disabled = true;
  //   startBtn.disabled = false;
  // });
});
