# Layout & Grid Systems

**Purpose:** Complete guide to structuring layouts with modern grid systems, spacing, and alignment principles.

**Principle:** Good layout is invisible. Users shouldn't notice the grid — they should just feel that the design "works."

---

## 1. Grid System Fundamentals

### What is a Grid System?

**Definition:** A framework of intersecting vertical and horizontal lines that helps organize content spatially.

**Purpose:**
- Creates visual structure and order
- Ensures consistency across pages
- Speeds up design decisions
- Provides alignment for elements
- Creates rhythm and flow

**Historical context:**
- **Print:** Baseline grids, column grids (since 1500s)
- **Web:** Fixed 960px grid (2000s)
- **Modern:** Fluid, responsive grids (2010s+)

---

## 2. Modern Grid Types

### 2.1 Column Grids

**Most common grid type for digital products.**

**Structure:**
```
┌────┬────┬────┬────┬────┬────┬────┬────┐
│    │    │    │    │    │    │    │    │  8 columns
└────┴────┴────┴────┴────┴────┴────┴────┘

┌─────┬─────┬─────┬─────┬─────┬─────┐
│     │     │     │     │     │     │  6 columns
└─────┴─────┴─────┴─────┴─────┴─────┘

┌──────┬──────┬──────┬──────┐
│      │      │      │      │  4 columns
└──────┴──────┴──────┴──────┘
```

**Column widths:**
- **Fluid:** % based, flexible (modern default)
- **Fixed:** px based, rigid (outdated)
- **Hybrid:** Fixed max-width + fluid (e.g., max-width: 1200px)

**Gutters (spacing between columns):**
- Desktop: 20-32px (1.5-2rem)
- Tablet: 16-24px (1-1.5rem)
- Mobile: 12-16px (0.75-1rem)

**Standard column counts:**
- **12 columns:** Most versatile (divisible by 2, 3, 4, 6)
- **8 columns:** Good for simpler layouts
- **4 columns:** Simple layouts, landing pages

### 2.2 Modular Grids

**Grid of cells (modules) that can combine.**

**Structure:**
```
┌────┬────┬────┬────┐
│    │    │    │    │
├────┼────┼────┼────┤
│    │    │    │    │
├────┼────┼────┼────┤
│    │    │    │    │
└────┴────┴────┴────┘
```

**Best for:**
- Card-based layouts
- Image galleries
- Dashboard widgets
- Masonry layouts

### 2.3 Baseline Grids

**Horizontal rhythm for vertical spacing.**

**Principle:** All vertical spacing is a multiple of the baseline.

**Common baseline values:**
- **4px grid:** 4, 8, 12, 16, 20, 24, 28, 32...
- **8px grid:** 8, 16, 24, 32, 40, 48, 56, 64... (most common)
- **6px grid:** 6, 12, 18, 24, 30, 36, 42, 48...

**Why 8px grid?**
- Divisible by many numbers (2, 4, 8)
- Works well with common font sizes (16px body, 24px headings)
- Used by major design systems (Material Design, Bootstrap, Tailwind)

**Implementation:**
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 2.5rem;   /* 40px */
  --space-8: 3rem;     /* 48px */
}

/* Everything aligns to 4px grid */
body {
  line-height: 1.5; /* 24px = 6 × 4px */
  margin-bottom: var(--space-4); /* 16px = 4 × 4px */
}

h1 {
  margin-top: var(--space-6); /* 32px = 8 × 4px */
  margin-bottom: var(--space-4); /* 16px = 4 × 4px */
}
```

### 2.4 Hierarchical Grids

**Multiple grid levels for complex layouts.**

**Example:**
```
Level 1: 4-column page grid
  Level 2: 2-column section grid
    Level 3: 3-column card grid
```

**Best for:**
- Complex dashboards
- Multi-section pages
- Nested components

---

## 3. Modern CSS Layout Techniques

### 3.1 CSS Grid (2024+ Standard)

**Best for:** 2-dimensional layouts (rows + columns)

**Basic grid:**
```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}
```

**Responsive grid:**
```css
.container {
  display: grid;
  gap: 1rem;
  /* Mobile: 1 column */
  grid-template-columns: 1fr;
}

