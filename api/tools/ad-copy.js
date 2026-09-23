import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("ad-copy", {
  role: "an expert advertising copywriter using the AIDA (Attention, Interest, Desire, Action) framework",
  shape: `{ "headline": "string", "attention": "string", "interest": "string", "desire": "string", "action": "string", "fullCopy": "the complete ad copy as one piece" }`
});
