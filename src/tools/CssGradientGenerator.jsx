import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function buildGradient(type, angle, shape, stops) {
    const stopList = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
    if (type === 'radial') return `radial-gradient(${shape}, ${stopList})`;
    return `linear-gradient(${angle}deg, ${stopList})`;
}
let nextId = 3;
export default function CssGradientGenerator() {
    const [type, setType] = useState('linear');
    const [angle, setAngle] = useState(90);
    const [shape, setShape] = useState('circle');
    const [stops, setStops] = useState([
        { id: 1, color: '#ff5f6d', position: 0 },
        { id: 2, color: '#ffc371', position: 100 },
    ]);
    const [copied, setCopied] = useState(false);
    function updateStop(id, key, value) {
        setStops((s) => s.map((st) => (st.id === id ? { ...st, [key]: value } : st)));
    }
    function addStop() {
        setStops((s) => [...s, { id: nextId++, color: '#00c9ff', position: 50 }]);
    }
    function removeStop(id) {
        setStops((s) => (s.length > 2 ? s.filter((st) => st.id !== id) : s));
    }
    const gradient = buildGradient(type, angle, shape, stops);
    const css = `background: ${gradient};`;
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(css);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    function handleDownload() {
        downloadFile(css, 'gradient.css', 'text/css');
    }
    return (
        <div className="tool-page">
            <h1>CSS Gradient Generator</h1>
            <p className="tool-description">
                Build a linear or radial CSS gradient from two or more color stops, adjust the angle or
                shape, and copy the generated <code>background</code> value. Runs entirely in your
                browser.
            </p>
            <div className="tool-controls">
                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                    </select>
                </label>
                {type === 'linear' && (
                    <label>
                        Angle: {angle}deg
                        <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
                    </label>
                )}
                {type === 'radial' && (
                    <label>
                        Shape:
                        <select value={shape} onChange={(e) => setShape(e.target.value)}>
                            <option value="circle">Circle</option>
                            <option value="ellipse">Ellipse</option>
                        </select>
                    </label>
                )}
                <button onClick={addStop}>Add color stop</button>
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
                <button onClick={handleDownload}>Download</button>
            </div>
            {stops.map((stop) => (
                <div className="tool-controls" key={stop.id}>
                    <label>
                        Color:
                        <input type="color" value={stop.color} onChange={(e) => updateStop(stop.id, 'color', e.target.value)} />
                    </label>
                    <label>
                        Position: {stop.position}%
                        <input type="range" min={0} max={100} value={stop.position} onChange={(e) => updateStop(stop.id, 'position', Number(e.target.value))} />
                    </label>
                    <button onClick={() => removeStop(stop.id)} disabled={stops.length <= 2}>
                        Remove
                    </button>
                </div>
            ))}
            <div className="tool-panel">
                <label>Preview</label>
                <div style={{ height: 160, borderRadius: 8, border: '1px solid var(--border)', background: gradient, }} />
            </div>
            <div className="tool-panel">
                <label htmlFor="gradient-output">Generated CSS</label>
                <textarea id="gradient-output" value={css} readOnly spellCheck={false} />
            </div>
        </div>
    );
}
