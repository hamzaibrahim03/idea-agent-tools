# idea-agent

Free, single-purpose developer tools that run entirely in the browser — no sign-up, no data sent
to a server. The idea: build small tools around well-known, high-search-volume "how do I..."
developer queries, one at a time.

## Current tools

- JSON Formatter & Validator
- Regex Tester
- Base64 Encoder / Decoder (correct UTF-8/emoji handling)
- UUID Generator (v4, real `crypto.randomUUID`)
- Unix Timestamp Converter (auto-detects seconds vs. milliseconds)

## Adding a new tool

1. Create `src/tools/YourTool.jsx` (see existing tools for the pattern — plain client-side React,
   no server calls).
2. Add an entry to `src/toolRegistry.js` (slug, name, description, component import) — this is
   the single source of truth for both routing and the homepage listing.

## Development

```
npm install
npm run dev
```

## Notes on scope

Search-volume/keyword research for picking which tools to build next isn't something this
project can verify automatically (no Ahrefs/SEMrush/Keyword Planner access) — tool selection is
based on well-known evergreen developer pain points rather than confirmed numbers. If you have
real keyword data pointing at specific gaps, that's the most useful input for picking the next
batch of tools.
