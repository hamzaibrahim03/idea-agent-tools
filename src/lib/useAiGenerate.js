import { useState } from "react";
import { callAnthropicDirect, callGeminiDirect, callServerFunction, extractJsonFromText } from "./aiClient.js";
export const API_KEY_STORAGE_KEY = "idea-agent:ai-tool:api-key";
export const API_PROVIDER_STORAGE_KEY = "idea-agent:ai-tool:api-provider";
export function buildDirectPrompt(agentLabel, input) {
  const inputLines = Object.entries(input || {})
    .filter(([, value]) => String(value ?? "").trim() !== "")
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
  return (
    `You are an expert AI assistant for the "${agentLabel}" tool. A user has provided the following details:\n\n${inputLines || "(no details provided)"}\n\n` +
    `Based on these details, produce a helpful, realistic, specific result as a JSON object with clear fields. ` +
    `Respond with ONLY valid JSON, no markdown fences, no commentary.`
  );
}
export function useAiGenerate(agentKey, agentLabel, { kind = "tool" } = {}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [provider, setProvider] = useState(() => {
    try {
      return localStorage.getItem(API_PROVIDER_STORAGE_KEY) || "anthropic";
    } catch {
      return "anthropic";
    }
  });
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  function updateProvider(value) {
    setProvider(value);
    try {
      localStorage.setItem(API_PROVIDER_STORAGE_KEY, value);
    } catch {
    }
  }
  function updateApiKey(value) {
    setApiKey(value);
    try {
      if (value) localStorage.setItem(API_KEY_STORAGE_KEY, value);
      else localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch {
    }
  }
  async function generate(input) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const trimmedKey = apiKey.trim();
      let data;
      if (trimmedKey) {
        try {
          const prompt = buildDirectPrompt(agentLabel, input);
          const raw = provider === "anthropic"
            ? await callAnthropicDirect(trimmedKey, prompt, { maxTokens: 2048 })
            : await callGeminiDirect(trimmedKey, prompt);
          if (!raw) throw new Error("The model returned an empty response. Try again.");
          try {
            data = extractJsonFromText(raw);
          } catch {
            data = { summary: raw };
          }
        } catch (keyErr) {
          if (/api key not valid|invalid.*api key|unauthorized|401/i.test(keyErr.message || "")) {
            updateApiKey("");
            throw new Error(
              "Your saved API key was invalid, so it's been cleared. Click \"Generate with AI\" again to use the free option, or re-enter a valid key."
            );
          }
          throw keyErr;
        }
      } else {
        const endpoint = kind === "agent" ? `/api/agents/${agentKey}` : `/api/tools/${agentKey}`;
        data = await callServerFunction(endpoint, { input, provider });
      }
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || "Unable to generate a result.");
      return null;
    } finally {
      setLoading(false);
    }
  }
  function reset() {
    setResult(null);
    setError("");
  }
  return {
    result,
    loading,
    error,
    generate,
    reset,
    showApiSetup,
    setShowApiSetup,
    provider,
    updateProvider,
    apiKey,
    updateApiKey,
  };
}
