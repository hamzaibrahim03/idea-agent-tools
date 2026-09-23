import { useEffect, useState } from 'react';
export default function PigLatinTranslator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    if (input === '') {
      setOutput('');
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/pig-latin-translator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
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
      <h1>Pig Latin Translator</h1>
      <p className="tool-description">
        Translate English text to Pig Latin: consonant clusters move to the end of the word plus
        "ay", and words that start with a vowel get "way" appended. This is one-directional -
        translating Pig Latin back to reliable English isn't possible. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pig-input">English text</label>
          <textarea
            id="pig-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste English text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="pig-output">Pig Latin</label>
          <textarea id="pig-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
