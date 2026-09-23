import { useEffect, useState } from 'react';
const STYLE_LABELS = {
    bullet: 'Bullet (•)',
    dash: 'Dash (-)',
    asterisk: 'Asterisk (*)',
    numbered: 'Numbered (1.)',
    lettered: 'Lettered (a.)',
    roman: 'Roman numeral (i.)'
};
export default function BulletPointFormatter() {
    const [input, setInput] = useState('');
    const [style, setStyle] = useState('bullet');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/bullet-point-formatter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, style } })
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
    }, [input, style]);
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
            <h1>Bullet Point Formatter</h1>
            <p className="tool-description">
                Paste lines of text and add a bullet, dash, asterisk, or numbered/lettered/roman-numeral
                prefix to each non-empty line.
            </p>
            <div className="tool-controls">
                <label>
                    Style:
                    <select value={style} onChange={(e) => setStyle(e.target.value)}>
                        {Object.entries(STYLE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </label>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="bp-input">Input</label>
                    <textarea id="bp-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder={'First item\nSecond item\nThird item'} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="bp-output">Formatted output</label>
                    <textarea id="bp-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
        </div>
    );
}
