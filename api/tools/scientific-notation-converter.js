import { createComputeHandler } from '../_lib/computeHandler.js';

function toScientific(n, precision) {
  if (n === 0) return { mantissa: 0, exponent: 0 };
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const exponent = Math.floor(Math.log10(abs));
  let mantissa = abs / 10 ** exponent;
  let e = exponent;
  if (mantissa >= 10) {
    mantissa /= 10;
    e += 1;
  } else if (mantissa < 1) {
    mantissa *= 10;
    e -= 1;
  }
  const rounded = Number(mantissa.toFixed(precision));
  if (rounded >= 10) {
    return { mantissa: sign * (rounded / 10), exponent: e + 1 };
  }
  return { mantissa: sign * rounded, exponent: e };
}
const SUPERSCRIPT_MAP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
function toSuperscript(n) {
  return String(n)
    .split('')
    .map((ch) => SUPERSCRIPT_MAP[ch] ?? ch)
    .join('');
}

function compute({ mode, decimalInput, mantissaInput, exponentInput, precision }) {
  let errorMsg = '';
  let scientificResult = '';
  let decimalResult = '';
  const precisionNum = Math.max(0, Math.min(15, Number(precision) || 0));
  if (mode === 'to-scientific') {
    const n = Number(decimalInput);
    if ((decimalInput || '').trim() === '' || Number.isNaN(n)) {
      errorMsg = 'Enter a valid decimal number.';
    } else {
      const { mantissa, exponent } = toScientific(n, precisionNum);
      scientificResult = `${mantissa} × 10${toSuperscript(exponent)}`;
    }
  } else {
    const m = Number(mantissaInput);
    const e = Number(exponentInput);
    if ((mantissaInput || '').trim() === '' || (exponentInput || '').trim() === '' || Number.isNaN(m) || Number.isNaN(e)) {
      errorMsg = 'Enter a valid mantissa and integer exponent.';
    } else if (!Number.isInteger(e)) {
      errorMsg = 'The exponent must be a whole number.';
    } else {
      const value = m * 10 ** e;
      decimalResult = value.toLocaleString('en-US', { maximumFractionDigits: 20, useGrouping: false });
    }
  }
  return { validationError: errorMsg, scientificResult, decimalResult };
}

export default createComputeHandler(compute);
