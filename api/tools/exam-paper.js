import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("exam-paper", {
  role: "an expert educator writing exam questions",
  shape: `{ "title": "string", "questions": [ { "question": "string", "marks": number } ], "totalMarks": number }`
});
