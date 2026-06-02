# cc-design Usage Examples

## Brand Style Cloning (New Feature)

cc-design now supports progressive loading of design systems from [getdesign.md](https://getdesign.md) — a curated collection of 68+ brand design specifications.

### Basic Usage

Simply mention a brand name in your design request:

```
/cc-design "Create a pricing page with Stripe's aesthetic"
```

**What happens:**
1. cc-design detects "Stripe" as a brand mention
2. Fetches Stripe's DESIGN.md from getdesign.md
3. Extracts colors, typography, spacing, and component patterns
4. Generates HTML with Stripe's design tokens applied
5. Verifies the output matches Stripe's visual style

### Supported Brands

**AI & LLM Platforms:**
- OpenAI, Anthropic, Claude, Cursor, Perplexity, Midjourney, Replicate, Hugging Face, Cohere, Stability AI

**Developer Tools:**
- Vercel, GitHub, Linear, Figma, Supabase, Sentry, Raycast, Expo, Postman, Railway, Render

**Fintech & Crypto:**
- Stripe, Coinbase, Binance, Revolut, Cash App, Robinhood, Plaid

**Enterprise & Cloud:**
- IBM, Salesforce, MongoDB, Redis, Snowflake, Databricks, Confluent

**Automotive:**
- Tesla, SpaceX, Lamborghini, Ferrari, Porsche, BMW, Mercedes-Benz, Bugatti

**Consumer Tech:**
- Apple, Spotify, Airbnb, Uber, Netflix, Nike, Notion

**Media & Social:**
- X (Twitter), Instagram, YouTube, TikTok, Discord, Slack

### Example Requests

#### 1. Single Brand Style

```
/cc-design "Notion-style kanban board"
```

Output: A kanban board with Notion's clean typography, subtle shadows, and neutral color palette.

---

#### 2. Brand + Specific Component

```
/cc-design "Linear-style issue tracker with keyboard shortcuts"
```

Output: Issue tracker using Linear's Inter font, purple accents, and command palette interaction pattern.

---

#### 3. Brand + Custom Content

```
/cc-design "Apple-style product showcase for a smartwatch"
```

Output: Product page with Apple's minimalist aesthetic, large hero images, and precise typography.

---

#### 4. Multi-Brand Blending

```
/cc-design "Mix Stripe's colors with Vercel's minimalist layout for a dashboard"
```

Output: Dashboard combining Stripe's purple gradient palette with Vercel's black background and clean spacing.

---

#### 5. Brand Exploration

```
/cc-design "Show me 3 variants: Stripe style, Vercel style, and Linear style for a settings page"
```

Output: `design_canvas.jsx` with side-by-side comparison of all three brand aesthetics, plus a tweaks panel to switch between them.

---

## Traditional Usage (No Brand)

### React Prototype

```
/cc-design "Interactive prototype of a chat interface"
```

Loads: `react-babel-setup.md` + `interactive-prototype.md`

---

### Slide Deck

```
/cc-design "Pitch deck with 5 slides: title, problem, solution, traction, ask"
```

Loads: `starter-components.md` + `deck_stage.js` template

---

### Animation

```
/cc-design "Animated loading sequence with 3 states"
```

Loads: `starter-components.md` + `react-babel-setup.md` + `animations.jsx` template

---

### Mobile Mockup

```
/cc-design "iOS app mockup for a fitness tracker"
```

Loads: `starter-components.md` + `react-babel-setup.md` + `ios_frame.jsx` template

---

### Wireframe

```
/cc-design "Low-fidelity wireframe for an e-commerce checkout flow"
```

Loads: `frontend-design.md` + `design_canvas.jsx` template

---

## Interactive Explainers

### Flow Explainer

```
/cc-design "Interactive flow diagram showing how a RAG pipeline works, step by step"
```

Loads: `explainer-interaction-patterns.md` + `explainer-node-graph-visuals.md` + `react-setup.md` + `flow_explainer.jsx`

Output: A guided walkthrough of the RAG pipeline with nodes (input → embed → retrieve → augment → generate), edges connecting them, and step-by-step playback that highlights each stage in sequence. Users click through steps to see how data flows.

**What to verify:** Each step has a `focus` array highlighting the relevant nodes; node kinds (`input`, `process`, `output`, `decision`) match their role; the graph is a valid connected directed graph.

---

### Compare Explainer

```
/cc-design "对比 PostgreSQL 和 MongoDB 作为主力数据库的优劣，做成交互式对比图"
```

Loads: Same explainer references + `compare_explainer.jsx`

Output: A multi-dimension comparison with PostgreSQL and MongoDB as subjects, tabs for switching dimensions (performance, scalability, data model, ecosystem), pro/con items with scores, and a verdict for each subject. Users switch dimensions via tabs.

**What to verify:** At least 2 subjects with distinct `accentColor`; items have valid `kind` (pro/con/neutral/highlight) and `score` (0-5); dimension tab switching works.

---

### Decision Tree Explainer

```
/cc-design "Interactive decision tree to help choose between React, Vue, Svelte, and Angular for a new project"
```

Loads: Same explainer references + `decision_tree.jsx`

Output: A branching tree with question nodes ("Type safety important?"), factor nodes adding context, and conclusion nodes with verdicts ("Choose TypeScript + React"). Every branch edge has a label explaining the condition. Users hover to highlight paths.

**What to verify:** Single root node; `question`/`factor`/`conclusion` kinds are correct; every edge has a `label`; conclusion nodes have `conclusion` verdict strings; no cycles.

---

## Knowledge Artifacts

```
/cc-design "Knowledge artifact explaining how DNS resolution works, from browser cache to authoritative name server"
```

Loads: `knowledge-artifact-spec.md` + `information-design-theory.md` + `interaction-design-theory.md`

Output: A structured explanation with interactive elements — not just a static article. Default density is **Level 2** (3-5 interactions: navigation, expand/collapse, tab switching, stepper). Default animation is **A2** (process demonstration with path highlighting or stepper). Content category "data flow / control flow" triggers the **Static-only Ban**, so at least one dynamic module is required.

**What to verify:**
- Content was scanned for cognitive structures (process, change, paths, feedback)
- At least one primary animation/interaction module carries the core explanation
- Interaction density matches content complexity (not Level 0 for a multi-step process)
- Animation intensity is proportional to content depth

---

## Design Review / Critique

```
/cc-design "Review and score this landing page design: landing.html"
```

Loads: `design-checklist.md` + `principle-review.md` + `verification.md` + `typography-spacing-quick-ref.md` (via `deep-design-review` checkpoint)

Output: A structured critique covering hierarchy, spacing, color, typography, interaction quality, and emotional fit. Scores each dimension and highlights specific issues with file/line references. Does NOT just say "looks good" — identifies at least 2-3 concrete improvement areas.

**What to verify:** The `deep-design-review` checkpoint was announced; all loaded references were consulted; critique references specific elements, not vague impressions; scoring uses the 5-dimension design scoring framework.

---

## Advanced Workflows

### Brand Style + Existing Design System

If your project already has a `DESIGN.md`:

```
/cc-design "Add a Stripe-inspired payment form to our app"
```

cc-design will:
1. Read your existing DESIGN.md
2. Fetch Stripe's design system
3. Ask how to update the existing contract: append, merge, or overwrite
4. Recommend merge by default unless this is a bounded add-on or a full reset
5. Generate HTML that respects your existing tokens while incorporating Stripe's payment UX patterns

---

### Export to PPTX

```
/cc-design "Tesla-style product reveal deck, then export to PPTX"
```

Workflow:
1. Generates HTML deck with Tesla's bold typography and dark aesthetic
2. Runs `scripts/gen_pptx.js` to convert to editable PowerPoint
3. Delivers both `.html` and `.pptx` files

---

### Progressive Refinement

```
User: /cc-design "Airbnb-style listing card"
Claude: [generates card with Airbnb's rounded corners, shadow style, and image treatment]

User: "Make it more compact"
Claude: [adjusts spacing while maintaining Airbnb's visual language]

User: "Add a heart icon for favorites"
Claude: [adds icon using Airbnb's icon style and interaction pattern]
```

---

## Tips for Best Results

### 1. Be Specific About Brand Elements

Instead of:
```
"Make it look like Stripe"
```

Try:
```
"Use Stripe's purple gradient and clean form styling"
```

### 2. Combine Brand + Task Type

```
"Vercel-style landing page with hero section and feature grid"
```

This helps cc-design load both the brand reference AND the appropriate component templates.

### 3. Request Comparisons for Exploration

```
"Show me this dashboard in Notion style vs Linear style"
```

You'll get a side-by-side comparison to help choose the right aesthetic direction.

### 4. Adapt, Don't Clone

```
"Inspired by Stripe's payment forms, but adapted for a B2B SaaS product"
```

cc-design will use Stripe's patterns as a foundation but adjust for your specific context.

### 5. Check the Brand Catalog

Visit [getdesign.md](https://getdesign.md) to see all 68+ available brands and their design characteristics before requesting.

---

## Troubleshooting

**Q: What if my brand isn't on getdesign.md?**

A: cc-design will fall back to web search and attempt to reconstruct the design system from public sources (screenshots, official guidelines). The quality may vary.

**Q: Can I mix more than 2 brands?**

A: Yes, but be cautious. Mixing 3+ distinct aesthetics often creates visual chaos. cc-design will warn you if the combination seems incoherent.

**Q: How do I save a fetched brand style for reuse?**

A: After cc-design fetches a brand's DESIGN.md, ask: "Save this as our project's design system." It will write a `DESIGN.md` file to your project root.

**Q: What if the brand's design has changed since getdesign.md was updated?**

A: getdesign.md is community-maintained. If you notice outdated styles, you can contribute updates to the [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) repository.

---

## Next Steps

- Try a simple brand clone: `/cc-design "Vercel-style 404 page"`
- Explore multi-brand blending: `/cc-design "Compare Stripe vs Coinbase styles for a crypto wallet UI"`
- Contribute missing brands to getdesign.md if you have design system documentation

For more details on how brand loading works internally, see `references/getdesign-loader.md`.
