import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("quiz", {
  role: "an expert quiz writer",
  shape: `{ "questions": [ { "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": "string, must exactly match one of the options" } ] }`
});
