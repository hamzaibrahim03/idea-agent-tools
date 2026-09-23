import { createComputeHandler } from '../_lib/computeHandler.js';

const EMOJI_MAP = {
  'ice cream': '🍦',
  'thank you': '🙏',
  'good morning': '🌅',
  'good night': '🌙',
  happy: '😊',
  sad: '😢',
  love: '❤️',
  fire: '🔥',
  cool: '😎',
  laugh: '😂',
  laughing: '😂',
  cry: '😭',
  crying: '😭',
  angry: '😠',
  tired: '😴',
  sleep: '😴',
  party: '🎉',
  celebrate: '🎉',
  music: '🎵',
  star: '⭐',
  sun: '☀️',
  rain: '🌧️',
  snow: '❄️',
  coffee: '☕',
  pizza: '🍕',
  burger: '🍔',
  beer: '🍺',
  cake: '🎂',
  dog: '🐶',
  cat: '🐱',
  money: '💰',
  rich: '🤑',
  idea: '💡',
  smart: '🧠',
  strong: '💪',
  run: '🏃',
  walk: '🚶',
  car: '🚗',
  plane: '✈️',
  home: '🏠',
  work: '💼',
  time: '⏰',
  book: '📚',
  phone: '📱',
  computer: '💻',
  game: '🎮',
  win: '🏆',
  lose: '😞',
  yes: '✅',
  no: '❌',
  ok: '👍',
  wow: '😮',
  hot: '🥵',
  cold: '🥶',
  hungry: '🍽️',
  thirsty: '🥤',
  sick: '🤒',
  scared: '😱',
  funny: '😆',
  bored: '😑',
  excited: '🤩',
  confused: '😕',
  peace: '✌️',
  world: '🌍',
  heart: '❤️',
  friend: '🤝'
};
const SORTED_KEYS = Object.keys(EMOJI_MAP).sort((a, b) => b.length - a.length);
const PATTERN = new RegExp(
  '\\b(' + SORTED_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b',
  'gi'
);

function translate(text) {
  if (!text) return { output: '', matchCount: 0 };
  let matchCount = 0;
  const output = text.replace(PATTERN, (match) => {
    matchCount++;
    const emoji = EMOJI_MAP[match.toLowerCase()];
    return `${match} ${emoji}`;
  });
  return { output, matchCount };
}

function compute({ input }) {
  return translate(String(input || ''));
}

export default createComputeHandler(compute);
