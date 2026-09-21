import { useState } from 'react';
function buildBorderRadius(corners) {
  const { tl, tr, br, bl } = corners;
  const allEqualAxes = [tl, tr, br, bl].every((c) => c.h === c.v);
  if (allEqualAxes) {
    return `${tl.h}px ${tr.h}px ${br.h}px ${bl.h}px`;
  }
  const horizontals = `${tl.h}px ${tr.h}px ${br.h}px ${bl.h}px`;
  const verticals = `${tl.v}px ${tr.v}px ${br.v}px ${bl.v}px`;
  return `${horizontals} / ${verticals}`;
}
const CORNER_LABELS = {
  tl: 'Top left',
  tr: 'Top right',
  br: 'Bottom right',
  bl: 'Bottom left',
};
export default function CssBorderRadiusGenerator() {
  const [linked, setLinked] = useState(true);
  const [linkedRadius, setLinkedRadius] = useState(24);
  const [corners, setCorners] = useState({
    tl: { h: 24, v: 24 },
    tr: { h: 24, v: 24 },
    br: { h: 24, v: 24 },
    bl: { h: 24, v: 24 },
  });
  const [copied, setCopied] = useState(false);
  function updateCorner(key, axis, value) {
    setCorners((c) => ({ ...c, [key]: { ...c[key], [axis]: value } }));
  }
  function updateLinked(value) {
    setLinkedRadius(value);
    setCorners({
      tl: { h: value, v: value },
      tr: { h: value, v: value },
      br: { h: value, v: value },
      bl: { h: value, v: value },
    });
  }
  const radiusValue = buildBorderRadius(corners);
  const css = `border-radius: ${radiusValue};`;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>CSS Border Radius Generator</h1>
      <p className="tool-description">
        Adjust each corner's radius independently, or link them together, to build a CSS
        <code> border-radius</code> value with a live preview. Uses the full 8-value elliptical
        syntax when a corner's horizontal and vertical radii differ. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} />
          Link all corners
        </label>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
      </div>
      {linked ? (
        <div className="tool-controls">
          <label>
            All corners: {linkedRadius}px
            <input
              type="range"
              min={0}
              max={150}
              value={linkedRadius}
              onChange={(e) => updateLinked(Number(e.target.value))}
            />
          </label>
        </div>
      ) : (
        <div className="tool-grid">
          {Object.keys(corners).map((key) => (
            <div className="tool-panel" key={key}>
              <label>{CORNER_LABELS[key]}</label>
              <div className="tool-controls">
                <label>
                  H: {corners[key].h}px
                  <input
                    type="range"
                    min={0}
                    max={150}
                    value={corners[key].h}
                    onChange={(e) => updateCorner(key, 'h', Number(e.target.value))}
                  />
                </label>
                <label>
                  V: {corners[key].v}px
                  <input
                    type="range"
                    min={0}
                    max={150}
                    value={corners[key].v}
                    onChange={(e) => updateCorner(key, 'v', Number(e.target.value))}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="tool-panel">
        <label>Preview</label>
        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 180,
              height: 180,
              background: 'var(--accent-border)',
              borderRadius: radiusValue,
            }}
          />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="radius-output">Generated CSS</label>
        <textarea id="radius-output" value={css} readOnly spellCheck={false} />
      </div>
    </div>
  );
}
