import { useState } from 'react';
const CATEGORIES = ['Faces', 'Animals', 'Food', 'Objects', 'Nature'];
const ALL_CATEGORY = 'All';
export default function RandomEmojiPicker() {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [count, setCount] = useState(1);
  const [picked, setPicked] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  function handlePick() {
    setError('');
    fetch('/api/tools/random-emoji-picker', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { category, count } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPicked(data.picked);
        setCopied(false);
      })
      .catch((e) => setError(e.message || 'Failed to pick'));
  }
  async function handleCopy() {
    if (picked.length === 0) return;
    try {
      await navigator.clipboard.writeText(picked.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Emoji Picker</h1>
      <p className="tool-description">
        Pick a random emoji (or several) from a curated set, optionally filtered by category,
        using your browser's cryptographically-random source. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value={ALL_CATEGORY}>All</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          Count:
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <button onClick={handlePick}>Pick</button>
        <button onClick={handleCopy} disabled={picked.length === 0}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {picked.length > 0 && (
        <div className="timestamp-result">
          <span style={{ fontSize: 36, letterSpacing: 4 }}>{picked.join(' ')}</span>
        </div>
      )}
    </div>
  );
}
