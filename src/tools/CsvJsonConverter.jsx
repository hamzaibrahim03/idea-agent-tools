import { useEffect, useState } from 'react';
export default function CsvJsonConverter() {
    const [mode, setMode] = useState('csv-to-json');
    const [input, setInput] = useState('name,age\nAlice,30\nBob,25');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            if (!input.trim()) {
                setOutput('');
                setError('');
                return;
            }
            fetch('/api/tools/csv-json-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, mode } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    setOutput(data.output || '');
                    setError(data.error || '');
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
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
    function handleSwap() {
        setMode((m) => (m === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json'));
        setInput(output || input);
    }
    return (
        <div className="tool-page">
            <h1>CSV ⇄ JSON Converter</h1>
            <p className="tool-description">
                Convert between CSV and JSON. Handles quoted fields with commas and embedded quotes.
            </p>
            <div className="tool-controls">
                <label>
                    Direction:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="csv-to-json">CSV to JSON</option>
                        <option value="json-to-csv">JSON to CSV</option>
                    </select>
                </label>
                <button onClick={handleSwap} disabled={!output}>
                    Swap (use output as input)
                </button>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="csv-input">{mode === 'csv-to-json' ? 'CSV input' : 'JSON input'}</label>
                    <textarea id="csv-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="csv-output">{mode === 'csv-to-json' ? 'JSON output' : 'CSV output'}</label>
                    <textarea id="csv-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Parse error:</strong> {error}
                </div>
            )}
        </div>
    );
}
