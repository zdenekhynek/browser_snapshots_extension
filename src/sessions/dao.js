import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function startSession(agent, token) {
  const endpointUrl = 'sessions/';

  const method = 'POST';
  const body = { agent };
  const options = { method, body };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options, token);
}

export function stopSession(sessionId, end, token) {
  const endpointUrl = 'sessions/';

  const method = 'PATCH';
  const body = { end };
  const options = { method, body };

  const url = formatUrl(endpointUrl, sessionId);
  return daoFetch(url, options, token);
}
