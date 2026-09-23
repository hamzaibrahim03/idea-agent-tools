import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("demand-letter", {
  role: "a professional writer drafting a formal demand letter (educational template, not legal advice)",
  shape: `{ "letter": "the full formal demand letter text, ready to use as a starting draft" }`
});
