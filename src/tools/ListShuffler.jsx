import { useState } from 'react';
function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export default function ListShuffler() {
  const [input, setInput] = useState('Apple\nBanana\nCherry\nDate\nElderberry');
  const [shuffled, setShuffled] = useState([]);
  const [copied, setCopied] = useState(false);
  const items = input.split('\n').map((l) => l.trim()).filter(Boolean);
  function handleShuffle() {
    setShuffled(shuffle(items));
    setCopied(false);
  }
  function pickOne() {
    if (items.length === 0) return;
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % items.length;
    setShuffled([items[idx]]);
    setCopied(false);
  }
  async function handleCopy() {
    if (shuffled.length === 0) return;
    try {
      await navigator.clipboard.writeText(shuffled.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>List Randomizer / Shuffler</h1>
      <p className="tool-description">
        Paste a list (one item per line) to shuffle it or pick one item at random. Runs entirely
        in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="list-input">List (one item per line)</label>
        <textarea id="list-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </div>
      <div className="tool-controls">
        <button onClick={handleShuffle} disabled={items.length === 0}>
          Shuffle all
        </button>
        <button onClick={pickOne} disabled={items.length === 0}>
          Pick one at random
        </button>
        <button onClick={handleCopy} disabled={shuffled.length === 0}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
      </div>
      {shuffled.length > 0 && (
        <ul className="uuid-list">
          {shuffled.map((item, i) => (
            <li key={i}>
              <code>{item}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
