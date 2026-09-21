import { useState } from 'react';
const MIME_TABLE = [
  ['.aac', 'audio/aac'],
  ['.avi', 'video/x-msvideo'],
  ['.bin', 'application/octet-stream'],
  ['.bmp', 'image/bmp'],
  ['.csv', 'text/csv'],
  ['.css', 'text/css'],
  ['.doc', 'application/msword'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.gif', 'image/gif'],
  ['.gz', 'application/gzip'],
  ['.htm', 'text/html'],
  ['.html', 'text/html'],
  ['.ico', 'image/vnd.microsoft.icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript'],
  ['.json', 'application/json'],
  ['.jsonld', 'application/ld+json'],
  ['.mjs', 'text/javascript'],
  ['.mp3', 'audio/mpeg'],
  ['.mp4', 'video/mp4'],
  ['.mpeg', 'video/mpeg'],
  ['.otf', 'font/otf'],
  ['.pdf', 'application/pdf'],
  ['.php', 'application/x-httpd-php'],
  ['.png', 'image/png'],
  ['.ppt', 'application/vnd.ms-powerpoint'],
  ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['.rar', 'application/vnd.rar'],
  ['.rtf', 'application/rtf'],
  ['.sh', 'application/x-sh'],
  ['.svg', 'image/svg+xml'],
  ['.tar', 'application/x-tar'],
  ['.tif', 'image/tiff'],
  ['.tiff', 'image/tiff'],
  ['.ttf', 'font/ttf'],
  ['.txt', 'text/plain'],
  ['.wav', 'audio/wav'],
  ['.weba', 'audio/webm'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xhtml', 'application/xhtml+xml'],
  ['.xls', 'application/vnd.ms-excel'],
  ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['.xml', 'application/xml'],
  ['.zip', 'application/zip'],
  ['.7z', 'application/x-7z-compressed']
];
function lookupByExtension(ext) {
  const normalized = ext.trim().toLowerCase();
  const withDot = normalized.startsWith('.') ? normalized : `.${normalized}`;
  return MIME_TABLE.filter(([e]) => e === withDot).map(([, mime]) => mime);
}
function lookupByMime(mime) {
  const normalized = mime.trim().toLowerCase();
  return MIME_TABLE.filter(([, m]) => m === normalized).map(([e]) => e);
}
export default function MimeTypeLookup() {
  const [mode, setMode] = useState('extension');
  const [query, setQuery] = useState('.pdf');
  const results = query.trim() ? (mode === 'extension' ? lookupByExtension(query) : lookupByMime(query)) : [];
  const q = query.trim().toLowerCase();
  const suggestions = q
    ? MIME_TABLE.filter(([ext, mime]) => (mode === 'extension' ? ext.includes(q) : mime.includes(q))).slice(0, 12)
    : [];
  return (
    <div className="tool-page">
      <h1>MIME Type Lookup</h1>
      <p className="tool-description">
        Look up the common MIME type for a file extension (e.g. ".pdf"), or search in reverse from
        a MIME type to its typical file extensions. Runs entirely in your browser using a built-in
        reference table.
      </p>
      <div className="tool-controls">
        <label>
          Direction:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="extension">Extension to MIME type</option>
            <option value="mime">MIME type to extension</option>
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label htmlFor="mime-query">{mode === 'extension' ? 'File extension' : 'MIME type'}</label>
        <input
          id="mime-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'extension' ? 'e.g. .json or json' : 'e.g. application/json'}
        />
      </div>
      {query.trim() && (
        <div className="tool-panel">
          <label>Result</label>
          {results.length > 0 ? (
            <ul className="uuid-list">
              {results.map((r) => (
                <li key={r}>
                  <code>{r}</code>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tool-placeholder">No known {mode === 'extension' ? 'MIME type' : 'extension'} for "{query}".</p>
          )}
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="tool-panel">
          <label>Matching entries in the reference table</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Extension</th>
                  <th>MIME type</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map(([ext, mime]) => (
                  <tr key={ext + mime}>
                    <td>
                      <code>{ext}</code>
                    </td>
                    <td>
                      <code>{mime}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
