import { useEffect, useState } from 'react';
export default function DesignSpacingScaleGenerator() {
    const [base, setBase] = useState(8);
    const [scaleType, setScaleType] = useState('linear');
    const [ratio, setRatio] = useState(1.5);
    const [copied, setCopied] = useState(false);
    const [uniqueScale, setUniqueScale] = useState([]);
    const [cssOutput, setCssOutput] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/design-spacing-scale-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { base, scaleType, ratio } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else {
                        setUniqueScale(data.uniqueScale || []);
                        setCssOutput(data.cssOutput || '');
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [base, scaleType, ratio]);
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(cssOutput);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Design Spacing Scale Generator</h1>
            <p className="tool-description">
                Generate a consistent spacing scale for a design system from a base unit - either a linear
                scale (simple multiples of your base) or a geometric scale (each step multiplied by a
                ratio).
            </p>
            <div className="tool-controls">
                <label>
                    Base unit (px):
                    <input type="number" min="1" step="0.5" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '70px' }} />
                </label>
                <label>
                    Scale type:
                    <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                        <option value="linear">Linear (common multiples)</option>
                        <option value="geometric">Geometric (ratio-based)</option>
                    </select>
                </label>
                {scaleType === 'geometric' && (
                    <label>
                        Ratio:
                        <input type="number" min="1.01" step="0.05" value={ratio} onChange={(e) => setRatio(e.target.value)} style={{ width: '70px' }} />
                    </label>
                )}
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS variables'}</button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label>Spacing scale</label>
                <div className="timestamp-result">
                    {uniqueScale.map((v, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <code style={{ width: 80 }}>{v}px</code>
                            <span style={{ height: 14, width: v, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 2 }} />
                        </span>
                    ))}
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="dssg-output">CSS custom properties</label>
                <textarea id="dssg-output" value={cssOutput} readOnly spellCheck={false} style={{ minHeight: 160 }} />
            </div>
        </div>
    );
}
