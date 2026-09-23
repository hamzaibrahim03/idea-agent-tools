import { useEffect, useState } from 'react';
export default function RomanNumeralConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/roman-numeral-converter', {
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
            setValidationError(data.validationError);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  return (
    <div className="tool-page">
      <h1>Roman Numeral Converter</h1>
      <p className="tool-description">
        Convert between Arabic numbers (1-3999) and Roman numerals, in either direction. Runs
        entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="roman-input">Number or Roman numeral</label>
        <input
          id="roman-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1994 or MCMXCIV"
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {error && <div className="agent-error">{error}</div>}
      {validationError && <div className="tool-error">{validationError}</div>}
      {output && !validationError && (
        <div className="tool-panel">
          <label htmlFor="roman-output">Result</label>
          <input id="roman-output" type="text" value={output} readOnly style={{ fontFamily: 'var(--mono)' }} />
        </div>
      )}
    </div>
  );
}
