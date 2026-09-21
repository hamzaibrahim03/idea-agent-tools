# idea-agent
Free, single-purpose online tools that run almost entirely in the browser — no sign-up. The idea:
build small tools around well-known, high-search-volume "how do I..." queries, one at a time,
covering both developer and everyday/non-technical use cases.
## AI Agents
The homepage leads with 4 "agents" (`src/agentRegistry.js`, components in `src/agents/`) that
chain several calculation steps into one guided, multi-step flow instead of a single tool:
- **🏗️ Construction Agent** (`/agents/construction-agent`) — plot size + quality tier + start date
  → requirements, materials (cement/sand/aggregate/steel), a bill of quantities, total cost
  breakdown, a phased timeline with real dates, a labor cost plan by trade, and a risk matrix.
- **💼 Business Agent** (`/agents/business-agent`) — business type + starting capital + target
  margin → startup cost breakdown, a pricing formula example, a monthly profit/break-even
  projection, and a marketing budget split.
- **💻 Developer Agent** (`/agents/developer-agent`) — app type + frontend + auth choice →
  requirements summary, a component list, a starter database schema, an API endpoint outline, a
  starter code snippet, and testing/deployment checklists.
- **✈️ Travel Agent** (`/agents/travel-agent`) — destination + trip length + group size + budget →
  a transport/hotel/food/activity/emergency-reserve budget split, and a day-by-day itinerary
  skeleton.
**Important: none of these call an AI model.** Every step is real client-side math/logic using the
same formulas as this site's individual calculators, or a curated template/checklist - not GPT/
Claude-generated text. This was a deliberate choice: it keeps every agent free, instant, and
identical every time, with no API key or backend required. If genuinely AI-written narrative
output (not just structured numbers) is wanted later, it would need to follow the existing
AI Prompt Generator's pattern - free template by default, optionally better with the user's own
Anthropic/Gemini API key - since this site has no server-side AI budget of its own.
## Current tools
The homepage has a search bar, an industry icon grid, and a category filter (`src/toolRegistry.js`'s
`CATEGORIES` export) with 21 categories - every tool below is tagged with one via its `category`
field in the registry. As of the latest count there are 345 tools across: Developer/CS, Everyday/
General, Text & Writing, Finance/Math, Construction/Home Improvement, Business, Real Estate,
Education, Career/Jobs, Marketing, E-commerce, Manufacturing, Logistics, Legal, Healthcare,
Architecture & Engineering, Agriculture, Restaurant/Food Business, Travel, Design, and Document
Tools.
The 19 industry categories added after Construction (Business through Document Tools) are listed
in summary form below rather than tool-by-tool, since the full list is long - browse them live via
the category filter. Every tool in these categories is honestly scoped to what a client-side-only
site can actually do: real calculators using standard published formulas, real interactive
checklists/trackers (session-only, no backend), and fill-in-the-blank document/template
generators. None of them fake AI analysis, real-time market/location data, OCR, or file-format
conversion (PDF↔Word, image background removal, etc.) - those were deliberately left out rather
than mocked. Legal and healthcare tools carry a visible disclaimer that they are educational
templates/organizational aids, not legal or medical advice.
- **Construction / Home Improvement** (16 tools): brick/block, concrete, paint, flooring,
  plaster, roofing, cost estimator, BOQ generator, material calculator, house cost estimator,
  labor cost, project timeline, site inspection checklist, budget tracker, safety plan checklist,
  risk assessment matrix.
- **Business** (15 tools): plan outline, startup costs, profit margin, SWOT builder, pricing,
  invoice generator, proposal outline, email templates, task priority matrix, KPI calculator,
  customer persona builder, partnership outline, meeting agenda, business name generator,
  elevator pitch builder.
- **Real Estate** (10 tools): mortgage calculator, loan eligibility, rental yield, property ROI,
  listing description template, inspection checklist, rental agreement outline, property
  comparison, stamp duty calculator, price-per-sq-ft calculator.
- **Education** (10 tools): quiz generator, flashcards, study plan generator, citation generator
  (APA/MLA/Chicago) and converter, exam paper generator, presentation outline, grade-weight
  calculator, academic calendar countdown, class schedule builder.
- **Career / Jobs** (10 tools): resume builder, ATS keyword checker, cover letter generator,
  interview question bank, salary/compensation calculator, skill gap analyzer, learning roadmap,
  job offer comparison, notice period calculator, job application tracker.
