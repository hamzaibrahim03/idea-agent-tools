import { useEffect, useState } from 'react';
export default function AsciiArtGenerator() {
    const [text, setText] = useState('HELLO');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/ascii-art-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { text } })
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
    }, [text]);
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
            <h1>Text to ASCII Art</h1>
            <p className="tool-description">
                Convert short text into blocky ASCII art banner text (letters, digits, and a few
                punctuation marks; limited to 20 characters).
            </p>
            <div className="tool-controls">
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={20} style={{ width: '200px' }} />
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <pre className="regex-highlighted" style={{ fontSize: 14, lineHeight: 1.4 }}>
                {output || 'Type something above'}
            </pre>
        </div>
    );
}
