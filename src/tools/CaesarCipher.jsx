import { useEffect, useState } from 'react';
export default function CaesarCipher() {
    const [input, setInput] = useState('');
    const [shift, setShift] = useState(3);
    const [mode, setMode] = useState('encrypt');
    const [bruteForce, setBruteForce] = useState(false);
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [variants, setVariants] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/caesar-cipher', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, shift, mode, bruteForce } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else {
                        setOutput(data.output || '');
                        setVariants(data.variants || []);
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input, shift, mode, bruteForce]);
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
            <h1>Caesar Cipher</h1>
            <p className="tool-description">
                Encrypt or decrypt text with a Caesar cipher shift, wrapping around the alphabet and
                preserving case and punctuation. Use brute force mode to try all 26 shifts when you don't
                know the key.
            </p>
            <div className="tool-controls">
                <label>
                    Mode:
                    <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={bruteForce}>
                        <option value="encrypt">Encrypt</option>
                        <option value="decrypt">Decrypt</option>
                    </select>
                </label>
                <label>
                    Shift:
                    <input type="range" min={-25} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} disabled={bruteForce} />
                </label>
                <input type="number" min={-25} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} disabled={bruteForce} style={{ width: '60px' }}/>
                <label className="checkbox-label">
                    <input type="checkbox" checked={bruteForce} onChange={(e) => setBruteForce(e.target.checked)} />
                    Brute force (try all shifts)
                </label>
                {!bruteForce && (
                    <button onClick={handleCopy} disabled={!output}>
                        {copied ? 'Copied!' : 'Copy output'}
                    </button>
                )}
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label htmlFor="caesar-input">Text</label>
                <textarea id="caesar-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. abc" spellCheck={false} />
            </div>
            {!bruteForce && (
                <div className="tool-panel">
                    <label htmlFor="caesar-output">Result</label>
                    <textarea id="caesar-output" value={output} readOnly spellCheck={false} />
                </div>
            )}
            {bruteForce && input && (
                <ul className="uuid-list">
                    {variants.map((v) => (
                        <li key={v.shift}>
                            <span>Shift {v.shift}</span>
                            <code>{v.text}</code>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
