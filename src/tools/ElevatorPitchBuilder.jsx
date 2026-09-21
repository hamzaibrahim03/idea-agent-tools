import { useState } from 'react';
const WORDS_PER_MINUTE = 130;
export default function ElevatorPitchBuilder() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [uniqueValue, setUniqueValue] = useState('');
  const [copied, setCopied] = useState(false);
  const pitch = [
    problem && `For ${targetCustomer || 'our target customers'}, ${problem}.`,
    solution && `Our solution is ${solution}.`,
    uniqueValue && `Unlike other options, ${uniqueValue}.`
  ]
    .filter(Boolean)
    .join(' ');
  const wordCount = pitch.trim() ? pitch.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((wordCount / WORDS_PER_MINUTE) * 60);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Elevator Pitch Builder</h1>
      <p className="tool-description">
        Answer four guided questions - problem, solution, target customer, and unique value - to
        assemble a structured elevator pitch using a standard pitch formula, with a word count and
        estimated speaking time. This fills in a fixed template from your own answers; it does not
        write or invent pitch content for you. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pitch-customer">Target customer</label>
          <input id="pitch-customer" type="text" value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} placeholder="e.g. small restaurant owners" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pitch-problem">Problem they face</label>
          <input id="pitch-problem" type="text" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g. tracking inventory manually wastes hours each week" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pitch-solution">Your solution</label>
          <input id="pitch-solution" type="text" value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="e.g. an app that automates inventory tracking" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pitch-value">Unique value</label>
          <input id="pitch-value" type="text" value={uniqueValue} onChange={(e) => setUniqueValue(e.target.value)} placeholder="e.g. we integrate directly with your POS system" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy} disabled={!pitch}>
          {copied ? 'Copied!' : 'Copy pitch'}
        </button>
      </div>
      {pitch ? (
        <div className="timestamp-result">
          <div>{pitch}</div>
          <div>
            <strong>Word count:</strong> <code>{wordCount}</code>
          </div>
          <div>
            <strong>Estimated speaking time:</strong> <code>~{estimatedSeconds}s</code>
          </div>
        </div>
      ) : (
        <p className="tool-placeholder">Fill in the fields above to build your pitch.</p>
      )}
    </div>
  );
}
