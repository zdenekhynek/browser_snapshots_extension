import { getQueryString } from '../utils/query_parameters';

export function getDefaultOptions() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const defaultOpts = { headers };
  return defaultOpts;
}

export function formatUrl(endpoint, id, params = {}) {
  let url = `http://127.0.0.1:8000/${endpoint}`;
  if (id) {
    url += `/${id}`;
  }
  url += getQueryString(params);

  return url;
}

export function daoFetch(url, opts) {
  const defaultOptions = getDefaultOptions();
  const options = Object.assign({}, defaultOptions, opts);

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  console.log('options', options, defaultOptions, opts);

  return fetch(url, options).then((res) => {
    return res.json().then((obj) => obj);
  }, (err) => {
    throw new NetworkError(err);
  });
}
