import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ input }) {
  const value = String(input || '').trim();
  if (!value) return { result: null };
  return { result: parseUserAgent(value) };
}

export default createComputeHandler(compute);
