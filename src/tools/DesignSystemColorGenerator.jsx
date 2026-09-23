import { useEffect, useState } from 'react';
export default function DesignSystemColorGenerator() {
    const [hex, setHex] = useState('#3366ff');
    const [valid, setValid] = useState(true);
    const [tints, setTints] = useState([]);
    const [shades, setShades] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/design-system-color-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { hex } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else {
                        setValid(data.valid);
                        setTints(data.tints || []);
                        setShades(data.shades || []);
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [hex]);
    return (
        <div className="tool-page">
            <h1>Design System Color Generator</h1>
            <p className="tool-description">
                Enter a base hex color to generate a full set of tints (mixed with white) and shades (mixed
                with black) for a basic design-system color scale, using real RGB interpolation math.
            </p>
            <div className="tool-controls">
                <label>
                    Base color:
                    <input type="color" value={valid ? hex : '#3366ff'} onChange={(e) => setHex(e.target.value)} />
                </label>
                <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: '110px', fontFamily: 'var(--mono)' }} />
            </div>
            {error && <div className="agent-error">{error}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a valid hex color (e.g. #3366ff).
                </div>
            )}
            {valid && (
                <>
                    <div className="tool-panel">
                        <label>Tints (base + white)</label>
                        <div className="timestamp-result">
                            {tints.map((t) => (
                                <span key={t.percent} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ width: 40, height: 24, borderRadius: 4, border: '1px solid var(--border)', background: t.hex }} />
                                    <code>{t.hex}</code>
                                    <span style={{ opacity: 0.6 }}>{t.percent}% white</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="tool-panel">
                        <label>Base color</label>
                        <div style={{ width: 60, height: 32, borderRadius: 4, border: '1px solid var(--border)', background: hex }} />
                    </div>
                    <div className="tool-panel">
                        <label>Shades (base + black)</label>
                        <div className="timestamp-result">
                            {shades.map((s) => (
                                <span key={s.percent} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ width: 40, height: 24, borderRadius: 4, border: '1px solid var(--border)', background: s.hex }} />
                                    <code>{s.hex}</code>
                                    <span style={{ opacity: 0.6 }}>{s.percent}% black</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
