import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
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
    const ai = useAiGenerate('api-doc-template', 'API Doc Template Generator');
    const doc = ai.result;
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
    async function handleGenerate() {
        const paramsSummary = params.map((p) => `${p.name}:${p.type}${p.required ? ' (required)' : ''} - ${p.description}`).join('; ');
        const fieldsSummary = fields.map((f) => `${f.name}:${f.type} - ${f.description}`).join('; ');
        await ai.generate({ path, method, description, parameters: paramsSummary, responseFields: fieldsSummary });
    }
    const paramTable = doc?.parameters?.length
        ? [
            '| Name | Type | Required | Description |',
            '| --- | --- | --- | --- |',
            ...doc.parameters.map((p) => `| ${p.name} | ${p.type} | ${p.required === true || p.required === 'true' ? 'Yes' : 'No'} | ${p.description} |`)
        ].join('\n')
        : '_None_';
    const markdown = doc
        ? `## ${doc.method || method} ${doc.endpoint || path}\n\n${doc.description || ''}\n\n### Request Parameters\n\n${paramTable}\n\n### Response Example\n\n\`\`\`\n${doc.responseExample || ''}\n\`\`\`\n`
        : '';
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(markdown);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    function handleDownload() {
        downloadFile(markdown, 'api-doc.md', 'text/markdown');
    }
    return (
        <div className="tool-page">
            <h1>API Doc Template Generator</h1>
            <p className="tool-description">
                Fill in an endpoint path, HTTP method, description, request parameters, and response
                fields, then click "Generate with AI" for a genuinely AI-generated Markdown API
                documentation block, ready to paste into your docs - free, no account needed
                (rate-limited to keep it free for everyone).
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
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !path.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button onClick={handleCopy} disabled={!doc}>{copied ? 'Copied!' : 'Copy Markdown'}</button>
                <button onClick={handleDownload} disabled={!doc}>Download</button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
            {doc && (
                <div className="tool-panel">
                    <label htmlFor="adt-output">Generated Markdown</label>
                    <textarea id="adt-output" value={markdown} readOnly spellCheck={false} style={{ minHeight: 220 }} />
                </div>
            )}
        </div>
    );
}
