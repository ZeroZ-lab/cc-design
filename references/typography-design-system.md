# Typography Design System: Theory & Implementation

> **Purpose:** Build a complete typography system based on proven design theory
> **Foundation:** Modular scale, vertical rhythm, typographic hierarchy
> **References:** Bringhurst's "Elements of Typographic Style", Material Design, Apple HIG

---

## Part 1: Theoretical Foundation

### 1.1 Modular Scale (Musical Harmony in Type)

**Theory source:** Ancient Greek music theory (Pythagoras, 6th century BC) + Renaissance architecture (Palladio, 16th century)

Typography borrowed from music: harmonious intervals create visual rhythm.

**Musical intervals as ratios:**
- Minor Third: 1.200 (6:5 ratio)
- Major Third: 1.250 (5:4 ratio) ← **We use this**
- Perfect Fourth: 1.333 (4:3 ratio)
- Perfect Fifth: 1.500 (3:2 ratio)
- Golden Ratio: 1.618 (φ)

**Why Major Third (1.25)?**
- In music: C to E, a pleasant, balanced interval
- Not too subtle (1.2 is hard to perceive)
- Not too extreme (1.618 creates huge jumps)
- Versatile across all design types

**Formula:**
```
Size(n) = Base × Ratio^n

Example (Major Third, base 16px):
16 × 1.25^0 = 16px   (body)
16 × 1.25^1 = 20px   (large body)
16 × 1.25^2 = 25px   (h3)
16 × 1.25^3 = 31px   (h2)
16 × 1.25^4 = 39px   (h1)
16 × 1.25^5 = 49px   (display)
```

**Why it works:** Mathematical relationships create visual harmony. Eyes perceive consistent ratios as "balanced" — same reason music sounds harmonious.

**Historical precedent:**
- Renaissance architects used musical ratios for building proportions
- Le Corbusier's Modulor system (1940s) applied golden ratio to architecture
- Jan Tschichold applied these to typography in "The New Typography" (1928)

**References:**
- Tschichold, J. (1928). "Die neue Typographie"
- Brown, T. (2011). "More Meaningful Typography" (A List Apart)
- https://www.modularscale.com/

### 1.2 Vertical Rhythm (Baseline Grid)

**Theory source:** 15th century movable type printing (Gutenberg) + Swiss typography (1950s)

All text sits on an invisible grid, like music on staff lines.

**Why 8px baseline grid?**

1. **Mathematical divisibility:**
   - 8 ÷ 2 = 4
   - 8 ÷ 4 = 2
   - 8 ÷ 8 = 1
   - Works with all common spacing needs

2. **Screen density compatibility:**
   - 1x displays: 8px = 8 physical pixels
   - 2x displays (Retina): 8px = 16 physical pixels
   - 3x displays (iPhone): 8px = 24 physical pixels
   - 4x displays: 8px = 32 physical pixels
   - Always renders crisply, no sub-pixel rendering

3. **Platform standards:**
   - iOS: 8pt base unit
   - Android: 8dp base unit
   - Material Design: 8dp grid
   - Apple HIG: 8pt grid

**Baseline Grid Formula:**
```
Baseline = Body font-size × Line-height

Example:
16px × 1.5 = 24px baseline grid (3 × 8px)
```

**Rules:**
1. All line-heights should result in multiples of 8px
2. All vertical spacing should be multiples of 8px
3. This creates consistent "beats" in the layout

**Why it works:** Consistent vertical rhythm reduces cognitive load. Eyes can predict where next line starts. Like a metronome in music — predictable rhythm is easier to follow.

**Historical context:**
- Gutenberg's 42-line Bible (1455): First use of consistent baseline
- Josef Müller-Brockmann (1960s): Formalized grid systems
- Mark Boulton (2007): "Five simple steps to designing grid systems"

**References:**
- Müller-Brockmann, J. (1981). "Grid Systems in Graphic Design"
- Material Design: "Understanding layout" (8dp grid)
- Apple HIG: "Layout" (8pt grid)

### 1.3 Line Length (Measure)

**Theory source:** Reading psychology research (1920s-2000s) + Eye-tracking studies

