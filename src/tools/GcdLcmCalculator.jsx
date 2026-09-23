import { useEffect, useState } from 'react';
export default function GcdLcmCalculator() {
    const [input, setInput] = useState('12, 18');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/gcd-lcm-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) { setError(data.error); setResult(null); }
                    else setResult(data.result);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input]);
    return (
        <div className="tool-page">
            <h1>GCD / LCM Calculator</h1>
            <p className="tool-description">
                Compute the greatest common divisor (via the Euclidean algorithm) and least common
                multiple of two or more whole numbers.
            </p>
            <div className="tool-panel">
                <label htmlFor="gcd-input">Numbers (comma or space separated)</label>
                <input id="gcd-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 12, 18, 24" />
            </div>
            {error && <div className="tool-error">{error}</div>}
            {result && (
                <div className="timestamp-result">
                    <span>
                        <strong>GCD:</strong> {result.gcd}
                    </span>
                    <span>
                        <strong>LCM:</strong> {result.lcm.toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    );
}
