import { useState } from 'react';
export default function ListShuffler() {
  const [input, setInput] = useState('Apple\nBanana\nCherry\nDate\nElderberry');
  const [shuffled, setShuffled] = useState([]);
  const [copied, setCopied] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const items = input.split('\n').map((l) => l.trim()).filter(Boolean);
  async function runAction(action) {
    setFetchError('');
    try {
      const r = await fetch('/api/tools/list-randomizer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { items, action } })
      });
      const data = await r.json();
      if (data.error) setFetchError(data.error);
      else {
        setShuffled(data.shuffled || []);
        setCopied(false);
      }
    } catch (e) {
      setFetchError(e.message || 'Failed to compute');
    }
  }
  function handleShuffle() {
    runAction('shuffle');
  }
  function pickOne() {
    runAction('pickOne');
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
        Paste a list (one item per line) to shuffle it or pick one item at random.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
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
