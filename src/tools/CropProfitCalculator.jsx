import { useEffect, useState } from 'react';
const DEFAULT_COSTS = [
    { label: 'Seed', amount: '3000' },
    { label: 'Fertilizer', amount: '4500' },
    { label: 'Labor', amount: '6000' }
];
export default function CropProfitCalculator() {
    const [yieldPerAcre, setYieldPerAcre] = useState('180');
    const [pricePerUnit, setPricePerUnit] = useState('4.20');
    const [totalAcres, setTotalAcres] = useState('100');
    const [costs, setCosts] = useState(DEFAULT_COSTS);
    const [valid, setValid] = useState(true);
    const [totalYield, setTotalYield] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [netProfit, setNetProfit] = useState(null);
    const [fetchError, setFetchError] = useState('');
    function updateCost(index, field, value) {
        setCosts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
    }
    function addCost() {
        setCosts((prev) => [...prev, { label: '', amount: '' }]);
    }
    function removeCost(index) {
        setCosts((prev) => prev.filter((_, i) => i !== index));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/crop-profit-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { yieldPerAcre, pricePerUnit, totalAcres, costs } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setTotalYield(data.totalYield ?? null);
                        setTotalRevenue(data.totalRevenue ?? null);
                        setTotalCost(data.totalCost ?? 0);
                        setNetProfit(data.netProfit ?? null);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [yieldPerAcre, pricePerUnit, totalAcres, costs]);
    return (
        <div className="tool-page">
            <h1>Crop Profit Calculator</h1>
            <p className="tool-description">
                Enter expected yield per acre, price per unit, total acres, and your cost line items (seed,
                fertilizer, labor, etc.) to compute total revenue, total cost, and net profit. Runs entirely
                in your browser.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="cpc2-yield">Expected yield per acre</label>
                    <input id="cpc2-yield" type="number" min={0} step="0.01" value={yieldPerAcre} onChange={(e) => setYieldPerAcre(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cpc2-price">Price per unit</label>
                    <input id="cpc2-price" type="number" min={0} step="0.01" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cpc2-acres">Total acres</label>
                    <input id="cpc2-acres" type="number" min={0} step="0.01" value={totalAcres} onChange={(e) => setTotalAcres(e.target.value)} />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={addCost}>
                    Add cost line item
                </button>
            </div>
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Cost item</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {costs.map((c, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="text" value={c.label} onChange={(e) => updateCost(i, 'label', e.target.value)} placeholder="e.g. Seed" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={c.amount} onChange={(e) => updateCost(i, 'amount', e.target.value)} style={{ width: '100px' }} />
                                </td>
                                <td>
                                    <button type="button" className="uuid-copy-btn" onClick={() => removeCost(i)} disabled={costs.length <= 1}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive yield per acre, non-negative price, and positive total acres.
                </div>
            )}
            {valid && totalYield !== null && (
                <div className="timestamp-result">
                    <div>
                        <strong>Total yield:</strong> {totalYield.toLocaleString(undefined, { maximumFractionDigits: 1 })} units
                    </div>
                    <div>
                        <strong>Total revenue:</strong> ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div>
                        <strong>Total cost:</strong> ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div>
                        <strong>Net profit:</strong> ${netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    {netProfit < 0 && <div style={{ color: '#dc2626', fontWeight: 600 }}>Projected loss</div>}
                </div>
            )}
        </div>
    );
}
