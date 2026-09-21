import { useState } from 'react';
function emptyMatrix(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => '0'));
}
function toNumbers(matrix) {
  return matrix.map((row) => row.map((cell) => Number(cell)));
}
function hasInvalidCell(matrix) {
  return matrix.some((row) => row.some((cell) => cell.trim() === '' || Number.isNaN(Number(cell))));
}
function add(a, b) {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}
function multiply(a, b) {
  const size = a.length;
  const result = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let sum = 0;
      for (let k = 0; k < size; k++) sum += a[i][k] * b[k][j];
      result[i][j] = sum;
    }
  }
  return result;
}
function determinant(m) {
  const n = m.length;
  if (n === 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}
function MatrixGrid({ label, matrix, onChange }) {
  return (
    <div className="tool-panel">
      <label>{label}</label>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${matrix.length}, 60px)`, gap: '6px' }}>
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={cell}
              onChange={(e) => onChange(i, j, e.target.value)}
              style={{ width: '60px', textAlign: 'center' }}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default function MatrixCalculator() {
  const [size, setSize] = useState(2);
  const [operation, setOperation] = useState('add');
  const [matrixA, setMatrixA] = useState(emptyMatrix(2));
  const [matrixB, setMatrixB] = useState(emptyMatrix(2));
  function handleSizeChange(newSize) {
    setSize(newSize);
    setMatrixA(emptyMatrix(newSize));
    setMatrixB(emptyMatrix(newSize));
  }
  function updateCell(setter, matrix, i, j, value) {
    const next = matrix.map((row) => row.slice());
    next[i][j] = value;
    setter(next);
  }
  const needsB = operation === 'add' || operation === 'multiply';
  const invalid = hasInvalidCell(matrixA) || (needsB && hasInvalidCell(matrixB));
  let resultMatrix = null;
  let resultScalar = null;
  if (!invalid) {
    const numA = toNumbers(matrixA);
    const numB = toNumbers(matrixB);
    if (operation === 'add') resultMatrix = add(numA, numB);
    else if (operation === 'multiply') resultMatrix = multiply(numA, numB);
    else resultScalar = determinant(numA);
  }
  return (
    <div className="tool-page">
      <h1>Matrix Calculator</h1>
      <p className="tool-description">
        Add, multiply, or find the determinant of 2×2 or 3×3 matrices. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          Size:
          <select value={size} onChange={(e) => handleSizeChange(Number(e.target.value))}>
            <option value={2}>2 × 2</option>
            <option value={3}>3 × 3</option>
          </select>
        </label>
        <label>
          Operation:
          <select value={operation} onChange={(e) => setOperation(e.target.value)}>
            <option value="add">A + B</option>
            <option value="multiply">A × B</option>
            <option value="determinant">det(A)</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <MatrixGrid label="Matrix A" matrix={matrixA} onChange={(i, j, v) => updateCell(setMatrixA, matrixA, i, j, v)} />
        {needsB && (
          <MatrixGrid label="Matrix B" matrix={matrixB} onChange={(i, j, v) => updateCell(setMatrixB, matrixB, i, j, v)} />
        )}
      </div>
      {invalid && <div className="tool-error">All matrix cells must contain a number.</div>}
      {!invalid && resultMatrix && (
        <div className="tool-panel">
          <label>Result</label>
          <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${size}, 70px)`, gap: '6px' }}>
            {resultMatrix.map((row, i) =>
              row.map((val, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    width: '70px',
                    textAlign: 'center',
                    padding: '8px 0',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: 'var(--code-bg)',
                    fontFamily: 'var(--mono)',
                  }}
                >
                  {Number(val.toFixed(6))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {!invalid && resultScalar !== null && (
        <div className="timestamp-result">
          <strong>det(A) = {Number(resultScalar.toFixed(6))}</strong>
        </div>
      )}
    </div>
  );
}
