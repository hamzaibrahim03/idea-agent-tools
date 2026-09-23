import { useEffect, useState } from 'react';
export default function ElectricalLoadCalculator() {
    const [items, setItems] = useState([
        { id: 1, name: 'Refrigerator', watts: '800', quantity: '1' },
        { id: 2, name: 'Microwave', watts: '1200', quantity: '1' },
        { id: 3, name: 'Lighting circuit', watts: '600', quantity: '1' }
    ]);
    const [voltage, setVoltage] = useState('120');
    const [rows, setRows] = useState([]);
    const [totalWatts, setTotalWatts] = useState(0);
    const [voltageValid, setVoltageValid] = useState(true);
    const [totalAmps, setTotalAmps] = useState(null);
    const [fetchError, setFetchError] = useState('');
    function updateItem(id, field, value) {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
    }
    function addItem() {
        setItems((prev) => [...prev, { id: Date.now(), name: '', watts: '', quantity: '1' }]);
    }
    function removeItem(id) {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/electrical-load-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { items, voltage } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setRows(data.rows || []);
                        setTotalWatts(data.totalWatts || 0);
                        setVoltageValid(data.voltageValid);
                        setTotalAmps(data.totalAmps);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [items, voltage]);
    return (
        <div className="tool-page">
            <h1>Electrical Load Calculator</h1>
            <p className="tool-description">
                Add electrical appliances or circuits with their wattage and quantity to sum total
                connected load, then compute the required amperage at a given voltage using the standard
                formula: amps = watts / volts. Runs entirely in your browser.
            </p>
            <div className="tool-error">
                <strong>Licensed professional required:</strong> This is a basic connected-load estimate.
                Real electrical service and circuit sizing must account for demand factors, continuous
                loads, and code requirements. A licensed electrician or engineer must verify anything used
                for actual permits or installation (e.g. NEC in the US).
            </div>
            <div className="tool-controls">
                <label>
                    Voltage (V):
                    <input type="number" min={0} value={voltage} onChange={(e) => setVoltage(e.target.value)} style={{ width: '90px' }} />
                </label>
                <button type="button" onClick={addItem}>
                    Add appliance/circuit
                </button>
            </div>
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Watts</th>
                            <th>Quantity</th>
                            <th>Subtotal (W)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((it) => {
                            const r = rows.find((rr) => rr.id === it.id) || it;
                            return (
                                <tr key={it.id}>
                                    <td>
                                        <input type="text" value={it.name} onChange={(e) => updateItem(it.id, 'name', e.target.value)} placeholder="e.g. Water heater" style={{ width: '100%' }} />
                                    </td>
                                    <td>
                                        <input type="number" min={0} value={it.watts} onChange={(e) => updateItem(it.id, 'watts', e.target.value)} style={{ width: '90px' }} />
                                    </td>
                                    <td>
                                        <input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(it.id, 'quantity', e.target.value)} style={{ width: '70px' }} />
                                    </td>
                                    <td>
                                        <code>{r.subtotal !== null && r.subtotal !== undefined ? r.subtotal.toFixed(0) : '-'}</code>
                                    </td>
                                    <td>
                                        <button type="button" className="uuid-copy-btn" onClick={() => removeItem(it.id)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!voltageValid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive voltage.
                </div>
            )}
            <div className="timestamp-result">
                <div>
                    <strong>Total connected load:</strong> {totalWatts.toFixed(0)} W
                </div>
                {totalAmps !== null && totalAmps !== undefined && (
                    <div>
                        <strong>Required amperage:</strong> {totalAmps.toFixed(2)} A
                    </div>
                )}
            </div>
        </div>
    );
}
