import { useState } from 'react';
const CATEGORIES = {
  Faces: ['😀', '😂', '🥹', '😉', '😍', '🤔', '😎', '🥳', '😴', '🤯', '😭', '🙃', '🤪', '😇', '🫠'],
  Animals: ['🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🦁', '🐸', '🐵', '🦄', '🐧', '🦉', '🐢', '🐙', '🦋'],
  Food: ['🍕', '🍔', '🌮', '🍣', '🍩', '🍪', '🍉', '🍓', '🥑', '🍇', '🧁', '🍫', '🍿', '🥐', '🍜'],
  Objects: ['💡', '🎈', '🎁', '📚', '🎸', '⌚', '🔑', '🧩', '🎮', '📷', '🕹️', '🧸', '🪁', '🧴', '🛼'],
  Nature: ['🌵', '🌲', '🌸', '🌈', '⭐', '🔥', '🌊', '☀️', '❄️', '🍀', '🌙', '⚡', '🌻', '🍁', '🌴']
};
const ALL_CATEGORY = 'All';
function randomIndex(length) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % length);
  let x;
  do {
    x = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return x % length;
}
function pickEmojis(pool, count) {
  return Array.from({ length: count }, () => pool[randomIndex(pool.length)]);
}
export default function RandomEmojiPicker() {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [count, setCount] = useState(1);
  const [picked, setPicked] = useState([]);
  const [copied, setCopied] = useState(false);
  const pool = category === ALL_CATEGORY ? Object.values(CATEGORIES).flat() : CATEGORIES[category];
  function handlePick() {
    const n = Math.max(1, Math.min(50, Number(count) || 1));
    setPicked(pickEmojis(pool, n));
    setCopied(false);
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
            {Object.keys(CATEGORIES).map((cat) => (
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
      {picked.length > 0 && (
        <div className="timestamp-result">
          <span style={{ fontSize: 36, letterSpacing: 4 }}>{picked.join(' ')}</span>
        </div>
      )}
    </div>
  );
}
