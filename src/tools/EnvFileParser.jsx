import { useState } from 'react';
function parseEnv(text) {
  const rows = [];
  const lines = text.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) rows.push({ key, value });
  }
  return rows;
}
function rowsToEnv(rows) {
  return rows
    .filter((r) => r.key.trim())
    .map((r) => `${r.key.trim()}=${/\s|#/.test(r.value) ? `"${r.value}"` : r.value}`)
    .join('\n');
}
const SAMPLE_ENV = 'DATABASE_URL=postgres://localhost:5432/app\nAPI_KEY=sk-example-1234\nDEBUG=true\n# A comment line is ignored\nPORT=3000';
export default function EnvFileParser() {
  const [input, setInput] = useState(SAMPLE_ENV);
  const [rows, setRows] = useState([{ key: '', value: '' }]);
  const [copied, setCopied] = useState(false);
  const parsedRows = parseEnv(input);
  const generatedEnv = rowsToEnv(rows);
  function updateRow(index, field, value) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { key: '', value: '' }]);
  }
  function removeRow(index) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleCopy() {
    if (!generatedEnv) return;
    try {
      await navigator.clipboard.writeText(generatedEnv);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>.env File Parser</h1>
      <p className="tool-description">
        Paste the contents of a .env file to view it as a table of key-value pairs, or use the
        builder below to add rows and generate .env text output. Runs entirely in your browser -
        nothing is uploaded anywhere.
      </p>
      <div className="tool-panel">
        <label htmlFor="env-input">Paste .env contents</label>
        <textarea
          id="env-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="KEY=value"
          spellCheck={false}
        />
      </div>
      {parsedRows.length > 0 && (
        <div className="tool-panel">
          <label>Parsed variables ({parsedRows.length})</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {parsedRows.map((r, i) => (
                  <tr key={`${r.key}-${i}`}>
                    <td>
                      <code>{r.key}</code>
                    </td>
                    <td>
                      <code>{r.value}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <h1 style={{ fontSize: '20px', marginTop: '32px' }}>Build a .env file</h1>
      <div className="tool-panel">
        <label>Key / value rows</label>
        {rows.map((r, i) => (
          <div className="tool-controls" key={i}>
            <input
              type="text"
              value={r.key}
              onChange={(e) => updateRow(i, 'key', e.target.value)}
              placeholder="KEY"
              style={{ width: '180px' }}
            />
            <input
              type="text"
              value={r.value}
              onChange={(e) => updateRow(i, 'value', e.target.value)}
              placeholder="value"
              style={{ width: '220px' }}
            />
            <button onClick={() => removeRow(i)} disabled={rows.length === 1}>
              Remove
            </button>
          </div>
        ))}
        <div className="tool-controls">
          <button onClick={addRow}>Add row</button>
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="env-output">
          Generated .env
          <button onClick={handleCopy} disabled={!generatedEnv} style={{ marginLeft: '10px' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </label>
        <textarea id="env-output" value={generatedEnv} readOnly spellCheck={false} placeholder="Generated .env output will appear here" />
      </div>
    </div>
  );
}
