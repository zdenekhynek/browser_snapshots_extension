import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function fetch(agent, token) {
  const endpointUrl = 'snapshots/';

  const method = 'POST';
  const body = { agent };
  const options = { method, body };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options, token);
}
