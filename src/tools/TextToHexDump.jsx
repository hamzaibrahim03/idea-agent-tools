import { useEffect, useState } from 'react';
export default function TextToHexDump() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [byteLength, setByteLength] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-to-hex-dump', {
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
            setByteLength(data.byteLength);
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
      <h1>Text to Hex Dump</h1>
      <p className="tool-description">
        Paste text to see a classic hex dump: byte offset, hexadecimal bytes, and their printable
        ASCII representation, 16 bytes per row, using UTF-8 byte encoding. Runs entirely in your
        browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <span className="tool-placeholder">{byteLength} byte{byteLength === 1 ? '' : 's'} (UTF-8)</span>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy hex dump'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="hex-input">Input</label>
        <textarea id="hex-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste or type text here" />
      </div>
      {output && (
        <div className="tool-panel">
          <label>Hex dump</label>
          <pre className="regex-highlighted">{output}</pre>
        </div>
      )}
    </div>
  );
}
