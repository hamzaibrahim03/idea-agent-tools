import { useState } from 'react';
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}
function simplify(num, den) {
  if (den === 0) return null;
  const sign = den < 0 ? -1 : 1;
  num *= sign;
  den *= sign;
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}
function operate(a, b, op) {
  switch (op) {
    case 'add':
      return simplify(a.num * b.den + b.num * a.den, a.den * b.den);
    case 'sub':
      return simplify(a.num * b.den - b.num * a.den, a.den * b.den);
    case 'mul':
      return simplify(a.num * b.num, a.den * b.den);
    case 'div':
      return simplify(a.num * b.den, a.den * b.num);
    default:
      return null;
  }
}
export default function FractionCalculator() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  const [op, setOp] = useState('add');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('3');
  const n1 = parseInt(num1, 10);
  const d1 = parseInt(den1, 10);
  const n2 = parseInt(num2, 10);
  const d2 = parseInt(den2, 10);
  const valid = [n1, d1, n2, d2].every(Number.isFinite) && d1 !== 0 && d2 !== 0 && !(op === 'div' && n2 === 0);
  const result = valid ? operate({ num: n1, den: d1 }, { num: n2, den: d2 }, op) : null;
  const decimal = result ? result.num / result.den : null;
  const mixed = result && Math.abs(result.num) >= Math.abs(result.den)
    ? {
      whole: Math.trunc(result.num / result.den),
      remainder: Math.abs(result.num % result.den)
    }
    : null;
  return (
    <div className="tool-page">
      <h1>Fraction Calculator</h1>
      <p className="tool-description">
        Add, subtract, multiply, or divide two fractions, with the result automatically
        simplified to lowest terms. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          <input type="number" value={num1} onChange={(e) => setNum1(e.target.value)} style={{ width: '60px' }} />
        </label>
        <span>/</span>
        <label>
          <input type="number" value={den1} onChange={(e) => setDen1(e.target.value)} style={{ width: '60px' }} />
        </label>
        <select value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="add">+</option>
          <option value="sub">−</option>
          <option value="mul">×</option>
          <option value="div">÷</option>
        </select>
        <label>
          <input type="number" value={num2} onChange={(e) => setNum2(e.target.value)} style={{ width: '60px' }} />
        </label>
        <span>/</span>
        <label>
          <input type="number" value={den2} onChange={(e) => setDen2(e.target.value)} style={{ width: '60px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter whole numbers with non-zero denominators (and a non-zero second numerator for division).
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Result:</strong> {result.num}/{result.den}
          </div>
          {mixed && (
            <div>
              <strong>Mixed number:</strong> {mixed.whole}{' '}
              {mixed.remainder !== 0 && `${mixed.remainder}/${Math.abs(result.den)}`}
            </div>
          )}
          <div>
            <strong>Decimal:</strong> {decimal.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}
          </div>
        </div>
      )}
    </div>
  );
}
