import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function createSnapshot(session, agent, title, url, source_code, image,
  token) {
  const endpointUrl = 'snapshots/';

  const method = 'POST';
  const body = { session, agent, title, url, source_code, image };
  const options = { method, body };

  const formattedUrl = formatUrl(endpointUrl);
  return daoFetch(formattedUrl, options, token);
}
