import { useState } from 'react';
const IDENTIFIER_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function toJsObjectLiteral(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => childPad + toJsObjectLiteral(v, indent + 1));
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const items = keys.map((k) => {
      const key = IDENTIFIER_KEY.test(k) ? k : `'${k.replace(/'/g, "\\'")}'`;
      return `${childPad}${key}: ${toJsObjectLiteral(value[k], indent + 1)}`;
    });
    return `{\n${items.join(',\n')}\n${pad}}`;
  }
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return String(value);
}
function jsonToJsObject(json) {
  return toJsObjectLiteral(JSON.parse(json));
}
function jsObjectToJson(code) {
  const value = new Function(`"use strict"; return (\n${code}\n);`)();
  return JSON.stringify(value, null, 2);
}
export default function JsonJsObjectConverter() {
  const [mode, setMode] = useState('json-to-js');
  const [input, setInput] = useState('{\n  "name": "example",\n  "count": 2,\n  "tags": ["a", "b"]\n}');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input.trim()) {
    try {
      output = mode === 'json-to-js' ? jsonToJsObject(input) : jsObjectToJson(input);
    } catch (e) {
      error = e.message;
    }
  }
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>JSON ⇄ JS Object Literal Converter</h1>
      <p className="tool-description">
        Convert JSON to a JS object literal (unquoted keys, single quotes) for pasting into
        source code, or back. Runs entirely in your browser - the JS-object-literal side is
        parsed locally, never sent anywhere.
      </p>
      <div className="tool-controls">
        <label>
          Direction:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="json-to-js">JSON to JS object</option>
            <option value="js-to-json">JS object to JSON</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="jsobj-input">{mode === 'json-to-js' ? 'JSON input' : 'JS object input'}</label>
          <textarea id="jsobj-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="jsobj-output">{mode === 'json-to-js' ? 'JS object output' : 'JSON output'}</label>
          <textarea id="jsobj-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Parse error:</strong> {error}
        </div>
      )}
    </div>
  );
}
