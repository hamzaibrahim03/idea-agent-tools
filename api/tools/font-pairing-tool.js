import { createComputeHandler } from '../_lib/computeHandler.js';

const PAIRINGS = [
  { heading: 'Playfair Display', body: 'Source Sans Pro', mood: 'Elegant editorial' },
  { heading: 'Montserrat', body: 'Merriweather', mood: 'Modern with warmth' },
  { heading: 'Poppins', body: 'Roboto', mood: 'Friendly and geometric' },
  { heading: 'Lora', body: 'Open Sans', mood: 'Classic and readable' },
  { heading: 'Oswald', body: 'Lato', mood: 'Bold condensed headings' },
  { heading: 'Raleway', body: 'Nunito Sans', mood: 'Clean and airy' },
  { heading: 'Abril Fatface', body: 'Karla', mood: 'High-contrast display pairing' },
  { heading: 'Libre Baskerville', body: 'Work Sans', mood: 'Traditional serif meets modern sans' },
  { heading: 'Bebas Neue', body: 'Inter', mood: 'Punchy headline with neutral body' },
  { heading: 'Cormorant Garamond', body: 'Mulish', mood: 'Refined luxury feel' }
];

function compute({ selected }) {
  const index = Number(selected);
  const pairing = PAIRINGS[Number.isInteger(index) && index >= 0 && index < PAIRINGS.length ? index : 0];
  return { pairing };
}

export default createComputeHandler(compute);
