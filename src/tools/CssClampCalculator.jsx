import { useState } from 'react';
function buildClamp({ minSize, maxSize, minWidth, maxWidth }) {
    const slope = (maxSize - minSize) / (maxWidth - minWidth);
    const yIntercept = minSize - slope * minWidth;
    const slopeVw = slope * 100;
    const minRem = (minSize / 16).toFixed(4).replace(/\.?0+$/, '');
    const maxRem = (maxSize / 16).toFixed(4).replace(/\.?0+$/, '');
    const preferred = `${yIntercept.toFixed(4).replace(/\.?0+$/, '')}px + ${slopeVw.toFixed(4).replace(/\.?0+$/, '')}vw`;
    return `clamp(${minRem}rem, ${preferred}, ${maxRem}rem)`;
}
export default function CssClampCalculator() {
    const [minSize, setMinSize] = useState(16);
    const [maxSize, setMaxSize] = useState(32);
    const [minWidth, setMinWidth] = useState(400);
    const [maxWidth, setMaxWidth] = useState(1200);
    const [copied, setCopied] = useState(false);
    const valid = maxWidth > minWidth && maxSize >= minSize;
    const clampValue = valid ? buildClamp({ minSize, maxSize, minWidth, maxWidth }) : null;
    const css = clampValue ? `font-size: ${clampValue};` : '';
    async function handleCopy() {
        if (!css) return;
        try {
            await navigator.clipboard.writeText(css);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>CSS Clamp Calculator</h1>
            <p className="tool-description">
                Enter a minimum and maximum font size along with the viewport widths they apply at, and
                get the matching CSS <code>clamp()</code> expression for fluid, responsive typography.
                Runs entirely in your browser.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="min-size">Min font size (px)</label>
                    <input id="min-size" type="number" value={minSize} onChange={(e) => setMinSize(Number(e.target.value))} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="max-size">Max font size (px)</label>
                    <input id="max-size" type="number" value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="min-width">Min viewport width (px)</label>
                    <input id="min-width" type="number" value={minWidth} onChange={(e) => setMinWidth(Number(e.target.value))} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="max-width">Max viewport width (px)</label>
                    <input id="max-width" type="number" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} />
                </div>
            </div>
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Max viewport width must exceed min viewport width, and max font
                    size must be at least the min font size.
                </div>
            )}
            {valid && (
                <>
                    <div className="tool-panel">
                        <label>Preview (resize your browser to see it scale)</label>
                        <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, fontSize: `clamp(${minSize / 16}rem, ${(minSize - ((maxSize - minSize) / (maxWidth - minWidth)) * minWidth).toFixed(4)}px + ${(((maxSize - minSize) / (maxWidth - minWidth)) * 100).toFixed(4)}vw, ${maxSize / 16}rem)`, }} >
                            Fluid text sample
                        </div>
                    </div>
                    <div className="tool-controls">
                        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
                    </div>
                    <div className="tool-panel">
                        <label htmlFor="clamp-output">Generated CSS</label>
                        <textarea id="clamp-output" value={css} readOnly spellCheck={false} />
                    </div>
                </>
            )}
        </div>
    );
}
