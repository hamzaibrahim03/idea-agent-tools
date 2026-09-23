import { useMemo, useState } from 'react';
const INVISIBLE_CHARS = [
    { code: 0x200b, name: 'Zero-width space' },
    { code: 0x200c, name: 'Zero-width non-joiner' },
    { code: 0x200d, name: 'Zero-width joiner' },
    { code: 0x200e, name: 'Left-to-right mark' },
    { code: 0x200f, name: 'Right-to-left mark' },
    { code: 0xfeff, name: 'Byte order mark / zero-width no-break space' },
    { code: 0x2060, name: 'Word joiner' },
    { code: 0x00ad, name: 'Soft hyphen' },
    { code: 0x180e, name: 'Mongolian vowel separator' },
    { code: 0x2028, name: 'Line separator' },
    { code: 0x2029, name: 'Paragraph separator' },
    { code: 0x0000, name: 'Null character' }
];
const INVISIBLE_SET = new Set(INVISIBLE_CHARS.map((c) => c.code));
const INVISIBLE_REGEX = new RegExp(
    '[' + INVISIBLE_CHARS.map((c) => `\\u${c.code.toString(16).padStart(4, '0')}`).join('') + ']',
    'g'
);
function analyze(text) {
    const found = new Map();
    for (const ch of text) {
        const code = ch.codePointAt(0);
        if (INVISIBLE_SET.has(code)) {
            found.set(code, (found.get(code) || 0) + 1);
        }
    }
    const cleaned = text.replace(INVISIBLE_REGEX, '');
    const breakdown = [...found.entries()]
        .map(([code, count]) => ({
            code,
            count,
            name: INVISIBLE_CHARS.find((c) => c.code === code)?.name || 'Unknown',
            hex: 'U+' + code.toString(16).toUpperCase().padStart(4, '0')
        }))
        .sort((a, b) => b.count - a.count);
    const totalRemoved = breakdown.reduce((sum, b) => sum + b.count, 0);
    return { cleaned, breakdown, totalRemoved };
}
export default function InvisibleCharacterRemover() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const { cleaned, breakdown, totalRemoved } = useMemo(() => analyze(input), [input]);
    async function handleCopy() {
        if (!cleaned) return;
        try {
            await navigator.clipboard.writeText(cleaned);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Invisible Character Remover</h1>
            <p className="tool-description">
                Paste text to detect and strip invisible/zero-width Unicode characters - zero-width spaces,
                joiners, byte-order marks, and similar - that often sneak in from copy-pasted content and
                cause subtle bugs. Uses a curated list of common problem characters, not an exhaustive
                Unicode scan. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <button onClick={handleCopy} disabled={!cleaned}>
                    {copied ? 'Copied!' : 'Copy cleaned text'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="invisible-input">Input</label>
                    <textarea
                        id="invisible-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste text that may contain hidden characters"
                    />
                </div>
                <div className="tool-panel">
                    <label htmlFor="invisible-output">Cleaned output</label>
                    <textarea id="invisible-output" value={cleaned} readOnly />
                </div>
            </div>
            {input && (
                <div className="timestamp-result">
                    <span>
                        <strong>Invisible characters removed:</strong> {totalRemoved}
                    </span>
                </div>
            )}
            {breakdown.length > 0 && (
                <div className="tool-panel">
                    <label>Breakdown</label>
                    <div className="regex-groups-wrap">
                        <table className="regex-groups-table">
                            <thead>
                                <tr>
                                    <th>Character</th>
                                    <th>Code point</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {breakdown.map((b) => (
                                    <tr key={b.code}>
                                        <td>{b.name}</td>
                                        <td><code>{b.hex}</code></td>
                                        <td>{b.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
