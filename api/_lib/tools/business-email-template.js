import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("business-email-template", {
  role: "a skilled professional business correspondence writer",
  shape: `{ "subject": "string", "email": "the full email text, ready to send, with greeting and sign-off" }`
});
