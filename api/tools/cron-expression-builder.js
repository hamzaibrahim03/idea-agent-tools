import { createComputeHandler } from '../_lib/computeHandler.js';

function buildField(mode, everyStep, fixedValue, selectedList) {
  if (mode === 'every') return everyStep > 1 ? `*/${everyStep}` : '*';
  if (mode === 'fixed') return String(fixedValue);
  if (mode === 'list') {
    const values = [...(selectedList || [])].sort((a, b) => a - b);
    return values.length ? values.join(',') : '*';
  }
  return '*';
}

function compute({ minute, hour, dayOfMonth, month, dayOfWeek }) {
  const expression = [
    buildField(minute.mode, minute.everyStep, minute.fixedValue, minute.selected),
    buildField(hour.mode, hour.everyStep, hour.fixedValue, hour.selected),
    buildField(dayOfMonth.mode, dayOfMonth.everyStep, dayOfMonth.fixedValue, dayOfMonth.selected),
    buildField(month.mode, month.everyStep, month.fixedValue, month.selected),
    buildField(dayOfWeek.mode, dayOfWeek.everyStep, dayOfWeek.fixedValue, dayOfWeek.selected)
  ].join(' ');
  return { expression };
}

export default createComputeHandler(compute);
