import { useEffect, useState } from 'react';
export default function RandomColorPaletteGenerator() {
  const [palette, setPalette] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [error, setError] = useState('');
  function handleRegenerate() {
    setError('');
    fetch('/api/tools/random-color-palette-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: {} })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPalette(data.palette);
        setCopiedIndex(-1);
      })
      .catch((e) => setError(e.message || 'Failed to generate'));
  }
  useEffect(() => {
    handleRegenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function handleCopy(hex, index) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Color Palette Generator</h1>
      <p className="tool-description">
        Generate a random 5-color palette using your browser's cryptographically-random source, with
        hue spread across the wheel and saturation/lightness kept in pleasant ranges. Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleRegenerate}>Regenerate palette</button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {palette.map((swatch, i) => (
          <div key={i} className="tool-panel" style={{ marginBottom: 0 }}>
            <div
              style={{
                height: 100,
                borderRadius: 8,
                background: swatch.hex,
                border: '1px solid var(--border)'
              }}
            />
            <button onClick={() => handleCopy(swatch.hex, i)} style={{ width: '100%' }}>
              {copiedIndex === i ? 'Copied!' : swatch.hex.toUpperCase()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
