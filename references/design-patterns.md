# Design Patterns Library

> **Load when:** Building product pages, dashboards, mobile apps, or any UI that benefits from proven layout patterns
> **Skip when:** Pure creative/experimental work where breaking conventions is the goal
> **Why it matters:** Proven patterns reduce decision fatigue and produce reliably good results. Deviating from patterns should be intentional, not accidental.
> **Typical failure it prevents:** Reinventing layouts from scratch (poorly), missing standard UI conventions, inconsistent card/grid structures

This library provides battle-tested design patterns with ready-to-use CSS. Each pattern includes structure, rationale, and code.

---

## Hero Section Patterns

The hero is the first thing users see. It must communicate the core value in under 3 seconds.

### Pattern 1: Center-Aligned

**When to use:** Product announcements, landing pages with a single strong message, presentations

**Structure:**
```
┌──────────────────────────────────┐
│                                  │
│         [Overline text]          │
│        ══════════════            │
│     LARGE HERO HEADLINE         │
│         supporting text          │
│                                  │
│           [ CTA ]                │
│                                  │
│       [Visual / Screenshot]      │
│                                  │
└──────────────────────────────────┘
```

**CSS:**
```css
.hero-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 24px 64px;
  max-width: 800px;
  margin: 0 auto;
}
.hero-center h1 {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.hero-center .subtitle {
  font-size: clamp(18px, 2.5vw, 22px);
  line-height: 1.5;
  color: var(--color-muted);
  max-width: 600px;
  margin-bottom: 32px;
}
.hero-center .overline {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  margin-bottom: 16px;
}
```

**Design tips:**
- Headline should be under 10 words
- Subtitle should be 1-2 sentences max
- Visual/screenshot should have subtle shadow or frame

### Pattern 2: Split-Screen

**When to use:** Products with strong visual assets, features with screenshots, SaaS landing pages

**Structure:**
```
┌─────────────────┬────────────────┐
│                 │                │
│  HEADLINE       │    [Visual]    │
│  supporting     │    [Image]     │
│  text here      │    [or Demo]   │
│                 │                │
│  [ CTA ]        │                │
│                 │                │
└─────────────────┴────────────────┘
```

**CSS:**
```css
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 80px 48px;
  max-width: 1280px;
  margin: 0 auto;
}
.hero-split .content { max-width: 520px; }
.hero-split h1 {
  font-size: clamp(36px, 4vw, 56px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.hero-split .visual {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}
@media (max-width: 768px) {
  .hero-split {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 48px 24px;
  }
}
```

**Design tips:**
- Text side: 45-55% width. Visual side gets the rest
- Visual should have slight perspective or depth (shadow, rotation)
- On mobile: stack vertically, visual below text

### Pattern 3: Full-Screen Visual

**When to use:** Creative work, portfolios, event pages, high-impact announcements

**Structure:**
```
┌──────────────────────────────────┐
│                                  │
│     [Full-bleed background       │
│      image or video]             │
│                                  │
│         HEADLINE                 │
│         subtitle                 │
│         [ CTA ]                  │
│                                  │
└──────────────────────────────────┘
```

**CSS:**
```css
.hero-fullscreen {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
}
.hero-fullscreen .bg {
  position: absolute;
  inset: 0;
  background: center/cover no-repeat;
  z-index: 0;
}
.hero-fullscreen .bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.4) 0%,
    rgba(0,0,0,0.6) 100%
  );
}
.hero-fullscreen .content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  padding: 24px;
}
.hero-fullscreen h1 {
  font-size: clamp(48px, 7vw, 80px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
```

**Design tips:**
- Always add an overlay gradient for text readability
- Background image: high quality, relevant, not distracting
- Keep text minimal — the image is the message

### Pattern 4: Card Grid Hero

**When to use:** Multi-product showcases, feature overviews, dashboards

**Structure:**
```
┌──────────────────────────────────┐
│  HEADLINE                        │
│  subtitle                        │
│                                  │
│  ┌────────┐ ┌────────┐ ┌──────┐ │
│  │ Card 1 │ │ Card 2 │ │Card 3│ │
│  │ [icon] │ │ [icon] │ │[icon]│ │
│  │ Title  │ │ Title  │ │Title │ │
│  │ desc   │ │ desc   │ │desc  │ │
│  └────────┘ └────────┘ └──────┘ │
└──────────────────────────────────┘
```

**CSS:**
```css
.hero-cards {
  padding: 80px 48px;
  max-width: 1200px;
  margin: 0 auto;
}
.hero-cards h1 {
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 16px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 48px;
}
.card {
  padding: 32px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.card .icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}
.card p {
  font-size: 15px;
  color: var(--color-muted);
  line-height: 1.5;
}
```

**Design tips:**
- 3 cards = clean row. 4+ cards = consider 2 rows
- Each card should have a visual anchor (icon, illustration)
- Card content should be scannable — title + 1-2 sentence description

### Pattern 5: Narrative Flow

**When to use:** Storytelling, long-form content, editorial, onboarding flows

**Structure:**
```
┌──────────────────────────────────┐
│  [Chapter marker / number]       │
│                                  │
│  HEADLINE                        │
│                                  │
│  Paragraph text that tells       │
│  the story, builds the           │
│  narrative arc...                │
│                                  │
│  [Pull quote or key stat]        │
│                                  │
│  More narrative text...          │
│                                  │
│  ────── TRANSITION ──────        │
│                                  │
│  [Next section begins...]        │
└──────────────────────────────────┘
```

