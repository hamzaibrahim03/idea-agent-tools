import { useEffect, useState } from 'react';
export default function HtmlEntityTool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('encode');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        if (!input) {
            setOutput('');
            setFetchError('');
            return undefined;
        }
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/html-entity-encoder-decoder', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, mode } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setFetchError(data.error);
                    else setOutput(data.output || '');
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
    return (
        <div className="tool-page">
            <h1>HTML Entity Encoder / Decoder</h1>
            <p className="tool-description">
                Encode special characters (&amp;, &lt;, &gt;, quotes) to HTML entities, or decode HTML
                entities back to plain text. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Mode:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="encode">Encode</option>
                        <option value="decode">Decode</option>
                    </select>
                </label>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="entity-input">Input</label>
                    <textarea id="entity-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '<div class="a">Tom & Jerry</div>' : '&lt;div&gt;Tom &amp;amp; Jerry&lt;/div&gt;'} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="entity-output">Output</label>
                    <textarea id="entity-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
        </div>
    );
}
