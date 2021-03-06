/* global chrome */

export function getCurrentTabInfo(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = (tabs && tabs.length) ? tabs[0] : {};
    const title = tab.title;
    const url = tab.url;

    callback(title, url);
  });
}

export function getBodyHtmlFn() {
  return 'document.querySelector("html").innerHTML;';
}

export function getCurrentTabSnapshot(callback) {
  const scripts = [getBodyHtmlFn()];
  const script = scripts.reduce((acc, indivScript) => {
    return acc + indivScript;
  }, '');

  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script,
  }, (data) => {
    const sourceCode = (data && data.length) ? data[0] : '';

    //  capture screenshot
    chrome.tabs.captureVisibleTab(null, {}, (image) => {
      callback(sourceCode, image);
    });
  });
}

export function getSnapshot() {
  return new Promise((resolve) => {
    getCurrentTabInfo((title, url) => {
      getCurrentTabSnapshot((sourceCode, image) => {
        resolve({ title, url, sourceCode, image });
      });
    });
  });
}

export function getActiveTabId() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const activeTab = tabs.find((tab) => tab.active);
      resolve(activeTab.id);
    });
  });
}

export function getWindowId() {
  return new Promise((resolve) => {
    chrome.windows.getCurrent((w) => {
      resolve(w.id);
    });
  });
}

export function switchToWindow(windowId) {
  chrome.windows.update(windowId, { focused: true });
}

export function switchToTab(tabId) {
  chrome.tabs.update(tabId, { active: true });
}

export function clearCache() {
  chrome.browsingData.remove(
    { since: 0 },
    {
      appcache: true,
      cache: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      pluginData: true,
      passwords: true,
      webSQL: true,
    }
  );
}

export function navigateToUrl(url) {
  chrome.tabs.update({ url });
}

//  SCENARIOS
//  clickNextVideo
//  clickAdd
//  clickOneFeatureVideo
//  search for video

export function executeScript(script) {
  //  make sure the window is focused to run script on it
  getWindowId()
    .then((windowId) => {
      return switchToWindow(windowId);
    })
    .then(() => {
      chrome.tabs.executeScript({
        code: script,
      });
    });
}
