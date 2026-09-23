import { useEffect, useState } from 'react';
export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [error, setError] = useState('');
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError('');
    fetch('/api/tools/uuid-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { count: 5, uppercase: false } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else setUuids(data.uuids);
      })
      .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleGenerate() {
    setError('');
    fetch('/api/tools/uuid-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { count: Math.min(Math.max(count, 1), 100), uppercase } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setUuids(data.uuids);
          setCopiedAll(false);
        }
      })
      .catch((e) => setError(e.message || 'Failed to compute'));
  }
  async function copyAll() {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
    }
  }
  async function copyOne(u) {
    try {
      await navigator.clipboard.writeText(u);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>UUID Generator</h1>
      <p className="tool-description">
        Generate random UUIDs (version 4), using a cryptographically-random generator - not a fake
        lookalike.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Count:
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: '70px' }}
          />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
          Uppercase
        </label>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={copyAll} disabled={uuids.length === 0}>
          {copiedAll ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      <ul className="uuid-list">
        {uuids.map((u, i) => (
          <li key={i}>
            <code>{u}</code>
            <button className="uuid-copy-btn" onClick={() => copyOne(u)} title="Copy this UUID">
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
