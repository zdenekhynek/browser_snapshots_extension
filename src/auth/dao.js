import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function fetch(username, password) {
  const endpointUrl = 'get-token/';

  const method = 'POST';
  const body = { username, password };
  const options = { method, body };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options);
}
