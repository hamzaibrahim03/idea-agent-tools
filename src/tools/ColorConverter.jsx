import { useEffect, useState } from 'react';
export default function ColorConverter() {
    const [hex, setHex] = useState('#aa3bff');
    const [rgb, setRgb] = useState(null);
    const [hsl, setHsl] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            fetch('/api/tools/color-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { hex } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setError(data.error);
                        setRgb(null);
                        setHsl(null);
                    } else {
                        setError('');
                        setRgb(data.rgb);
                        setHsl(data.hsl);
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 200);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [hex]);
    return (
        <div className="tool-page">
            <h1>Color Converter</h1>
            <p className="tool-description">
                Convert a color between HEX, RGB, and HSL with a live preview swatch.
            </p>
            <div className="tool-controls">
                <label>
                    Color:
                    <input type="color" value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#000000'} onChange={(e) => setHex(e.target.value)} />
                </label>
                <label>
                    Hex:
                    <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: '110px', fontFamily: 'var(--mono)' }} />
                </label>
            </div>
            {error && <div className="tool-error">{error}</div>}
            {rgb && hsl && (
                <div className="timestamp-result">
                    <div style={{ height: 60, borderRadius: 8, border: '1px solid var(--border)', background: hex, marginBottom: 8 }} />
                    <span>
                        <strong>HEX:</strong> <code>{hex}</code>
                    </span>
                    <span>
                        <strong>RGB:</strong> <code>rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
                    </span>
                    <span>
                        <strong>HSL:</strong> <code>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
                    </span>
                </div>
            )}
        </div>
    );
}
