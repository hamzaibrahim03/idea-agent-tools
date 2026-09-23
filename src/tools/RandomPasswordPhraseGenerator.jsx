import { useEffect, useRef, useState } from 'react';
export default function RandomPasswordPhraseGenerator() {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(false);
  const [includeNumber, setIncludeNumber] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const didInit = useRef(false);
  function generate(n, sep, cap, num) {
    setError('');
    fetch('/api/tools/random-password-phrase-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { wordCount: n, separator: sep, capitalize: cap, includeNumber: num } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPassphrase(data.passphrase);
      })
      .catch((e) => setError(e.message || 'Failed to compute'));
  }
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    generate(4, '-', false, false);
  }, []);
  function handleGenerate() {
    const n = Math.max(2, Math.min(10, Number(wordCount) || 4));
    generate(n, separator, capitalize, includeNumber);
    setCopied(false);
  }
  async function handleCopy() {
    if (!passphrase) return;
    try {
      await navigator.clipboard.writeText(passphrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Passphrase Generator</h1>
      <p className="tool-description">
        Generate a memorable passphrase from several random dictionary words (the classic
        "correct horse battery staple" approach), using your browser's cryptographically-random
        source - distinct from a random-character password. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Words:
          <input
            type="number"
            min={2}
            max={10}
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <label>
          Separator:
          <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=" ">Space</option>
            <option value=".">Period (.)</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} />
          Capitalize words
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={includeNumber} onChange={(e) => setIncludeNumber(e.target.checked)} />
          Add a number
        </label>
      </div>
      <div className="tool-controls">
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleCopy} disabled={!passphrase}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {passphrase && (
        <div className="timestamp-result">
          <code style={{ fontSize: 18, wordBreak: 'break-all' }}>{passphrase}</code>
        </div>
      )}
    </div>
  );
}
