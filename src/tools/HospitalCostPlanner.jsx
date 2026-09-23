import { useEffect, useState } from 'react';
export default function HospitalCostPlanner() {
    const [items, setItems] = useState([
        { id: 1, label: 'Procedure', cost: '5000' },
        { id: 2, label: 'Room & board', cost: '1200' },
        { id: 3, label: 'Medication', cost: '300' }
    ]);
    const [coveragePercent, setCoveragePercent] = useState('80');
    const [coverageValid, setCoverageValid] = useState(true);
    const [totalCost, setTotalCost] = useState(0);
    const [insurancePays, setInsurancePays] = useState(0);
    const [outOfPocket, setOutOfPocket] = useState(0);
    const [fetchError, setFetchError] = useState('');
    function updateItem(id, field, value) {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
    }
    function addItem() {
        setItems((prev) => [...prev, { id: Date.now(), label: '', cost: '' }]);
    }
    function removeItem(id) {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }
    const coverageNum = Number(coveragePercent);
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/hospital-cost-planner', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { items, coveragePercent } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setCoverageValid(data.coverageValid);
                        setTotalCost(data.totalCost || 0);
                        setInsurancePays(data.insurancePays || 0);
                        setOutOfPocket(data.outOfPocket || 0);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [items, coveragePercent]);
    return (
        <div className="tool-page">
            <h1>Hospital Cost Planner</h1>
            <p className="tool-description">
                Add expected cost line items - procedures, room charges, medications, and more - along
                with your insurance coverage percentage, to estimate your total out-of-pocket cost. Runs
                entirely in your browser.
            </p>
            <div className="tool-error">
                <strong>Not medical advice, not a price lookup:</strong> This tool does no lookup of real
                hospital or procedure prices. You must enter your own cost estimates obtained from your
                provider or hospital billing office. Actual costs and insurance coverage vary - confirm
                final figures with your insurer and provider.
            </div>
            <div className="tool-controls">
                <label>
                    Insurance coverage (%):
                    <input type="number" min={0} max={100} value={coveragePercent} onChange={(e) => setCoveragePercent(e.target.value)} style={{ width: '90px' }} />
                </label>
                <button type="button" onClick={addItem}>
                    Add cost item
                </button>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!coverageValid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a coverage percentage between 0 and 100.
                </div>
            )}
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Line item</th>
                            <th>Estimated cost ($)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((it) => (
                            <tr key={it.id}>
                                <td>
                                    <input type="text" value={it.label} onChange={(e) => updateItem(it.id, 'label', e.target.value)} placeholder="e.g. Surgery" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={it.cost} onChange={(e) => updateItem(it.id, 'cost', e.target.value)} style={{ width: '110px' }} />
                                </td>
                                <td>
                                    <button type="button" className="uuid-copy-btn" onClick={() => removeItem(it.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {coverageValid && (
                <div className="timestamp-result">
                    <div>
                        <strong>Total estimated cost:</strong> ${totalCost.toFixed(2)}
                    </div>
                    <div>
                        <strong>Insurance pays ({coverageNum}%):</strong> ${insurancePays.toFixed(2)}
                    </div>
                    <div>
                        <strong>Estimated out-of-pocket:</strong> ${outOfPocket.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
