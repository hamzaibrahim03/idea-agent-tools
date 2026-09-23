import { useState } from 'react';
function toPascalCase(key) {
  const cleaned = key.replace(/[^a-zA-Z0-9]+/g, ' ').trim();
  return cleaned
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') || 'Root';
}
function isValidIdentifier(key) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}
function propKey(key) {
  return isValidIdentifier(key) ? key : JSON.stringify(key);
}
function inferType(value, name, interfaces) {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const elementTypes = [...new Set(value.map((v) => inferType(v, name, interfaces)))];
    return elementTypes.length === 1 ? `${elementTypes[0]}[]` : `(${elementTypes.join(' | ')})[]`;
  }
  const t = typeof value;
  if (t === 'object') {
    const interfaceName = toPascalCase(name);
    buildInterface(value, interfaceName, interfaces);
    return interfaceName;
  }
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'unknown';
}
function buildInterface(obj, name, interfaces) {
  const keys = Object.keys(obj);
  const lines = keys.map((key) => {
    const type = inferType(obj[key], key, interfaces);
    return `  ${propKey(key)}: ${type};`;
  });
  interfaces.push(`interface ${name} {\n${lines.join('\n')}\n}`);
  return name;
}
function generateInterfaces(json, rootName) {
  const parsed = JSON.parse(json);
  const interfaces = [];
  if (Array.isArray(parsed)) {
    if (parsed.length === 0 || typeof parsed[0] !== 'object' || parsed[0] === null) {
      const elementType = parsed.length ? inferType(parsed[0], rootName, interfaces) : 'unknown';
      return `type ${rootName} = ${elementType}[];`;
    }
    buildInterface(parsed[0], rootName, interfaces);
    return interfaces.reverse().join('\n\n');
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return `type ${rootName} = ${inferType(parsed, rootName, interfaces)};`;
  }
  buildInterface(parsed, rootName, interfaces);
  return interfaces.reverse().join('\n\n');
}
export default function JsonToTypescriptInterface() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "active": true,\n  "tags": ["admin", "user"],\n  "address": {\n    "city": "London",\n    "zip": "SW1"\n  }\n}');
  const [rootName, setRootName] = useState('Root');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input.trim()) {
    try {
      output = generateInterfaces(input, rootName.trim() || 'Root');
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
      <h1>JSON to TypeScript Interface</h1>
      <p className="tool-description">
        Paste JSON to generate a matching TypeScript interface definition. Types are inferred from
        the values present, including nested objects (as separate interfaces) and arrays. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Root interface name:
          <input type="text" value={rootName} onChange={(e) => setRootName(e.target.value)} style={{ width: '140px' }} />
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="jsts-input">JSON input</label>
          <textarea
            id="jsts-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "paste your JSON here"}'
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="jsts-output">
            TypeScript output {error && <span className="tool-error-inline">Invalid JSON</span>}
          </label>
          <textarea id="jsts-output" value={output} readOnly spellCheck={false} placeholder="Generated interfaces will appear here" />
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
