import { useState } from 'react';
const GUIDELINES = [
  { key: 'button', label: 'Button label', min: 1, max: 25, note: 'Keep short and action-oriented (e.g. "Save changes")' },
  { key: 'tooltip', label: 'Tooltip', min: 10, max: 80, note: 'Brief explanatory text, one short sentence' },
  { key: 'toast', label: 'Toast / notification', min: 10, max: 100, note: 'Enough to convey the event, no more' },
  { key: 'heading', label: 'Section heading', min: 3, max: 40, note: 'Short and scannable' },
  { key: 'placeholder', label: 'Input placeholder', min: 3, max: 30, note: 'Example or hint text, not instructions' },
  { key: 'errormsg', label: 'Error message', min: 10, max: 120, note: 'Explain what went wrong and how to fix it' }
];
export default function UiCopyLengthChecker() {
  const [text, setText] = useState('');
  const [componentType, setComponentType] = useState('button');
  const guideline = GUIDELINES.find((g) => g.key === componentType);
  const length = text.length;
  const withinRange = length >= guideline.min && length <= guideline.max;
  const status = length === 0 ? 'empty' : withinRange ? 'good' : length < guideline.min ? 'short' : 'long';
  const statusLabel = {
    empty: 'Enter some copy to check its length',
    good: 'Within the recommended range',
    short: `Shorter than the typical ${guideline.min}-${guideline.max} character range`,
    long: `Longer than the typical ${guideline.min}-${guideline.max} character range`
  }[status];
  return (
    <div className="tool-page">
      <h1>UI Copy Length Checker</h1>
      <p className="tool-description">
        Paste UI copy - a button label, tooltip, or similar - and check its character count against
        common UI component length guidelines. These are general conventions, not hard rules; your
        design system may differ. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Component type:
          <select value={componentType} onChange={(e) => setComponentType(e.target.value)}>
            {GUIDELINES.map((g) => (
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
