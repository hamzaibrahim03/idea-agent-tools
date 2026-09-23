import { useState } from 'react';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
function rangeOptions(count, start = 0) {
  return Array.from({ length: count }, (_, i) => i + start);
}
function buildField(mode, everyStep, fixedValue, selectedSet) {
  if (mode === 'every') return everyStep > 1 ? `*/${everyStep}` : '*';
  if (mode === 'fixed') return String(fixedValue);
  if (mode === 'list') {
    const values = [...selectedSet].sort((a, b) => a - b);
    return values.length ? values.join(',') : '*';
  }
  return '*';
}
function FieldBuilder({ label, max, min = 0, mode, setMode, everyStep, setEveryStep, fixedValue, setFixedValue, selectedSet, toggleSelected, labels }) {
  const options = rangeOptions(max - min + 1, min);
  return (
    <div className="tool-panel">
      <label>{label}</label>
      <div className="tool-controls" style={{ marginBottom: 8 }}>
        <label>
          <input type="radio" checked={mode === 'every'} onChange={() => setMode('every')} /> Every
        </label>
        <label>
          <input type="radio" checked={mode === 'fixed'} onChange={() => setMode('fixed')} /> At
        </label>
        <label>
          <input type="radio" checked={mode === 'list'} onChange={() => setMode('list')} /> Specific
        </label>
      </div>
      {mode === 'every' && (
        <label>
          Every
          <input
            type="number"
            min={1}
            max={max}
            value={everyStep}
            onChange={(e) => setEveryStep(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: 70, marginLeft: 6 }}
          />
          {' '}unit(s)
        </label>
      )}
      {mode === 'fixed' && (
        <select value={fixedValue} onChange={(e) => setFixedValue(Number(e.target.value))}>
          {options.map((v) => (
            <option key={v} value={v}>{labels ? labels[v - min] : v}</option>
          ))}
        </select>
      )}
      {mode === 'list' && (
        <div className="tool-controls">
          {options.map((v) => (
            <label className="checkbox-label" key={v}>
              <input type="checkbox" checked={selectedSet.has(v)} onChange={() => toggleSelected(v)} />
              {labels ? labels[v - min] : v}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
function useFieldState(defaultFixed = 0) {
  const [mode, setMode] = useState('every');
  const [everyStep, setEveryStep] = useState(1);
  const [fixedValue, setFixedValue] = useState(defaultFixed);
  const [selectedSet, setSelectedSet] = useState(new Set());
  function toggleSelected(v) {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  }
  return { mode, setMode, everyStep, setEveryStep, fixedValue, setFixedValue, selectedSet, toggleSelected };
}
export default function CronExpressionBuilder() {
  const minute = useFieldState(0);
  const hour = useFieldState(0);
  const dayOfMonth = useFieldState(1);
  const month = useFieldState(1);
  const dayOfWeek = useFieldState(1);
  const [copied, setCopied] = useState(false);
  const expression = [
    buildField(minute.mode, minute.everyStep, minute.fixedValue, minute.selectedSet),
    buildField(hour.mode, hour.everyStep, hour.fixedValue, hour.selectedSet),
    buildField(dayOfMonth.mode, dayOfMonth.everyStep, dayOfMonth.fixedValue, dayOfMonth.selectedSet),
    buildField(month.mode, month.everyStep, month.fixedValue, month.selectedSet),
    buildField(dayOfWeek.mode, dayOfWeek.everyStep, dayOfWeek.fixedValue, dayOfWeek.selectedSet)
  ].join(' ');
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Cron Expression Builder</h1>
      <p className="tool-description">
        Build a 5-field cron expression from a form - pick each field with dropdowns and checkboxes
        instead of writing cron syntax by hand. (Already have an expression and want it explained
        instead? Use the Cron Expression Parser.) Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy expression'}</button>
      </div>
      <div className="tool-grid">
        <FieldBuilder label="Minute (0-59)" min={0} max={59} {...minute} />
        <FieldBuilder label="Hour (0-23)" min={0} max={23} {...hour} />
        <FieldBuilder label="Day of month (1-31)" min={1} max={31} {...dayOfMonth} />
        <FieldBuilder label="Month (1-12)" min={1} max={12} labels={MONTHS} {...month} />
        <FieldBuilder label="Day of week (0-6, Sun-Sat)" min={0} max={6} labels={WEEKDAYS} {...dayOfWeek} />
      </div>
      <div className="tool-panel">
        <label htmlFor="cron-builder-output">Cron expression</label>
        <input
          id="cron-builder-output"
          type="text"
          value={expression}
          readOnly
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
    </div>
  );
}
