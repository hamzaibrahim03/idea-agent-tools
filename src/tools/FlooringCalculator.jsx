import { useState } from 'react';
export default function FlooringCalculator() {
  const [roomLength, setRoomLength] = useState('12');
  const [roomWidth, setRoomWidth] = useState('10');
  const [tileUnit, setTileUnit] = useState('in');
  const [tileLength, setTileLength] = useState('12');
  const [tileWidth, setTileWidth] = useState('12');
  const [waste, setWaste] = useState('10');
  const [boxCoverage, setBoxCoverage] = useState('');
  const roomLengthNum = Number(roomLength);
  const roomWidthNum = Number(roomWidth);
  const tileLengthNum = Number(tileLength);
  const tileWidthNum = Number(tileWidth);
  const wasteNum = Number(waste);
  const boxCoverageNum = Number(boxCoverage);
  const valid =
    Number.isFinite(roomLengthNum) && roomLengthNum > 0 &&
    Number.isFinite(roomWidthNum) && roomWidthNum > 0 &&
    Number.isFinite(tileLengthNum) && tileLengthNum > 0 &&
    Number.isFinite(tileWidthNum) && tileWidthNum > 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const roomAreaSqFt = valid ? roomLengthNum * roomWidthNum : 0;
  const tileAreaSqFt = valid
    ? tileUnit === 'in'
      ? (tileLengthNum / 12) * (tileWidthNum / 12)
      : tileLengthNum * tileWidthNum
    : 0;
  const rawTilesNeeded = valid && tileAreaSqFt > 0 ? roomAreaSqFt / tileAreaSqFt : null;
  const tilesWithWaste = rawTilesNeeded !== null ? rawTilesNeeded * (1 + wasteNum / 100) : null;
  const boxesNeeded =
    tilesWithWaste !== null && Number.isFinite(boxCoverageNum) && boxCoverageNum > 0
      ? Math.ceil((tilesWithWaste * tileAreaSqFt) / boxCoverageNum)
      : null;
  return (
    <div className="tool-page">
      <h1>Flooring / Tile Calculator</h1>
      <p className="tool-description">
        Calculate how many tiles you need to cover a room, based on room size, tile size, and a
        waste allowance for cuts. Optionally enter your tile box's coverage to see how many boxes
        to buy. This is an estimate - confirm with your supplier before ordering. Runs entirely
        in your browser.
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
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive room and tile dimensions, and a non-negative waste percentage.
        </div>
      )}
      {tilesWithWaste !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Room area:</strong> {roomAreaSqFt.toFixed(2)} sq ft
          </div>
          <div>
            <strong>Tiles needed (before waste):</strong> {Math.ceil(rawTilesNeeded)}
          </div>
          <div>
            <strong>Tiles needed (with {waste}% waste):</strong> {Math.ceil(tilesWithWaste)}
          </div>
          {boxesNeeded !== null && (
            <div>
              <strong>Boxes needed:</strong> {boxesNeeded}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
