import { useEffect, useState } from 'react';
export default function Base64Tool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('encode');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        if (!input) {
            setOutput('');
            setError('');
            setFetchError('');
            return undefined;
        }
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/base64-encoder-decoder', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, mode } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setError(data.error);
                        setOutput('');
                    } else {
                        setError('');
                        setOutput(data.output || '');
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
            <h1>Base64 Encoder / Decoder</h1>
            <p className="tool-description">
                Encode text to Base64 or decode Base64 back to text, with correct UTF-8 handling (emoji and
                non-English text included). Runs entirely in your browser.
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
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="b64-input">{mode === 'encode' ? 'Text' : 'Base64'}</label>
                    <textarea id="b64-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode' : 'Base64 string to decode'} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="b64-output">{mode === 'encode' ? 'Base64' : 'Text'}</label>
                    <textarea id="b64-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
