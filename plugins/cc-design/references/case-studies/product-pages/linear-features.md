# Linear Features Page

## Overview
- **Type:** Product page (Feature showcase)
- **Style:** Modern + Professional
- **Primary color:** Purple-blue (`oklch(0.55 0.18 270)`)
- **Typography:** Primary: Inter, Secondary: SF Mono (for code)

## Why It Works

1. **Extreme clarity** — Every feature is explained in one sentence. No marketing fluff, no buzzwords. Just "what it does" in plain English.

2. **Visual rhythm** — The page alternates between text-left/image-right and text-right/image-left. This creates a natural flow that keeps you scrolling.

3. **Real UI, not mockups** — Linear shows actual product screenshots, not idealized mockups. This builds trust and sets accurate expectations.

4. **Dark mode first** — The design embraces dark UI, which feels modern and developer-friendly. This is intentional positioning.

## Design Techniques

### Visual Hierarchy
- **Feature headlines:** 32-40px, bold, high contrast
- **Feature descriptions:** 16-18px, regular weight, slightly muted
- **Section labels:** 12-14px, uppercase, tracked out, accent color
- **Code snippets:** 14px monospace, syntax highlighted

**Key insight:** The section labels (small, uppercase, colored) act as visual anchors. They break up the page and make it scannable.

### Color Usage
- **Background:** Dark (`oklch(0.12 0.02 270)`) with subtle purple tint
- **Surface:** Slightly lighter dark (`oklch(0.15 0.02 270)`)
- **Text:** High contrast white (`oklch(0.95 0 0)`) for primary, muted gray for secondary
- **Accent:** Purple-blue gradient used for highlights and interactive elements
- **Syntax highlighting:** Carefully chosen colors that work on dark background

**Key insight:** The dark background makes the product screenshots (which are also dark) feel native to the page. No jarring light/dark transitions.

### Typography
- **Font pairing:** Inter (UI) + SF Mono (code) — both are neutral, modern, highly legible
- **Weight variation:** 400 (body), 500 (labels), 600 (subheadings), 700 (headlines)
- **Letter spacing:** Tight on headlines (-0.02em), wide on labels (+0.08em)
- **Line height:** 1.2 on headlines, 1.6 on body text

**Key insight:** Using a monospace font for code snippets (not just inline code) reinforces the developer-tool positioning.

### Whitespace
- **Between features:** 120-160px vertical spacing
- **Within feature blocks:** 40-60px between headline and description
- **Around screenshots:** 80-100px breathing room
- **Section breaks:** 200px+ for major transitions

**Key insight:** The massive spacing makes each feature feel important. Nothing is rushed.

## Reusable Patterns

### Pattern 1: Alternating Feature Blocks

**Structure:**
```
[Section label]
[Feature headline]
[Feature description]
[Screenshot]

[Screenshot]
[Section label]
[Feature headline]
[Feature description]

(Repeat, alternating sides)
```

**Code:**
```css
.feature-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 120px 48px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Alternate: even blocks reverse the order */
.feature-block:nth-child(even) {
  direction: rtl;
}

.feature-block:nth-child(even) > * {
  direction: ltr;
}

.feature-content {
  max-width: 520px;
}

.feature-label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: oklch(0.65 0.18 270);
  margin-bottom: 16px;
}

.feature-content h2 {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: oklch(0.95 0 0);
  margin-bottom: 20px;
}

.feature-content p {
  font-size: 18px;
  line-height: 1.6;
  color: oklch(0.70 0 0);
}

.feature-visual {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

@media (max-width: 768px) {
  .feature-block {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .feature-block:nth-child(even) {
    direction: ltr;
  }
}
```

**When to use:** Feature pages, product tours, any content that benefits from visual proof alongside explanation.

### Pattern 2: Dark Mode Color System

**Technique:** Linear's dark mode isn't just inverted colors. It's a carefully crafted palette.

**Code:**
```css
:root {
  /* Backgrounds */
  --bg-base: oklch(0.12 0.02 270);      /* Page background */
  --bg-surface: oklch(0.15 0.02 270);   /* Card background */
  --bg-elevated: oklch(0.18 0.02 270);  /* Hover states */
  
  /* Text */
  --text-primary: oklch(0.95 0 0);      /* Headlines, important text */
  --text-secondary: oklch(0.70 0 0);    /* Body text */
  --text-tertiary: oklch(0.50 0 0);     /* Muted text */
  
  /* Accent */
  --accent-primary: oklch(0.65 0.18 270);
  --accent-light: oklch(0.75 0.15 270);
  
  /* Borders */
  --border-subtle: oklch(0.20 0.02 270);
  --border-strong: oklch(0.30 0.02 270);
}
```

