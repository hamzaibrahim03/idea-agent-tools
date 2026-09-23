import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("notice-to-vacate", {
  role: "a professional writer drafting a formal notice-to-vacate letter (educational template, not legal advice)",
  shape: `{ "letter": "the full notice-to-vacate letter text, ready to use as a starting draft" }`
});