Optimal reading: 45-75 characters per line (CPL).

**Scientific evidence:**

1. **Tinker's Research (1929-1963):**
   - Tested thousands of readers
   - Found optimal line length: 52 characters
   - Range: 45-75 characters maintains reading speed
   - Outside this range: comprehension drops

2. **Dyson's Studies (2004-2005):**
   - Eye-tracking technology
   - Confirmed 45-75 CPL optimal
   - Too short (<40 CPL): Eye jumps too often, choppy reading
   - Too long (>80 CPL): Eye loses track of next line, re-reading increases

3. **Physiological basis:**
   - Human eye makes "saccades" (rapid jumps) when reading
   - Each saccade covers 7-9 characters
   - Optimal line = 6-8 saccades
   - More saccades = fatigue; fewer = loss of place

**Why 60-65 CPL is the sweet spot:**
- Balances reading speed and comprehension
- Minimizes eye fatigue
- Works across most font sizes (16-18px)

**Implementation:**
```css
p {
  max-width: 65ch; /* ch = character width unit */
}
```

**Why `ch` unit:** 1ch = width of "0" character in current font. Automatically adapts to font changes.

**References:**
- Tinker, M. A. (1963). "Legibility of Print"
- Dyson, M. C. (2004). "How physical text layout affects reading from screen"
- Rayner, K. (1998). "Eye movements in reading and information processing"
- Bringhurst, R. (2004). "The Elements of Typographic Style" (recommends 45-75 CPL)

### 1.4 Line Height (Leading)

**Theory source:** Robert Bringhurst's empirical research + Traditional typography

Relationship between font size and line height:

**Bringhurst's Formula:**
```
Line-height = 1 + (0.5 / Characters-per-line)

For 65 CPL:
Line-height = 1 + (0.5 / 65) ≈ 1.5

For 40 CPL (narrow column):
Line-height = 1 + (0.5 / 40) ≈ 1.5125
```

**Why this formula works:**
- Narrower columns need slightly more leading (more line breaks = more eye jumps)
- Wider columns can use tighter leading (fewer line breaks)
- Formula balances readability across different measures

**Practical rules (simplified from Bringhurst):**
- **Display (48px+)**: 1.0-1.2 (tight for impact)
  - Large text has more internal whitespace
  - Doesn't need extra leading
  - Tight leading creates visual impact
  
- **Headings (24-48px)**: 1.2-1.3
  - Medium internal whitespace
  - Moderate leading for clarity
  
- **Body (16-20px)**: 1.5-1.6 (never less than 1.5)
  - Optimal for sustained reading
  - Prevents descenders/ascenders collision
  - WCAG 2.1 recommends minimum 1.5 for accessibility
  
- **Small (12-14px)**: 1.6-1.8 (needs more space)
  - Less internal whitespace
  - Needs extra leading to prevent cramping
  - Improves legibility at small sizes

**Why it works:** 
1. **Physiological:** Larger text has more internal whitespace, needs less leading
2. **Optical:** Small text letters are closer together, need more separation between lines
3. **Accessibility:** WCAG 2.1 Success Criterion 1.4.8 requires 1.5 minimum for body text

**Historical context:**
- Traditional metal type: Leading = physical strips of lead between lines
- Optimal leading discovered through 500 years of printing
- Bringhurst codified these empirical findings into formulas

**References:**
- Bringhurst, R. (2004). "The Elements of Typographic Style" (3rd ed.), pp. 25-30
- WCAG 2.1: Success Criterion 1.4.8 (Visual Presentation)
- Legge, G. E. (2007). "Psychophysics of Reading in Normal and Low Vision"

### 1.5 Font Weight Hierarchy

**Theory source:** Weber's Law (Ernst Heinrich Weber, 1834) + Miller's Law (George Miller, 1956)

**Weber's Law — Perceptual Psychology:**
```
ΔI / I = k (constant)

Humans perceive relative differences, not absolute differences.
```

Applied to font weights:
- 400 → 500: 25% increase — barely noticeable
- 400 → 600: 50% increase — clear difference ✓
- 400 → 700: 75% increase — strong contrast ✓

