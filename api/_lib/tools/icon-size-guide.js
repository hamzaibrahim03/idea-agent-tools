import { createComputeHandler } from '../computeHandler.js';

const SIZES = [
  { px: 16, context: 'Inline text icons, dense list rows' },
  { px: 20, context: 'Toolbar icons, form field icons' },
  { px: 24, context: 'Standard UI icons, buttons, navigation' },
  { px: 32, context: 'Prominent action buttons, card icons' },
  { px: 48, context: 'Feature highlights, empty states' },
  { px: 64, context: 'Hero sections, onboarding illustrations' }
];

function compute({ selected }) {
  const selectedList = selected || [];
  const items = SIZES.filter((s) => selectedList.includes(s.px));
  return { items };
}

export default createComputeHandler(compute);
