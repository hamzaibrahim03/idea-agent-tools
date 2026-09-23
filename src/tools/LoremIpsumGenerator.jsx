import { useEffect, useState } from 'react';
export default function LoremIpsumGenerator() {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [fetchError, setFetchError] = useState('');
  async function generate() {
    setFetchError('');
    try {
      const r = await fetch('/api/tools/lorem-ipsum-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { paragraphCount, startClassic } })
      });
      const data = await r.json();
      if (data.error) setFetchError(data.error);
      else setOutput(data.output || '');
    } catch (e) {
      setFetchError(e.message || 'Failed to compute');
    }
  }
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleGenerate() {
    generate();
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
      <h1>Lorem Ipsum Generator</h1>
      <p className="tool-description">
        Generate placeholder Lorem Ipsum text for mockups and layouts.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
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
        <label className="checkbox-label">
          <input type="checkbox" checked={startClassic} onChange={(e) => setStartClassic(e.target.checked)} />
          Start with classic opening
        </label>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="tool-panel">
        <textarea readOnly value={output} style={{ minHeight: 300 }} />
      </div>
    </div>
  );
}
