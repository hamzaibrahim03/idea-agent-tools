import { createComputeHandler } from '../computeHandler.js';

const SUBJECTS = ['the team', 'a curious cat', 'our neighbor', 'the old machine', 'a bright student', 'the committee', 'my brother', 'the river', 'a quiet town', 'the scientist'];
const VERBS = ['discovered', 'organized', 'questioned', 'rebuilt', 'welcomed', 'measured', 'ignored', 'celebrated', 'documented', 'transformed'];
const OBJECTS = ['the missing report', 'a forgotten garden', 'several new ideas', 'the plan for tomorrow', 'an unexpected visitor', 'the old bridge', 'a stack of letters', 'the annual budget', 'a strange melody', 'the town square'];
const CONNECTORS = ['Meanwhile', 'As a result', 'Even so', 'Later that day', 'Without warning', 'In the end', 'Nevertheless', 'Soon after'];
const CLOSERS = ['and nobody seemed to mind', 'though the details remained unclear', 'which surprised everyone present', 'for reasons still unknown', 'and the story spread quickly', 'but only a few noticed', 'and life went on as usual'];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function makeSentence(useConnector) {
  const prefix = useConnector && Math.random() < 0.35 ? `${pick(CONNECTORS)}, ` : '';
  const subject = prefix ? pick(SUBJECTS) : capitalize(pick(SUBJECTS));
  const body = `${prefix}${subject} ${pick(VERBS)} ${pick(OBJECTS)}`;
  const withCloser = Math.random() < 0.5 ? `${body} ${pick(CLOSERS)}` : body;
  return capitalize(withCloser) + '.';
}
function makeParagraph(sentenceCount) {
  return Array.from({ length: sentenceCount }, (_, i) => makeSentence(i > 0)).join(' ');
}
function generate(paragraphCount) {
  return Array.from({ length: paragraphCount }, () => makeParagraph(4 + Math.floor(Math.random() * 3))).join('\n\n');
}

function compute({ paragraphCount }) {
  const n = Math.max(1, Math.min(20, Number(paragraphCount) || 1));
  return { output: generate(n) };
}

export default createComputeHandler(compute);
