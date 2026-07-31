export function getApiUrl(endpoint) {
  const cleanEndpoint = String(endpoint || '').replace(/^\//, '');
  return `/DM154/api/${cleanEndpoint}`.replace(/\/{2,}/g, '/');
}
