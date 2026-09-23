import { useState } from 'react';
const SIZES = [
  { px: 16, context: 'Inline text icons, dense list rows' },
  { px: 20, context: 'Toolbar icons, form field icons' },
  { px: 24, context: 'Standard UI icons, buttons, navigation' },
  { px: 32, context: 'Prominent action buttons, card icons' },
  { px: 48, context: 'Feature highlights, empty states' },
  { px: 64, context: 'Hero sections, onboarding illustrations' }
];
export default function IconSizeGuideGenerator() {
  const [selected, setSelected] = useState(SIZES.map((s) => s.px));
  function toggle(px) {
    setSelected((sel) => (sel.includes(px) ? sel.filter((p) => p !== px) : [...sel, px]));
  }
  return (
    <div className="tool-page">
      <h1>Icon Size Guide</h1>
      <p className="tool-description">
        A reference tool showing standard UI icon sizing conventions with visual preview boxes at
        each size and typical usage-context notes. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        {SIZES.map((s) => (
          <label key={s.px} className="checkbox-label">
            <input type="checkbox" checked={selected.includes(s.px)} onChange={() => toggle(s.px)} />
            {s.px}px
          </label>
        ))}
      </div>
      <div className="tool-panel">
        <label>Size preview</label>
        <div className="timestamp-result">
          {SIZES.filter((s) => selected.includes(s.px)).map((s) => (
            <span key={s.px} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  width: s.px,
                  height: s.px,
                  minWidth: s.px,
                  border: '2px solid var(--accent-border)',
                  borderRadius: 4,
                  background: 'var(--accent-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
              <code style={{ width: 50 }}>{s.px}px</code>
              <span style={{ opacity: 0.75 }}>{s.context}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
