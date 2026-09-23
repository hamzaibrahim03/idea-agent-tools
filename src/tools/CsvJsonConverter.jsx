import { useState } from 'react';
function parseCsvLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inQuotes) {
            if (c === '"' && line[i + 1] === '"') {
                current += '"';
                i++;
            } else if (c === '"') {
                inQuotes = false;
            } else {
                current += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ',') {
            fields.push(current);
            current = '';
        } else {
            current += c;
        }
    }
    fields.push(current);
    return fields;
}
function csvToJson(csv) {
    const lines = csv.split(/\r?\n/).filter((l) => l.length > 0);
    if (lines.length === 0) return '[]';
    const headers = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] ?? '';
        });
        return obj;
    });
    return JSON.stringify(rows, null, 2);
}
function csvEscape(value) {
    const str = String(value ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}
function jsonToCsv(json) {
    const data = JSON.parse(json);
    const rows = Array.isArray(data) ? data : [data];
    if (rows.length === 0) return '';
    const headers = Array.from(rows.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k));
        return set;
    }, new Set()));
    const lines = [headers.join(',')];
    for (const row of rows) {
        lines.push(headers.map((h) => csvEscape(row[h])).join(','));
    }
    return lines.join('\n');
}
export default function CsvJsonConverter() {
    const [mode, setMode] = useState('csv-to-json');
    const [input, setInput] = useState('name,age\nAlice,30\nBob,25');
    const [copied, setCopied] = useState(false);
    let output = '';
    let error = '';
    if (input.trim()) {
        try {
            output = mode === 'csv-to-json' ? csvToJson(input) : jsonToCsv(input);
        } catch (e) {
            error = e.message;
        }
    }
    async function handleCopy() {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    function handleSwap() {
        setMode((m) => (m === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json'));
        setInput(output || input);
    }
    return (
        <div className="tool-page">
            <h1>CSV ⇄ JSON Converter</h1>
            <p className="tool-description">
                Convert between CSV and JSON. Handles quoted fields with commas and embedded quotes. Runs
                entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Direction:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="csv-to-json">CSV to JSON</option>
                        <option value="json-to-csv">JSON to CSV</option>
                    </select>
                </label>
                <button onClick={handleSwap} disabled={!output}>
                    Swap (use output as input)
                </button>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="csv-input">{mode === 'csv-to-json' ? 'CSV input' : 'JSON input'}</label>
                    <textarea id="csv-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="csv-output">{mode === 'csv-to-json' ? 'JSON output' : 'CSV output'}</label>
                    <textarea id="csv-output" value={output} readOnly spellCheck={false} />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Parse error:</strong> {error}
                </div>
            )}
        </div>
    );
}
