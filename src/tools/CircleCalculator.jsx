import { useEffect, useState } from 'react';
export default function CircleCalculator() {
    const [field, setField] = useState('radius');
    const [value, setValue] = useState('5');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/circle-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { field, value } })
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
    }, [field, value]);
    const fieldLabels = {
        radius: 'Radius',
        diameter: 'Diameter',
        circumference: 'Circumference',
        area: 'Area',
    };
    return (
        <div className="tool-page">
            <h1>Circle Calculator</h1>
            <p className="tool-description">
                Enter any one of radius, diameter, circumference, or area to calculate the other three.
            </p>
            <div className="tool-controls">
                <label>
                    Given:
                    <select value={field} onChange={(e) => setField(e.target.value)}>
                        <option value="radius">Radius</option>
                        <option value="diameter">Diameter</option>
                        <option value="circumference">Circumference</option>
                        <option value="area">Area</option>
                    </select>
                </label>
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '140px' }} />
            </div>
            {error && <div className="tool-error">{error}</div>}
            {result && !error && (
                <div className="timestamp-result">
                    {Object.entries(fieldLabels).map(([key, label]) => (
                        <span key={key}>
                            <strong>{label}:</strong> {result[key]}
                            {key === field ? ' (given)' : ''}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