**Why it works:** Our brains detect ratios, not absolute values. A 100-unit jump from 400→500 feels smaller than 600→700, even though both are 100 units.

**Miller's Law — Cognitive Load:**
```
Humans can hold 7±2 items in working memory.
For visual hierarchy: 3-4 levels maximum.
```

**Perceptual weight differences:**
- 100 → 200: Barely noticeable
- 200 → 300: Subtle
- 300 → 400: Noticeable
- 400 → 600: Clear difference ✓
- 600 → 700: Strong difference ✓
- 700 → 900: Extreme

**Rule:** Use weights with ≥200 difference for clear hierarchy.

**Optimal set (3 weights):**
- 400 (Regular): Body text
- 600 (Semibold): Subheadings, UI
- 700 (Bold): Main headings

**Why only 2-3 weights:** More than 3 levels = cognitive overload. Users can't distinguish 5+ weight levels, creating false hierarchy.

**References:**
- Weber, E. H. (1834). "De Pulsu, Resorptione, Auditu et Tactu"
- Miller, G. A. (1956). "The Magical Number Seven, Plus or Minus Two"

### 1.6 Script-First Typography (Critical for Mixed CJK + Latin Work)

**Core idea:** typography must follow the dominant script of the page, not the most expressive font in the palette.

This is the most common failure mode in modern AI-assisted design:
- choose a stylish Latin display face
- apply it to a mixed Chinese/English headline
- let Chinese glyphs fall back to a different font
- end up with mismatched weight, x-height, rhythm, and awkward line breaks

The result often looks "designed" at first glance but feels wrong on second reading.

### Primary Script Rule

Determine which writing system carries most of the semantic load:

- **Mostly Chinese page:** CJK typography system leads
- **Mostly Latin page:** Latin typography system leads
- **Truly bilingual marketing page:** define separate headline behaviors for each script and verify them independently

**Rule:** The dominant script determines body font, default heading font, spacing calibration, and acceptable tracking.

### Role-Based Font Model

Assign fonts by role, not by section mood:

1. **Body/UI Sans**
   - Used for paragraphs, UI copy, metadata, labels, buttons
   - Must be the most stable and readable family in the system

2. **Primary Heading Font**
   - Used for the main language of headings
   - On CJK-heavy pages, this should be a CJK-capable heading family

3. **Latin Display Accent**
   - Optional
   - Reserved for logos, isolated English brand words, short overlines, or very short hero fragments
   - Not allowed to govern mixed-script CJK headings by default

4. **Mono**
   - Reserved for code, labels, tiny technical annotations

**Practical limit:** 2 core families + 1 mono.

If you need more than this to make the page feel designed, the hierarchy is under-specified.

### Mixed-Script Headline Rule

**Bad pattern:**
```css
h1 {
  font-family: "Fancy Latin Display", "Noto Serif SC", serif;
  font-weight: 700;
  letter-spacing: -0.03em;
}
```

Why this fails:
- Latin face may only ship one real weight (e.g. 400)
- Chinese falls back to a different family with a real 700 weight
- Browser synthesizes bold for Latin but not for Chinese
- One line now contains two unrelated weight systems

**Preferred approach:**
- If Chinese dominates the headline, set the whole line in the CJK headline font
- If the English brand word must be expressive, split it into its own element

Example:
```html
<h1>
  <span class="brand-word">cc-design</span>
  <span class="title-main">示例 prompt 不只是展示，也是在校验 skill 行为</span>
</h1>
```

```css
.brand-word {
  font-family: "Instrument Serif", serif;
  font-weight: 400;
}

.title-main {
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-weight: 700;
}
```

### Tracking and Weight Guardrails for CJK

Latin display typography often benefits from tighter tracking. Chinese usually does not.

**Defaults:**
- Latin display 48px+: `letter-spacing: -0.02em` to `-0.05em`
- CJK heading: `letter-spacing: 0` by default
- CJK body: `letter-spacing: 0`

**Do not:**
- apply negative tracking to Chinese headings by default
- use browser fake bold as part of the visual identity
- compress Chinese headline spacing until characters visually collide

### Readability Thresholds for CJK-Heavy Interfaces

