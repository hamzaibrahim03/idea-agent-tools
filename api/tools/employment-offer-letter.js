import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("employment-offer-letter", {
  role: "an HR professional drafting a formal employment offer letter",
  shape: `{ "letter": "the full offer letter text, ready to use as a starting draft" }`
});
