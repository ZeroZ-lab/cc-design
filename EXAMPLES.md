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

## Advanced Workflows

### Brand Style + Existing Design System

If your project already has a `DESIGN.md`:

```
/cc-design "Add a Stripe-inspired payment form to our app"
```

cc-design will:
1. Read your existing DESIGN.md
2. Fetch Stripe's design system
3. Ask: "Should I merge Stripe's payment form patterns into your design system, or keep it isolated?"
4. Generate HTML that respects your existing tokens while incorporating Stripe's payment UX patterns

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
