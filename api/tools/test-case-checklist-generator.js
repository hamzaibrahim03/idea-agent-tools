import { createComputeHandler } from '../_lib/computeHandler.js';

const CATEGORIES = {
  unit: {
    label: 'Unit',
    items: [
      'Happy path with typical valid input', 'Boundary values (min, max, zero, off-by-one)',
      'Null / undefined / missing input', 'Empty string / empty array / empty object',
      'Invalid type input', 'Negative numbers where only positive expected',
      'Very large input (performance / overflow)', 'Function called with no arguments',
      'Return value type and shape correctness', 'Error/exception handling paths'
    ]
  },
  integration: {
    label: 'Integration',
    items: [
      'Correct data passed between components/modules', 'Dependent service returns success',
      'Dependent service returns an error / times out', 'Database read/write consistency',
      'Correct handling of partial failures', 'Authentication/authorization between components',
      'Data format mismatches between systems', 'Retry and fallback behavior',
      'Configuration differences between environments', 'Concurrent access / race conditions'
    ]
  },
  e2e: {
    label: 'End-to-end (E2E)',
    items: [
      'Full happy-path user journey completes successfully', 'Form validation errors shown to user',
      'Navigation between pages/screens works as expected', 'Session/auth expiration handled gracefully',
      'Data persists correctly across page reloads', 'Responsive behavior on different screen sizes',
      'Third-party integration failures handled gracefully', 'Loading and empty states render correctly',
      'Accessibility of key user flows (keyboard, screen reader)', 'Cross-browser behavior consistency'
    ]
  }
};

function compute({ category }) {
  const key = CATEGORIES[category] ? category : 'unit';
  const cat = CATEGORIES[key];
  return { category: key, label: cat.label, items: cat.items };
}

export default createComputeHandler(compute);
