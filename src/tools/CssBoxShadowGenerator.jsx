import { useState } from 'react';
function buildBoxShadow({ offsetX, offsetY, blur, spread, color, inset }) {
    const parts = [`${offsetX}px`, `${offsetY}px`, `${blur}px`, `${spread}px`, color];
    if (inset) parts.push('inset');
    return `box-shadow: ${parts.join(' ')};`;
}
export default function CssBoxShadowGenerator() {
    const [offsetX, setOffsetX] = useState(10);
    const [offsetY, setOffsetY] = useState(10);
    const [blur, setBlur] = useState(20);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState('rgba(0, 0, 0, 0.35)');
    const [inset, setInset] = useState(false);
    const [copied, setCopied] = useState(false);
    const css = buildBoxShadow({ offsetX, offsetY, blur, spread, color, inset });
    const shadowValue = css.replace('box-shadow: ', '').replace(';', '');
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
            <h1>CSS Box Shadow Generator</h1>
            <p className="tool-description">
                Adjust offset, blur, spread, color, and inset to build a CSS <code>box-shadow</code> value
                with a live preview. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Offset X: {offsetX}px
                    <input type="range" min={-50} max={50} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
                </label>
                <label>
                    Offset Y: {offsetY}px
                    <input type="range" min={-50} max={50} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
                </label>
                <label>
                    Blur: {blur}px
                    <input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(Number(e.target.value))} />
                </label>
                <label>
                    Spread: {spread}px
                    <input type="range" min={-50} max={50} value={spread} onChange={(e) => setSpread(Number(e.target.value))} />
                </label>
            </div>
            <div className="tool-controls">
                <label>
                    Color:
                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '160px', fontFamily: 'var(--mono)' }} />
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
                    Inset
                </label>
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
            </div>
            <div className="tool-panel">
                <label>Preview</label>
                <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 140, height: 140, borderRadius: 8, background: 'var(--bg)', boxShadow: shadowValue, }} />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="shadow-output">Generated CSS</label>
                <textarea id="shadow-output" value={css} readOnly spellCheck={false} />
            </div>
        </div>
    );
}
