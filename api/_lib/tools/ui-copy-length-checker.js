import { createComputeHandler } from '../computeHandler.js';

const GUIDELINES = [
  { key: 'button', label: 'Button label', min: 1, max: 25, note: 'Keep short and action-oriented (e.g. "Save changes")' },
  { key: 'tooltip', label: 'Tooltip', min: 10, max: 80, note: 'Brief explanatory text, one short sentence' },
  { key: 'toast', label: 'Toast / notification', min: 10, max: 100, note: 'Enough to convey the event, no more' },
  { key: 'heading', label: 'Section heading', min: 3, max: 40, note: 'Short and scannable' },
  { key: 'placeholder', label: 'Input placeholder', min: 3, max: 30, note: 'Example or hint text, not instructions' },
  { key: 'errormsg', label: 'Error message', min: 10, max: 120, note: 'Explain what went wrong and how to fix it' }
];

function compute({ text, componentType }) {
  const guideline = GUIDELINES.find((g) => g.key === componentType) || GUIDELINES[0];
  const value = String(text || '');
  const length = value.length;
  const withinRange = length >= guideline.min && length <= guideline.max;
  const status = length === 0 ? 'empty' : withinRange ? 'good' : length < guideline.min ? 'short' : 'long';
  const statusLabel = {
    empty: 'Enter some copy to check its length',
    good: 'Within the recommended range',
    short: `Shorter than the typical ${guideline.min}-${guideline.max} character range`,
    long: `Longer than the typical ${guideline.min}-${guideline.max} character range`
  }[status];
  return { guideline, length, status, statusLabel };
}

export default createComputeHandler(compute);
