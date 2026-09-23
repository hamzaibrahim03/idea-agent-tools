import { createComputeHandler } from '../computeHandler.js';

function hexToRgb(hex) {
  const clean = (hex || '').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}
function relativeLuminance({ r, g, b }) {
  const [rl, gl, bl] = [r, g, b].map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}
function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function compute({ foreground, background }) {
  const ratio = contrastRatio(foreground, background);
  const valid = ratio !== null;
  const checks = valid
    ? [
        { label: 'AA - normal text (4.5:1)', pass: ratio >= 4.5 },
        { label: 'AA - large text (3:1)', pass: ratio >= 3 },
        { label: 'AAA - normal text (7:1)', pass: ratio >= 7 },
        { label: 'AAA - large text (4.5:1)', pass: ratio >= 4.5 },
      ]
    : [];
  return { valid, ratio, checks };
}

export default createComputeHandler(compute);
