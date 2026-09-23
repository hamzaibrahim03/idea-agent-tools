import { useEffect, useState } from 'react';
export default function FertilizerCalculator() {
    const [area, setArea] = useState('40');
    const [areaUnit, setAreaUnit] = useState('acres');
    const [targetRate, setTargetRate] = useState('60');
    const [productPercent, setProductPercent] = useState('20');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/fertilizer-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { area, areaUnit, targetRate, productPercent } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) { setError(data.error); setResult(null); }
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [area, areaUnit, targetRate, productPercent]);
    return (
        <div className="tool-page">
            <h1>Fertilizer Calculator</h1>
            <p className="tool-description">
                Enter your field area, target nutrient application rate, and the fertilizer product's nutrient
                percentage (e.g. a 20% N product) to compute total product quantity needed, using the standard
                formula: product needed = (target rate / product nutrient %) x area.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="fert-area">Field area</label>
                    <input id="fert-area" type="number" min={0} step="0.01" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="fert-areaunit">Area unit</label>
                    <select id="fert-areaunit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="fert-rate">Target nutrient rate (lbs or kg per {areaUnit === 'acres' ? 'acre' : 'hectare'})</label>
                    <input id="fert-rate" type="number" min={0} step="0.01" value={targetRate} onChange={(e) => setTargetRate(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="fert-percent">Product nutrient percentage (%)</label>
                    <input id="fert-percent" type="number" min={0} max={100} step="0.1" value={productPercent} onChange={(e) => setProductPercent(e.target.value)} />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>Product needed per {areaUnit === 'acres' ? 'acre' : 'hectare'}:</strong> {result.productPerArea.toFixed(2)}
                    </div>
                    <div>
                        <strong>Total product needed:</strong> {result.totalProduct.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                </div>
            )}
        </div>
    );
}
