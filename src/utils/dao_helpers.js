/* global API_URL */
import { getQueryString } from '../utils/query_parameters';

export function getDefaultOptions(token) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const defaultOpts = { headers };
  return defaultOpts;
}

export function formatUrl(endpoint, id, params = {}) {
  let url = `${API_URL}${endpoint}`;

  //  let url = `https://browser-snapshots.herokuapp.com/${endpoint}`;
  if (id) {
    url += `${id}/`;
  }
  url += getQueryString(params);

  return url;
}

export function daoFetch(url, opts, token = '') {
  const defaultOptions = getDefaultOptions(token);
  const options = Object.assign({}, defaultOptions, opts);

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  return fetch(url, options).then((res) => {
    return res.json().then((obj) => obj);
  }, (err) => {
    throw new Error(err);
  });
}
