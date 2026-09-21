import { useState, useRef } from 'react';
export default function ImageResizerTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [originalDims, setOriginalDims] = useState(null);
  const [mode, setMode] = useState('pixels');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percent, setPercent] = useState(50);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const imgElRef = useRef(null);
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setResizedUrl(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        imgElRef.current = img;
        setOriginalDims({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setImageSrc(reader.result);
      };
      img.onerror = () => setError('Could not load that file as an image.');
      img.src = reader.result;
    };
    reader.onerror = () => setError('Could not read that file.');
    reader.readAsDataURL(file);
  }
  function handleWidthChange(value) {
    const w = Math.max(1, parseInt(value, 10) || 1);
    setWidth(w);
    if (lockAspect && originalDims) {
      setHeight(Math.round((w * originalDims.h) / originalDims.w));
    }
  }
  function handleHeightChange(value) {
    const h = Math.max(1, parseInt(value, 10) || 1);
    setHeight(h);
    if (lockAspect && originalDims) {
      setWidth(Math.round((h * originalDims.w) / originalDims.h));
    }
  }
  function targetDims() {
    if (!originalDims) return { w: 0, h: 0 };
    if (mode === 'percent') {
      const p = Math.max(1, parseFloat(percent) || 1) / 100;
      return { w: Math.max(1, Math.round(originalDims.w * p)), h: Math.max(1, Math.round(originalDims.h * p)) };
    }
    return { w: width, h: height };
  }
  function handleResize() {
    if (!imgElRef.current) return;
    const { w, h } = targetDims();
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(imgElRef.current, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Could not generate the resized image.');
        return;
      }
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
      setResizedUrl(URL.createObjectURL(blob));
    }, 'image/png');
  }
  function handleDownload() {
    if (!resizedUrl) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = 'resized-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  const dims = targetDims();
  return (
    <div className="tool-page">
      <h1>Image Resizer</h1>
      <p className="tool-description">
        Upload an image, resize it by exact width/height or by percentage using the browser's real
        Canvas API, and download the result as a PNG. All processing happens locally in your
        browser - the image is never uploaded anywhere.
      </p>
      <div className="tool-controls">
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {imageSrc && originalDims && (
        <>
          <div className="tool-controls">
            <label>
              Resize by:
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="pixels">Exact pixels</option>
                <option value="percent">Percentage</option>
              </select>
            </label>
            {mode === 'pixels' ? (
              <>
                <label>
                  Width:
                  <input type="number" min="1" value={width} onChange={(e) => handleWidthChange(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                  Height:
                  <input type="number" min="1" value={height} onChange={(e) => handleHeightChange(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
                  Lock aspect ratio
                </label>
              </>
            ) : (
              <label>
                Percentage:
                <input type="number" min="1" max="500" value={percent} onChange={(e) => setPercent(e.target.value)} style={{ width: '70px' }} />
                %
              </label>
            )}
            <button onClick={handleResize}>Resize image</button>
          </div>
          <p className="tool-placeholder">
            Original: {originalDims.w} x {originalDims.h}px -&gt; Target: {dims.w} x {dims.h}px
          </p>
          <div className="tool-grid">
            <div className="tool-panel">
              <label>Original</label>
              <img src={imageSrc} alt="Original upload" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />
            </div>
            {resizedUrl && (
              <div className="tool-panel">
                <label>Resized result</label>
                <img src={resizedUrl} alt="Resized result" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />
                <button onClick={handleDownload}>Download resized image</button>
              </div>
            )}
          </div>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
