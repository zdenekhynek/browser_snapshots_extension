import { daoFetch, formatUrl } from '../utils/dao_helpers';

export const ENDPOINT_URL = 'tasks/';

export function fetch(agent, token) {
  //  always get queud up
  const status = 1;
  const endpointUrl = ENDPOINT_URL;

  const method = 'GET';
  const options = { method };

  const formattedUrl = formatUrl(endpointUrl, null, { agent, status });
  return daoFetch(formattedUrl, options, token);
}

export function changeStatus(taskId, status, token) {
  const endpointUrl = ENDPOINT_URL;

  const method = 'PATCH';
  const body = { status };
  const options = { method, body };

  const url = formatUrl(endpointUrl, taskId);
  return daoFetch(url, options, token);
}
