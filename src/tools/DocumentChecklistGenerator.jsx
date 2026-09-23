import { useEffect, useState } from 'react';
const DOCUMENT_TYPE_LABELS = {
    report: 'Report',
    contract: 'Contract',
    resume: 'Resume',
    proposal: 'Proposal'
};
export default function DocumentChecklistGenerator() {
    const [docType, setDocType] = useState('report');
    const [checked, setChecked] = useState({});
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        setError('');
        fetch('/api/tools/document-checklist-generator', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ input: { docType } })
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.error) setError(data.error);
                else {
                    setItems(data.items || []);
                    setChecked({});
                }
            })
            .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        return () => { cancelled = true; };
    }, [docType]);
    function toggle(item) {
        setChecked((c) => ({ ...c, [item]: !c[item] }));
    }
    const checkedCount = items.filter((i) => checked[i]).length;
    return (
        <div className="tool-page">
            <h1>Document Checklist Generator</h1>
            <p className="tool-description">
                Pick a document type to get a curated checklist of standard sections and elements that
                document type should typically include, from a built-in reference list.
            </p>
            <div className="tool-controls">
                <label>
                    Document type:
                    <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                        {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </label>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label>
                    {DOCUMENT_TYPE_LABELS[docType]} checklist ({checkedCount}/{items.length} done)
                </label>
                {items.map((item) => (
                    <label key={item} className="checkbox-label" style={{ padding: '4px 0' }}>
                        <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} />
                        <span style={{ textDecoration: checked[item] ? 'line-through' : 'none', opacity: checked[item] ? 0.5 : 1 }}>
                            {item}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
