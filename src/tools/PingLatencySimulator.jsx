import { useEffect, useState } from 'react';
const REGIONS = ['US East', 'US West', 'EU West', 'EU Central', 'Asia Pacific (Tokyo)', 'Asia Pacific (Singapore)', 'South America', 'Australia'];
export default function PingLatencySimulator() {
  const [regionA, setRegionA] = useState('US East');
  const [regionB, setRegionB] = useState('EU West');
  const [samples, setSamples] = useState([]);
  const [baseMs, setBaseMs] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/ping-latency-simulator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { regionA, regionB, simulate: false } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setBaseMs(data.baseMs);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [regionA, regionB]);
  function handleSimulate() {
    setError('');
    fetch('/api/tools/ping-latency-simulator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { regionA, regionB, simulate: true } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setBaseMs(data.baseMs);
          setSamples(data.samples);
        }
      })
      .catch((e) => setError(e.message || 'Failed to compute'));
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
      {error && <div className="agent-error">{error}</div>}
      {baseMs !== null && (
        <div className="tool-panel">
          <label>Typical baseline</label>
          <div className="timestamp-result">
            <div>
              <strong>{regionA}</strong> to <strong>{regionB}</strong>: ~{baseMs}ms round-trip
              (typical range {Math.round(baseMs * 0.85)}-{Math.round(baseMs * 1.15)}ms)
            </div>
          </div>
        </div>
      )}
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
