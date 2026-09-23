import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("cover-letter", {
  role: "a skilled professional cover letter writer",
  shape: `{ "letter": "the full cover letter text, ready to send, with greeting and sign-off" }`
});
