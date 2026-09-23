import { createComputeHandler } from '../_lib/computeHandler.js';

function toNumbers(matrix) {
  return matrix.map((row) => row.map((cell) => Number(cell)));
}
function hasInvalidCell(matrix) {
  return matrix.some((row) => row.some((cell) => String(cell).trim() === '' || Number.isNaN(Number(cell))));
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

function compute({ matrixA, matrixB, operation }) {
  const needsB = operation === 'add' || operation === 'multiply';
  const invalid = hasInvalidCell(matrixA) || (needsB && hasInvalidCell(matrixB));
  if (invalid) {
    return { invalid: true, resultMatrix: null, resultScalar: null };
  }
  const numA = toNumbers(matrixA);
  const numB = needsB ? toNumbers(matrixB) : null;
  let resultMatrix = null;
  let resultScalar = null;
  if (operation === 'add') resultMatrix = add(numA, numB);
  else if (operation === 'multiply') resultMatrix = multiply(numA, numB);
  else resultScalar = determinant(numA);
  return { invalid: false, resultMatrix, resultScalar };
}

export default createComputeHandler(compute);
