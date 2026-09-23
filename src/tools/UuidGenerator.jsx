import { useState } from 'react';
export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState(() => generateMany(5));
  const [copiedAll, setCopiedAll] = useState(false);
  function generateMany(n) {
    return Array.from({ length: n }, () => crypto.randomUUID());
  }
  function handleGenerate() {
    setUuids(generateMany(Math.min(Math.max(count, 1), 100)));
    setCopiedAll(false);
  }
  const displayed = uuids.map((u) => (uppercase ? u.toUpperCase() : u));
  async function copyAll() {
    try {
      await navigator.clipboard.writeText(displayed.join('\n'));
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
        Generate random UUIDs (version 4), using your browser's built-in cryptographically-random
        generator - not a fake lookalike.
      </p>
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
        <button onClick={copyAll} disabled={displayed.length === 0}>
          {copiedAll ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      <ul className="uuid-list">
        {displayed.map((u, i) => (
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
