import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function getTasks(agent, token) {
  const endpointUrl = 'tasks/';

  const method = 'GET';
  const body = { agent };
  const options = { method };

  const formattedUrl = formatUrl(endpointUrl);
  return daoFetch(formattedUrl, options, token);
}
