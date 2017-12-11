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

function makePostRequest(apiUrl, params) {
  console.log('making request', params);

  fetch(apiUrl, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((resp) => {
    console.log('resp', resp);
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

function saveSnapshot(title, url, source_code, image) {
  const apiUrl = 'http://127.0.0.1:8000/snapshots/';
  const params = createParams(title, url, source_code, image);

  makePostRequest(apiUrl, params);
}

function getBodyHtmlFn() {
  return 'document.querySelector("html").innerHTML;';
}

function makeUrlSnapshot(title, url) {
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
      saveSnapshot(title, url, sourceCode, image);
    });
  });
}

function makeSnapshot() {
  getCurrentTab((title, url) => {
    makeUrlSnapshot(title, url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const saveBtn = document.getElementById('saveBtn');

  let intervalId;

  saveBtn.addEventListener('click', () => {
    makeSnapshot();
  });
  startBtn.addEventListener('click', () => {
    makeSnapshot();

    intervalId = setInterval(() => {
      makeSnapshot();
    }, 1000 * 60);
  });
  stopBtn.addEventListener('click', () => {
    clearInterval(intervalId);
  });
});
