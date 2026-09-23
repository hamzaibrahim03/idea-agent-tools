import { useEffect, useState } from 'react';
export default function Base32Encoder() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('encode');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            if (!input) {
                setOutput('');
                setError('');
                return;
            }
            fetch('/api/tools/base32-encoder', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, mode } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error !== undefined) {
                        setOutput(data.output || '');
                        setError(data.error || '');
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input, mode]);
    async function handleCopy() {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    function swap() {
        setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
        setInput(output);
    }
    return (
        <div className="tool-page">
            <h1>Base32 Encoder / Decoder</h1>
            <p className="tool-description">
                Encode text to Base32 (RFC 4648) or decode Base32 back to text, with correct padding.
            </p>
            <div className="tool-controls">
                <label className="checkbox-label">
                    <input type="radio" name="mode" checked={mode === 'encode'} onChange={() => setMode('encode')} />
                    Encode
                </label>
                <label className="checkbox-label">
                    <input type="radio" name="mode" checked={mode === 'decode'} onChange={() => setMode('decode')} />
                    Decode
                </label>
                <button onClick={swap} disabled={!output}>
                    Swap ⇅
                </button>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy result'}
                </button>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="b32-input">{mode === 'encode' ? 'Text' : 'Base32'}</label>
                    <textarea id="b32-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode' : 'Base32 string to decode, e.g. NBSWY3DP'} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="b32-output">{mode === 'encode' ? 'Base32' : 'Text'}</label>
                    <textarea id="b32-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
