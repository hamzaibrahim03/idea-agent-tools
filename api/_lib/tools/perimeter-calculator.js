import { createComputeHandler } from '../computeHandler.js';

function compute({ shape, length, width, sideA, sideB, sideC, radius, polySide, polyCount }) {
  let perimeter = null;
  let error = '';
  let note = '';
  if (shape === 'rectangle') {
    const l = Number(length);
    const w = Number(width);
    if (!(l > 0 && w > 0)) error = 'Enter positive length and width.';
    else perimeter = 2 * (l + w);
  } else if (shape === 'triangle') {
    const a = Number(sideA);
    const b = Number(sideB);
    const c = Number(sideC);
    if (!(a > 0 && b > 0 && c > 0)) error = 'Enter three positive side lengths.';
    else if (a + b <= c || a + c <= b || b + c <= a) error = 'These three sides cannot form a valid triangle.';
    else perimeter = a + b + c;
  } else if (shape === 'circle') {
    const r = Number(radius);
    if (!(r > 0)) error = 'Enter a positive radius.';
    else {
      perimeter = 2 * Math.PI * r;
      note = 'Circumference';
    }
  } else {
    const s = Number(polySide);
    const n = Number(polyCount);
    if (!(s > 0) || !(Number.isInteger(n) && n >= 3)) error = 'Enter a positive side length and an integer number of sides (3 or more).';
    else perimeter = s * n;
  }
  return { perimeter, error, note };
}

export default createComputeHandler(compute);
