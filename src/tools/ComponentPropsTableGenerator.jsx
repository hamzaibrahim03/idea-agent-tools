import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
let nextId = 1;
function makeDefaultRows() {
  return [
    { id: nextId++, name: 'label', type: 'string', defaultValue: '-', description: 'Text shown inside the component' },
    { id: nextId++, name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables user interaction' }
  ];
}
export default function ComponentPropsTableGenerator() {
  const [componentName, setComponentName] = useState('Button');
  const [rows, setRows] = useState(makeDefaultRows);
  const [copied, setCopied] = useState(false);
  function updateRow(id, field, value) {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }
  function addRow() {
    setRows((r) => [...r, { id: nextId++, name: '', type: '', defaultValue: '', description: '' }]);
  }
  function removeRow(id) {
    setRows((r) => r.filter((row) => row.id !== id));
  }
  const pad = (text, w) => (text || '').padEnd(w, ' ');
  const widths = {
    name: Math.max(4, ...rows.map((r) => r.name.length), 4),
    type: Math.max(4, ...rows.map((r) => r.type.length), 4),
    defaultValue: Math.max(7, ...rows.map((r) => r.defaultValue.length), 7),
    description: Math.max(11, ...rows.map((r) => r.description.length), 11)
  };
  const headerLine = `| ${pad('Prop', widths.name)} | ${pad('Type', widths.type)} | ${pad('Default', widths.defaultValue)} | ${pad('Description', widths.description)} |`;
  const dividerLine = `| ${'-'.repeat(widths.name)} | ${'-'.repeat(widths.type)} | ${'-'.repeat(widths.defaultValue)} | ${'-'.repeat(widths.description)} |`;
  const bodyLines = rows.map(
    (r) => `| ${pad(r.name, widths.name)} | ${pad(r.type, widths.type)} | ${pad(r.defaultValue, widths.defaultValue)} | ${pad(r.description, widths.description)} |`
  );
  const markdown = `### ${componentName} Props\n\n${[headerLine, dividerLine, ...bodyLines].join('\n')}`;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(markdown, 'component-props.md', 'text/markdown');
  }
  return (
    <div className="tool-page">
      <h1>Component Props Table Generator</h1>
      <p className="tool-description">
        Add rows describing a component's props - name, type, default value, and description - and
        get a clean, formatted Markdown table ready to paste into component documentation. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Component name:
          <input type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} style={{ width: '160px' }} />
        </label>
        <button onClick={addRow}>Add prop</button>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Markdown'}</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      <div className="tool-panel">
        <label>Props</label>
        <div style={{ overflowX: 'auto' }}>
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><input type="text" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><input type="text" value={row.type} onChange={(e) => updateRow(row.id, 'type', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><input type="text" value={row.defaultValue} onChange={(e) => updateRow(row.id, 'defaultValue', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><input type="text" value={row.description} onChange={(e) => updateRow(row.id, 'description', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><button className="uuid-copy-btn" onClick={() => removeRow(row.id)} disabled={rows.length <= 1}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="cpt-output">Markdown output</label>
        <textarea id="cpt-output" value={markdown} readOnly spellCheck={false} style={{ minHeight: 160 }} />
      </div>
    </div>
  );
}
