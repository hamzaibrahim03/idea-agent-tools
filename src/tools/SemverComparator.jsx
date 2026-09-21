import { useState } from 'react';
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?(?:\+([0-9A-Za-z-.]+))?$/;
function parseSemver(input) {
  const match = SEMVER_RE.exec(input.trim());
  if (!match) throw new Error(`"${input}" is not a valid semantic version`);
  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ? prerelease.split('.') : []
  };
}
function compareIdentifier(a, b) {
  const aNum = /^\d+$/.test(a);
  const bNum = /^\d+$/.test(b);
  if (aNum && bNum) return Number(a) - Number(b);
  if (aNum && !bNum) return -1;
  if (!aNum && bNum) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}
function comparePrerelease(a, b) {
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1;
  if (b.length === 0) return -1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (i >= a.length) return -1;
    if (i >= b.length) return 1;
    const cmp = compareIdentifier(a[i], b[i]);
    if (cmp !== 0) return cmp;
  }
  return 0;
}
function compareSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  return comparePrerelease(a.prerelease, b.prerelease);
}
export default function SemverComparator() {
  const [versionA, setVersionA] = useState('1.2.3');
  const [versionB, setVersionB] = useState('2.0.0-beta.1');
  let result = null;
  let error = '';
  try {
    const parsedA = parseSemver(versionA);
    const parsedB = parseSemver(versionB);
    const cmp = compareSemver(parsedA, parsedB);
    result = { cmp, parsedA, parsedB };
  } catch (e) {
    error = e.message;
  }
  function reasonFor(cmp, a, b) {
    if (cmp === 0) return 'Both versions are equal in precedence.';
    if (a.major !== b.major) return `Major versions differ: ${a.major} vs ${b.major}.`;
    if (a.minor !== b.minor) return `Minor versions differ: ${a.minor} vs ${b.minor}.`;
    if (a.patch !== b.patch) return `Patch versions differ: ${a.patch} vs ${b.patch}.`;
    if (a.prerelease.length === 0 || b.prerelease.length === 0) {
      return 'A version without a prerelease tag has higher precedence than one with a prerelease tag.';
    }
    return 'Prerelease identifiers differ in precedence (compared field by field).';
  }
  return (
    <div className="tool-page">
      <h1>Semver Comparator</h1>
      <p className="tool-description">
        Paste two semantic version strings to see which one is greater, per the{' '}
        <a href="https://semver.org/#spec-item-11" target="_blank" rel="noreferrer">semver precedence rules</a>{' '}
        - including prerelease comparisons like 2.0.0-alpha vs 2.0.0-beta. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="semver-a">Version A</label>
          <input
            id="semver-a"
            type="text"
            value={versionA}
            onChange={(e) => setVersionA(e.target.value)}
            placeholder="1.2.3"
            style={{ fontFamily: 'var(--mono)' }}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="semver-b">Version B</label>
          <input
            id="semver-b"
            type="text"
            value={versionB}
            onChange={(e) => setVersionB(e.target.value)}
            placeholder="2.0.0-beta.1"
            style={{ fontFamily: 'var(--mono)' }}
          />
        </div>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {!error && result && (
        <div className="timestamp-result">
          <span>
            <strong>Result:</strong>{' '}
            {result.cmp === 0
              ? 'A is equal to B'
              : result.cmp > 0
                ? 'A is greater than B'
                : 'A is less than B'}
          </span>
          <span>
            <strong>Why:</strong> {reasonFor(result.cmp, result.parsedA, result.parsedB)}
          </span>
        </div>
      )}
    </div>
  );
}
