import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("business-name", {
  role: "an expert brand naming consultant",
  shape: `{ "names": ["string, 10-12 creative and varied business name ideas"], "notes": "brief note on naming direction and a reminder to check trademark availability" }`
});
