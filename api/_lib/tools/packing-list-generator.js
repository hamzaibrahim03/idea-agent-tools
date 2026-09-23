import { createComputeHandler } from '../computeHandler.js';

const TRIP_TYPES = {
  beach: {
    label: 'Beach',
    items: [
      'Swimsuit', 'Sunscreen', 'Sunglasses', 'Beach towel', 'Flip-flops', 'Hat',
      'After-sun lotion', 'Beach bag', 'Light cover-up', 'Waterproof phone pouch'
    ]
  },
  business: {
    label: 'Business',
    items: [
      'Suit / business attire', 'Dress shoes', 'Laptop and charger', 'Business cards',
      'Notebook and pen', 'Phone charger', 'Portable battery pack', 'Travel iron / steamer',
      'Dress belt', 'Toiletry bag'
    ]
  },
  camping: {
    label: 'Camping',
    items: [
      'Tent', 'Sleeping bag', 'Sleeping pad', 'Headlamp / flashlight', 'Camp stove',
      'Water filter or purification tablets', 'First aid kit', 'Multi-tool / knife',
      'Insect repellent', 'Extra socks', 'Fire starter'
    ]
  },
  winter: {
    label: 'Winter',
    items: [
      'Insulated jacket', 'Thermal base layers', 'Gloves', 'Winter hat', 'Scarf',
      'Waterproof boots', 'Wool socks', 'Hand warmers', 'Lip balm', 'Moisturizer'
    ]
  },
  general: {
    label: 'General',
    items: [
      'Passport / ID', 'Phone charger', 'Toothbrush and toothpaste', 'Underwear and socks',
      'Comfortable shoes', 'Medications', 'Travel adapter', 'Reusable water bottle',
      'Basic first aid items', 'Laundry bag'
    ]
  }
};
const PER_DAY_ITEM = 'Change of clothes';

function compute({ tripType, days }) {
  const trip = TRIP_TYPES[tripType];
  if (!trip) throw new Error('Unknown trip type');
  const daysNum = Math.max(1, parseInt(days, 10) || 1);
  const items = [...trip.items, `${PER_DAY_ITEM} (${daysNum}x for ${daysNum}-day trip)`];
  return { items, daysNum };
}

export default createComputeHandler(compute);
