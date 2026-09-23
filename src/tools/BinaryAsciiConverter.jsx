import { useEffect, useState } from 'react';
export default function BinaryAsciiConverter() {
    const [mode, setMode] = useState('Binary');
    const [direction, setDirection] = useState('toCode');
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            if (!input) {
                setOutput('');
                return;
            }
            fetch('/api/tools/binary-ascii-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { mode, direction, input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setOutput(data.output || '');
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [mode, direction, input]);
    async function handleCopy() {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    const inputLabel = direction === 'toCode' ? 'Text' : mode === 'Binary' ? 'Binary' : 'Hex';
    const outputLabel = direction === 'toCode' ? (mode === 'Binary' ? 'Binary' : 'Hex') : 'Text';
    return (
        <div className="tool-page">
            <h1>Binary / ASCII Converter</h1>
            <p className="tool-description">
                Convert text to binary or hexadecimal byte codes and back, using UTF-8 encoding.
            </p>
            <div className="tool-controls">
                <label>
                    Mode:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="Binary">Binary</option>
                        <option value="Hex">Hex</option>
                    </select>
                </label>
                <label>
                    Direction:
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="toCode">Text → Code</option>
                        <option value="toText">Code → Text</option>
                    </select>
                </label>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="binary-input">{inputLabel}</label>
                    <textarea id="binary-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={direction === 'toCode' ? 'e.g. Hi' : mode === 'Binary' ? 'e.g. 01001000 01101001' : 'e.g. 48 69'} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="binary-output">{outputLabel}</label>
                    <textarea id="binary-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
            {error && <div className="tool-error">{error}</div>}
        </div>
    );
}
