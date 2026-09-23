import { useEffect, useState } from 'react';
const COMPONENT_TYPES = [
  { key: 'button', label: 'Button label' },
  { key: 'tooltip', label: 'Tooltip' },
  { key: 'toast', label: 'Toast / notification' },
  { key: 'heading', label: 'Section heading' },
  { key: 'placeholder', label: 'Input placeholder' },
  { key: 'errormsg', label: 'Error message' }
];
export default function UiCopyLengthChecker() {
  const [text, setText] = useState('');
  const [componentType, setComponentType] = useState('button');
  const [guideline, setGuideline] = useState({ label: 'Button label', min: 1, max: 25, note: '' });
  const [length, setLength] = useState(0);
  const [status, setStatus] = useState('empty');
  const [statusLabel, setStatusLabel] = useState('Enter some copy to check its length');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/ui-copy-length-checker', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { text, componentType } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setGuideline(data.guideline);
            setLength(data.length);
            setStatus(data.status);
            setStatusLabel(data.statusLabel);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [text, componentType]);
  return (
    <div className="tool-page">
      <h1>UI Copy Length Checker</h1>
      <p className="tool-description">
        Paste UI copy - a button label, tooltip, or similar - and check its character count against
        common UI component length guidelines. These are general conventions, not hard rules; your
        design system may differ. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Component type:
          <select value={componentType} onChange={(e) => setComponentType(e.target.value)}>
            {COMPONENT_TYPES.map((g) => (
              <option key={g.key} value={g.key}>{g.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label htmlFor="ucl-input">UI copy</label>
        <input id="ucl-input" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your UI copy" />
      </div>
      <div className="timestamp-result">
        <span><strong>Character count:</strong> {length}</span>
        <span><strong>Recommended range for {guideline.label.toLowerCase()}:</strong> {guideline.min}-{guideline.max} characters</span>
        <span>
          {status === 'good' ? '✅' : status === 'empty' ? '' : '⚠️'} {statusLabel}
        </span>
        <span style={{ opacity: 0.7 }}>{guideline.note}</span>
      </div>
    </div>
  );
}
