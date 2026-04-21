# Design Context: Start from Existing Context

**This is the single most important thing for this skill.**

Good hi-fi design always grows from existing design context. **Doing hi-fi from scratch is a last resort, and will always produce generic work.** So at the start of every design task, first ask: is there anything we can reference?

## What is Design Context

In order of priority from highest to lowest:

### 1. User's Design System/UI Kit
The component library, color tokens, typography specs, and icon system the user's product already has. **The ideal scenario.**

### 2. User's Codebase
If the user provided a codebase, it contains living component implementations. Read those component files:
- `theme.ts` / `colors.ts` / `tokens.css` / `_variables.scss`
- Specific components (Button.tsx, Card.tsx)
- Layout scaffold (App.tsx, MainLayout.tsx)
- Global stylesheets

**Read the code and copy exact values**: hex codes, spacing scale, font stack, border radius. Don't redraw from memory.

### 3. User's Published Product
If the user has a live product but didn't give code, use Playwright or ask the user for screenshots.

```bash
# Use Playwright to screenshot a public URL
npx playwright screenshot https://example.com screenshot.png --viewport-size=1920,1080
```

This lets you see the real visual vocabulary.

### 4. Brand Guidelines/Logo/Existing Assets
The user may have: Logo files, brand color specs, marketing materials, slide templates. These are all context.

### 5. Competitor References
When the user says "like XX website" -- ask them to provide a URL or screenshot. **Don't** work from vague impressions in your training data.

### 6. Known Design Systems (fallback)
If none of the above exist, use recognized design systems as a base:
- Apple HIG
- Material Design 3
- Radix Colors (for color)
- shadcn/ui (for components)
- Tailwind default palette

Explicitly tell the user what you're using, so they know this is a starting point, not the final draft.

## Process for Getting Context

### Step 1: Ask the user

Required questions at task start (from `workflow.md`):

```markdown
1. Do you have an existing design system/UI kit/component library? Where?
2. Do you have brand guidelines, color/typography specs?
3. Can you give me screenshots or a URL of your existing product?
4. Is there a codebase I can read?
```

### Step 2: When the user says "no", help them find it

Don't just give up. Try:

```markdown
Let me see if there are clues:
- Do your previous projects have relevant designs?
- What colors/typography does your company's marketing website use?
- What style is your product's logo? Can you give me one?
- Are there any products you admire as references?
```

### Step 3: Read all context you can find

If the user gave a codebase path, you read:
1. **List the file structure first**: find style/theme/component-related files
2. **Read theme/token files**: lift specific hex/px values
3. **Read 2-3 representative components**: see the visual vocabulary (hover state, shadow, border, padding node pattern)
4. **Read global stylesheet**: base resets, font loading
5. **If there are Figma links/screenshots**: look at them, but **trust code more**

**Important**: **Don't** glance and then work from impression. You've only truly lifted context when you have 30+ specific values written down.

### Step 4: Vocalize the system you'll use

After reviewing context, tell the user the system you'll use:

```markdown
Based on your codebase and product screenshots, I've distilled this design system:

**Colors**
- Primary: #C27558 (from tokens.css)
- Background: #FDF9F0
- Text: #1A1A1A
- Muted: #6B6B6B

**Typography**
- Display: Instrument Serif (from @font-face in global.css)
- Body: Geist Sans
- Mono: JetBrains Mono

**Spacing** (from your scale system)
- 4, 8, 12, 16, 24, 32, 48, 64

**Shadow pattern**
- `0 1px 2px rgba(0,0,0,0.04)` (subtle card)
- `0 10px 40px rgba(0,0,0,0.1)` (elevated modal)

**Border-radius**
- Small components 4px, cards 12px, buttons 8px

**Component vocabulary**
- Button: filled primary, outlined secondary, ghost tertiary, all rounded 8px
- Card: white background, subtle shadow, no border

I'll start working based on this system. Confirm this is OK?
```

Start only after the user confirms.

## Designing from Scratch (Fallback When No Context)

**Strong warning**: Output quality will noticeably decline in this scenario. Tell the user explicitly.

```markdown
You don't have design context, so I can only work from general intuition.
The output will be "looks OK but lacks distinctiveness" stuff.
Do you want to continue, or gather some reference materials first?
```

If the user insists you proceed, make decisions in this order:

### 1. Choose an aesthetic direction
Don't give generic results. Pick a clear direction:
- brutally minimal
- editorial/magazine
- brutalist/raw
- organic/natural
- luxury/refined
- playful/toy
- retro-futuristic
- soft/pastel

Tell the user which one you chose.

### 2. Choose a known design system as the skeleton
- Use Radix Colors for color (https://www.radix-ui.com/colors)
- Use shadcn/ui for component vocabulary (https://ui.shadcn.com)
- Use Tailwind spacing scale (multiples of 4)

### 3. Choose distinctive font pairs

Don't use Inter/Roboto. Recommended pairs (free from Google Fonts):
- Instrument Serif + Geist Sans
- Cormorant Garamond + Inter Tight
- Bricolage Grotesque + Söhne (paid)
- Fraunces + Work Sans (note: Fraunces has been overused by AI)
- JetBrains Mono + Geist Sans (technical feel)

### 4. Every key decision has reasoning

Don't choose silently. Write it in HTML comments:

```html
<!--
Design decisions:
- Primary color: warm terracotta (oklch 0.65 0.18 25) — fits the "editorial" direction  
- Display: Instrument Serif for humanist, literary feel
- Body: Geist Sans for cleanness contrast
- No gradients — committed to minimal, no AI slop
- Spacing: 8px base, golden ratio friendly (8/13/21/34)
-->
```

## Import Strategy (When User Provides Codebase)

When the user says "import this codebase as reference":

### Small (<50 files)
Read all of them, internalize the context.

### Medium (50-500 files)
Focus on:
- `src/components/` or `components/`
- All styles/tokens/theme-related files
- 2-3 representative full-page components (Home.tsx, Dashboard.tsx)

### Large (>500 files)
Ask the user to specify focus:
- "I want to build a settings page" → read existing settings-related files
- "I want to build a new feature" → read the overall shell + closest reference
- Don't aim for completeness, aim for accuracy

## Working with Figma/Design Files

If the user gave a Figma link:

- **Don't** expect to directly "convert Figma to HTML" -- that requires extra tools
- Figma links are usually not publicly accessible
- Ask the user: export as **screenshots** to send you + tell you specific color/spacing values

If only Figma screenshots were given, tell the user:
- I can see the visuals, but can't extract precise values
- For key numbers (hex, px), please tell me directly, or export as code (Figma supports this)

## Final Reminder

**The upper limit of a project's design quality is determined by the quality of context you obtain.**

Spending 10 minutes collecting context is more valuable than spending 1 hour drawing hi-fi from scratch.

**When there's no context, prioritize asking the user for it rather than forcing it.**