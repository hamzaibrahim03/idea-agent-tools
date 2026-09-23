import { useEffect, useState } from 'react';
export default function DuplicateLineRemover() {
    const [input, setInput] = useState('');
    const [caseInsensitive, setCaseInsensitive] = useState(false);
    const [trim, setTrim] = useState(false);
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [removed, setRemoved] = useState(0);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/duplicate-line-remover', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, caseInsensitive, trim } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else {
                        setOutput(data.output || '');
                        setRemoved(data.removed || 0);
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input, caseInsensitive, trim]);
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
            <h1>Duplicate Line Remover</h1>
            <p className="tool-description">
                Paste multi-line text and remove duplicate lines, keeping the first occurrence of each.
            </p>
            <div className="tool-controls">
                <label className="checkbox-label">
                    <input type="checkbox" checked={caseInsensitive} onChange={() => setCaseInsensitive((v) => !v)} />
                    Case-insensitive
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={trim} onChange={() => setTrim((v) => !v)} />
                    Trim whitespace before comparing
                </label>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="dedupe-input">Input</label>
                    <textarea id="dedupe-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="dedupe-output">Output ({removed} duplicate{removed === 1 ? '' : 's'} removed)</label>
                    <textarea id="dedupe-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
        </div>
    );
}