- **Marketing** (10 tools): social post templates, hashtag generator, video script outline, ad
  copy templates, SEO title/meta generator, blog outline generator, marketing ROI calculator,
  content calendar, newsletter template, email subject line tester.
- **E-commerce** (10 tools): product description templates, fee-aware pricing calculator,
  shipping cost calculator, profit calculator, product name generator, comparison table builder,
  support reply templates, discount code generator, inventory reorder calculator, cart
  abandonment rate calculator.
- **Legal** (10 tools, all educational templates - not legal advice): NDA, generic contract,
  terms & conditions, privacy policy, notice to vacate, demand letter, power of attorney, and
  employment offer letter templates, a clause glossary, and a legal document checklist.
- **Healthcare** (6 tools, all organizational aids - not medical advice): appointment planner,
  medication schedule organizer, hospital cost planner, patient intake form template, medical
  terminology glossary, insurance coverage calculator.
- **Architecture & Engineering** (12 tools): floor plan area calculator, room size calculator,
  perimeter calculator, stair calculator, wall material calculator, window/door quantity
  calculator, lighting load, electrical load, water tank sizing, HVAC load estimator, building
  material estimator, engineering unit converter.
- **Manufacturing** (9 tools): production cost, material requirement planner, maintenance
  schedule, risk checklist, workplace safety checklist, quality inspection checklist, OEE (KPI)
  calculator, inventory calculator, SOP template generator.
- **Logistics** (9 tools): fuel cost, freight shipping estimator, vehicle load calculator, fleet
  cost calculator, delivery invoice generator, ETA calculator, driver schedule generator, route
  stop planner, inventory tracker.
- **Agriculture** (9 tools): crop planning, irrigation, seed requirement, fertilizer, crop profit,
  farm expense tracker, machinery cost, harvest yield estimator, livestock feed calculator.
- **Restaurant / Food Business** (8 tools): food cost, menu pricing, recipe cost, recipe scaling,
  restaurant profit, staff schedule generator, menu item profitability analyzer, portion cost
  calculator.
- **Travel** (8 tools): trip budget calculator, packing list generator, itinerary builder, road
  trip fuel calculator, pre-trip checklist, daily budget splitter, transport cost comparator, trip
  countdown.
- **Design** (9 tools): font pairing tool, real Canvas-API image resizer, spacing scale
  generator, type scale generator, design-system color generator, responsive breakpoint
  reference, icon size guide, UI copy length checker, component props table generator.
- **Document Tools** (4 tools): delimited-text table extractor, word-count page estimator,
  document checklist generator, plain-text formatter for pasted document content.
Developer tools:
- JSON Formatter & Validator
- Regex Tester
- Base64 Encoder / Decoder (correct UTF-8/emoji handling)
- UUID Generator (v4, real `crypto.randomUUID`)
- Unix Timestamp Converter (auto-detects seconds vs. milliseconds)
- URL Encoder / Decoder
- JWT Decoder
- Hash Generator (SHA-256/384/512, SHA-1 via Web Crypto)
- Markdown Previewer
- Text Case Converter
- Color Converter (HEX/RGB/HSL)
- Cron Expression Parser
- Text Diff Checker
- CSV to JSON Converter (and back)
- Slug Generator
- HTML Entity Encoder / Decoder
- YAML to JSON Converter (and back — common cases, not the full spec)
- Number Base Converter (binary/octal/decimal/hex)
- Whitespace / Text Cleaner
- Meta Tag Generator (SEO/Open Graph/Twitter Card)
- robots.txt Generator
- Favicon Tag Generator & Checklist
- Text Line Sorter (A-Z/Z-A, case-insensitive, natural number sort)
- Duplicate Line Remover
- Find & Replace Tool (optional regex)
- Text Statistics & Letter Frequency
- IP Subnet Calculator (IPv4/CIDR)
- AI Prompt Generator (free template auto-detects role/format; optionally connect your own
  Anthropic/Gemini API key, stored only in your browser, for genuine AI-generated prompts - OpenAI
  is not supported, since its API blocks direct browser calls with no workaround)
- JSON ⇄ JS Object Literal Converter
- Quote Style Converter (single/double/backtick)
- Indentation Converter (tabs ⇄ spaces)
- Regex Cheatsheet (searchable, click-to-copy)
- Placeholder Image URL Generator (calls a third-party image service to render the preview —
  noted on its page)
