import { useEffect, useState } from 'react';
export default function BuildingMaterialEstimator() {
    const [floorArea, setFloorArea] = useState('2000');
    const [floors, setFloors] = useState('1');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/building-material-estimator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { floorArea, floors } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) setError(d.error);
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [floorArea, floors]);
    const { valid, totalArea, materials } = data || {};
    return (
        <div className="tool-page">
            <h1>Building Material Estimator</h1>
            <p className="tool-description">
                Get a very rough planning-stage estimate of major material quantities - concrete, steel,
                bricks, lumber, and more - from total floor area and number of floors, using commonly
                published per-square-foot material intensity figures.
            </p>
            <div className="tool-error">
                <strong>Rough planning estimate only:</strong> These figures are generic rule-of-thumb
                intensities and vary enormously by building type, structural system, and region. This is
                not a substitute for a quantity surveyor's or engineer's real material takeoff - use only
                for very early, rough planning purposes.
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="bm-area">Floor area per floor (sq ft)</label>
                    <input id="bm-area" type="number" min={0} value={floorArea} onChange={(e) => setFloorArea(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="bm-floors">Number of floors</label>
                    <input id="bm-floors" type="number" min={1} value={floors} onChange={(e) => setFloors(e.target.value)} />
                </div>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {data && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive floor area and number of floors.
                </div>
            )}
            {valid && (
                <>
                    <div className="timestamp-result">
                        <strong>Total floor area:</strong> {totalArea.toFixed(0)} sq ft
                    </div>
                    <div className="regex-groups-wrap">
                        <table className="regex-groups-table">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Rough estimated quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((m) => (
                                    <tr key={m.name}>
                                        <td>{m.name}</td>
                                        <td>
                                            <code>{m.quantity.toFixed(1)} {m.unit}</code>
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
