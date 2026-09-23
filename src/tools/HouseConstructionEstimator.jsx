import { useEffect, useState } from 'react';
const RATE_PER_SQFT = {
    economy: 100,
    standard: 160,
    premium: 260
};
export default function HouseConstructionEstimator() {
    const [builtUpArea, setBuiltUpArea] = useState('1800');
    const [floors, setFloors] = useState('2');
    const [tier, setTier] = useState('standard');
    const [rate, setRate] = useState(String(RATE_PER_SQFT.standard));
    const [valid, setValid] = useState(true);
    const [totalArea, setTotalArea] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [breakdown, setBreakdown] = useState([]);
    const [fetchError, setFetchError] = useState('');
    function handleTier(value) {
        setTier(value);
        setRate(String(RATE_PER_SQFT[value]));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/house-construction-estimator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { builtUpArea, floors, rate } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setTotalArea(data.totalArea || 0);
                        setTotalCost(data.totalCost || 0);
                        setBreakdown(data.breakdown || []);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [builtUpArea, floors, rate]);
    return (
        <div className="tool-page">
            <h1>House Construction Cost Estimator</h1>
            <p className="tool-description">
                Get a high-level total cost estimate for a house build from built-up area, number of floors,
                and quality tier, broken down by category (structure, finishing, electrical, plumbing, other)
                using commonly published typical percentage splits. These percentages are general industry
                rules of thumb, not a quote for your specific project - actual splits vary by design and
                region. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Quality tier:
                    <select value={tier} onChange={(e) => handleTier(e.target.value)}>
                        <option value="economy">Economy</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                    </select>
                </label>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="built-up-area">Built-up area per floor (sq ft)</label>
                    <input
                        id="built-up-area"
                        type="number"
                        min={0}
                        value={builtUpArea}
                        onChange={(e) => setBuiltUpArea(e.target.value)}
                    />
                </div>
                <div className="tool-panel">
                    <label htmlFor="floors">Number of floors</label>
                    <input id="floors" type="number" min={1} step="1" value={floors} onChange={(e) => setFloors(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="rate">Rate ($/sq ft)</label>
                    <input id="rate" type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive area, a positive number of floors, and a positive rate.
                </div>
            )}
            {valid && (
                <>
                    <div className="timestamp-result">
                        <div>
                            <strong>Total built-up area:</strong> {totalArea.toLocaleString()} sq ft
                        </div>
                        <div>
                            <strong>Estimated total cost:</strong> ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                    <div className="regex-groups-wrap" style={{ marginTop: 16 }}>
                        <table className="regex-groups-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Typical %</th>
                                    <th>Estimated cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {breakdown.map((b) => (
                                    <tr key={b.key}>
                                        <td>{b.label}</td>
                                        <td>{b.pct}%</td>
                                        <td>
                                            <code>${b.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
