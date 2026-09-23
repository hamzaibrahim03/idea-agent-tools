import { useEffect, useState } from 'react';
const PRESETS = {
    modular: { label: 'US Modular Brick (7.625 × 2.25 in) - ~6.9/sq ft', length: 7.625, height: 2.25 },
    'standard-us': { label: 'US Standard Brick (8 × 2.25 in)', length: 8, height: 2.25 },
    'uk-metric': { label: 'UK Metric Brick (8.66 × 2.56 in / 220 × 65 mm)', length: 8.66, height: 2.56 },
    block: { label: 'Concrete Block (15.625 × 7.625 in)', length: 15.625, height: 7.625 }
};
export default function BrickCalculator() {
    const [wallLength, setWallLength] = useState('20');
    const [wallHeight, setWallHeight] = useState('8');
    const [openingsArea, setOpeningsArea] = useState('0');
    const [preset, setPreset] = useState('modular');
    const [brickLength, setBrickLength] = useState(PRESETS.modular.length);
    const [brickHeight, setBrickHeight] = useState(PRESETS.modular.height);
    const [joint, setJoint] = useState('0.375');
    const [waste, setWaste] = useState('10');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    function handlePreset(key) {
        setPreset(key);
        setBrickLength(PRESETS[key].length);
        setBrickHeight(PRESETS[key].height);
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/brick-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { wallLength, wallHeight, openingsArea, brickLength, brickHeight, joint, waste } })
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
    }, [wallLength, wallHeight, openingsArea, brickLength, brickHeight, joint, waste]);
    const { valid, wallArea, result } = data || {};
    return (
        <div className="tool-page">
            <h1>Brick &amp; Block Calculator</h1>
            <p className="tool-description">
                Estimate how many bricks or concrete blocks you need for a wall, based on wall size,
                brick size, mortar joint thickness, and a waste allowance for cuts and breakage. This is
                an estimate for planning purposes - always confirm quantities with your supplier or a
                professional before ordering.
            </p>
            <div className="tool-controls">
                <label>
                    Brick/block size:
                    <select value={preset} onChange={(e) => handlePreset(e.target.value)}>
                        {Object.entries(PRESETS).map(([key, p]) => (
                            <option key={key} value={key}>
                                {p.label}
                            </option>
                        ))}
                        <option value="custom">Custom</option>
                    </select>
                </label>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="wall-length">Wall length (ft)</label>
                    <input id="wall-length" type="number" min={0} value={wallLength} onChange={(e) => setWallLength(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="wall-height">Wall height (ft)</label>
                    <input id="wall-height" type="number" min={0} value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="openings-area">Doors/windows area to subtract (sq ft)</label>
                    <input id="openings-area" type="number" min={0} value={openingsArea} onChange={(e) => setOpeningsArea(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="waste-pct">Waste allowance (%)</label>
                    <input id="waste-pct" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="brick-length">Brick/block length (in)</label>
                    <input id="brick-length" type="number" min={0} step="0.001" value={brickLength} onChange={(e) => { setPreset('custom'); setBrickLength(e.target.value); }} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="brick-height">Brick/block height (in)</label>
                    <input id="brick-height" type="number" min={0} step="0.001" value={brickHeight} onChange={(e) => { setPreset('custom'); setBrickHeight(e.target.value); }} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="joint">Mortar joint thickness (in)</label>
                    <input id="joint" type="number" min={0} step="0.0625" value={joint} onChange={(e) => setJoint(e.target.value)} />
                </div>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {data && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter positive wall dimensions and brick/block dimensions.
                </div>
            )}
            {data && valid && wallArea <= 0 && (
                <div className="tool-error">
                    <strong>Error:</strong> Wall area after subtracting openings must be greater than zero.
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>Net wall area:</strong> {wallArea.toFixed(2)} sq ft
                    </div>
                    <div>
                        <strong>Bricks/blocks per sq ft:</strong> {result.bricksPerSqFt.toFixed(3)}
                    </div>
                    <div>
                        <strong>Raw count needed:</strong> {Math.ceil(result.rawCount)}
                    </div>
                    <div>
                        <strong>With {waste}% waste allowance:</strong> {Math.ceil(result.withWaste)} bricks/blocks
                    </div>
                </div>
            )}
        </div>
    );
}
