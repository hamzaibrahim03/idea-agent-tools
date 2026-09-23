import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("api-doc-template", {
  role: "an expert technical writer documenting APIs",
  shape: `{ "endpoint": "string", "method": "string", "description": "string", "parameters": [ { "name": "string", "type": "string", "required": "boolean as string", "description": "string" } ], "responseExample": "string" }`
});