CJK text becomes visually cramped faster than Latin text at the same pixel size.

Recommended floors:
- Body: **16px minimum**
- Metadata / UI labels: **14px minimum**
- Long-form explanation text: 16-18px with 1.7-1.9 line height
- Chinese headings: prefer slightly looser line-height than Latin at the same size

If a design needs lots of 12-13px Chinese copy to fit, the layout is too dense.

### Verification Rule

Mixed-script typography must be verified visually, not inferred from CSS.

For any page with Chinese + English headline mixing:
1. Capture a screenshot after final edit
2. Check line breaks
3. Check whether Latin and CJK weights look like the same hierarchy
4. Check that metadata did not drift into unreadable tiny sizes
5. If in doubt, reduce font variety rather than increasing it

---

## Part 2: Complete Design System

### 2.1 Type Scale System

**Base Configuration:**
```
Base size: 16px (web standard, accessibility minimum)
Scale ratio: 1.250 (Major Third)
Baseline grid: 8px (divisible by common screen densities)
```

**Generated Scale:**
```
Level -2: 10px  (1.250^-2) — Micro text, legal
Level -1: 13px  (1.250^-1) — Small, captions
Level  0: 16px  (1.250^0)  — Body text
Level  1: 20px  (1.250^1)  — Large body, intro
Level  2: 25px  (1.250^2)  — H3, card titles
Level  3: 31px  (1.250^3)  — H2, section headers
Level  4: 39px  (1.250^4)  — H1, page titles
Level  5: 49px  (1.250^5)  — Display, hero
Level  6: 61px  (1.250^6)  — Large display
Level  7: 76px  (1.250^7)  — Massive hero
```

**Rounded for Implementation:**
```css
:root {
  /* Type scale (Major Third 1.25) */
  --text-xs: 10px;    /* -2 */
  --text-sm: 13px;    /* -1 */
  --text-base: 16px;  /*  0 */
  --text-lg: 20px;    /*  1 */
  --text-xl: 25px;    /*  2 */
  --text-2xl: 31px;   /*  3 */
  --text-3xl: 39px;   /*  4 */
  --text-4xl: 49px;   /*  5 */
  --text-5xl: 61px;   /*  6 */
  --text-6xl: 76px;   /*  7 */
}
```

### 2.2 Line Height System

**Calculated from theory:**
```css
:root {
  /* Line heights (matched to use case) */
  --lh-none: 1.0;      /* Single line, logos */
  --lh-tight: 1.25;    /* Display, hero (48px+) */
  --lh-snug: 1.375;    /* Headings (24-48px) */
  --lh-normal: 1.5;    /* Body text (16-20px) */
  --lh-relaxed: 1.625; /* Small text (12-14px) */
  --lh-loose: 1.75;    /* Dense content, CJK */
}
```

**Mapping:**
```css
/* Display text */
.text-6xl, .text-5xl { line-height: var(--lh-tight); }

/* Headings */
.text-4xl, .text-3xl, .text-2xl { line-height: var(--lh-snug); }

/* Body */
.text-xl, .text-lg, .text-base { line-height: var(--lh-normal); }

/* Small */
.text-sm, .text-xs { line-height: var(--lh-relaxed); }
```

### 2.3 Spacing System (8px Grid)

**Theory:** 8px is divisible by 2, 4, 8 — works across all screen densities (1x, 2x, 3x).

**Scale:**
```css
:root {
  /* Spacing scale (8px base) */
  --space-0: 0;
  --space-1: 4px;    /* 0.5 × 8 */
  --space-2: 8px;    /* 1 × 8 */
  --space-3: 12px;   /* 1.5 × 8 */
  --space-4: 16px;   /* 2 × 8 */
  --space-5: 20px;   /* 2.5 × 8 */
  --space-6: 24px;   /* 3 × 8 */
  --space-8: 32px;   /* 4 × 8 */
  --space-10: 40px;  /* 5 × 8 */
  --space-12: 48px;  /* 6 × 8 */
  --space-16: 64px;  /* 8 × 8 */
  --space-20: 80px;  /* 10 × 8 */
  --space-24: 96px;  /* 12 × 8 */
  --space-32: 128px; /* 16 × 8 */
}
```

