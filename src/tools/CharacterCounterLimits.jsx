import { useEffect, useState } from 'react';
export default function CharacterCounterLimits() {
    const [input, setInput] = useState('');
    const [stats, setStats] = useState({ length: 0, platforms: [], segments: 0 });
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/character-counter-limits', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setStats(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input]);
    return (
        <div className="tool-page">
            <h1>Character Counter with Platform Limits</h1>
            <p className="tool-description">
                Type or paste text to see a live character count against common platform limits - Twitter/X
                posts, SMS segments, and meta title/description SEO guidance.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label htmlFor="char-limit-input">Text</label>
                <textarea id="char-limit-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste or type your text here" style={{ minHeight: 200 }} />
            </div>
            <div className="timestamp-result">
                <span>
                    <strong>Total characters:</strong> {stats.length}
                </span>
                {stats.platforms.map((p) => (
                    <span key={p.key}>
                        <strong>{p.label} ({p.limit}):</strong>{' '}
                        {p.over ? `${Math.abs(p.remaining)} over the limit` : `${p.remaining} remaining`}
                        {p.over && <span className="tool-error-inline">Over limit</span>}
                    </span>
                ))}
                <span>
                    <strong>SMS segments (160 chars/segment, 153/segment simplified multipart rule):</strong>{' '}
                    {stats.segments || 0}
                </span>
            </div>
        </div>
    );
}
