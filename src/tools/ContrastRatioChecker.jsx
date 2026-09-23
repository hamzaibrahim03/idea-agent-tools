import { useEffect, useState } from 'react';
export default function ContrastRatioChecker() {
    const [foreground, setForeground] = useState('#222222');
    const [background, setBackground] = useState('#ffffff');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/contrast-ratio-checker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { foreground, background } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) setError(d.error);
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 200);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [foreground, background]);
    const valid = data?.valid;
    return (
        <div className="tool-page">
            <h1>Contrast Ratio Checker</h1>
            <p className="tool-description">
                Enter a foreground and background color to compute the WCAG contrast ratio using the real
                relative-luminance formula, and see pass/fail results against the AA and AAA thresholds
                for normal and large text.
            </p>
            <div className="tool-controls">
                <label>
                    Foreground:
                    <input type="color" value={/^#[0-9a-f]{6}$/i.test(foreground) ? foreground : '#000000'} onChange={(e) => setForeground(e.target.value)} />
                </label>
                <input type="text" value={foreground} onChange={(e) => setForeground(e.target.value)} style={{ width: '100px', fontFamily: 'var(--mono)' }} />
                <label>
                    Background:
                    <input type="color" value={/^#[0-9a-f]{6}$/i.test(background) ? background : '#ffffff'} onChange={(e) => setBackground(e.target.value)} />
                </label>
                <input type="text" value={background} onChange={(e) => setBackground(e.target.value)} style={{ width: '100px', fontFamily: 'var(--mono)' }} />
            </div>
            {error && <div className="agent-error">{error}</div>}
            {data && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter valid hex colors for both foreground and background.
                </div>
            )}
            {valid && (
                <>
                    <div className="tool-panel">
                        <label>Preview</label>
                        <div style={{ padding: '24px', borderRadius: 8, border: '1px solid var(--border)', background, color: foreground, fontSize: 20, fontWeight: 600, }} >
                            Sample text on this background
                        </div>
                    </div>
                    <div className="timestamp-result">
                        <span>
                            <strong>Contrast ratio:</strong> <code>{data.ratio.toFixed(2)}:1</code>
                        </span>
                        {data.checks.map((c) => (
                            <span key={c.label}>
                                {c.pass ? '✅' : '❌'} {c.label}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
