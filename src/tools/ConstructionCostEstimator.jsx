import { useEffect, useState } from 'react';
export default function ConstructionCostEstimator() {
    const [projectType, setProjectType] = useState('residential');
    const [tier, setTier] = useState('standard');
    const [sqft, setSqft] = useState('2000');
    const [useCustomRate, setUseCustomRate] = useState(false);
    const [customRate, setCustomRate] = useState('180');
    const [laborShare, setLaborShare] = useState('40');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/construction-cost-estimator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { projectType, tier, sqft, useCustomRate, customRate, laborShare } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) { setError(d.error); setData(null); }
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [projectType, tier, sqft, useCustomRate, customRate, laborShare]);
    const { range, rate, totalLow, totalHigh, totalMid, laborCost, materialCost } = data || {};
    return (
        <div className="tool-page">
            <h1>Construction Cost Estimator</h1>
            <p className="tool-description">
                Estimate total construction cost from square footage and a quality tier, using published
                rough regional-average per-sq-ft cost ranges. Actual costs vary hugely by location, labor
                market, and site conditions - override the per-sq-ft rate with your own regional figure for
                a better estimate. This is a planning-stage estimate, not a substitute for a licensed
                contractor's quote.
            </p>
            <div className="tool-controls">
                <label>
                    Project type:
                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                    </select>
                </label>
                <label>
                    Quality tier:
                    <select value={tier} onChange={(e) => setTier(e.target.value)}>
                        <option value="economy">Economy</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                    </select>
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={useCustomRate} onChange={(e) => setUseCustomRate(e.target.checked)} />
                    Use my own rate
                </label>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="sqft">Square footage</label>
                    <input id="sqft" type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="labor-share">Labor share of total cost (%)</label>
                    <input id="labor-share" type="number" min={0} max={100} value={laborShare} onChange={(e) => setLaborShare(e.target.value)} />
                </div>
                {useCustomRate && (
                    <div className="tool-panel">
                        <label htmlFor="custom-rate">Your regional rate ($/sq ft)</label>
                        <input id="custom-rate" type="number" min={0} value={customRate} onChange={(e) => setCustomRate(e.target.value)} />
                    </div>
                )}
            </div>
            {!useCustomRate && range && (
                <p className="tool-placeholder">
                    Published range for {projectType} / {tier}: ${range.low}-${range.high} per sq ft (using midpoint $
                    {rate.toFixed(0)}/sq ft below).
                </p>
            )}
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {data && (
                <div className="timestamp-result">
                    {!useCustomRate && (
                        <div>
                            <strong>Estimated range:</strong> ${totalLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - $
                            {totalHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    )}
                    <div>
                        <strong>Estimated total (at ${rate.toFixed(0)}/sq ft):</strong> $
                        {totalMid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div>
                        <strong>Estimated labor cost:</strong> ${laborCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div>
                        <strong>Estimated material cost:</strong> ${materialCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                </div>
            )}
        </div>
    );
}