- CSS Unit Converter (px/rem/em/pt/%)
- Text Encryption (AES-256-GCM via Web Crypto API)
- Barcode Checksum Validator (EAN-8/13, UPC-A, GTIN-14)
Everyday/general-purpose tools:
- Word Counter
- Password Generator (real `crypto.getRandomValues`)
- Percentage Calculator
- Age Calculator
- Unit Converter (length/weight/temperature)
- QR Code Generator (the one tool that calls a third-party image API — noted on its page)
- BMI Calculator
- Tip Calculator
- Lorem Ipsum Generator
- Text Reverser
- Random Number Generator (real `crypto.getRandomValues`)
- List Randomizer / Shuffler (Fisher-Yates, real `crypto.getRandomValues`)
- Morse Code Translator
- Roman Numeral Converter
- Binary / Hex ⇄ Text Converter
- Palindrome Checker
- Anagram Checker
- Caesar Cipher (encrypt/decrypt/brute-force)
- Character Counter (Twitter/SMS/SEO limits)
- Acronym Generator
- Loan / EMI Calculator
- Dice Roller & Coin Flip (real `crypto.getRandomValues`)
- Stopwatch & Pomodoro Timer
- World Clock & Timezone Converter
- GPA Calculator (standard 4.0 scale)
- Grade / Percentage Converter
- Study Timer (by subject, with session log)
- Text to ASCII Art
- Compound Interest Calculator (with optional monthly contributions)
- Discount / Sale Price Calculator (with optional post-discount tax)
- Split Bill Calculator (even split or custom shares)
- Car Loan Calculator, Retirement Savings Projector, Savings Goal Calculator, Freelance Rate
  Calculator, Hourly ⇄ Salary Converter, Inflation Calculator, Money to Words Converter, Unit
  Price Comparator
- Body Fat, Calorie Needs (Mifflin-St Jeor), Water Intake, and Pregnancy Due Date estimators
  (all clearly marked as estimates, not medical advice)
- Cooking Measurement Converter, Random Team Generator, Random Date Generator, Weighted Random
  Picker, Random Name Generator, Password Strength Checker, Countdown Timer, Timezone Meeting
  Planner (work-hours overlap grid), Random Color Palette Generator
- Prime Number Checker, GCD/LCM, Quadratic Equation Solver, Matrix Calculator, Statistics
  Calculator, Permutations & Combinations, Pythagorean Theorem, Triangle Area, Circle Calculator,
  Scientific Notation Converter
- Moon Phase Calculator, Zodiac Sign Calculator (for fun, not scientific), Workdays Calculator,
  Next Birthday Countdown, Time Until Calculator, Random Quote Generator, Random Emoji Picker,
  Decision Maker, Passphrase Generator (XKCD-style, real crypto randomness)
More developer tools:
- Ping Latency Reference (educational latency table, not a live measurement), HTTP Status Code
  Reference, MIME Type Lookup, CIDR Range Calculator, User-Agent Parser, JSON to TypeScript
  Interface, SQL Formatter, .env File Parser, .gitignore Generator, Dockerfile Linter
- Base32 Encoder/Decoder, HMAC Generator, CRC-32 Calculator, URL Parser, Data URI Converter,
  HTML to Markdown Converter, JSONPath Tester, XML Formatter, UUID Validator
- CSS Gradient / Box Shadow / Border Radius / Flexbox / Grid / Triangle generators (all with a
  live visual preview), Contrast Ratio Checker (WCAG AA/AAA), CSS Clamp Calculator, Aspect Ratio
  Calculator, Viewport Units Calculator
- Markdown Table Generator, Commit Message Generator (Conventional Commits), Semver Comparator,
  package.json Validator, Bash Alias Generator, Cron Expression Builder (form-based, distinct
  from the existing parser), Line Counter, Curl Command Builder
More text/writing tools:
- Text-to-Speech Preview, Line Number Adder, Text Columnizer, Random Paragraph Generator, Word
  Frequency Counter, Sentence Case Converter, Text to Hex Dump, Bullet Point Formatter, Text Diff
  Percentage (similarity score), Text Truncator
- Pig Latin Translator, Leet Speak Converter, Syllable Counter, Alternating Case Converter, Number
  to Words / Words to Number converters, Text Wrapper, Invisible Character Remover, Text Emoji
  Translator, String Length by Encoding (UTF-16/code points/UTF-8 bytes), Title Case Converter
More math tools:
- Fraction Calculator, Ratio & Proportion Solver, Exponent & Root Calculator, Logarithm
  Calculator, Average (Mean) Calculator, Factorial Calculator, Probability Calculator, Vector
  Calculator (dot/cross product, magnitude, angle), Trigonometry Calculator (sin/cos/tan)
