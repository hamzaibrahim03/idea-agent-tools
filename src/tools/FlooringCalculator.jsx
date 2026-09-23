import { useEffect, useState } from 'react';
export default function FlooringCalculator() {
    const [roomLength, setRoomLength] = useState('12');
    const [roomWidth, setRoomWidth] = useState('10');
    const [tileUnit, setTileUnit] = useState('in');
    const [tileLength, setTileLength] = useState('12');
    const [tileWidth, setTileWidth] = useState('12');
    const [waste, setWaste] = useState('10');
    const [boxCoverage, setBoxCoverage] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/flooring-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { roomLength, roomWidth, tileUnit, tileLength, tileWidth, waste, boxCoverage } })
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
    }, [roomLength, roomWidth, tileUnit, tileLength, tileWidth, waste, boxCoverage]);
    return (
        <div className="tool-page">
            <h1>Flooring / Tile Calculator</h1>
            <p className="tool-description">
                Calculate how many tiles you need to cover a room, based on room size, tile size, and a
                waste allowance for cuts. Optionally enter your tile box's coverage to see how many boxes
                to buy. This is an estimate - confirm with your supplier before ordering.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="room-length">Room length (ft)</label>
                    <input id="room-length" type="number" min={0} value={roomLength} onChange={(e) => setRoomLength(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="room-width">Room width (ft)</label>
                    <input id="room-width" type="number" min={0} value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="tile-unit">Tile size unit</label>
                    <select id="tile-unit" value={tileUnit} onChange={(e) => setTileUnit(e.target.value)}>
                        <option value="in">Inches</option>
                        <option value="ft">Feet</option>
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="tile-length">Tile length ({tileUnit})</label>
                    <input id="tile-length" type="number" min={0} value={tileLength} onChange={(e) => setTileLength(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="tile-width">Tile width ({tileUnit})</label>
                    <input id="tile-width" type="number" min={0} value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="waste-pct">Waste allowance (%)</label>
                    <input id="waste-pct" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="box-coverage">Box coverage (sq ft per box) - optional</label>
                    <input id="box-coverage" type="number" min={0} value={boxCoverage} onChange={(e) => setBoxCoverage(e.target.value)} placeholder="e.g. 15" />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result && result.tilesWithWaste !== null && (
                <div className="timestamp-result">
                    <div>
                        <strong>Room area:</strong> {result.roomAreaSqFt.toFixed(2)} sq ft
                    </div>
                    <div>
                        <strong>Tiles needed (before waste):</strong> {Math.ceil(result.rawTilesNeeded)}
                    </div>
                    <div>
                        <strong>Tiles needed (with {waste}% waste):</strong> {Math.ceil(result.tilesWithWaste)}
                    </div>
                    {result.boxesNeeded !== null && (
                        <div>
                            <strong>Boxes needed:</strong> {result.boxesNeeded}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