**Key insight:** The backgrounds have a subtle purple tint (chroma 0.02), not pure gray. This creates a cohesive color story.

### Pattern 3: Screenshot Presentation

**Technique:** Linear's screenshots have depth and context.

**Code:**
```css
.screenshot-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 0 0 1px oklch(0.20 0.02 270),
    0 20px 60px rgba(0,0,0,0.4),
    0 40px 100px rgba(0,0,0,0.3);
}

.screenshot-container img {
  width: 100%;
  height: auto;
  display: block;
}

/* Optional: Add a subtle glow */
.screenshot-container::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    oklch(0.65 0.18 270) 0%,
    oklch(0.55 0.20 300) 100%
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.3;
}
```

**When to use:** Product screenshots, UI demos, any visual that needs to feel premium.

## Key Code Snippets

### Linear-Style Button

```css
.btn-linear {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 500;
  color: oklch(0.95 0 0);
  background: oklch(0.18 0.02 270);
  border: 1px solid oklch(0.25 0.02 270);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-linear:hover {
  background: oklch(0.20 0.02 270);
  border-color: oklch(0.35 0.02 270);
}

.btn-linear.primary {
  background: linear-gradient(
    135deg,
    oklch(0.60 0.20 270) 0%,
    oklch(0.55 0.22 300) 100%
  );
  border: none;
}

.btn-linear.primary:hover {
  filter: brightness(1.1);
}
```

### Linear-Style Card

```css
.card-linear {
  padding: 32px;
  border-radius: 12px;
  background: oklch(0.15 0.02 270);
  border: 1px solid oklch(0.20 0.02 270);
  transition: all 0.2s ease;
}

.card-linear:hover {
  background: oklch(0.16 0.02 270);
  border-color: oklch(0.25 0.02 270);
  transform: translateY(-2px);
}
```

### Linear-Style Code Block

```css
.code-block {
  padding: 24px;
  border-radius: 8px;
  background: oklch(0.10 0.02 270);
  border: 1px solid oklch(0.18 0.02 270);
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow-x: auto;
}

.code-block .keyword { color: oklch(0.75 0.15 330); }  /* Pink */
.code-block .string { color: oklch(0.75 0.15 150); }   /* Green */
.code-block .function { color: oklch(0.75 0.15 270); } /* Purple */
.code-block .comment { color: oklch(0.50 0 0); }       /* Gray */
```

## When to Use This Approach

**Perfect for:**
- Developer tools and APIs
- Project management and productivity software
- Technical products with complex features
- Products targeting designers and engineers
- Any product where "modern" and "professional" are key brand attributes

**Not ideal for:**
- Consumer products (too technical)
- Products targeting non-technical users (dark mode can feel intimidating)
- Playful or casual brands (too serious)
- Products that need to feel warm and approachable (dark mode can feel cold)

## Key Takeaways

1. **Dark mode is a positioning choice** — Linear uses dark UI to signal "this is for professionals." It's not just aesthetic.

2. **Alternating layout creates rhythm** — The left-right-left-right pattern keeps the page dynamic without being chaotic.

3. **Real screenshots > mockups** — Showing the actual product builds trust and sets accurate expectations.

4. **Subtle color tints matter** — The purple tint in the grays creates a cohesive color story. Pure gray would feel lifeless.

5. **Whitespace = confidence** — The generous spacing says "we don't need to cram everything above the fold."

## Further Analysis

Compare Linear's approach to competitors:
- **Asana:** Lighter, more colorful, more consumer-friendly
- **Jira:** More traditional, less modern
- **Notion:** Lighter UI, more playful

Linear's dark-first approach is distinctive and memorable. It's a bold choice that pays off.

## Implementation Notes

**Dark mode considerations:**
- Ensure sufficient contrast (WCAG AA minimum: 4.5:1 for body text, 3:1 for large text)
- Test on different displays (OLED vs LCD shows colors differently)
- Provide a light mode toggle for accessibility
- Use slightly desaturated colors (high saturation on dark backgrounds can cause eye strain)

**Performance:**
- Large screenshots can slow page load. Use WebP format with fallbacks
- Lazy-load images below the fold
- Consider using CSS gradients instead of gradient images where possible
