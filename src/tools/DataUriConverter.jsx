import { useState, useRef } from 'react';
function readFileAsDataUri(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Unable to read this file.'));
        reader.readAsDataURL(file);
    });
}
function parseDataUri(value) {
    const match = value.trim().match(/^data:([^;,]*)?(;charset=[^;,]+)?(;base64)?,(.*)$/s);
    if (!match) throw new Error('Not a valid data: URI.');
    const mimeType = match[1] || 'text/plain';
    const isBase64 = Boolean(match[3]);
    const data = match[4];
    return { mimeType, isBase64, data };
}
export default function DataUriConverter() {
    const [fileName, setFileName] = useState('');
    const [dataUri, setDataUri] = useState('');
    const [decodeInput, setDecodeInput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const uri = await readFileAsDataUri(file);
            setFileName(file.name);
            setDataUri(uri);
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to read this file.');
        }
    }
    async function handleCopy() {
        if (!dataUri) return;
        try {
            await navigator.clipboard.writeText(dataUri);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    const decoded = (() => {
        if (!decodeInput.trim()) return null;
        try {
            const result = parseDataUri(decodeInput);
            return result;
        } catch {
            return null;
        }
    })();
    const isImage = decoded?.mimeType.startsWith('image/');
    const isText = decoded && !decoded.isBase64 ? true : decoded?.mimeType.startsWith('text/') || decoded?.mimeType === 'application/json';
    let decodedText = '';
    let decodeError = '';
    if (decoded && isText) {
        try {
            decodedText = decoded.isBase64 ? atob(decoded.data) : decodeURIComponent(decoded.data);
        } catch {
            decodeError = 'Unable to decode this data URI content.';
        }
    }
    return (
        <div className="tool-page">
            <h1>Data URI Converter</h1>
            <p className="tool-description">
                Convert a file to a base64 data: URI, or paste a data: URI to preview and decode it back.
                Runs entirely in your browser - files are never uploaded anywhere.
            </p>
            <div className="tool-panel">
                <label htmlFor="file-input">File to encode</label>
                <input id="file-input" ref={fileInputRef} type="file" onChange={handleFileChange} />
            </div>
            {dataUri && (
                <div className="tool-panel">
                    <label htmlFor="datauri-output">Data URI for "{fileName}"</label>
                    <textarea id="datauri-output" value={dataUri} readOnly spellCheck={false} />
                    <div className="tool-controls">
                        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy data URI'}</button>
                    </div>
                    {dataUri.startsWith('data:image/') && (
                        <img
                            src={dataUri}
                            alt={fileName}
                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--border)' }}
                        />
                    )}
                </div>
            )}
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <div className="tool-panel">
                <label htmlFor="datauri-input">Or paste a data: URI to decode</label>
                <textarea id="datauri-input" value={decodeInput} onChange={(e) => setDecodeInput(e.target.value)} placeholder="data:text/plain;base64,SGVsbG8h" spellCheck={false} />
            </div>
            {decodeInput.trim() && !decoded && (
                <div className="tool-error">
                    <strong>Error:</strong> Not a valid data: URI.
                </div>
            )}
            {decoded && (
                <div className="tool-panel">
                    <label>Decoded preview ({decoded.mimeType})</label>
                    {isImage && (
                        <img src={decodeInput.trim()} alt="Decoded" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, border: '1px solid var(--border)' }} />
                    )}
                    {!isImage && isText && !decodeError && (
                        <textarea readOnly value={decodedText} spellCheck={false} />
                    )}
                    {decodeError && (
                        <div className="tool-error">
                            <strong>Error:</strong> {decodeError}
                        </div>
                    )}
                    {!isImage && !isText && (
                        <p className="tool-placeholder">
                            Binary content of type "{decoded.mimeType}" can't be previewed as text.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
