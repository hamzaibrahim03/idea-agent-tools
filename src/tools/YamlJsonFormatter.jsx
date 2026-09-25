import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function parseYamlValue(raw) {
  const v = raw.trim();
  if (v === '') return '';
  if (v === 'null' || v === '~') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}
function indentOf(line) {
  return line.length - line.trimStart().length;
}
function parseYamlBlock(lines) {
  const relevant = [];
  for (const line of lines) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    relevant.push(line);
  }
  if (relevant.length === 0) return null;
  const minIndent = Math.min(...relevant.map(indentOf));
  const isSequence = relevant
    .filter((l) => indentOf(l) === minIndent)
    .every((l) => l.trim().startsWith('-'));
  if (isSequence) {
    const result = [];
    let i = 0;
    while (i < relevant.length) {
      const line = relevant[i];
      const dashIndent = indentOf(line);
      const content = line.trim().slice(1).trim();
      if (content.includes(':') && !content.startsWith('"') && !content.startsWith("'")) {
        const groupLines = [' '.repeat(dashIndent + 2) + content];
        let j = i + 1;
        while (j < relevant.length && indentOf(relevant[j]) > dashIndent) {
          groupLines.push(relevant[j]);
          j++;
        }
        result.push(parseYamlBlock(groupLines));
        i = j;
      } else {
        result.push(parseYamlValue(content));
        i++;
      }
    }
    return result;
  }
  const obj = {};
  let i = 0;
  while (i < relevant.length) {
    const line = relevant[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    const rest = line.slice(colonIdx + 1).trim();
    if (rest === '') {
      let j = i + 1;
      const children = [];
      while (j < relevant.length && indentOf(relevant[j]) > indentOf(line)) {
        children.push(relevant[j]);
        j++;
      }
      obj[key] = parseYamlBlock(children);
      i = j;
    } else {
      obj[key] = parseYamlValue(rest);
      i++;
    }
  }
  return obj;
}
function yamlToJson(yaml) {
  const lines = yaml.split('\n');
  const parsed = parseYamlBlock(lines);
  return JSON.stringify(parsed, null, 2);
}
function jsonToYaml(value, indent = 0) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]`;
    return value
      .map((item) => {
        if (item !== null && typeof item === 'object') {
          const nested = jsonToYaml(item, indent + 1).trimStart();
          return `${pad}- ${nested}`;
        }
        return `${pad}- ${formatScalar(item)}`;
      })
      .join('\n');
  }
  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return `${pad}{}`;
    return keys
      .map((k) => {
        const v = value[k];
        if (v !== null && typeof v === 'object') {
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
        }
        return `${pad}${k}: ${formatScalar(v)}`;
      })
      .join('\n');
  }
  return `${pad}${formatScalar(value)}`;
}
function formatScalar(v) {
  if (v === null) return 'null';
  if (typeof v === 'string' && /[:#]/.test(v)) return `"${v}"`;
  return String(v);
}
export default function YamlJsonFormatter() {
  const [mode, setMode] = useState('yaml-to-json');
  const [input, setInput] = useState('name: example\nversion: 1\ntags:\n  - a\n  - b');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input.trim()) {
    try {
      output = mode === 'yaml-to-json' ? yamlToJson(input) : jsonToYaml(JSON.parse(input));
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
  function handleDownload() {
    if (mode === 'yaml-to-json') {
      downloadFile(output, 'converted.json', 'application/json');
    } else {
      downloadFile(output, 'converted.yaml', 'application/yaml');
    }
  }
  return (
    <div className="tool-page">
      <h1>YAML ⇄ JSON Converter</h1>
      <p className="tool-description">
        Convert between YAML and JSON. Supports common block mappings, sequences, and scalars -
        not the full YAML spec (no anchors or flow collections). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Direction:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="yaml-to-json">YAML to JSON</option>
            <option value="json-to-yaml">JSON to YAML</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="yaml-input">{mode === 'yaml-to-json' ? 'YAML input' : 'JSON input'}</label>
          <textarea id="yaml-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="yaml-output">{mode === 'yaml-to-json' ? 'JSON output' : 'YAML output'}</label>
          <textarea id="yaml-output" value={output} readOnly spellCheck={false} />
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
