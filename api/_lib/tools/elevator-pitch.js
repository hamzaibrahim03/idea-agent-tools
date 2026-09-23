import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("elevator-pitch", {
  role: "an expert startup pitch coach",
  shape: `{ "pitch": "the full elevator pitch, 30-60 seconds when spoken", "keyPoints": ["string"] }`
});
