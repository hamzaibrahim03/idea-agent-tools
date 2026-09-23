import { useState } from 'react';
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
const JUSTIFY = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
const ALIGN = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'];
const WRAP = ['nowrap', 'wrap', 'wrap-reverse'];
function buildCss({ direction, justify, align, wrap, gap }) {
    return [
        '.container {',
        `  display: flex;`,
        `  flex-direction: ${direction};`,
        `  justify-content: ${justify};`,
        `  align-items: ${align};`,
        `  flex-wrap: ${wrap};`,
        `  gap: ${gap}px;`,
        '}',
    ].join('\n');
}
export default function CssFlexboxPlayground() {
    const [direction, setDirection] = useState('row');
    const [justify, setJustify] = useState('flex-start');
    const [align, setAlign] = useState('stretch');
    const [wrap, setWrap] = useState('nowrap');
    const [gap, setGap] = useState(12);
    const [copied, setCopied] = useState(false);
    const css = buildCss({ direction, justify, align, wrap, gap });
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
            <h1>CSS Flexbox Playground</h1>
            <p className="tool-description">
                Adjust flex-direction, justify-content, align-items, flex-wrap, and gap on a live preview
                of sample boxes, and copy the generated container CSS. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    direction:
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        {DIRECTIONS.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </label>
                <label>
                    justify-content:
                    <select value={justify} onChange={(e) => setJustify(e.target.value)}>
                        {JUSTIFY.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </label>
                <label>
                    align-items:
                    <select value={align} onChange={(e) => setAlign(e.target.value)}>
                        {ALIGN.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </label>
                <label>
                    flex-wrap:
                    <select value={wrap} onChange={(e) => setWrap(e.target.value)}>
                        {WRAP.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </label>
                <label>
                    gap: {gap}px
                    <input type="range" min={0} max={48} value={gap} onChange={(e) => setGap(Number(e.target.value))} />
                </label>
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
            </div>
            <div className="tool-panel">
                <label>Preview</label>
                <div style={{ display: 'flex', flexDirection: direction, justifyContent: justify, alignItems: align, flexWrap: wrap, gap: `${gap}px`, minHeight: 220, padding: 16, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--code-bg)', }} >
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} style={{ width: 64, height: 64, borderRadius: 6, background: 'var(--accent-border)', color: 'var(--text-h)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0, }} >
                            {n}
                        </div>
                    ))}
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="flex-output">Generated CSS</label>
                <textarea id="flex-output" value={css} readOnly spellCheck={false} />
            </div>
        </div>
    );
}
