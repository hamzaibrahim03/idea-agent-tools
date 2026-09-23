import { useEffect, useState } from 'react';
const MAX_VALUE = 999999999999;
export default function NumberToWordsConverter() {
  const [input, setInput] = useState('');
  const [words, setWords] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (input.trim() === '') {
      setWords('');
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/number-to-words-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) { setError(data.error); setWords(''); }
          else setWords(data.words);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  async function handleCopy() {
    if (!words) return;
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Number to Words Converter</h1>
      <p className="tool-description">
        Convert a number into its English words form, e.g. 1234 becomes "one thousand two hundred
        thirty-four". Supports whole numbers up to 999,999,999,999. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!words}>
          {copied ? 'Copied!' : 'Copy words'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="n2w-input">Number</label>
        <input
          id="n2w-input"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1234"
        />
        {error && <span className="tool-error-inline">{error}</span>}
      </div>
      <div className="tool-panel">
        <label htmlFor="n2w-output">In words</label>
        <input id="n2w-output" type="text" value={words} readOnly />
      </div>
    </div>
  );
}
