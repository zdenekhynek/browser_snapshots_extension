import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function fetch(username, password) {
  const projectsUrl = 'get-token/';

  const method = 'POST';
  const body = { username, password };
  const options = { method, body };

  const url = formatUrl(projectsUrl);

  return daoFetch(url, options);
}
