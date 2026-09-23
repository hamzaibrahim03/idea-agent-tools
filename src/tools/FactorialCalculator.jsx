import { useEffect, useState } from 'react';
const MAX_N = 170;
export default function FactorialCalculator() {
    const [n, setN] = useState('5');
    const [valid, setValid] = useState(true);
    const [result, setResult] = useState(null);
    const [steps, setSteps] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/factorial-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { n } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setResult(data.valid ? data.result : null);
                        setSteps(data.valid ? data.steps : '');
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [n]);
    return (
        <div className="tool-page">
            <h1>Factorial Calculator</h1>
            <p className="tool-description">
                Calculate n! (n factorial) - the product of all positive integers up to n. Runs entirely
                in your browser.
            </p>
            <div className="tool-controls">
                <input type="number" min={0} max={MAX_N} step={1} value={n} onChange={(e) => setN(e.target.value)} style={{ width: '100px' }} />
                <span>!</span>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a whole number from 0 to {MAX_N} (factorials beyond {MAX_N}! exceed floating-point precision).
                </div>
            )}
            {result !== null && (
                <div className="timestamp-result">
                    <div>
                        <strong>
                            {n}! =
                        </strong>{' '}
                        {result.toLocaleString('en-US')}
                    </div>
                    <div>
                        <strong>Expansion:</strong> {steps}
                    </div>
                </div>
            )}
        </div>
    );
}
