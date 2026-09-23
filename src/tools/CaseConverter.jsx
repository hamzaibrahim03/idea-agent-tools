import { useEffect, useState } from 'react';
export default function CaseConverter() {
    const [input, setInput] = useState('');
    const [copiedKey, setCopiedKey] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/case-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResults(data.results || []);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input]);
    async function copy(label, value) {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopiedKey(label);
            setTimeout(() => setCopiedKey(''), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Text Case Converter</h1>
            <p className="tool-description">
                Convert text between camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.
                Looking for prose-style title casing (with AP/Chicago minor-word rules)? See the{' '}
                <a href="/tools/title-case-converter">Title Case Converter</a>.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label htmlFor="case-input">Input</label>
                <input id="case-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. my_variable-Name here" />
            </div>
            <ul className="uuid-list">
                {results.map(([label, value]) => (
                    <li key={label}>
                        <code>{value || '—'}</code>
                        <button className="uuid-copy-btn" onClick={() => copy(label, value)} disabled={!value}>
                            {copiedKey === label ? 'Copied!' : `Copy ${label}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
