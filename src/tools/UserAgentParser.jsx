import { useState } from 'react';
const BROWSER_PATTERNS = [
  { name: 'Edge', regex: /Edg(?:A|iOS)?\/([\d.]+)/ },
  { name: 'Opera', regex: /(?:OPR|Opera)\/([\d.]+)/ },
  { name: 'Samsung Internet', regex: /SamsungBrowser\/([\d.]+)/ },
  { name: 'Firefox', regex: /Firefox\/([\d.]+)/ },
  { name: 'Chrome', regex: /Chrome\/([\d.]+)/ },
  { name: 'Safari', regex: /Version\/([\d.]+).*Safari/ },
  { name: 'Internet Explorer', regex: /(?:MSIE |rv:)([\d.]+)(?=.*Trident)/ }
];
const OS_PATTERNS = [
  { name: 'Windows 11/10', regex: /Windows NT 10\.0/ },
  { name: 'Windows 8.1', regex: /Windows NT 6\.3/ },
  { name: 'Windows 8', regex: /Windows NT 6\.2/ },
  { name: 'Windows 7', regex: /Windows NT 6\.1/ },
  { name: 'Windows', regex: /Windows NT/ },
  { name: 'iOS', regex: /iPhone OS ([\d_]+)/ },
  { name: 'iPadOS', regex: /CPU OS ([\d_]+)/ },
  { name: 'macOS', regex: /Mac OS X ([\d_.]+)/ },
  { name: 'Android', regex: /Android ([\d.]+)/ },
  { name: 'Chrome OS', regex: /CrOS/ },
  { name: 'Linux', regex: /Linux/ }
];
function detectDeviceType(ua) {
  if (/iPad|Tablet(?!.*Mobile)/i.test(ua)) return 'Tablet';
  if (/Mobi|iPhone|Android.*Mobile/i.test(ua)) return 'Mobile';
  return 'Desktop';
}
function parseUserAgent(ua) {
  const browserMatch = BROWSER_PATTERNS.find((p) => p.regex.test(ua));
  const browserVersion = browserMatch ? ua.match(browserMatch.regex)?.[1] : null;
  const osMatch = OS_PATTERNS.find((p) => p.regex.test(ua));
  const osVersionRaw = osMatch ? ua.match(osMatch.regex)?.[1] : null;
  const osVersion = osVersionRaw ? osVersionRaw.replace(/_/g, '.') : null;
  return {
    browser: browserMatch ? browserMatch.name : 'Unknown',
    browserVersion: browserVersion || 'Unknown',
    os: osMatch ? osMatch.name : 'Unknown',
    osVersion: osVersion || '',
    deviceType: detectDeviceType(ua)
  };
}
const SAMPLE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
export default function UserAgentParser() {
  const [input, setInput] = useState(SAMPLE_UA);
  const result = input.trim() ? parseUserAgent(input.trim()) : null;
  return (
    <div className="tool-page">
      <h1>User-Agent Parser</h1>
      <p className="tool-description">
        Paste a User-Agent string to extract the browser name/version, operating system, and
        device type. This uses heuristic regex pattern matching against common UA string formats
        (Chrome, Firefox, Safari, Edge, and common mobile patterns) - it is not a full,
        authoritative UA database and can be wrong on unusual or spoofed strings. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <button onClick={() => setInput(navigator.userAgent)}>Use my browser's UA</button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="ua-input">User-Agent string</label>
        <textarea
          id="ua-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a User-Agent string here"
          spellCheck={false}
          style={{ minHeight: '100px' }}
        />
      </div>
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Browser:</strong> {result.browser} {result.browserVersion}
          </div>
          <div>
            <strong>Operating system:</strong> {result.os} {result.osVersion}
          </div>
          <div>
            <strong>Device type:</strong> {result.deviceType}
          </div>
        </div>
      )}
    </div>
  );
}
