import { useState } from 'react';
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/;
const NAME_RE = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
function validatePackageJson(text) {
  const issues = [];
  const warnings = [];
  if (!text.trim()) {
    return { issues: ['No input provided'], warnings, parsed: null };
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { issues: [`Invalid JSON: ${e.message}`], warnings, parsed: null };
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { issues: ['Top-level value must be a JSON object'], warnings, parsed: null };
  }
  if (!data.name) {
    issues.push('Missing required field "name"');
  } else if (typeof data.name !== 'string') {
    issues.push('"name" must be a string');
  } else {
    if (data.name.length > 214) issues.push('"name" is longer than 214 characters');
    if (data.name !== data.name.toLowerCase()) issues.push('"name" must be lowercase');
    if (!NAME_RE.test(data.name)) {
      issues.push('"name" contains characters not allowed in npm package names');
    }
  }
  if (!data.version) {
    issues.push('Missing required field "version"');
  } else if (typeof data.version !== 'string') {
    issues.push('"version" must be a string');
  } else if (!SEMVER_RE.test(data.version)) {
    issues.push(`"version" ("${data.version}") is not a valid semantic version (expected e.g. 1.2.3)`);
  }
  if (data.private !== true) {
    if (!data.description) warnings.push('No "description" field (recommended for published packages)');
    if (!data.license) warnings.push('No "license" field (recommended for published packages)');
  }
  if (data.main && typeof data.main !== 'string') issues.push('"main" must be a string if present');
  if (data.scripts && (typeof data.scripts !== 'object' || Array.isArray(data.scripts))) {
    issues.push('"scripts" must be an object if present');
  }
  if (data.dependencies && (typeof data.dependencies !== 'object' || Array.isArray(data.dependencies))) {
    issues.push('"dependencies" must be an object if present');
  }
  if (data.devDependencies && (typeof data.devDependencies !== 'object' || Array.isArray(data.devDependencies))) {
    issues.push('"devDependencies" must be an object if present');
  }
  return { issues, warnings, parsed: data };
}
const SAMPLE = `{
  "name": "my-package",
  "version": "1.0.0",
  "description": "An example package",
  "main": "index.js",
  "license": "MIT"
}`;
export default function PackageJsonValidator() {
  const [input, setInput] = useState('');
  const { issues, warnings, parsed } = validatePackageJson(input);
  const isValid = input.trim() && issues.length === 0;
  return (
    <div className="tool-page">
      <h1>package.json Validator</h1>
      <p className="tool-description">
        Paste a package.json file to check for valid JSON, required fields ("name"/"version"), npm
        naming rules, and a valid semantic version. This is a basic sanity checker, not a full
        npm-registry-level validator. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={() => setInput(SAMPLE)}>Load sample</button>
        <button onClick={() => setInput('')} disabled={!input}>Clear</button>
      </div>
      <div className="tool-panel">
        <label htmlFor="pkg-input">package.json content</label>
        <textarea
          id="pkg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your package.json content here"
          spellCheck={false}
          style={{ minHeight: 220 }}
        />
      </div>
      {input.trim() && (
        <div className="timestamp-result">
          <span>
            <strong>Status:</strong>{' '}
            {isValid ? 'Looks structurally valid' : `${issues.length} issue(s) found`}
          </span>
          {parsed && (
            <span>
              <strong>Name / Version:</strong> {parsed.name || '—'} / {parsed.version || '—'}
            </span>
          )}
        </div>
      )}
      {issues.length > 0 && (
        <div className="tool-error">
          <strong>Issues:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="tool-panel">
          <label>Warnings</label>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, opacity: 0.85 }}>
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
