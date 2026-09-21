import { useState } from 'react';
const YES_NO_MAYBE = ['Yes', 'No', 'Maybe'];
function randomIndex(length) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % length);
  let x;
  do {
    x = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return x % length;
}
export default function DecisionMaker() {
  const [mode, setMode] = useState('options');
  const [optionsText, setOptionsText] = useState('Pizza\nSushi\nTacos\nBurgers');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const options = optionsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  function handleDecide() {
    if (mode === 'options') {
      if (options.length === 0) return;
      setResult(options[randomIndex(options.length)]);
    } else {
      setResult(YES_NO_MAYBE[randomIndex(YES_NO_MAYBE.length)]);
    }
  }
  return (
    <div className="tool-page">
      <h1>Decision Maker</h1>
      <p className="tool-description">
        Can't decide? Paste a list of options or ask a yes/no question, and this tool picks one at
        random using your browser's cryptographically-random source. It's a fun decision-helper,
        not authoritative advice - the real choice is still yours. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => { setMode(e.target.value); setResult(''); }}>
            <option value="options">Pick from a list</option>
            <option value="yesno">Yes / No / Maybe</option>
          </select>
        </label>
        <button onClick={handleDecide} disabled={mode === 'options' && options.length === 0}>
          Decide for me
        </button>
      </div>
      {mode === 'options' ? (
        <div className="tool-panel">
          <label htmlFor="options-input">Options (one per line)</label>
          <textarea
            id="options-input"
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder={'Option A\nOption B\nOption C'}
          />
        </div>
      ) : (
        <div className="tool-panel">
          <label htmlFor="question-input">Your question (optional, just for you)</label>
          <input
            id="question-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Should I get the tacos?"
          />
        </div>
      )}
      {mode === 'options' && options.length === 0 && (
        <div className="tool-error">Add at least one option.</div>
      )}
      {result && (
        <div className="timestamp-result">
          <span style={{ fontSize: 24 }}>
            <strong>{result}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
