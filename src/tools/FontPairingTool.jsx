import { useState, useEffect } from 'react';
const PAIRINGS = [
    { heading: 'Playfair Display', body: 'Source Sans Pro', mood: 'Elegant editorial' },
    { heading: 'Montserrat', body: 'Merriweather', mood: 'Modern with warmth' },
    { heading: 'Poppins', body: 'Roboto', mood: 'Friendly and geometric' },
    { heading: 'Lora', body: 'Open Sans', mood: 'Classic and readable' },
    { heading: 'Oswald', body: 'Lato', mood: 'Bold condensed headings' },
    { heading: 'Raleway', body: 'Nunito Sans', mood: 'Clean and airy' },
    { heading: 'Abril Fatface', body: 'Karla', mood: 'High-contrast display pairing' },
    { heading: 'Libre Baskerville', body: 'Work Sans', mood: 'Traditional serif meets modern sans' },
    { heading: 'Bebas Neue', body: 'Inter', mood: 'Punchy headline with neutral body' },
    { heading: 'Cormorant Garamond', body: 'Mulish', mood: 'Refined luxury feel' }
];
export default function FontPairingTool() {
    const [selected, setSelected] = useState(0);
    const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
    const [pairing, setPairing] = useState(PAIRINGS[0]);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        const families = PAIRINGS.flatMap((p) => [p.heading, p.body]).join('&family=').replace(/ /g, '+');
        const href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);
    useEffect(() => {
        let cancelled = false;
        fetch('/api/tools/font-pairing-tool', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ input: { selected } })
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.error) setFetchError(data.error);
                else {
                    setFetchError('');
                    setPairing(data.pairing);
                }
            })
            .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        return () => { cancelled = true; };
    }, [selected]);
    return (
        <div className="tool-page">
            <h1>Font Pairing Tool</h1>
            <p className="tool-description">
                Browse a curated reference list of well-known heading + body font pairings, with a live
                preview loaded from Google Fonts (falls back to your system font if the stylesheet can't
                load). Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Pairing:
                    <select value={selected} onChange={(e) => setSelected(Number(e.target.value))}>
                        {PAIRINGS.map((p, i) => (
                            <option key={i} value={i}>
                                {p.heading} + {p.body}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="tool-panel">
                <label htmlFor="fp-preview-text">Preview text</label>
                <input id="fp-preview-text" type="text" value={previewText} onChange={(e) => setPreviewText(e.target.value)} />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-panel">
                <label>Live preview</label>
                <div style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--code-bg)' }}>
                    <div style={{ fontFamily: `'${pairing.heading}', sans-serif`, fontSize: 32, fontWeight: 700, marginBottom: 10, color: 'var(--text-h)' }}>
                        {previewText || 'Heading preview'}
                    </div>
                    <div style={{ fontFamily: `'${pairing.body}', sans-serif`, fontSize: 16, lineHeight: 1.6, color: 'var(--text)' }}>
                        {previewText || 'Body text preview'} - this is how the body font renders alongside the heading font above.
                    </div>
                </div>
            </div>
            <div className="timestamp-result">
                <span><strong>Heading font:</strong> {pairing.heading}</span>
                <span><strong>Body font:</strong> {pairing.body}</span>
                <span><strong>Style:</strong> {pairing.mood}</span>
            </div>
        </div>
    );
}
