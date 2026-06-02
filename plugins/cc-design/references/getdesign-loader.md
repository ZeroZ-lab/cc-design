# GetDesign.md Brand Style Loader

## Purpose

This reference enables cc-design to progressively load design systems from https://getdesign.md — a curated collection of 68+ DESIGN.md files capturing the visual DNA of popular brands (Stripe, Vercel, Notion, Apple, Tesla, etc.).

## When to Load This Reference

Load this reference when:
- User mentions a specific brand name in their design request (e.g., "Stripe-style payment form", "Notion-like dashboard")
- User asks to "clone" or "match" a well-known product's design
- User wants to explore multiple brand aesthetics before committing

## Brand Detection Pattern

Scan the user's request for these brand categories:

**AI & LLM Platforms:** OpenAI, Anthropic, Claude, Cursor, Perplexity, Midjourney, Replicate, Hugging Face, Cohere, Stability AI

**Developer Tools:** Vercel, GitHub, Linear, Figma, Supabase, Sentry, Raycast, Expo, Postman, Railway, Render

**Fintech & Crypto:** Stripe, Coinbase, Binance, Revolut, Cash App, Robinhood, Plaid

**Enterprise & Cloud:** IBM, Salesforce, MongoDB, Redis, Snowflake, Databricks, Confluent

**Automotive:** Tesla, SpaceX, Lamborghini, Ferrari, Porsche, BMW, Mercedes-Benz, Bugatti

**Consumer Tech:** Apple, Spotify, Airbnb, Uber, Netflix, Nike, Notion

**Media & Social:** X (Twitter), Instagram, YouTube, TikTok, Discord, Slack

## Workflow

### Step 1: Fetch Brand List

Use WebFetch to get the current brand catalog:

```
WebFetch("https://getdesign.md", "Extract all available brand names and their categories. Return as a structured list.")
```

### Step 2: Match User Intent

If user says "Stripe-style checkout":
- Detected brand: **Stripe**
- Category: Fintech
- Design characteristics to expect: Clean gradients, purple accent, trust-building typography

### Step 3: Fetch Specific DESIGN.md

GetDesign.md hosts files at: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/designs/{brand-slug}.md`

Common slug patterns:
- `stripe.md`
- `vercel.md`
- `notion.md`
- `linear.md`
- `apple.md`

Use WebFetch to retrieve:

```
WebFetch("https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/designs/stripe.md", 
         "Extract the complete design system specification including colors, typography, spacing, and component patterns.")
```

### Step 4: Parse Design Tokens

Extract these key sections from the fetched DESIGN.md:

**Colors:**
- Primary palette (hex codes)
- Semantic colors (success, error, warning)
- Background/surface colors
- Text hierarchy colors

**Typography:**
- Font families (with fallbacks)
- Size scale (headings, body, captions)
- Weight scale
- Line heights

**Spacing:**
- Base unit (usually 4px or 8px)
- Scale multipliers
- Component-specific spacing

**Components:**
- Button styles (primary, secondary, ghost)
- Input field patterns
- Card/container styles
- Navigation patterns

**Motion:**
- Transition durations
- Easing functions
- Animation principles

### Step 5: Merge with Project Context

**If project has existing DESIGN.md:**
- Read current DESIGN.md
- Ask user: "I found a Stripe design system. Should I:
  1. Replace your current design entirely
  2. Merge Stripe's colors but keep your typography
  3. Use Stripe as inspiration but adapt to your brand
  4. Just show me Stripe's system for reference"

**If no DESIGN.md exists:**
- Use fetched design system as the foundation
- Adapt brand-specific elements (replace "Stripe" with user's product name)
- Generate DESIGN.md in project root

### Step 6: Generate Adapted HTML

When writing HTML, inject the design tokens:

```html
<style>
  :root {
    /* Colors from Stripe DESIGN.md */
    --primary: #635BFF;
    --primary-hover: #0A2540;
    --surface: #FFFFFF;
    --text: #0A2540;
    --text-secondary: #425466;
    
    /* Typography from Stripe DESIGN.md */
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: "SF Mono", Monaco, "Cascadia Code", monospace;
    
    /* Spacing from Stripe DESIGN.md */
    --space-unit: 8px;
    --space-xs: calc(var(--space-unit) * 1);
    --space-sm: calc(var(--space-unit) * 2);
    --space-md: calc(var(--space-unit) * 3);
    --space-lg: calc(var(--space-unit) * 4);
  }
</style>
```

## Multi-Brand Blending (Advanced)

If user requests multiple brand influences (e.g., "Stripe's colors with Linear's layout"):

1. Fetch both DESIGN.md files
2. Extract non-conflicting tokens:
   - Colors from Brand A
   - Typography from Brand B
   - Spacing from Brand A
   - Component patterns from Brand B
3. Generate a hybrid DESIGN.md with attribution comments
4. Preview both pure versions + hybrid in design_canvas.jsx for comparison

## Fallback Strategy

If brand not found on getdesign.md:
1. Search for "{brand} design system" using WebSearch
2. Extract design principles from official brand guidelines
3. Manually construct a minimal DESIGN.md with:
   - Colors from screenshots
   - Typography from web inspector
   - Spacing inferred from visual rhythm
4. Note in DESIGN.md: "// Reconstructed from public sources, not official"

## Anti-Patterns to Avoid

❌ **Don't blindly copy:** Adapt the design system to the user's product context
❌ **Don't ignore licensing:** Note that design systems may have trademark restrictions
❌ **Don't mix conflicting aesthetics:** Stripe's gradients + Vercel's minimalism = visual chaos
❌ **Don't skip user confirmation:** Always show what you fetched before applying

## Example Usage

**User:** "Create a pricing page with Vercel's aesthetic"

**Your workflow:**
1. Detect brand: Vercel
2. Fetch: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/designs/vercel.md`
3. Extract: Black background, white text, geist font, subtle gradients
4. Generate: pricing_page.html with Vercel's design tokens
5. Verify: Screenshot shows clean, minimal, Vercel-like design

**User:** "Mix Stripe's colors with Linear's typography"

**Your workflow:**
1. Fetch both DESIGN.md files
2. Extract: Stripe's purple palette + Linear's Inter font stack
3. Generate: hybrid-design.md with attribution
4. Create: comparison board showing pure Stripe, pure Linear, and hybrid
5. Ask: "Which direction feels right for your product?"

## Integration with Existing References

- **frontend-design.md:** Use getdesign-loader BEFORE falling back to generic design principles
- **design-system-creation.md:** Use fetched DESIGN.md as a starting template, not final output
- **tweaks-system.md:** Enable brand switching via tweaks panel (dropdown: "Stripe | Vercel | Linear")

## Success Criteria

✅ User gets a design that feels professionally crafted, not generic
✅ Design tokens are consistently applied across all components
✅ User understands which brand influenced which design decisions
✅ Generated DESIGN.md is editable and well-documented
✅ No console errors, no broken layouts, no AI slop aesthetics
