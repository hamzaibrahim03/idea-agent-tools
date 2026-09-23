import { useEffect, useState } from 'react';
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
    const [markdown, setMarkdown] = useState('');
    const [error, setError] = useState('');
    function updateRow(id, field, value) {
        setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    }
    function addRow() {
        setRows((r) => [...r, { id: nextId++, name: '', type: '', defaultValue: '', description: '' }]);
    }
    function removeRow(id) {
        setRows((r) => r.filter((row) => row.id !== id));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/component-props-table-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { componentName, rows } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setMarkdown(data.markdown || '');
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [componentName, rows]);
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
            <h1>Component Props Table Generator</h1>
            <p className="tool-description">
                Add rows describing a component's props - name, type, default value, and description - and
                get a clean, formatted Markdown table ready to paste into component documentation.
            </p>
            <div className="tool-controls">
                <label>
                    Component name:
                    <input type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} style={{ width: '160px' }} />
                </label>
                <button onClick={addRow}>Add prop</button>
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Markdown'}</button>
            </div>
            {error && <div className="agent-error">{error}</div>}
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
