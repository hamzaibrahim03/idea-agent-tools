import { useEffect, useState } from 'react';
export default function IndentationConverter() {
    const [input, setInput] = useState('function greet() {\n\tif (true) {\n\t\tconsole.log("hi");\n\t}\n}');
    const [mode, setMode] = useState('spaces');
    const [width, setWidth] = useState(2);
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/indentation-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, mode, width } })
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
    }, [input, mode, width]);
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
            <h1>Indentation Converter</h1>
            <p className="tool-description">
                Convert code indentation between tabs and spaces, or change the space width. Runs
                entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Convert to:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="spaces">Spaces</option>
                        <option value="tabs">Tabs</option>
                    </select>
                </label>
                <label>
                    Indent width:
                    <input type="number" min={1} max={8} value={width} onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))} style={{ width: '60px' }} />
                </label>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="indent-input">Input</label>
                    <textarea id="indent-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="indent-output">Output</label>
                    <textarea id="indent-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
        </div>
    );
}
