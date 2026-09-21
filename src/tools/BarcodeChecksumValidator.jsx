import { useState } from 'react';
function computeCheckDigit(digitsWithoutCheck) {
  let sum = 0;
  for (let i = 0; i < digitsWithoutCheck.length; i++) {
    const digit = digitsWithoutCheck[digitsWithoutCheck.length - 1 - i];
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}
function validateBarcode(code) {
  const clean = code.replace(/\s/g, '');
  if (!/^\d+$/.test(clean)) return { error: 'Barcode must contain only digits.' };
  if (![8, 12, 13, 14].includes(clean.length)) {
    return { error: 'Expected length 8 (EAN-8), 12 (UPC-A), 13 (EAN-13), or 14 (GTIN-14) digits.' };
  }
  const digits = clean.split('').map(Number);
  const body = digits.slice(0, -1);
  const providedCheck = digits[digits.length - 1];
  const expectedCheck = computeCheckDigit(body);
  return { valid: providedCheck === expectedCheck, expectedCheck, providedCheck, length: clean.length };
}
export default function BarcodeChecksumValidator() {
  const [code, setCode] = useState('4006381333931');
  const [generateBody, setGenerateBody] = useState('400638133393');
  const result = code.trim() ? validateBarcode(code) : null;
  const generateClean = generateBody.replace(/\s/g, '');
  const generateValid = /^\d+$/.test(generateClean) && [7, 11, 12, 13].includes(generateClean.length);
  const generatedCheckDigit = generateValid ? computeCheckDigit(generateClean.split('').map(Number)) : null;
  return (
    <div className="tool-page">
      <h1>Barcode Checksum Validator</h1>
      <p className="tool-description">
        Validate the check digit of an EAN-8, EAN-13, UPC-A, or GTIN-14 barcode, or compute the
        correct check digit for a barcode body. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="barcode-validate">Validate a full barcode (including check digit)</label>
        <input id="barcode-validate" type="text" value={code} onChange={(e) => setCode(e.target.value)} style={{ fontFamily: 'var(--mono)' }} />
      </div>
      {result?.error && <div className="tool-error">{result.error}</div>}
      {result && !result.error && (
        <div className="timestamp-result">
          <div>
            <strong>Length:</strong> {result.length} digits
          </div>
          <div>
            <strong>Provided check digit:</strong> {result.providedCheck}
          </div>
          <div>
            <strong>Expected check digit:</strong> {result.expectedCheck}
          </div>
          <div>
            <strong>{result.valid ? '✓ Valid barcode' : '✗ Invalid - check digit does not match'}</strong>
          </div>
        </div>
      )}
      <div className="tool-panel" style={{ marginTop: 24 }}>
        <label htmlFor="barcode-generate">Compute check digit for a barcode body (7, 11, 12, or 13 digits)</label>
        <input id="barcode-generate" type="text" value={generateBody} onChange={(e) => setGenerateBody(e.target.value)} style={{ fontFamily: 'var(--mono)' }} />
      </div>
      {generateBody.trim() && !generateValid && (
        <div className="tool-error">Body must be 7, 11, 12, or 13 digits.</div>
      )}
      {generatedCheckDigit !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Check digit:</strong> {generatedCheckDigit}
          </div>
          <div>
            <strong>Full barcode:</strong> {generateClean}{generatedCheckDigit}
          </div>
        </div>
      )}
    </div>
  );
}
