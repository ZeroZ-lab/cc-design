# Content Guidelines: Anti-AI Slop, Content Standards, Scale Specifications

The easiest traps to fall into in AI design. This is a "what not to do" list, more important than "what to do" -- because AI slop is the default; if you don't actively avoid it, it happens.

## AI Slop Complete Blacklist

### Visual Traps

**❌ Aggressive gradient backgrounds**
- Purple → pink → blue full-screen gradients (the typical AI-generated website flavor)
- Rainbow gradients in any direction
- Mesh gradients filling the background
- ✅ If you must use gradients: subtle, monochromatic, intentionally placed accents (e.g., button hover)

**❌ Rounded cards + left border accent color**
```css
/* This is the signature of AI-flavored cards */
.card {
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  padding: 16px;
}
```
These cards are overused in AI-generated dashboards. Want to emphasize something? Use more design-conscious methods: background color contrast, font weight/size contrast, plain separator lines, or simply don't use cards at all.

**❌ Emoji decoration**
Unless the brand itself uses emoji (like Notion, Slack), don't put emoji on UI. **Especially don't**:
- 🚀 ⚡️ ✨ 🎯 💡 before titles
- ✅ in feature lists
- → in CTA buttons (standalone arrow OK, emoji arrow not OK)

If you don't have icons, use a real icon library (Lucide/Heroicons/Phosphor), or use placeholders.

**❌ SVG for imagery**
Don't try to use SVG to draw: people, scenes, devices, objects, abstract art. AI-drawn SVG imagery is instantly recognizable as AI -- childish and cheap. **A gray rectangle with the text label "Illustration Placeholder 1200x800" is 100x better than a poorly drawn SVG hero illustration**.

The only scenarios where SVG is acceptable:
- Real icons (16x16 to 32x32 level)
- Geometric shapes as decorative elements
- Data viz charts

**❌ Excessive iconography**
Not every title/feature/section needs an icon. Overusing icons makes the interface look like a toy. Less is more.

