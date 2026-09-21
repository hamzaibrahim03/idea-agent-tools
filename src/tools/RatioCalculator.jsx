import { useState } from 'react';
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}
export default function RatioCalculator() {
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
  const [c, setC] = useState('10');
  const [d, setD] = useState('');
  const aNum = Number(a);
  const bNum = Number(b);
  const cNum = Number(c);
  const dNum = Number(d);
  const blanks = [a, b, c, d].filter((v) => v.trim() === '').length;
  const valid = blanks === 1 && [a, b, c, d].every((v) => v.trim() === '' || Number.isFinite(Number(v)));
  let solved = null;
  let solvedField = null;
  if (valid) {
    if (a.trim() === '') {
      solved = (bNum * cNum) / dNum;
      solvedField = 'a';
    } else if (b.trim() === '') {
      solved = (aNum * dNum) / cNum;
      solvedField = 'b';
    } else if (c.trim() === '') {
      solved = (aNum * dNum) / bNum;
      solvedField = 'c';
    } else if (d.trim() === '') {
      solved = (bNum * cNum) / aNum;
      solvedField = 'd';
    }
  }
  const simplifyValid = Number.isFinite(aNum) && Number.isFinite(bNum) && aNum !== 0 && bNum !== 0;
  const g = simplifyValid ? gcd(aNum, bNum) : 1;
  const simplified = simplifyValid ? `${aNum / g} : ${bNum / g}` : null;
  return (
    <div className="tool-page">
      <h1>Ratio &amp; Proportion Solver</h1>
      <p className="tool-description">
        Simplify a ratio to lowest terms, or solve a proportion (a:b = c:d) by leaving exactly one
        of the four values blank. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="a" style={{ width: '70px' }} />
        <span>:</span>
        <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="b" style={{ width: '70px' }} />
        <span>=</span>
        <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="c" style={{ width: '70px' }} />
        <span>:</span>
        <input type="number" value={d} onChange={(e) => setD(e.target.value)} placeholder="d (leave blank to solve)" style={{ width: '130px' }} />
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Note:</strong> Leave exactly one of the four fields blank to solve the proportion.
        </div>
      )}
      {solved !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Solved value ({solvedField}):</strong> {Number.isFinite(solved) ? solved.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') : 'undefined (division by zero)'}
          </div>
        </div>
      )}
      {simplified && (
        <div className="timestamp-result">
          <div>
            <strong>a:b simplified:</strong> {simplified}
          </div>
        </div>
      )}
    </div>
  );
}
