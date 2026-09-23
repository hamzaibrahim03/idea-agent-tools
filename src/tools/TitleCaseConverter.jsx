import { useEffect, useState } from 'react';
export default function TitleCaseConverter() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('ap');
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/title-case-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, style } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setOutput(data.output);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, style]);
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
      <h1>Title Case Converter</h1>
      <p className="tool-description">
        Convert text to proper title case following standard style-guide rules: major words are
        capitalized, while minor words (articles, short conjunctions, short prepositions) stay
        lowercase unless they are the first or last word. Choose between AP style (short words of
        3 letters or fewer stay lowercase) and Chicago style (a fixed list of minor words). Runs
        entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Style:
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="ap">AP style</option>
            <option value="chicago">Chicago style</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="tc-input">Input</label>
          <textarea id="tc-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="the quick brown fox jumps over the lazy dog" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tc-output">Title case output</label>
          <textarea id="tc-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
