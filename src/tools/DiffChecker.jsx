import { useEffect, useState } from 'react';
export default function DiffChecker() {
    const [left, setLeft] = useState('');
    const [right, setRight] = useState('');
    const [diff, setDiff] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            if (!left && !right) {
                setDiff([]);
                return;
            }
            fetch('/api/tools/diff-checker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { left, right } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setDiff(data.diff || []);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 300);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [left, right]);
    return (
        <div className="tool-page">
            <h1>Text Diff Checker</h1>
            <p className="tool-description">
                Compare two blocks of text and see line-by-line differences highlighted.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="diff-left">Original</label>
                    <textarea id="diff-left" value={left} onChange={(e) => setLeft(e.target.value)} spellCheck={false} placeholder="Paste original text" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="diff-right">Changed</label>
                    <textarea id="diff-right" value={right} onChange={(e) => setRight(e.target.value)} spellCheck={false} placeholder="Paste changed text" />
                </div>
            </div>
            {diff.length > 0 && (
                <div className="regex-highlighted">
                    {diff.map((line, idx) => (
                        <div key={idx} style={{ background: line.type === 'added' ? 'rgba(34,197,94,0.15)' : line.type === 'removed' ? 'rgba(220,38,38,0.12)' : 'transparent', color: line.type === 'added' ? '#16a34a' : line.type === 'removed' ? '#dc2626' : 'inherit' }} >
                            {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
                            {line.text || ' '}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
