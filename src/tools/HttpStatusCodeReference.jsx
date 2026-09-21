import { useState } from 'react';
const CODES = [
  { code: 100, name: 'Continue', desc: 'The initial part of the request has been received and the client should continue.' },
  { code: 101, name: 'Switching Protocols', desc: 'The server is switching protocols as requested by the client (e.g. to WebSocket).' },
  { code: 103, name: 'Early Hints', desc: 'Lets the client start preloading resources while the server prepares a response.' },
  { code: 200, name: 'OK', desc: 'The request succeeded.' },
  { code: 201, name: 'Created', desc: 'The request succeeded and a new resource was created.' },
  { code: 202, name: 'Accepted', desc: 'The request was accepted for processing, but processing is not complete.' },
  { code: 204, name: 'No Content', desc: 'The request succeeded but there is no content to return.' },
  { code: 206, name: 'Partial Content', desc: 'Only part of the resource is returned, as requested via a Range header.' },
  { code: 301, name: 'Moved Permanently', desc: 'The resource has been permanently moved to a new URL.' },
  { code: 302, name: 'Found', desc: 'The resource temporarily resides at a different URL.' },
  { code: 303, name: 'See Other', desc: 'The response can be found at another URL using a GET request.' },
  { code: 304, name: 'Not Modified', desc: 'The cached version of the resource is still valid.' },
  { code: 307, name: 'Temporary Redirect', desc: 'Like 302, but the request method must not change.' },
  { code: 308, name: 'Permanent Redirect', desc: 'Like 301, but the request method must not change.' },
  { code: 400, name: 'Bad Request', desc: 'The server could not understand the request due to invalid syntax.' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or not been provided.' },
  { code: 402, name: 'Payment Required', desc: 'Reserved for future use; occasionally used for payment/quota systems.' },
  { code: 403, name: 'Forbidden', desc: 'The client does not have access rights to the content.' },
  { code: 404, name: 'Not Found', desc: 'The server cannot find the requested resource.' },
  { code: 405, name: 'Method Not Allowed', desc: 'The request method is not supported for this resource.' },
  { code: 406, name: 'Not Acceptable', desc: 'No content matching the Accept headers was found.' },
  { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 409, name: 'Conflict', desc: 'The request conflicts with the current state of the resource.' },
  { code: 410, name: 'Gone', desc: 'The resource is no longer available and will not be available again.' },
  { code: 411, name: 'Length Required', desc: 'The request did not specify the length of its content.' },
  { code: 413, name: 'Payload Too Large', desc: 'The request entity is larger than limits the server will process.' },
  { code: 414, name: 'URI Too Long', desc: 'The requested URI is longer than the server can interpret.' },
  { code: 415, name: 'Unsupported Media Type', desc: 'The media format of the request is not supported.' },
  { code: 418, name: "I'm a teapot", desc: 'A joke status from the HTCPCP protocol; the server refuses to brew coffee.' },
  { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but contains semantic errors.' },
  { code: 425, name: 'Too Early', desc: 'The server is unwilling to risk processing a request that might be replayed.' },
  { code: 429, name: 'Too Many Requests', desc: 'The client has sent too many requests in a given time (rate limiting).' },
  { code: 431, name: 'Request Header Fields Too Large', desc: 'The request header fields are too large.' },
  { code: 451, name: 'Unavailable For Legal Reasons', desc: 'The resource is unavailable due to a legal demand.' },
  { code: 500, name: 'Internal Server Error', desc: 'The server encountered an unexpected condition.' },
  { code: 501, name: 'Not Implemented', desc: 'The server does not support the functionality required.' },
  { code: 502, name: 'Bad Gateway', desc: 'The server, acting as a gateway, received an invalid response upstream.' },
  { code: 503, name: 'Service Unavailable', desc: 'The server is not ready to handle the request (overloaded or down).' },
  { code: 504, name: 'Gateway Timeout', desc: 'The server, acting as a gateway, did not get a response in time.' },
  { code: 505, name: 'HTTP Version Not Supported', desc: 'The HTTP version used in the request is not supported.' },
  { code: 507, name: 'Insufficient Storage', desc: 'The server is unable to store the representation needed to complete the request.' },
  { code: 511, name: 'Network Authentication Required', desc: 'The client needs to authenticate to gain network access.' }
];
const CATEGORY_LABELS = {
  1: '1xx - Informational',
  2: '2xx - Success',
  3: '3xx - Redirection',
  4: '4xx - Client Error',
  5: '5xx - Server Error'
};
export default function HttpStatusCodeReference() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = CODES.filter(
    (c) => !q || String(c.code).includes(q) || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  );
  const grouped = [1, 2, 3, 4, 5].map((cat) => ({
    cat,
    items: filtered.filter((c) => Math.floor(c.code / 100) === cat)
  })).filter((g) => g.items.length > 0);
  return (
    <div className="tool-page">
      <h1>HTTP Status Code Reference</h1>
      <p className="tool-description">
        A searchable reference table of common HTTP status codes, grouped by category (1xx-5xx),
        with a plain-language meaning for each. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="status-search">Search</label>
        <input
          id="status-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 404, redirect, unauthorized"
        />
      </div>
      {grouped.length === 0 && <p className="tool-placeholder">No matching status codes for "{query}".</p>}
      {grouped.map((g) => (
        <div key={g.cat} className="tool-panel">
          <label>{CATEGORY_LABELS[g.cat]}</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {g.items.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <code>{c.code}</code>
                    </td>
                    <td>{c.name}</td>
                    <td>{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
