import { useEffect, useState } from 'react';
export default function FloorPlanAreaCalculator() {
    const [rooms, setRooms] = useState([
        { id: 1, name: 'Living Room', length: '18', width: '14' },
        { id: 2, name: 'Bedroom', length: '12', width: '11' }
    ]);
    const [rows, setRows] = useState([]);
    const [totalArea, setTotalArea] = useState(0);
    const [roomCount, setRoomCount] = useState(0);
    const [error, setError] = useState('');
    function updateRoom(id, field, value) {
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    }
    function addRoom() {
        setRooms((prev) => [...prev, { id: Date.now(), name: '', length: '', width: '' }]);
    }
    function removeRoom(id) {
        setRooms((prev) => prev.filter((r) => r.id !== id));
    }
    useEffect(() => {
        let cancelled = false;
        setError('');
        fetch('/api/tools/floor-plan-area-calculator', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ input: { rooms } })
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.error) setError(data.error);
                else {
                    setRows(data.rows || []);
                    setTotalArea(data.totalArea || 0);
                    setRoomCount(data.roomCount || 0);
                }
            })
            .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        return () => { cancelled = true; };
    }, [rooms]);
    return (
        <div className="tool-page">
            <h1>Floor Plan Area Calculator</h1>
            <p className="tool-description">
                Add each room's name, length, and width to calculate its floor area, plus the total floor
                area across all rooms.
            </p>
            <div className="tool-controls">
                <button type="button" onClick={addRoom}>
                    Add room
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Room</th>
                            <th>Length (ft)</th>
                            <th>Width (ft)</th>
                            <th>Area (sq ft)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((r, idx) => (
                            <tr key={r.id}>
                                <td>
                                    <input type="text" value={r.name} onChange={(e) => updateRoom(r.id, 'name', e.target.value)} placeholder="e.g. Kitchen" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={r.length} onChange={(e) => updateRoom(r.id, 'length', e.target.value)} style={{ width: '90px' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={r.width} onChange={(e) => updateRoom(r.id, 'width', e.target.value)} style={{ width: '90px' }} />
                                </td>
                                <td>
                                    <code>{rows[idx]?.area !== null && rows[idx]?.area !== undefined ? rows[idx].area.toFixed(2) : '-'}</code>
                                </td>
                                <td>
                                    <button type="button" className="uuid-copy-btn" onClick={() => removeRoom(r.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="timestamp-result">
                <div>
                    <strong>Total floor area:</strong> {totalArea.toFixed(2)} sq ft
                </div>
                <div>
                    <strong>Room count:</strong> {roomCount}
                </div>
            </div>
        </div>
    );
}