**Semantic Mapping:**
```css
:root {
  /* Semantic spacing */
  --space-text-tight: var(--space-3);    /* 12px - heading to body */
  --space-text-normal: var(--space-4);   /* 16px - paragraph to paragraph */
  --space-text-loose: var(--space-6);    /* 24px - paragraph with emphasis */
  
  --space-component-xs: var(--space-2);  /* 8px - tight UI */
  --space-component-sm: var(--space-4);  /* 16px - form fields */
  --space-component-md: var(--space-6);  /* 24px - cards */
  --space-component-lg: var(--space-8);  /* 32px - sections */
  
  --space-section-sm: var(--space-12);   /* 48px - related sections */
  --space-section-md: var(--space-16);   /* 64px - major sections */
  --space-section-lg: var(--space-24);   /* 96px - page sections */
}
```

### 2.4 Font Weight System

**Perceptual hierarchy:**
```css
:root {
  /* Font weights (perceptual steps) */
  --weight-light: 300;     /* Rarely used, luxury brands */
  --weight-normal: 400;    /* Body text */
  --weight-medium: 500;    /* Subtle emphasis, UI */
  --weight-semibold: 600;  /* Strong emphasis, subheadings */
  --weight-bold: 700;      /* Headings, CTAs */
  --weight-black: 900;     /* Rarely used, extreme emphasis */
}
```

**Usage rules:**
```css
/* Standard hierarchy (3 weights) */
body { font-weight: var(--weight-normal); }
strong, b { font-weight: var(--weight-semibold); }
h1, h2, h3 { font-weight: var(--weight-bold); }

/* UI hierarchy (2 weights) */
.ui-text { font-weight: var(--weight-normal); }
.ui-emphasis { font-weight: var(--weight-semibold); }
```

### 2.5 Letter Spacing (Tracking)

**Theory:** Larger text needs tighter tracking, smaller text needs looser.

```css
:root {
  /* Letter spacing */
  --tracking-tighter: -0.05em;  /* Display text (48px+) */
  --tracking-tight: -0.025em;   /* Headings (24-48px) */
  --tracking-normal: 0;         /* Body text */
  --tracking-wide: 0.025em;     /* Small text, all-caps */
  --tracking-wider: 0.05em;     /* Tiny text, labels */
}
```

**Application:**
```css
.text-6xl, .text-5xl { letter-spacing: var(--tracking-tighter); }
.text-4xl, .text-3xl { letter-spacing: var(--tracking-tight); }
.text-base { letter-spacing: var(--tracking-normal); }
.text-sm, .text-xs { letter-spacing: var(--tracking-wide); }
.uppercase { letter-spacing: var(--tracking-wider); }
```

---

## Part 3: Responsive Typography

### 3.1 Fluid Type Scale

**Theory:** Type should scale smoothly between breakpoints, not jump.

**Formula (CSS clamp):**
```
font-size: clamp(MIN, PREFERRED, MAX)

PREFERRED = BASE + (SCALE × (100vw - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH))
```

**Implementation:**
```css
:root {
  /* Fluid type scale (320px → 1440px) */
  --text-base-fluid: clamp(14px, 0.875rem + 0.5vw, 18px);
  --text-lg-fluid: clamp(16px, 1rem + 0.75vw, 22px);
  --text-xl-fluid: clamp(18px, 1.125rem + 1vw, 28px);
  --text-2xl-fluid: clamp(22px, 1.375rem + 1.5vw, 36px);
  --text-3xl-fluid: clamp(28px, 1.75rem + 2vw, 48px);
  --text-4xl-fluid: clamp(36px, 2.25rem + 2.5vw, 64px);
  --text-5xl-fluid: clamp(48px, 3rem + 3vw, 80px);
}
```

### 3.2 Breakpoint-Based Scale

**Alternative: Stepped scaling**
```css
/* Mobile first */
:root {
  --text-display: 36px;
  --text-h1: 28px;
  --text-h2: 22px;
  --text-h3: 18px;
  --text-body: 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  :root {
    --text-display: 48px;
    --text-h1: 36px;
    --text-h2: 28px;
    --text-h3: 22px;
    --text-body: 18px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  :root {
    --text-display: 64px;
    --text-h1: 48px;
    --text-h2: 36px;
    --text-h3: 24px;
    --text-body: 18px;
  }
}
```

