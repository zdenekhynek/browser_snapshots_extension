import { daoFetch, formatUrl } from '../utils/dao_helpers';

export const ENDPOINT_URL = 'tasks/';

export function fetch(agent, token, type = null) {
  //  always get queud up
  const status = 1;
  const endpointUrl = ENDPOINT_URL;

  const method = 'GET';
  const options = { method };
  const params = { agent, status };

  if (type) {
    params.type = type;
  }

  const formattedUrl = formatUrl(endpointUrl, null, params);
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

export function changeSessionId(taskId, session, token) {
  const endpointUrl = ENDPOINT_URL;

  const method = 'PATCH';
  const body = { session };
  const options = { method, body };

  const url = formatUrl(endpointUrl, taskId);
  return daoFetch(url, options, token);
}
