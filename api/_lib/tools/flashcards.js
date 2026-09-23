import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("flashcards", {
  role: "an expert educator creating study flashcards",
  shape: `{ "cards": [ { "term": "string", "definition": "string" } ] }`
});
