import { useEffect, useState } from 'react';
export default function TextEmojiTranslator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-emoji-translator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setOutput(data.output);
            setMatchCount(data.matchCount);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Text Emoji Translator</h1>
      <p className="tool-description">
        Type text and common words get a matching emoji added after them (e.g. "happy" -&gt; "happy
        😊", "love" -&gt; "love ❤️"). Uses a curated lookup table of everyday words and phrases - fun,
        not exhaustive. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="emoji-input">Text</label>
          <textarea
            id="emoji-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I am so happy, this is fire!"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="emoji-output">With emoji</label>
          <textarea id="emoji-output" value={output} readOnly />
        </div>
      </div>
      {input && (
        <div className="timestamp-result">
          <span>
            <strong>Words matched:</strong> {matchCount}
          </span>
        </div>
      )}
    </div>
  );
}
