import { useState } from 'react';
const REGIONS = ['US East', 'US West', 'EU West', 'EU Central', 'Asia Pacific (Tokyo)', 'Asia Pacific (Singapore)', 'South America', 'Australia'];
const BASE_LATENCY_MS = {
  'US East': { 'US East': 1, 'US West': 60, 'EU West': 80, 'EU Central': 95, 'Asia Pacific (Tokyo)': 150, 'Asia Pacific (Singapore)': 220, 'South America': 110, Australia: 200 },
  'US West': { 'US West': 1, 'EU West': 140, 'EU Central': 150, 'Asia Pacific (Tokyo)': 100, 'Asia Pacific (Singapore)': 170, 'South America': 170, Australia: 140 },
  'EU West': { 'EU West': 1, 'EU Central': 15, 'Asia Pacific (Tokyo)': 230, 'Asia Pacific (Singapore)': 170, 'South America': 190, Australia: 260 },
  'EU Central': { 'EU Central': 1, 'Asia Pacific (Tokyo)': 240, 'Asia Pacific (Singapore)': 160, 'South America': 200, Australia: 270 },
  'Asia Pacific (Tokyo)': { 'Asia Pacific (Tokyo)': 1, 'Asia Pacific (Singapore)': 70, 'South America': 280, Australia: 105 },
  'Asia Pacific (Singapore)': { 'Asia Pacific (Singapore)': 1, 'South America': 320, Australia: 95 },
  'South America': { 'South America': 1, Australia: 320 },
  Australia: { Australia: 1 }
};
function lookupBase(a, b) {
  if (a === b) return BASE_LATENCY_MS[a][b];
  return BASE_LATENCY_MS[a]?.[b] ?? BASE_LATENCY_MS[b]?.[a];
}
function simulateSample(baseMs) {
  const jitterBytes = new Uint32Array(1);
  crypto.getRandomValues(jitterBytes);
  const jitterFraction = (jitterBytes[0] / 0xffffffff) * 0.3 - 0.05;
  return Math.max(1, Math.round(baseMs * (1 + jitterFraction)));
}
export default function PingLatencySimulator() {
  const [regionA, setRegionA] = useState('US East');
  const [regionB, setRegionB] = useState('EU West');
  const [samples, setSamples] = useState([]);
  const baseMs = lookupBase(regionA, regionB);
  function handleSimulate() {
    const next = Array.from({ length: 5 }, () => simulateSample(baseMs));
    setSamples(next);
  }
  const avg = samples.length ? Math.round(samples.reduce((s, v) => s + v, 0) / samples.length) : null;
  return (
    <div className="tool-page">
      <h1>Ping Latency Simulator</h1>
      <p className="tool-description">
        Not a real network ping - there is no backend to measure against. This generates
        illustrative round-trip latency numbers for common cloud region pairs (e.g. "US East to EU
        West: ~80-100ms") based on typical real-world backbone figures, for educational reference
        only. Runs entirely in your browser; it never sends an actual network request.
      </p>
      <div className="tool-controls">
        <label>
          From:
          <select value={regionA} onChange={(e) => setRegionA(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select value={regionB} onChange={(e) => setRegionB(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSimulate}>Simulate 5 pings</button>
      </div>
      <div className="tool-panel">
        <label>Typical baseline</label>
        <div className="timestamp-result">
          <div>
            <strong>{regionA}</strong> to <strong>{regionB}</strong>: ~{baseMs}ms round-trip
            (typical range {Math.round(baseMs * 0.85)}-{Math.round(baseMs * 1.15)}ms)
          </div>
        </div>
      </div>
      {samples.length > 0 && (
        <div className="tool-panel">
          <label>Simulated samples</label>
          <ul className="uuid-list">
            {samples.map((s, i) => (
              <li key={i}>
                <code>Ping {i + 1}</code>
                <span>{s}ms</span>
              </li>
            ))}
          </ul>
          <div className="timestamp-result">
            <div>
              <strong>Average:</strong> {avg}ms
            </div>
          </div>
        </div>
      )}
      <div className="tool-panel">
        <label>Reference: typical latency between major cloud regions</label>
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Typical round-trip</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>US East to US West</td>
                <td>~55-65ms</td>
              </tr>
              <tr>
                <td>US East to EU West</td>
                <td>~75-95ms</td>
              </tr>
              <tr>
                <td>EU West to EU Central</td>
                <td>~12-18ms</td>
              </tr>
              <tr>
                <td>US East to Asia Pacific (Tokyo)</td>
                <td>~140-165ms</td>
              </tr>
              <tr>
                <td>EU West to Asia Pacific (Singapore)</td>
                <td>~160-190ms</td>
              </tr>
              <tr>
                <td>Asia Pacific (Tokyo) to Australia</td>
                <td>~95-115ms</td>
              </tr>
              <tr>
                <td>US West to South America</td>
                <td>~150-190ms</td>
              </tr>
              <tr>
                <td>Same region (same city)</td>
                <td>~1-2ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
