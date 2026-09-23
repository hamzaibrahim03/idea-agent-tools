import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("developer", {
  role: "an expert software architect and technical lead",
  shape: `{
  "summary": "short overview of the project",
  "requirements": ["string"],
  "architecture": "string",
  "components": [ { "name": "string", "purpose": "string" } ],
  "databaseSchema": [ { "table": "string", "fields": ["string"] } ],
  "apiEndpoints": [ { "method": "string", "path": "string", "purpose": "string" } ],
  "testingPlan": ["string"],
  "deploymentChecklist": ["string"]
}`
});
