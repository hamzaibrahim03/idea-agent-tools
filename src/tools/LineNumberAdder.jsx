import { useEffect, useState } from 'react';
export default function LineNumberAdder() {
  const [input, setInput] = useState('');
  const [start, setStart] = useState(1);
  const [padWidth, setPadWidth] = useState(1);
  const [separator, setSeparator] = useState(': ');
  const [output, setOutput] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/line-number-adder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, start, padWidth, separator } })
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
  }, [input, start, padWidth, separator]);
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
      <h1>Line Number Adder</h1>
      <p className="tool-description">
        Paste text and prepend a line number to every line, with a configurable starting number,
        zero-padding width, and separator.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Start at:
          <input
            type="number"
            min={0}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <label>
          Min digits:
          <input
            type="number"
            min={1}
            max={10}
            value={padWidth}
            onChange={(e) => setPadWidth(e.target.value)}
            style={{ width: '60px' }}
          />
        </label>
        <label>
          Separator:
          <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value=": ">Colon (": ")</option>
            <option value=". ">Period (". ")</option>
            <option value=") ">Paren (") ")</option>
            <option value="\t">Tab</option>
            <option value=" ">Space</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ln-input">Input</label>
          <textarea id="ln-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste text here" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ln-output">Numbered output</label>
          <textarea id="ln-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
