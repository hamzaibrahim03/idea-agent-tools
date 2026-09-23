import { useEffect, useState } from 'react';
const AREA_UNITS = {
    acres: { label: 'Acres', sqft: 43560 },
    hectares: { label: 'Hectares', sqft: 107639.1 },
    sqft: { label: 'Square feet', sqft: 1 },
    sqm: { label: 'Square meters', sqft: 10.7639 }
};
export default function CropPlanningCalculator() {
    const [area, setArea] = useState('1');
    const [areaUnit, setAreaUnit] = useState('acres');
    const [rowSpacingIn, setRowSpacingIn] = useState('30');
    const [plantSpacingIn, setPlantSpacingIn] = useState('12');
    const [valid, setValid] = useState(true);
    const [areaSqFt, setAreaSqFt] = useState(null);
    const [plantCount, setPlantCount] = useState(null);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/crop-planning-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { area, areaUnit, rowSpacingIn, plantSpacingIn } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setAreaSqFt(data.areaSqFt);
                        setPlantCount(data.plantCount);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [area, areaUnit, rowSpacingIn, plantSpacingIn]);
    return (
        <div className="tool-page">
            <h1>Crop Planning Calculator</h1>
            <p className="tool-description">
                Enter your field area and desired row and plant spacing to estimate how many plants will fit.
                Uses simple area-divided-by-spacing math with consistent unit conversion. Actual plant counts
                may vary with field shape and headland space. Runs entirely in your browser.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="cpc-area">Field area</label>
                    <input id="cpc-area" type="number" min={0} step="0.01" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cpc-unit">Area unit</label>
                    <select id="cpc-unit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                        {Object.entries(AREA_UNITS).map(([key, u]) => (
                            <option key={key} value={key}>
                                {u.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="cpc-row">Row spacing (inches)</label>
                    <input id="cpc-row" type="number" min={0} value={rowSpacingIn} onChange={(e) => setRowSpacingIn(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cpc-plant">Plant spacing within row (inches)</label>
                    <input id="cpc-plant" type="number" min={0} value={plantSpacingIn} onChange={(e) => setPlantSpacingIn(e.target.value)} />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive field area and positive row and plant spacing.
                </div>
            )}
            {valid && areaSqFt !== null && (
                <div className="timestamp-result">
                    <div>
                        <strong>Field area:</strong> {areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
                    </div>
                    <div>
                        <strong>Estimated number of plants:</strong> {plantCount.toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    );
}
