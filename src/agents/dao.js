import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function fetchAgents(token) {
  const endpointUrl = 'agents/';

  const method = 'GET';
  const options = { method };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options, token);
}
