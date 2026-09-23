import { useState } from 'react';
const UUID_RE = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;
function variantLabel(digit) {
  const bits = parseInt(digit, 16);
  if ((bits & 0b1000) === 0b0000) return 'NCS backward compatible (0xx)';
  if ((bits & 0b1100) === 0b1000) return 'RFC 4122 (10x)';
  if ((bits & 0b1110) === 0b1100) return 'Microsoft (110)';
  return 'Reserved for future use (111)';
}
function analyzeUuid(input) {
  const trimmed = input.trim();
  const match = trimmed.match(UUID_RE);
  if (!match) {
    return { valid: false, formatOk: false };
  }
  const [, g1, g2, g3, g4, g5] = match;
  const version = g3[0];
  const variantDigit = g4[0];
  const isNilUuid = /^0+$/.test(g1 + g2 + g3 + g4 + g5);
  const isMaxUuid = /^f+$/i.test(g1 + g2 + g3 + g4 + g5);
  return {
    valid: true,
    formatOk: true,
    canonical: `${g1}-${g2}-${g3}-${g4}-${g5}`.toLowerCase(),
    version: /[1-8]/.test(version) ? version : null,
    versionRaw: version,
    variant: variantLabel(variantDigit),
    isNilUuid,
    isMaxUuid
  };
}
const VERSION_NAMES = {
  1: 'Time-based (v1)',
  2: 'DCE Security (v2)',
  3: 'Name-based, MD5 (v3)',
  4: 'Random (v4)',
  5: 'Name-based, SHA-1 (v5)',
  6: 'Reordered time-based (v6)',
  7: 'Unix Epoch time-based (v7)',
  8: 'Custom (v8)'
};
export default function UuidValidator() {
  const [input, setInput] = useState('');
  const result = input.trim() ? analyzeUuid(input) : null;
  return (
    <div className="tool-page">
      <h1>UUID Validator</h1>
      <p className="tool-description">
        Paste a string to check whether it's a well-formed UUID, and identify its version and
        variant from the bit pattern. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="uuid-validate-input">UUID</label>
        <input
          id="uuid-validate-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          spellCheck={false}
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {result && !result.formatOk && (
        <div className="tool-error">
          <strong>Invalid:</strong> Not a well-formed UUID (expected 8-4-4-4-12 hex digits, e.g.
          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
        </div>
      )}
      {result && result.formatOk && (
        <div className="timestamp-result">
          <div>
            <strong>Status:</strong> Valid UUID format
          </div>
          <div>
            <strong>Canonical form:</strong> <code>{result.canonical}</code>
          </div>
          <div>
            <strong>Version:</strong>{' '}
            {result.version ? VERSION_NAMES[result.version] : `Unrecognized (digit "${result.versionRaw}")`}
          </div>
          <div>
            <strong>Variant:</strong> {result.variant}
          </div>
          {result.isNilUuid && (
            <div>
              <strong>Note:</strong> This is the Nil UUID (all zeros).
            </div>
          )}
          {result.isMaxUuid && (
            <div>
              <strong>Note:</strong> This is the Max UUID (all Fs).
            </div>
          )}
        </div>
      )}
    </div>
  );
}
