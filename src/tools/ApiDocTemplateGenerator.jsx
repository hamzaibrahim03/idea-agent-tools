import { useState } from 'react';
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
let nextId = 1;
function makeDefaultParams() {
  return [{ id: nextId++, name: 'id', type: 'string', required: true, description: 'Unique identifier' }];
}
function makeDefaultFields() {
  return [{ id: nextId++, name: 'id', type: 'string', description: 'Unique identifier' }];
}
export default function ApiDocTemplateGenerator() {
  const [path, setPath] = useState('/api/users/{id}');
  const [method, setMethod] = useState('GET');
  const [description, setDescription] = useState('Retrieve a single user by ID.');
  const [params, setParams] = useState(makeDefaultParams);
  const [fields, setFields] = useState(makeDefaultFields);
  const [copied, setCopied] = useState(false);
  function updateParam(id, field, value) {
    setParams((p) => p.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }
  function addParam() {
    setParams((p) => [...p, { id: nextId++, name: '', type: 'string', required: false, description: '' }]);
  }
  function removeParam(id) {
    setParams((p) => p.filter((row) => row.id !== id));
  }
  function updateField(id, field, value) {
    setFields((f) => f.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }
  function addField() {
    setFields((f) => [...f, { id: nextId++, name: '', type: 'string', description: '' }]);
  }
  function removeField(id) {
    setFields((f) => f.filter((row) => row.id !== id));
  }
  const paramTable = params.length
    ? [
      '| Name | Type | Required | Description |',
      '| --- | --- | --- | --- |',
      ...params.map((p) => `| ${p.name} | ${p.type} | ${p.required ? 'Yes' : 'No'} | ${p.description} |`)
    ].join('\n')
    : '_None_';
  const fieldTable = fields.length
    ? [
      '| Field | Type | Description |',
      '| --- | --- | --- |',
      ...fields.map((f) => `| ${f.name} | ${f.type} | ${f.description} |`)
    ].join('\n')
    : '_None_';
  const markdown = `## ${method} ${path}\n\n${description}\n\n### Request Parameters\n\n${paramTable}\n\n### Response Fields\n\n${fieldTable}\n`;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>API Doc Template Generator</h1>
      <p className="tool-description">
        Fill in an endpoint path, HTTP method, description, request parameters, and response fields
        to assemble a clean, structured Markdown API documentation block, ready to paste into your
        docs. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="adt-path">Endpoint path</label>
          <input id="adt-path" type="text" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="adt-method">HTTP method</label>
          <select id="adt-method" value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="adt-desc">Description</label>
        <input id="adt-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="tool-panel">
        <label>Request parameters</label>
        <div style={{ overflowX: 'auto' }}>
          <table className="regex-groups-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={p.id}>
                  <td><input type="text" value={p.name} onChange={(e) => updateParam(p.id, 'name', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><input type="text" value={p.type} onChange={(e) => updateParam(p.id, 'type', e.target.value)} style={{ width: '100%' }} /></td>
                  <td>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={p.required} onChange={(e) => updateParam(p.id, 'required', e.target.checked)} />
                    </label>
                  </td>
                  <td><input type="text" value={p.description} onChange={(e) => updateParam(p.id, 'description', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><button className="uuid-copy-btn" onClick={() => removeParam(p.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addParam} style={{ marginTop: 8, alignSelf: 'flex-start' }}>Add parameter</button>
      </div>
      <div className="tool-panel">
        <label>Response fields</label>
        <div style={{ overflowX: 'auto' }}>
          <table className="regex-groups-table">
            <thead>
              <tr><th>Field</th><th>Type</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.id}>
                  <td><input type="text" value={f.name} onChange={(e) => updateField(f.id, 'name', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><input type="text" value={f.type} onChange={(e) => updateField(f.id, 'type', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><input type="text" value={f.description} onChange={(e) => updateField(f.id, 'description', e.target.value)} style={{ width: '100%' }} /></td>
                  <td><button className="uuid-copy-btn" onClick={() => removeField(f.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addField} style={{ marginTop: 8, alignSelf: 'flex-start' }}>Add field</button>
      </div>
      <div className="tool-controls">
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Markdown'}</button>
      </div>
      <div className="tool-panel">
        <label htmlFor="adt-output">Markdown output</label>
        <textarea id="adt-output" value={markdown} readOnly spellCheck={false} style={{ minHeight: 220 }} />
      </div>
    </div>
  );
}
