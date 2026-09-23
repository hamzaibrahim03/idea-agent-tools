import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("interview-questions", {
  role: "an expert hiring manager and interview coach",
  shape: `{ "questions": ["string, 8-10 relevant interview questions for this role and level"] }`
});