**CSS:**
```css
.narrative {
  max-width: 680px;
  margin: 0 auto;
  padding: 80px 24px;
}
.narrative .chapter-marker {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  margin-bottom: 24px;
}
.narrative h1 {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 32px;
}
.narrative p {
  font-size: 18px;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 24px;
}
.narrative .pull-quote {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-primary);
  border-left: 3px solid var(--color-primary);
  padding-left: 24px;
  margin: 48px 0;
}
.narrative .transition {
  text-align: center;
  margin: 64px 0;
  font-size: 24px;
  color: var(--color-border);
  letter-spacing: 0.2em;
}
```

**Design tips:**
- Narrow column width (600-700px) for readability
- Use pull quotes to break up long text
- Add visual transitions (lines, shapes, spacing) between sections

---

## Card Patterns

Cards are the building blocks of modern UI. These patterns cover the most common use cases.

### Minimal Card

```css
.card-minimal {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
}
.card-minimal h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.card-minimal p {
  font-size: 14px;
  color: var(--color-muted);
  line-height: 1.5;
}
```

### Image Card

```css
.card-image {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-image .body {
  padding: 20px;
}
.card-image .tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  margin-bottom: 8px;
}
.card-image h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.card-image p {
  font-size: 14px;
  color: var(--color-muted);
  line-height: 1.5;
}
```

### Data Card

```css
.card-data {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
.card-data .metric {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}
.card-data .label {
  font-size: 14px;
  color: var(--color-muted);
  margin-bottom: 16px;
}
.card-data .trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
}
.card-data .trend.up { color: var(--color-success); }
.card-data .trend.down { color: var(--color-error); }
```

### Interactive Card

```css
.card-interactive {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.2s ease;
}
.card-interactive:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.card-interactive:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.card-interactive .arrow {
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}
.card-interactive:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}
```

---

## Button Patterns

Buttons must have clear visual hierarchy: primary > secondary > tertiary.

```css
/* Primary: For the main action */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px color-mix(in oklch, var(--color-primary) 30%, transparent);
}

/* Secondary: For supporting actions */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-secondary:hover {
  background: var(--color-bg);
  border-color: var(--color-text);
}

/* Tertiary: For low-priority actions */
.btn-tertiary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;
}
.btn-tertiary:hover { color: var(--color-text); }
```

---

## Navigation Patterns

### Top Navigation

```css
.nav-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 48px;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in oklch, var(--color-bg) 80%, transparent);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-top .logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}
.nav-top .links {
  display: flex;
  gap: 32px;
  list-style: none;
}
.nav-top .links a {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.15s;
}
.nav-top .links a:hover { color: var(--color-text); }
.nav-top .links a.active { color: var(--color-primary); }
```

---

## Section Patterns

### Feature Section

```css
.feature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  padding: 80px 48px;
  max-width: 1200px;
  margin: 0 auto;
}
/* Alternate: even sections reverse the order */
.feature-section:nth-child(even) {
  direction: rtl;
}
.feature-section:nth-child(even) > * {
  direction: ltr;
}
```

### Stats Section

```css
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
  padding: 64px 48px;
  text-align: center;
}
.stat-item .number {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary);
  margin-bottom: 8px;
}
.stat-item .label {
  font-size: 15px;
  color: var(--color-muted);
}
```

### Testimonial Section

```css
.testimonial {
  max-width: 700px;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
}
.testimonial blockquote {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  font-style: italic;
  color: var(--color-text);
  margin-bottom: 24px;
}
.testimonial .author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.testimonial .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-border);
}
.testimonial .name {
  font-size: 15px;
  font-weight: 600;
}
.testimonial .role {
  font-size: 13px;
  color: var(--color-muted);
}
```

---

## CTA Patterns

### Inline CTA

```css
.cta-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
}
```

### Banner CTA

```css
.cta-banner {
  background: var(--color-primary);
  color: white;
  padding: 48px;
  border-radius: 16px;
  text-align: center;
  margin: 80px auto;
  max-width: 900px;
}
.cta-banner h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}
.cta-banner p {
  font-size: 18px;
  opacity: 0.85;
  margin-bottom: 24px;
}
.cta-banner .btn {
  background: white;
  color: var(--color-primary);
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
```

---

## Footer Pattern

```css
.footer {
  border-top: 1px solid var(--color-border);
  padding: 48px;
  margin-top: 80px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
}
.footer-brand { max-width: 280px; }
.footer-brand .logo {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}
.footer-brand p {
  font-size: 14px;
  color: var(--color-muted);
  line-height: 1.5;
}
.footer-col h4 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}
.footer-col a {
  display: block;
  font-size: 14px;
  color: var(--color-muted);
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.15s;
}
.footer-col a:hover { color: var(--color-text); }
```

---

## Responsive Breakpoints

Use these standard breakpoints for all patterns above:

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm: Tablets */ }
@media (min-width: 768px)  { /* md: Small laptops */ }
@media (min-width: 1024px) { /* lg: Desktops */ }
@media (min-width: 1280px) { /* xl: Large screens */ }
```

**Rule:** Every grid pattern should collapse to single-column below 768px. No horizontal scrolling ever.
