import { useState } from 'react';
const DEFAULT_STOPS = [
  { name: 'Warehouse', distanceFromPrev: '0' },
  { name: 'Stop A', distanceFromPrev: '18' },
  { name: 'Stop B', distanceFromPrev: '12' },
  { name: 'Stop C', distanceFromPrev: '25' }
];
export default function RouteDistanceCalculator() {
  const [stops, setStops] = useState(DEFAULT_STOPS);
  const [avgSpeed, setAvgSpeed] = useState('40');
  function updateStop(index, field, value) {
    setStops((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }
  function addStop() {
    setStops((prev) => [...prev, { name: '', distanceFromPrev: '' }]);
  }
  function removeStop(index) {
    setStops((prev) => prev.filter((_, i) => i !== index));
  }
  const speedNum = Number(avgSpeed);
  const speedValid = Number.isFinite(speedNum) && speedNum > 0;
  const totalDistance = stops.reduce((sum, s, i) => {
    if (i === 0) return sum;
    const d = Number(s.distanceFromPrev);
    return sum + (Number.isFinite(d) && d >= 0 ? d : 0);
  }, 0);
  const totalHours = speedValid ? totalDistance / speedNum : null;
  function formatDuration(hours) {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }
  return (
    <div className="tool-page">
      <h1>Route Stop Planner</h1>
      <p className="tool-description">
        Enter a list of stop names and the distance from each stop to the next - this site has no map
        or live routing data, so distances must be entered manually (e.g. from an odometer or your own
        route planning). The tool sums total route distance and estimates total drive time from your
        average speed. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Average speed (distance unit/hour):
          <input type="number" min={0} value={avgSpeed} onChange={(e) => setAvgSpeed(e.target.value)} style={{ width: '90px' }} />
        </label>
        <button type="button" onClick={addStop}>
          Add stop
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Stop name</th>
              <th>Distance from previous stop</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stops.map((s, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={s.name} onChange={(e) => updateStop(i, 'name', e.target.value)} placeholder={i === 0 ? 'Start location' : `Stop ${i}`} style={{ width: '100%' }} />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={s.distanceFromPrev}
                    onChange={(e) => updateStop(i, 'distanceFromPrev', e.target.value)}
                    disabled={i === 0}
                    style={{ width: '100px' }}
                  />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeStop(i)} disabled={stops.length <= 1}>
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
          <strong>Total route distance:</strong> {totalDistance.toLocaleString()}
        </div>
        {speedValid && (
          <div>
            <strong>Estimated total drive time:</strong> {formatDuration(totalHours)}
          </div>
        )}
      </div>
    </div>
  );
}
