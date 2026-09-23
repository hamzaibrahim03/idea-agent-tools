import { useEffect, useState } from 'react';
export default function LeetSpeakConverter() {
  const [input, setInput] = useState('');
  const [intensity, setIntensity] = useState('light');
  const [output, setOutput] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/leet-speak-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, intensity } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else setOutput(data.output || '');
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, intensity]);
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
      <h1>Leet Speak Converter</h1>
      <p className="tool-description">
        Convert text into "leet speak" (1337) using common character substitutions like a-&gt;4,
        e-&gt;3, i-&gt;1, o-&gt;0, s-&gt;5, and t-&gt;7. Choose a light level for just the classic,
        easy-to-read swaps, or aggressive for more letters replaced.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Intensity:
          <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
            <option value="light">Light (a, e, i, o, s, t)</option>
            <option value="aggressive">Aggressive (+ b, g, l, z)</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="leet-input">Text</label>
          <textarea
            id="leet-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="leet-output">Leet speak</label>
          <textarea id="leet-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
