import { createComputeHandler } from '../_lib/computeHandler.js';

function parseUrl(value) {
  const url = new URL(value);
  const params = [...url.searchParams.entries()];
  return {
    href: url.href,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
    params
  };
}

function compute({ input }) {
  const value = String(input || '').trim();
  if (!value) return { parsed: null, error: '' };
  try {
    return { parsed: parseUrl(value), error: '' };
  } catch {
    return { parsed: null, error: 'Not a valid, fully-qualified URL (must include a protocol, e.g. https://).' };
  }
}

export default createComputeHandler(compute);