Construction / home improvement tools (all formulas verified against known industry reference
values - e.g. the brick calculator's modular-brick default matches the standard "~6.9 bricks per
sq ft" rule of thumb, and the roofing pitch multiplier matches published roofing tables):
- Brick & Block Calculator (wall size + brick size + mortar joint + waste %)
- Concrete Volume & Bags Calculator (slab/footing or post hole, cubic yards + pre-mix bags)
- Paint Coverage Calculator (wall area, coats, coverage rate)
- Flooring / Tile Calculator (room size, tile size, waste %, optional box coverage)
- Plaster / Render Calculator (wall area, coat thickness, bag coverage)
- Roofing Materials Calculator (footprint + pitch → roof area + shingle bundles)
All construction calculators are estimates for planning purposes - always confirm quantities with
a supplier or professional before ordering materials.
## Going live / monetization checklist
Everything below is wired up in code but disabled or placeholder until you supply real
accounts/IDs:
1. **Domain** - live at https://idea-agent-six.vercel.app. If you buy a custom domain, add it in
   the Vercel project settings, then replace `idea-agent-six.vercel.app` in
   [src/components/Seo.jsx](src/components/Seo.jsx), [public/robots.txt](public/robots.txt), and
   [public/sitemap.xml](public/sitemap.xml).
2. **Deploy** - `vercel.json` is set up for SPA routing. Already deployed via `vercel --prod`; run
   it again (or connect the repo in the Vercel dashboard for auto-deploy on push) to update.
3. **Analytics** - sign up at [plausible.io](https://plausible.io), then uncomment and fill in
   the script tag in [index.html](index.html).
4. **AdSense** - apply at [google.com/adsense](https://www.google.com/adsense) (needs some real
   traffic/content history first). Once approved, set `ADSENSE_CLIENT` and flip
   `ADSENSE_ENABLED` to `true` in [src/components/AdSlot.jsx](src/components/AdSlot.jsx), and add
   the AdSense loader `<script>` tag to `index.html` per their instructions. Also add real
   `data-ad-slot` values (currently placeholder `0000000000`/`0000000001`) from your AdSense
   dashboard in [src/components/Home.jsx](src/components/Home.jsx) and
   [src/components/ToolPage.jsx](src/components/ToolPage.jsx).
5. **Affiliate links** - sign up for a relevant program (hosting, dev tools, etc.), then set a
   real `href` and `enabled: true` in [src/affiliateLinks.js](src/affiliateLinks.js).
None of these earn anything until real IDs/accounts replace the placeholders above - this repo
only wires the integration points.
## Adding a new tool
1. Create `src/tools/YourTool.jsx` (see existing tools for the pattern — plain client-side React,
   no server calls).
2. Add an entry to `src/toolRegistry.js` (slug, name, description, component import) — this is
   the single source of truth for both routing and the homepage listing.
## Adding a new agent
1. Create `src/agents/YourAgent.jsx` — a multi-step wizard component (see `ConstructionAgent.jsx`
   for the pattern: a step selector using `.tool-controls` buttons, each step rendering a
   `.timestamp-result` or `.regex-groups-table` section). Keep every calculation real client-side
   math/logic, never a fake "AI-generated" result.
2. Add an entry to `src/agentRegistry.js` (slug, icon, category, name, description, component
   import) — routed at `/agents/:slug`, separate from `/tools/:slug`.
## Development
```
npm install
npm run dev
```
`npm run dev` (plain Vite) serves the frontend only - the `/api/generate-prompt` serverless
function used by the AI Prompt Generator's free tier won't run under it. To test that locally
too:
```
cp .env.local.example .env.local   # then fill in your own ANTHROPIC_API_KEY / GEMINI_API_KEY
npm run dev:vercel
```
`.env.local` is gitignored and read automatically by `vercel dev` - keys are never hardcoded,
committed, or bundled into client JS; the deployed site reads the same variable names from
Vercel's own Production environment variables (`vercel env add`), set independently of this
file.
## Notes on scope
Search-volume/keyword research for picking which tools to build next isn't something this
project can verify automatically (no Ahrefs/SEMrush/Keyword Planner access) — tool selection is
based on well-known evergreen developer pain points rather than confirmed numbers. If you have
real keyword data pointing at specific gaps, that's the most useful input for picking the next
batch of tools.
