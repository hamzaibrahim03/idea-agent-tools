import { createComputeHandler } from '../_lib/computeHandler.js';

const DOMESTIC_ITEMS = [
  'Government-issued photo ID', 'Boarding pass / tickets', 'Hotel confirmation',
  'Payment cards and some cash', 'Phone charger', 'Medications',
  'Weather-appropriate clothing', 'Emergency contact list', 'Copy of itinerary shared with someone at home'
];
const INTERNATIONAL_ITEMS = [
  'Valid passport (check expiration date - many countries require 6+ months validity)',
  'Visa (check requirements for your destination)',
  'Travel insurance', 'Vaccination records / health requirements reminder',
  'Local currency or a card with no foreign transaction fees',
  'Power plug adapter', 'Copies of important documents (passport photo page, itinerary)',
  'Emergency contacts and embassy/consulate info', 'International phone plan or SIM',
  'Check travel advisories for your destination'
];

function compute({ destinationType }) {
  const type = destinationType === 'domestic' ? 'domestic' : 'international';
  const items = type === 'international' ? INTERNATIONAL_ITEMS : DOMESTIC_ITEMS;
  return { destinationType: type, items };
}

export default createComputeHandler(compute);