---

## Part 4: Advanced Techniques

### 4.1 Optical Adjustments

**Theory:** Mathematical perfection ≠ visual perfection. Eyes need optical corrections.

**Techniques:**

1. **Overshoot:** Round letters (O, C) extend slightly beyond baseline/cap-height
2. **Optical sizing:** Different letter shapes for different sizes
3. **Kerning pairs:** Adjust spacing for specific letter combinations (AV, To, We)

**CSS Implementation:**
```css
/* Optical sizing (variable fonts) */
h1 {
  font-variation-settings: 'opsz' 48; /* Optimized for 48px */
}

body {
  font-variation-settings: 'opsz' 16; /* Optimized for 16px */
}

/* Kerning */
p {
  font-kerning: normal; /* Enable kerning */
  text-rendering: optimizeLegibility; /* Better kerning, ligatures */
}
```

### 4.2 Hanging Punctuation

**Theory:** Punctuation should "hang" outside text block for optical alignment.

```css
p {
  hanging-punctuation: first last; /* Quotes hang outside */
}
```

### 4.3 Widows & Orphans Control

**Theory:** Avoid single words on last line (widow) or single lines at top of column (orphan).

```css
p {
  orphans: 2; /* Minimum 2 lines at bottom of column */
  widows: 2;  /* Minimum 2 lines at top of column */
  text-wrap: pretty; /* CSS Text 4 - balance line breaks */
}

h1, h2, h3 {
  text-wrap: balance; /* Balance multi-line headings */
}
```

### 4.4 Hyphenation

**Theory:** Improves justification, reduces rivers of whitespace.

```css
p {
  hyphens: auto;
  hyphenate-limit-chars: 6 3 2; /* Min word length, min before, min after */
}
```

---

## Part 5: Complete Implementation

### 5.1 Full CSS System

```css
/* ============================================
   TYPOGRAPHY DESIGN SYSTEM
   Based on: Major Third scale (1.25)
   Baseline: 8px grid
   Body size: 16px
   ============================================ */

:root {
  /* ===== Type Scale ===== */
  --text-xs: 10px;
  --text-sm: 13px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 25px;
  --text-2xl: 31px;
  --text-3xl: 39px;
  --text-4xl: 49px;
  --text-5xl: 61px;
  --text-6xl: 76px;
  
  /* ===== Line Heights ===== */
  --lh-none: 1.0;
  --lh-tight: 1.25;
  --lh-snug: 1.375;
  --lh-normal: 1.5;
  --lh-relaxed: 1.625;
  --lh-loose: 1.75;
  
  /* ===== Font Weights ===== */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  
  /* ===== Letter Spacing ===== */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  
  /* ===== Spacing Scale (8px grid) ===== */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
  
  /* ===== Semantic Spacing ===== */
  --space-heading-to-body: var(--space-3);
  --space-paragraph: var(--space-4);
  --space-section: var(--space-16);
}

/* ===== Base Typography ===== */
body {
  font-size: var(--text-base);
  line-height: var(--lh-normal);
  font-weight: var(--weight-normal);
  letter-spacing: var(--tracking-normal);
  
  /* Optical improvements */
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Headings ===== */
h1 {
  font-size: var(--text-4xl);
  line-height: var(--lh-tight);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-heading-to-body);
}

h2 {
  font-size: var(--text-3xl);
  line-height: var(--lh-snug);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  margin-top: var(--space-section);
  margin-bottom: var(--space-heading-to-body);
}

h3 {
  font-size: var(--text-2xl);
  line-height: var(--lh-snug);
  font-weight: var(--weight-semibold);
  margin-top: var(--space-12);
  margin-bottom: var(--space-heading-to-body);
}

/* ===== Body Text ===== */
p {
  max-width: 65ch;
  margin-bottom: var(--space-paragraph);
  
  /* Advanced features */
  orphans: 2;
  widows: 2;
  text-wrap: pretty;
  hyphens: auto;
}

/* ===== Utility Classes ===== */
.text-display {
  font-size: var(--text-6xl);
  line-height: var(--lh-tight);
  letter-spacing: var(--tracking-tighter);
}

.text-balance {
  text-wrap: balance;
}

.text-pretty {
  text-wrap: pretty;
}
```

