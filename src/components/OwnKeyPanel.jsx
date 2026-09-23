const PROVIDERS = {
  anthropic: { label: "Anthropic (Claude)", keyPlaceholder: "sk-ant-..." },
  gemini: { label: "Google (Gemini)", keyPlaceholder: "AIza..." },
};
export default function OwnKeyPanel({ provider, updateProvider, apiKey, updateApiKey }) {
  return (
    <div className="tool-panel" style={{ marginTop: 12 }}>
      <p className="tool-description" style={{ marginTop: 0, fontSize: 13 }}>
        "Generate with AI" already works for free with no setup, rate-limited to keep it
        free for everyone. Connect your own key here instead for unlimited use.
      </p>
      <label htmlFor="own-key-provider">AI provider</label>
      <select id="own-key-provider" value={provider} onChange={(e) => updateProvider(e.target.value)}>
        {Object.entries(PROVIDERS).map(([key, p]) => (
          <option key={key} value={key}>
            {p.label}
          </option>
        ))}
      </select>
      <label htmlFor="own-key-api-key" style={{ marginTop: 10 }}>
        API key
      </label>
      <input
        id="own-key-api-key"
        type="password"
        value={apiKey}
        onChange={(e) => updateApiKey(e.target.value)}
        placeholder={PROVIDERS[provider].keyPlaceholder}
        autoComplete="off"
      />
      <p className="tool-description" style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
        Stored only in this browser's local storage - never sent to us. It is sent directly
        from your browser to {PROVIDERS[provider].label} when you click "Generate with AI".
        Clear the field to remove it.
      </p>
    </div>
  );
}
