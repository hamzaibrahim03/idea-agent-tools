import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function buildTriangleCss(direction, size, color) {
    const transparent = { top: 'transparent', right: 'transparent', bottom: 'transparent', left: 'transparent' };
    const borders = { ...transparent };
    switch (direction) {
        case 'up':
            borders.bottom = color;
            break;
        case 'down':
            borders.top = color;
            break;
        case 'left':
            borders.right = color;
            break;
        case 'right':
            borders.left = color;
            break;
        default:
            break;
    }
    const vertical = direction === 'up' || direction === 'down';
    const lines = [
        'width: 0;',
        'height: 0;',
        vertical
            ? `border-left: ${size}px solid transparent;`
            : `border-top: ${size}px solid transparent;`,
        vertical
            ? `border-right: ${size}px solid transparent;`
            : `border-bottom: ${size}px solid transparent;`,
        direction === 'up' && `border-bottom: ${size}px solid ${color};`,
        direction === 'down' && `border-top: ${size}px solid ${color};`,
        direction === 'left' && `border-right: ${size}px solid ${color};`,
        direction === 'right' && `border-left: ${size}px solid ${color};`,
    ].filter(Boolean);
    return { css: lines.join('\n'), borders };
}
const DIRECTIONS = ['up', 'down', 'left', 'right'];
export default function CssTriangleGenerator() {
    const [direction, setDirection] = useState('up');
    const [size, setSize] = useState(50);
    const [color, setColor] = useState('#3b82f6');
    const [copied, setCopied] = useState(false);
    const { css, borders } = buildTriangleCss(direction, size, color);
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(css);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    function handleDownload() {
        downloadFile(css, 'triangle.css', 'text/css');
    }
    const vertical = direction === 'up' || direction === 'down';
    return (
        <div className="tool-page">
            <h1>CSS Triangle Generator</h1>
            <p className="tool-description">
                Pick a direction, size, and color to generate a pure-CSS triangle using the classic
                zero-width-border trick, with a live preview and copyable CSS. Runs entirely in your
                browser.
            </p>
            <div className="tool-controls">
                <label>
                    Direction:
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        {DIRECTIONS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Size: {size}px
                    <input type="range" min={10} max={150} value={size} onChange={(e) => setSize(Number(e.target.value))} />
                </label>
                <label>
                    Color:
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </label>
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
                <button onClick={handleDownload}>Download</button>
            </div>
            <div className="tool-panel">
                <label>Preview</label>
                <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 0, height: 0, borderTopWidth: vertical ? 0 : `${size}px`, borderBottomWidth: vertical ? 0 : `${size}px`, borderLeftWidth: vertical ? `${size}px` : 0, borderRightWidth: vertical ? `${size}px` : 0, borderStyle: 'solid', borderTopColor: borders.top, borderBottomColor: borders.bottom, borderLeftColor: borders.left, borderRightColor: borders.right, }} />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="triangle-output">Generated CSS</label>
                <textarea id="triangle-output" value={css} readOnly spellCheck={false} />
            </div>
        </div>
    );
}