### 5.2 Usage Examples

```html
<!-- Hero Section -->
<section class="hero">
  <h1 class="text-display">Beautiful Typography</h1>
  <p class="text-lg">Based on proven design theory and mathematical harmony.</p>
</section>

<!-- Article -->
<article>
  <h1>Article Title</h1>
  <p class="text-lg">Introduction paragraph with larger text.</p>
  
  <h2>Section Heading</h2>
  <p>Body paragraph with optimal line length and spacing.</p>
  <p>Another paragraph with proper vertical rhythm.</p>
  
  <h3>Subsection</h3>
  <p>More content following the modular scale.</p>
</article>
```

---

## Part 6: Quality Checklist

Before delivery, verify:

### Mathematical Correctness
- [ ] All font sizes follow modular scale (1.25 ratio)
- [ ] All line heights result in 8px multiples
- [ ] All spacing values are 8px multiples

### Optical Quality
- [ ] Body text: 16-18px minimum
- [ ] Line length: 45-75 characters
- [ ] Line height: ≥1.5 for body text
- [ ] Font weights: 2-3 maximum, ≥200 difference
- [ ] Letter spacing: tighter for large, wider for small

### Accessibility
- [ ] Minimum 16px body text (WCAG)
- [ ] Sufficient contrast (4.5:1 for body, 3:1 for large)
- [ ] No justified text on web
- [ ] No all-caps for body text

### Responsive Behavior
- [ ] Type scales down on mobile
- [ ] Line length maintained across breakpoints
- [ ] Touch targets ≥44px (buttons, links)

---

## References

### Core Texts
1. **Bringhurst, Robert.** "The Elements of Typographic Style" (4th ed., 2012) — The typographer's Bible. Modular scale, line height formulas, line length.
2. **Müller-Brockmann, Josef.** "Grid Systems in Graphic Design" (1981) — Foundation of baseline grid and systematic layout.
3. **Tschichold, Jan.** "The New Typography" (1928) — Modern typography principles, proportion systems.

### Research Papers
4. **Tinker, M. A.** "Legibility of Print" (1963) — Foundational study on optimal line length (45-75 CPL).
5. **Dyson, M. C.** "How physical text layout affects reading from screen" (2004) — Eye-tracking confirmation of Tinker.
6. **Rayner, K.** "Eye movements in reading and information processing: 20 years of research" (1998) — Saccade mechanics.
7. **Miller, G. A.** "The Magical Number Seven, Plus or Minus Two" (1956) — Cognitive load limits, why 3-4 hierarchy levels.
8. **Weber, E. H.** "De Pulsu, Resorptione, Auditu et Tactu" (1834) — Perceptual difference threshold (Weber's Law).
9. **Legge, G. E.** "Psychophysics of Reading in Normal and Low Vision" (2007) — Scientific basis for minimum text sizes.

### Modern Design Systems
10. **Material Design Typography:** https://m3.material.io/styles/typography — Google's 8dp grid system.
11. **Apple Human Interface Guidelines:** Typography section — iOS/macOS type standards.
12. **WCAG 2.1:** Success Criterion 1.4.8 — Accessibility requirements for line height (≥1.5).

### Tools
13. **Modular Scale:** https://www.modularscale.com/ — Calculator for type scales.
14. **Type Scale:** https://typescale.com/ — Visual type scale tool.
15. **Fluid Type Scale:** https://utopia.fyi/type/calculator — Fluid responsive type calculator.

### Historical Context
16. **Frutiger, Adrian.** "Signs and Symbols: Their Design and Meaning" (1998) — Letter spacing and optical adjustment.
17. **Le Corbusier.** "The Modulor" (1948) — Application of golden ratio to design proportions.
18. **Marcotte, Ethan.** "Responsive Web Design" (2010) — Fluid typography for multiple screens.