@media (min-width: 48rem) {
  .container {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 64rem) {
  .container {
    /* Desktop: 3 columns */
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

**Auto-fit grid (responsive without media queries):**
```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  /* Automatically adjusts based on available space */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

**Named grid areas:**
```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  gap: 1.5rem;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### 3.2 Flexbox (1-Dimensional Layouts)

**Best for:** 1-dimensional layouts (row OR column)

**Row layout:**
```css
.row {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}
```

**Column layout:**
```css
.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

**Flex with wrapping:**
```css
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-wrap > * {
  /* Grow to fill space */
  flex: 1 1 200px;
}
```

**Space between:**
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### 3.3 Container Queries (2024+)

**Best for:** Component-level responsiveness

**Basic usage:**
```css
.card {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

**Benefits:**
- Components respond to their container, not viewport
- Truly reusable components
- Works in any layout context

---

## 4. Common Layout Patterns

### 4.1 Single Column (Stack)

**Simplest layout, mobile-first default.**

```
┌─────────────────┐
│     Header      │
├─────────────────┤
│     Content     │
│                 │
│                 │
├─────────────────┤
│     Footer      │
└─────────────────┘
```

**CSS:**
```css
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
```

### 4.2 Two-Column Layout

**Common for: Blog posts, documentation, simple dashboards.**

```
┌─────┬───────────┐
│ Side│           │
│ bar │  Content  │
│     │           │
└─────┴───────────┘
```

**CSS:**
```css
.two-column {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

/* Mobile: stack */
@media (max-width: 768px) {
  .two-column {
    grid-template-columns: 1fr;
  }
}
```

### 4.3 Holy Grail Layout

**Classic: Header + 2 sidebars + main content + footer.**

```
┌─────────────────────────┐
│        Header           │
├─────┬───────────┬───────┤
│     │           │       │
│Side │   Main    │ Aside │
│     │           │       │
├─────┴───────────┴───────┤
│        Footer           │
└─────────────────────────┘
```

**CSS:**
```css
.holy-grail {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  gap: 2rem;
}

/* Tablet: hide one sidebar */
@media (max-width: 1024px) {
  .holy-grail {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
  }
  .aside { display: none; }
}

/* Mobile: stack */
@media (max-width: 768px) {
  .holy-grail {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
```

### 4.4 Card Grid

**Common for: E-commerce, portfolios, dashboards.**

```
┌──────┬──────┬──────┬──────┐
│Card 1│Card 2│Card 3│Card 4│
├──────┼──────┼──────┼──────┤
│Card 5│Card 6│Card 7│Card 8│
└──────┴──────┴──────┴──────┘
```

**CSS:**
```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  /* Auto-fit: responsive without media queries */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

### 4.5 Bento Grid (Grid of Modules)

**Trending in 2024-2025: Dashboard-style layouts.**

```
┌──────────────┬─────┬─────┐
│              │Card │Card │
│   Large      │ 2   │ 3   │
│   Card       │─────┼─────┤
│              │Card │Card │
│              │ 4   │ 5   │
├──────────────┴─────┴─────┤
│           Card 6          │
└──────────────────────────┘
```

**CSS:**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 1.5rem;
}

.large {
  grid-column: span 2;
  grid-row: span 2;
}
```

### 4.6 Masonry Layout

**Pinterest-style: Cards of varying heights.**

```
┌─────┬─────┬─────┐
│     │Card │     │
│Card │ 2   │Card │
│ 1   ├─────┤ 3   │
│     │Card │     │
├─────┤ 4   ├─────┤
│Card │     │Card │
│ 5   ├─────┤ 6   │
│     │Card │     │
└─────┤ 7   └─────┘
      │
```

**CSS (with CSS Grid):**
```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px; /* Small rows for granularity */
  gap: 1.5rem;
}

.masonry-item {
  /* Span rows based on content height */
  grid-row-end: span 20;
}
```

**Alternative (CSS Columns):**
```css
.masonry {
  column-count: 3;
  column-gap: 1.5rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}
```

---

## 5. Spacing System

### 5.1 8pt Grid System

**Industry standard spacing system.**

**Scale:**
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 2.5rem;   /* 40px */
  --space-8: 3rem;     /* 48px */
  --space-9: 4rem;     /* 64px */
  --space-10: 5rem;    /* 80px */
  --space-11: 6rem;    /* 96px */
  --space-12: 8rem;    /* 128px */
}
```

**Usage:**
- **4px (0.25rem):** Micro spacing, borders
- **8px (0.5rem):** Tight spacing, related items
- **16px (1rem):** Default spacing, card padding
- **24px (1.5rem):** Section spacing
- **32px (2rem):** Large section spacing
- **48px (3rem):** Page-level spacing

### 5.2 Spacing Categories

**Component spacing:**
- **Padding:** 16px (1rem) - cards, buttons
- **Gap:** 16px (1rem) - grid gaps, flex gaps
- **Margin:** 16px (1rem) - element spacing

**Section spacing:**
- **Small sections:** 24px (1.5rem)
- **Medium sections:** 32px (2rem)
- **Large sections:** 48px (3rem)

**Page-level spacing:**
- **Top/bottom of page:** 64px (4rem)
- **Hero sections:** 80px (5rem)

### 5.3 Responsive Spacing

**Increase spacing on larger screens.**

```css
.section {
  padding: 2rem 1rem; /* 32px 16px - mobile */
}

@media (min-width: 48rem) {
  .section {
    padding: 3rem 2rem; /* 48px 32px - tablet */
  }
}

@media (min-width: 64rem) {
  .section {
    padding: 4rem 2rem; /* 64px 32px - desktop */
  }
}
```

---

## 6. Alignment Principles

### 6.1 Visual Alignment

**Principle:** Elements should align to a common optical edge, not mathematical edge.**

**Example:**
```
❌ Bad: Mathematical alignment
┌─────────────┐
│ Icon  Text  │  ← Icon and text don't visually align
└─────────────┘

✅ Good: Optical alignment
┌─────────────┐
│ Icon  Text  │  ← Adjusted for visual balance
└─────────────┘
```

**CSS solution:**
```css
.icon {
  /* Slight offset for optical alignment */
  margin-top: 2px;
}
```

### 6.2 Text Alignment

**Rules:**
- **Body text:** Left-aligned (for LTR languages)
- **Headlines:** Left-aligned (usually)
- **Captions:** Center-aligned (sometimes)
- **CTA buttons:** Center-aligned (in hero sections)

**Avoid:**
- **Justified text** on web (creates rivers of white space)
- **Center-aligned body text** (harder to read)
- **Mixed alignment** (confusing hierarchy)

### 6.3 Element Alignment

**Left alignment (default):**
```css
.container {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
```

**Center alignment:**
```css
.container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

**Right alignment (RTL or special cases):**
```css
.container {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
```

---

## 7. Layout Hierarchy

### 7.1 Visual Hierarchy Through Spacing

**Principle:** More space = more importance.**

```
┌─────────────────────┐
│      (48px)         │ ← Most important
│     HEADLINE        │
│                     │
│    (24px)           │ ← Less important
│  Subheadline        │
│                     │
│    (16px)           │ ← Least important
│  Body text          │
│  Body text          │
└─────────────────────┘
```

**CSS:**
```css
.headline {
  margin-bottom: 3rem; /* 48px */
}

.subheadline {
  margin-bottom: 1.5rem; /* 24px */
}

.body-text {
  margin-bottom: 1rem; /* 16px */
}
```

### 7.2 Grouping with Spacing

**Principle:** Related items should be closer than unrelated items.**

```
❌ Bad: Equal spacing
┌─────┐ ┌─────┐ ┌─────┐
│Item1│ │Item2│ │Item3│  ← Can't tell groups
└─────┘ └─────┘ └─────┘

✅ Good: Grouped spacing
┌─────┐ ┌─────┐
│Item1│ │Item2│  ← Group A
└─────┘ └─────┘
       ┌─────┐
       │Item3│  ← Group B
       └─────┘
```

**CSS:**
```css
.group-a {
  gap: 1rem; /* Tight spacing */
}

.group-b {
  gap: 1rem;
}

.between-groups {
  margin-bottom: 2rem; /* Loose spacing */
}
```

---

## 8. Common Layout Mistakes

### 1. No Grid System

**Problem:** Elements placed arbitrarily, no underlying structure.

**Solution:** Always use a grid system (even if invisible).

### 2. Inconsistent Spacing

**Problem:** Random values (13px, 27px, 43px).

**Solution:** Use an 8pt grid system (8, 16, 24, 32, 40, 48).

### 3. Too Many Columns

**Problem:** 16-column grid when 12 would suffice.

**Solution:** Use 12 columns for versatility, 8 for simplicity, 4 for landing pages.

### 4. Ignoring Mobile

**Problem:** 4-column layout on 375px screen.

**Solution:** Mobile-first (1 column → 2 columns → 3+ columns).

### 5. Tight Gutters on Desktop

**Problem:** 8px gutters on 1920px screen.

**Solution:** Scale gutters (16px mobile, 24px tablet, 32px desktop).

### 6. No Visual Hierarchy

**Problem:** Equal spacing for all elements.

**Solution:** More space for important elements, less for details.

### 7. Breaking the Grid

**Problem:** Elements don't align to grid (accidentally).

**Solution:** Either align to grid OR break it intentionally (not by accident).

### 8. Overlapping Elements

**Problem:** Elements overlap on smaller screens.

**Solution:** Test on smallest target screen, use min-heights.

---

## 9. Layout Testing Checklist

### Grid System

- [ ] All elements align to grid (intentionally)
- [ ] Consistent gutter width across sections
- [ ] Column count is appropriate for content
- [ ] Grid scales across breakpoints

### Spacing

- [ ] All spacing values are multiples of baseline (4px or 8px)
- [ ] Related items are grouped with tight spacing
- [ ] Unrelated items are separated with loose spacing
- [ ] Spacing increases on larger screens

### Alignment

- [ ] Text is left-aligned (for body copy)
- [ ] Elements align optically, not just mathematically
- [ ] Consistent alignment across similar elements

### Responsiveness

- [ ] Layout works on mobile (375px)
- [ ] Layout works on tablet (768px)
- [ ] Layout works on desktop (1440px)
- [ ] No horizontal scrolling
- [ ] No overlapping elements

### Visual Hierarchy

- [ ] More space = more importance
- [ ] Clear visual hierarchy through spacing
- [ ] Related items grouped together
- [ ] Clear separation between sections

---

## 10. Layout Tools & Resources

**Design tools:**
- Figma: Built-in grid system, layout grids
- Sketch: Grid system, layout guides
- Adobe XD: Responsive resize, grid system

**CSS frameworks:**
- Tailwind CSS: 8pt grid system, responsive utilities
- Bootstrap: 12-column grid system
- CSS Grid: Native CSS grid

**Inspiration:**
- Grid systems in nature: https://bernhardt-zimmer.com/grid-systems/
- 8pt grid system: https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632
- CSS Grid tricks: https://css-tricks.com/snippets/css/complete-guide-grid/

**Generators:**
- CSS Grid Generator: https://cssgrid-generator.netlify.app/
- Flexbox Froggy: https://flexboxfroggy.com/ (interactive learning)
- Grid Garden: https://cssgridgarden.com/ (interactive learning)

---

## Quick Reference

### 12-Column Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Span columns */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }
```

### 8pt Spacing Scale

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 2.5rem;   /* 40px */
  --space-8: 3rem;     /* 48px */
  --space-9: 4rem;     /* 64px */
}
```

### Responsive Grid

```css
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 48rem) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 64rem) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### Auto-Fit Grid

```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

---

**Remember:** Good layout is invisible. Users should never notice the grid — they should just feel that the design "works" and is easy to use.

**The grid is a tool, not a rule. Break it intentionally, not accidentally.**
