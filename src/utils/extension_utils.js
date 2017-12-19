export function getCurrentTabInfo(callback) {
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

export function getBodyHtmlFn() {
  return 'document.querySelector("html").innerHTML;';
}

export function getCurrentTabSnapshot(callback) {
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
      callback(sourceCode, image);
    });
  });
}

export function getSnapshot() {
  return new Promise((resolve, reject) => {
    getCurrentTabInfo((title, url) => {
      getCurrentTabSnapshot((sourceCode, image) => {
        resolve({ title, url, sourceCode, image });
      })
    });
  });
}
