import { useEffect, useRef, useState } from 'react';
export default function RandomParagraphGenerator() {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const didInit = useRef(false);
  function generate(n) {
    setError('');
    fetch('/api/tools/random-paragraph-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { paragraphCount: n } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOutput(data.output);
      })
      .catch((e) => setError(e.message || 'Failed to compute'));
  }
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    generate(3);
  }, []);
  function handleGenerate() {
    generate(Math.max(1, Math.min(20, Number(paragraphCount) || 1)));
    setCopied(false);
  }
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
      <h1>Random Paragraph Generator</h1>
      <p className="tool-description">
        Generate readable-sounding placeholder paragraphs built from real English words and
        sentence patterns, instead of Latin Lorem Ipsum. Useful when you want filler text that
        still looks like language at a glance. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Paragraphs:
          <input
            type="number"
            min={1}
            max={20}
            value={paragraphCount}
            onChange={(e) => setParagraphCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-panel">
        <textarea readOnly value={output} style={{ minHeight: 300 }} />
      </div>
    </div>
  );
}
