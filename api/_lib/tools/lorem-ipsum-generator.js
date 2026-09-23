import { createComputeHandler } from '../computeHandler.js';

const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris ' +
  'nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse ' +
  'cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa ' +
  'qui officia deserunt mollit anim id est laborum'
).split(' ');

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
function makeSentence() {
  const length = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length }, randomWord);
  const sentence = words.join(' ');
  return sentence[0].toUpperCase() + sentence.slice(1) + '.';
}
function makeParagraph(sentenceCount) {
  return Array.from({ length: sentenceCount }, makeSentence).join(' ');
}
function generate(count, classic) {
  const paragraphs = Array.from({ length: count }, () => makeParagraph(4 + Math.floor(Math.random() * 3)));
  if (classic && paragraphs.length > 0) {
    paragraphs[0] =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      paragraphs[0];
  }
  return paragraphs.join('\n\n');
}

function compute({ paragraphCount, startClassic }) {
  const count = Math.max(1, Math.min(20, Number(paragraphCount) || 1));
  const output = generate(count, !!startClassic);
  return { output };
}

export default createComputeHandler(compute);
