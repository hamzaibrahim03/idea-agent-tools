import { useEffect, useState } from 'react';
export default function BodyFatCalculator() {
    const [sex, setSex] = useState('male');
    const [heightCm, setHeightCm] = useState('175');
    const [neckCm, setNeckCm] = useState('38');
    const [waistCm, setWaistCm] = useState('85');
    const [hipCm, setHipCm] = useState('95');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/body-fat-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { sex, heightCm, neckCm, waistCm, hipCm } })
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
    }, [sex, heightCm, neckCm, waistCm, hipCm]);
    const valid = result?.valid;
    const bodyFat = result?.bodyFat;
    return (
        <div className="tool-page">
            <h1>Body Fat Calculator</h1>
            <p className="tool-description">
                Estimate body fat percentage using the US Navy circumference method, based on height,
                neck, and waist measurements (plus hip for females). This is an estimate only, not a
                medical measurement - for an accurate reading, consult a healthcare professional or use a
                clinical body composition test.
            </p>
            <div className="tool-controls">
                <label>
                    Sex:
                    <select value={sex} onChange={(e) => setSex(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <label>
                    Height (cm):
                    <input type="number" min={0} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={{ width: '90px' }} />
                </label>
                <label>
                    Neck (cm):
                    <input type="number" min={0} value={neckCm} onChange={(e) => setNeckCm(e.target.value)} style={{ width: '90px' }} />
                </label>
                <label>
                    Waist (cm):
                    <input type="number" min={0} value={waistCm} onChange={(e) => setWaistCm(e.target.value)} style={{ width: '90px' }} />
                </label>
                {sex === 'female' && (
                    <label>
                        Hip (cm):
                        <input type="number" min={0} value={hipCm} onChange={(e) => setHipCm(e.target.value)} style={{ width: '90px' }} />
                    </label>
                )}
            </div>
            {error && <div className="agent-error">{error}</div>}
            {result && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter positive measurements for all required fields (waist must be greater than neck).
                </div>
            )}
            {result && valid && bodyFat === null && (
                <div className="tool-error">
                    <strong>Error:</strong> These measurements produce an invalid result - double-check waist, neck, and hip values.
                </div>
            )}
            {bodyFat !== null && bodyFat !== undefined && (
                <div className="timestamp-result">
                    <strong>Estimated body fat:</strong> {bodyFat.toFixed(1)}%
                </div>
            )}
        </div>
    );
}
