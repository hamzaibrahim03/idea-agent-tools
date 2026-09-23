import { createComputeHandler } from '../_lib/computeHandler.js';
import { webcrypto } from 'node:crypto';

const WORD_LIST = [
  'apple', 'river', 'mountain', 'forest', 'ocean', 'tiger', 'eagle', 'castle', 'garden', 'bridge',
  'silver', 'golden', 'copper', 'winter', 'summer', 'autumn', 'spring', 'desert', 'jungle', 'island',
  'planet', 'rocket', 'comet', 'galaxy', 'meteor', 'shadow', 'thunder', 'lightning', 'breeze', 'storm',
  'candle', 'lantern', 'mirror', 'window', 'ladder', 'anchor', 'compass', 'harbor', 'voyage', 'journey',
  'wizard', 'dragon', 'phoenix', 'griffin', 'knight', 'archer', 'ranger', 'hunter', 'farmer', 'sailor',
  'pirate', 'wanderer', 'traveler', 'painter', 'writer', 'dancer', 'singer', 'builder', 'gardener', 'teacher',
  'crystal', 'diamond', 'emerald', 'ruby', 'sapphire', 'pearl', 'marble', 'granite', 'canyon', 'valley',
  'meadow', 'prairie', 'orchard', 'harvest', 'blossom', 'petal', 'branch', 'root', 'leaf', 'seed',
  'falcon', 'sparrow', 'raven', 'heron', 'otter', 'badger', 'fox', 'wolf', 'bear', 'lion',
  'panther', 'leopard', 'cheetah', 'zebra', 'giraffe', 'elephant', 'dolphin', 'whale', 'shark', 'turtle',
  'candy', 'cookie', 'muffin', 'pancake', 'waffle', 'noodle', 'pepper', 'ginger', 'cinnamon', 'vanilla',
  'coffee', 'lemon', 'orange', 'cherry', 'peach', 'mango', 'melon', 'coconut', 'walnut', 'almond',
  'rocket', 'engine', 'piston', 'turbine', 'circuit', 'signal', 'sensor', 'module', 'gadget', 'device',
  'puzzle', 'riddle', 'pattern', 'formula', 'theorem', 'diagram', 'sketch', 'canvas', 'palette', 'easel',
  'melody', 'rhythm', 'harmony', 'chorus', 'ballad', 'anthem', 'symphony', 'concert', 'theater', 'stage',
  'castle', 'tower', 'fortress', 'palace', 'temple', 'shrine', 'statue', 'fountain', 'plaza', 'market',
  'village', 'hamlet', 'harbor', 'coastline', 'peninsula', 'glacier', 'volcano', 'plateau', 'cavern', 'cliff',
  'whisper', 'echo', 'silence', 'glimmer', 'sparkle', 'shimmer', 'flicker', 'glow', 'blaze', 'ember',
  'velvet', 'satin', 'linen', 'cotton', 'wool', 'leather', 'canvas', 'ribbon', 'thread', 'button',
  'pocket', 'satchel', 'basket', 'crate', 'barrel', 'chest', 'trunk', 'drawer', 'shelf', 'cabinet',
  'meadowlark', 'nightingale', 'hummingbird', 'kingfisher', 'woodpecker', 'flamingo', 'peacock', 'swan', 'crane', 'pelican',
  'biscuit', 'pretzel', 'sandwich', 'burrito', 'dumpling', 'omelet', 'risotto', 'casserole', 'chowder', 'stew',
  'quartz', 'obsidian', 'amber', 'jade', 'onyx', 'topaz', 'garnet', 'opal', 'ivory', 'ebony',
  'sunrise', 'sunset', 'twilight', 'daybreak', 'midnight', 'horizon', 'skyline', 'starlight', 'moonbeam', 'daylight'
];

function randomIndex(length) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % length);
  let x;
  do {
    x = webcrypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return x % length;
}

function generatePassphrase(wordCount, separator, capitalize, includeNumber) {
  const words = Array.from({ length: wordCount }, () => {
    const w = WORD_LIST[randomIndex(WORD_LIST.length)];
    return capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  if (includeNumber) {
    const digits = webcrypto.getRandomValues(new Uint32Array(1))[0] % 100;
    words.push(String(digits));
  }
  return words.join(separator);
}

function compute({ wordCount, separator, capitalize, includeNumber }) {
  const n = Math.max(2, Math.min(10, Number(wordCount) || 4));
  const passphrase = generatePassphrase(n, separator ?? '-', !!capitalize, !!includeNumber);
  return { passphrase };
}

export default createComputeHandler(compute);
