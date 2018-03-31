import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function fetch(agent, token) {
  //  always get queud up
  const status = 1;
  const endpointUrl = 'tasks/';

  const method = 'GET';
  const options = { method };

  const formattedUrl = formatUrl(endpointUrl, null, { agent, status });
  return daoFetch(formattedUrl, options, token);
}
