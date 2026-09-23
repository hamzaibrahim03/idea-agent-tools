import { useEffect, useState } from 'react';
export default function AcronymGenerator() {
    const [input, setInput] = useState('');
    const [excludeSmallWords, setExcludeSmallWords] = useState(false);
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState({ uppercase: '', withPeriods: '' });
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/acronym-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, excludeSmallWords } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input, excludeSmallWords]);
    const { uppercase, withPeriods } = result;
    async function handleCopy() {
        if (!uppercase) return;
        try {
            await navigator.clipboard.writeText(uppercase);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Acronym Generator</h1>
            <p className="tool-description">
                Type a phrase and generate an acronym from the first letter of each word. Handles extra
                spaces, punctuation, and hyphenated words (each half of a hyphenated word counts as its own
                word).
            </p>
            <div className="tool-controls">
                <label className="checkbox-label">
                    <input type="checkbox" checked={excludeSmallWords} onChange={() => setExcludeSmallWords((v) => !v)} />
                    Exclude small words (a, the, of, and, ...)
                </label>
                <button onClick={handleCopy} disabled={!uppercase}>
                    {copied ? 'Copied!' : 'Copy acronym'}
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label htmlFor="acronym-input">Phrase</label>
                <input id="acronym-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Random Access Memory" />
            </div>
            <div className="tool-panel">
                <label htmlFor="acronym-output">Acronym</label>
                <input id="acronym-output" type="text" value={uppercase} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            <div className="tool-panel">
                <label htmlFor="acronym-output-periods">With periods</label>
                <input id="acronym-output-periods" type="text" value={withPeriods} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
        </div>
    );
}
