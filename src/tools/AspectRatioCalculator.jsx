import { useEffect, useState } from 'react';
export default function AspectRatioCalculator() {
    const [width, setWidth] = useState('1920');
    const [height, setHeight] = useState('1080');
    const [knownWidth, setKnownWidth] = useState('1280');
    const [ratioW, setRatioW] = useState('16');
    const [ratioH, setRatioH] = useState('9');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/aspect-ratio-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { width, height, knownWidth, ratioW, ratioH } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [width, height, knownWidth, ratioW, ratioH]);
    const { ratioValid, simplified, decimalRatio, calcValid, calculatedHeight } = result || {};
    return (
        <div className="tool-page">
            <h1>Aspect Ratio Calculator</h1>
            <p className="tool-description">
                Simplify a width/height pair to its simplest ratio (via GCD), or calculate a missing
                dimension from a known width and a target ratio.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label>Simplify a ratio</label>
                <div className="tool-controls">
                    <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Width" style={{ width: '100px' }} />
                    <span>:</span>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" style={{ width: '100px' }} />
                </div>
                {result && !ratioValid && (
                    <div className="tool-error-inline">Enter positive width and height values.</div>
                )}
                {ratioValid && (
                    <div className="timestamp-result">
                        <span>
                            <strong>Simplified ratio:</strong> <code>{simplified.w}:{simplified.h}</code>
                        </span>
                        <span>
                            <strong>Decimal ratio:</strong> <code>{decimalRatio.toFixed(4)}</code>
                        </span>
                    </div>
                )}
            </div>
            <div className="tool-panel">
                <label>Calculate height from width + ratio</label>
                <div className="tool-controls">
                    <label>
                        Width:
                        <input type="number" value={knownWidth} onChange={(e) => setKnownWidth(e.target.value)} style={{ width: '100px' }} />
                    </label>
                    <label>
                        Ratio:
                        <input type="number" value={ratioW} onChange={(e) => setRatioW(e.target.value)} style={{ width: '60px' }} />
                    </label>
                    <span>:</span>
                    <input type="number" value={ratioH} onChange={(e) => setRatioH(e.target.value)} style={{ width: '60px' }} />
                </div>
                {result && !calcValid && (
                    <div className="tool-error-inline">Enter positive width and ratio values.</div>
                )}
                {calcValid && (
                    <div className="timestamp-result">
                        <span>
                            <strong>Calculated height:</strong> <code>{calculatedHeight.toFixed(2)}</code>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