**❌ "Data slop"**
Fabricated stats as decoration:
- "10,000+ happy customers" (you don't even know if there are any)
- "99.9% uptime" (if you don't have real data, don't write it)
- Decorative "metric cards" composed of icon + number + word
- Mock tables with fake data dressed up ornately

If you don't have real data, leave placeholders or ask the user for it.

**❌ "Quote slop"**
Fabricated user reviews or celebrity quotes decorating the page. Leave placeholders and ask the user for real quotes.

**❌ "Feature slop" — 3-column benefits grid**
Three cards with icon + bold title + 2-sentence description. Every SaaS landing page looks like this. Real products have distinct value propositions — if all three columns sound the same, the design is covering up that the copy has nothing to say.

**❌ "Badge slop"**
"New", "Popular", "Beta", "🔥", "Premium" badge stickers on everything. When everything is highlighted, nothing is highlighted. Badges are for genuine exceptions, not decoration.

**❌ "Dark mode slop"**
Dark background (`#0D1117`, `#111827`) + neon accent + glowing borders. This is GitHub Dark Mode copied badly. It signals "developer tool made by someone who copied a dark theme" rather than intentional design. Reserved only for products that genuinely target developers and have a reason for this aesthetic.

**❌ "Glassmorphism slop"**
Frosted glass cards stacked three layers deep, blur everywhere, gradients behind the blur. Glass as an accent can work; glass as the entire design language means there's no actual design language.

**❌ "Illustration slop"**
Flat vector figures with blob shapes, pastel colors, and characters waving at the viewer. These came from the same 3 Figma community illustration packs. There is no scenario where this improves a design. Use real photography, or use nothing.

**❌ "Stats section slop"**
Four numbers in a row: `10M+ Users`, `99.9% Uptime`, `150+ Countries`, `24/7 Support`. This pattern has zero credibility without sources and zero visual interest without context. If the numbers are real and meaningful, give them context. If they're fabricated, delete them.

### Typography Traps

**❌ Avoid these overused fonts**:
- Inter (default for AI-generated websites)
- Roboto
- Arial / Helvetica
- Pure system font stack
- Fraunces (AI discovered this and overused it)
- Space Grotesk (AI's recent favorite)

**✅ Use distinctive display + body pairs**. Inspiration directions:
- Serif display + sans-serif body (editorial feel)
- Mono display + sans body (technical feel)
- Heavy display + light body (contrast)
- Variable font for hero weight animation

Font resources:
- Lesser-known good options on Google Fonts (Instrument Serif, Cormorant, Bricolage Grotesque, JetBrains Mono)
- Open-source font sites (Fraunces sibling fonts, Adobe Fonts)
- Don't invent font names out of thin air

### Color Traps

**❌ Fabricating colors from scratch**
Don't design an entire unfamiliar color system from scratch. It usually ends up discordant.

**✅ Strategy**:
1. Have a brand color → use it, fill missing color tokens with oklch interpolation
2. No brand color but have a reference → extract colors from the reference product screenshot
3. Completely from scratch → choose a known color system (Radix Colors / Tailwind default palette / Anthropic brand), don't mix your own

**Defining colors with oklch** is the most modern approach:
```css
:root {
  --primary: oklch(0.65 0.18 25);      /* warm terracotta */
  --primary-light: oklch(0.85 0.08 25); /* same hue, lighter */
  --primary-dark: oklch(0.45 0.20 25);  /* same hue, darker */
}
```
oklch ensures hue doesn't drift when adjusting lightness, better than hsl.

**❌ Simply inverting colors for dark mode**
It's not just inverting colors. Good dark mode requires re-adjusting saturation, contrast, and accent colors. If you don't want to do dark mode properly, don't do it at all.

### Layout Traps

**❌ Bento grid overuse**
Every AI-generated landing page wants to do bento. Unless your information structure genuinely suits bento, use other layouts.

**❌ Big hero + 3-column features + testimonials + CTA**
This landing page template has been overused. If you want to innovate, actually innovate.

**❌ Card grid where every card looks the same**
Asymmetric, differently-sized cards, some with images and some with text only, some spanning columns -- that's what a real designer would do.

## Content Standards

### 1. Don't add filler content

Every element must earn its place. Empty space is a design problem, solved with **composition** (contrast, rhythm, whitespace), **not** by filling it with content.

**Questions to identify filler**:
- If you remove this content, does the design get worse? If "no," remove it.
- What real problem does this element solve? If "make the page less empty," delete it.
- Does this stats/quote/feature have real data backing it? If not, don't fabricate it.

"One thousand no's for every yes."

### 2. Ask before adding material

You think adding another paragraph/page/section would be better? Ask the user first, don't add unilaterally.

Reasons:
- The user knows their audience better than you
- Adding content has costs, the user may not want it
- Adding content unilaterally violates the "junior designer reporting to manager" relationship

### 3. Create a system up front

After exploring design context, **state the system you'll use verbally** and let the user confirm:

```markdown
My design system:
- Colors: #1A1A1A main text + #F0EEE6 background + #D97757 accent (from your brand)
- Typography: Instrument Serif for display + Geist Sans for body
- Rhythm: section titles with full-bleed color background + white text; regular sections on white background
- Images: hero uses full-bleed photo, feature sections use placeholders for you to provide
- At most 2 background colors, avoid clutter

Confirm this direction and I'll start working.
```

Start working only after the user confirms. This check-in avoids "halfway through and the direction is wrong."

## Scale Specifications

### Slides (1920x1080)

- Body text minimum **24px**, ideal 28-36px
- Titles 60-120px
- Section titles 80-160px
- Hero headline can use 180-240px large text
- Never use <24px text on slides

### Print documents

- Body text minimum **10pt** (~13.3px), ideal 11-12pt
- Titles 18-36pt
- Caption 8-9pt

### Web and mobile

- Body text minimum **14px** (16px for elderly-friendly)
- Mobile body text **16px** (avoid iOS auto-zoom)
- Hit target (clickable elements) minimum **44x44px**
- Line height 1.5-1.7 (1.7-1.8 for CJK text)

### Contrast

- Body text vs background **at least 4.5:1** (WCAG AA)
- Large text vs background **at least 3:1**
- Check with Chrome DevTools accessibility tools

## CSS Power Tools

**Advanced CSS features** are a designer's friend -- use them boldly:

### Typography

```css
/* Make heading line breaks more natural, no orphan words on the last line */
h1, h2, h3 { text-wrap: balance; }

/* Body text line breaks, avoiding widows and orphans */
p { text-wrap: pretty; }

/* CJK typography power tool: punctuation compression, line-start/line-end control */
p { 
  text-spacing-trim: space-all;
  hanging-punctuation: first;
}
```

### Layout

```css
/* CSS Grid + named areas = super readable */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Subgrid for aligning card content */
.card { display: grid; grid-template-rows: subgrid; }
```

### Visual Effects

```css
/* Design-conscious scrollbar */
* { scrollbar-width: thin; scrollbar-color: #666 transparent; }

/* Glassmorphism (use sparingly) */
.glass {
  backdrop-filter: blur(20px) saturate(150%);
  background: color-mix(in oklch, white 70%, transparent);
}

/* View transitions API for smooth page transitions */
@view-transition { navigation: auto; }
```

### Interaction

```css
/* :has() selector makes conditional styling easy */
.card:has(img) { padding-top: 0; } /* cards with images have no top padding */

/* Container queries make components truly responsive */
@container (min-width: 500px) { ... }

/* New color-mix function */
.button:hover {
  background: color-mix(in oklch, var(--primary) 85%, black);
}
```

## Quick Decision Guide: When You're Unsure

- Want to add a gradient? → Probably don't
- Want to add an emoji? → Don't
- Want to add rounded corners + border-left accent on a card? → Don't, use other methods
- Want to draw a hero illustration with SVG? → Don't, use a placeholder
- Want to add a quote decoration? → Ask the user for a real quote first
- Want to add a row of icon features? → Ask whether icons are needed, they might not be
- Using Inter? → Switch to something more distinctive
- Using a purple gradient? → Switch to a grounded color system

**When you feel "adding this would look better" -- that's usually a sign of AI slop.** Start with the simplest version, only add when the user requests it.