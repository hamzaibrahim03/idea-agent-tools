import { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';

export default function JpgToTextConverter() {
    const [imageSrc, setImageSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | recognizing | done
    const [progress, setProgress] = useState(0);
    const [resultText, setResultText] = useState('');
    const [confidence, setConfidence] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const workerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    function handleFile(e) {
        const picked = e.target.files?.[0];
        if (!picked) return;
        setError('');
        setResultText('');
        setConfidence(null);
        setStatus('idle');
        setProgress(0);
        setFile(picked);
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.onerror = () => setError('Could not read that file.');
        reader.readAsDataURL(picked);
    }

    async function handleExtract() {
        if (!file) return;
        setError('');
        setResultText('');
        setConfidence(null);
        setCopied(false);
        setStatus('loading');
        setProgress(0);
        try {
            if (!workerRef.current) {
                workerRef.current = await createWorker('eng', 1, {
                    logger: (msg) => {
                        if (msg.status === 'recognizing text') {
                            setStatus('recognizing');
                            setProgress(Math.round((msg.progress || 0) * 100));
                        } else if (msg.progress !== undefined) {
                            setProgress(Math.round((msg.progress || 0) * 100));
                        }
                    }
                });
            }
            const { data } = await workerRef.current.recognize(file);
            setResultText(data.text.trim());
            setConfidence(data.confidence);
            setStatus('done');
        } catch (err) {
            console.error(err);
            setError('Could not extract text from that image. Try a clearer or higher-resolution photo.');
            setStatus('idle');
        }
    }

    function handleCopy() {
        if (!resultText) return;
        navigator.clipboard.writeText(resultText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    function handleDownload() {
        if (!resultText) return;
        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const isBusy = status === 'loading' || status === 'recognizing';

    return (
        <div className="tool-page">
            <h1>JPG to Text Converter (OCR)</h1>
            <p className="tool-description">
                Upload a JPG, PNG, or other image and extract any text it contains using real optical
                character recognition (Tesseract OCR), running entirely in your browser via WebAssembly.
                Your image is never uploaded to any server - only the one-time OCR engine itself
                (a few MB) is fetched from a public CDN the first time you use this tool.
            </p>
            <div className="tool-controls">
                <input type="file" accept="image/*" onChange={handleFile} />
                <button onClick={handleExtract} disabled={!file || isBusy}>
                    {isBusy ? 'Extracting...' : 'Extract text'}
                </button>
            </div>
            {error && <div className="tool-error">{error}</div>}
            {isBusy && (
                <div style={{ margin: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginBottom: 4 }}>
                        <span>{status === 'loading' ? 'Loading OCR engine...' : 'Recognizing text...'}</span>
                        <span>{progress}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'var(--accent)',
                                transition: 'width 0.2s ease'
                            }}
                        />
                    </div>
                </div>
            )}
            {imageSrc && (
                <div className="tool-grid">
                    <div className="tool-panel">
                        <label>Uploaded image</label>
                        <img
                            src={imageSrc}
                            alt="Uploaded for OCR"
                            style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--border)' }}
                        />
                    </div>
                    {status === 'done' && (
                        <div className="tool-panel">
                            <label>
                                Extracted text
                                {confidence !== null && (
                                    <small style={{ marginLeft: 8, fontWeight: 400 }}>
                                        ({Math.round(confidence)}% confidence)
                                    </small>
                                )}
                            </label>
                            <textarea
                                readOnly
                                value={resultText || '(No text detected in this image.)'}
                                rows={14}
                                style={{
                                    width: '100%',
                                    fontFamily: 'inherit',
                                    padding: 8,
                                    borderRadius: 8,
                                    border: '1px solid var(--border)',
                                    resize: 'vertical'
                                }}
                            />
                            <div className="tool-controls" style={{ marginTop: 8 }}>
                                <button onClick={handleCopy} disabled={!resultText}>
                                    {copied ? 'Copied!' : 'Copy text'}
                                </button>
                                <button onClick={handleDownload} disabled={!resultText}>
                                    Download as .txt
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
