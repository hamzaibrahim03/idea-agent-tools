import { useEffect, useState } from 'react';
export default function ExponentRootCalculator() {
    const [mode, setMode] = useState('power');
    const [base, setBase] = useState('2');
    const [exponent, setExponent] = useState('10');
    const [radicand, setRadicand] = useState('27');
    const [rootDegree, setRootDegree] = useState('3');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/exponent-root-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { mode, base, exponent, radicand, rootDegree } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setError(data.error);
                        setResult(null);
                    } else {
                        setError('');
                        setResult(data.result);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [mode, base, exponent, radicand, rootDegree]);
    return (
        <div className="tool-page">
            <h1>Exponent &amp; Root Calculator</h1>
            <p className="tool-description">
                Calculate a number raised to a power, or the nth root of a number. Runs entirely in your
                browser.
            </p>
            <div className="tool-controls">
                <label className="checkbox-label">
                    <input type="radio" name="exp-mode" checked={mode === 'power'} onChange={() => setMode('power')} />
                    Power (base^exponent)
                </label>
                <label className="checkbox-label">
                    <input type="radio" name="exp-mode" checked={mode === 'root'} onChange={() => setMode('root')} />
                    Root (ⁿ√x)
                </label>
            </div>
            {mode === 'power' ? (
                <div className="tool-controls">
                    <input type="number" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '100px' }} />
                    <span>^</span>
                    <input type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} style={{ width: '100px' }} />
                </div>
            ) : (
                <div className="tool-controls">
                    <input type="number" value={rootDegree} onChange={(e) => setRootDegree(e.target.value)} style={{ width: '80px' }} />
                    <span>√</span>
                    <input type="number" value={radicand} onChange={(e) => setRadicand(e.target.value)} style={{ width: '100px' }} />
                </div>
            )}
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result !== null && !error && (
                <div className="timestamp-result">
                    <div>
                        <strong>Result:</strong> {result}
                    </div>
                </div>
            )}
        </div>
    );
}
