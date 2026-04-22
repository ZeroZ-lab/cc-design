# Typography & Spacing: Implementation Examples

> **Load when:** Building any design where text and spacing quality matters
> **Purpose:** Provide copy-paste CSS patterns that implement correct typography and spacing
> **Prevents:** Inconsistent font sizes, broken vertical rhythm, awkward image spacing

---

## CSS Variables Setup

Start every design with these variables:

```css
:root {
  /* Font sizes - Web */
  --text-display: 64px;
  --text-h1: 48px;
  --text-h2: 32px;
  --text-h3: 24px;
  --text-body-lg: 20px;
  --text-body: 18px;
  --text-small: 14px;
  
  /* Font sizes - Slides */
  --slide-title: 96px;
  --slide-section: 64px;
  --slide-heading: 48px;
  --slide-body: 28px;
  --slide-caption: 20px;
  
  /* Line heights */
  --lh-tight: 1.2;
  --lh-normal: 1.5;
  --lh-relaxed: 1.6;
  
  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-base: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-5xl: 128px;
  
  /* Font weights */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

---

## Typography Patterns

### Pattern 1: Article/Blog Post

```css
article {
  max-width: 65ch; /* Optimal line length */
  font-size: var(--text-body);
  line-height: var(--lh-normal);
  color: #1a1a1a;
}

article h1 {
  font-size: var(--text-h1);
  font-weight: var(--weight-bold);
  line-height: var(--lh-tight);
  margin-bottom: var(--space-base); /* 16px */
}

article h2 {
  font-size: var(--text-h2);
  font-weight: var(--weight-semibold);
  line-height: var(--lh-tight);
  margin-top: var(--space-3xl); /* 64px - section break */
  margin-bottom: var(--space-md); /* 12px */
}

article h3 {
  font-size: var(--text-h3);
  font-weight: var(--weight-semibold);
  line-height: 1.3;
  margin-top: var(--space-2xl); /* 48px */
  margin-bottom: var(--space-md); /* 12px */
}

article p {
  margin-bottom: var(--space-lg); /* 24px between paragraphs */
}

article p + p {
  margin-top: var(--space-base); /* 16px for consecutive paragraphs */
}
```

### Pattern 2: Landing Page Hero

```css
.hero {
  padding: var(--space-4xl) var(--space-2xl); /* 96px vertical, 48px horizontal */
  text-align: center;
}

.hero h1 {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  line-height: 1.1;
  margin-bottom: var(--space-lg); /* 24px */
  letter-spacing: -0.02em; /* Tighter for large text */
}

.hero p {
  font-size: var(--text-body-lg);
  line-height: var(--lh-normal);
  color: #4a4a4a;
  margin-bottom: var(--space-2xl); /* 48px before CTA */
  max-width: 60ch;
  margin-left: auto;
  margin-right: auto;
}

.hero button {
  font-size: var(--text-body);
  font-weight: var(--weight-semibold);
  padding: var(--space-md) var(--space-lg); /* 12px × 24px */
}
```

### Pattern 3: Slide Deck

```css
.slide {
  width: 1920px;
  height: 1080px;
  padding: var(--space-4xl); /* 96px all sides */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide h1 {
  font-size: var(--slide-heading);
  font-weight: var(--weight-bold);
  line-height: var(--lh-tight);
  margin-bottom: var(--space-2xl); /* 48px */
}

.slide p {
  font-size: var(--slide-body);
  line-height: var(--lh-normal);
  margin-bottom: var(--space-xl); /* 32px */
}

.slide ul {
  font-size: var(--slide-body);
  line-height: var(--lh-relaxed);
}

.slide li + li {
  margin-top: var(--space-lg); /* 24px between list items */
}
```

---

## Image Spacing Patterns

### Pattern 1: Image in Article

```css
article img {
  width: 100%;
  height: auto;
  margin-top: var(--space-xl); /* 32px after text */
  margin-bottom: var(--space-base); /* 16px before caption */
  border-radius: 8px;
}

article figcaption {
  font-size: var(--text-small);
  color: #666;
  text-align: center;
  margin-bottom: var(--space-2xl); /* 48px before next element */
}
```

### Pattern 2: Hero Image

```css
.hero-image {
  width: 100%;
  max-width: 1200px;
  margin: var(--space-3xl) auto; /* 64px top and bottom */
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}
```

### Pattern 3: Image Grid

```css
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl); /* 32px between images */
  margin-top: var(--space-2xl); /* 48px after heading */
  margin-bottom: var(--space-3xl); /* 64px before next section */
}
```

---

## Common Spacing Scenarios

### Scenario 1: Card Component

```css
.card {
  padding: var(--space-xl); /* 32px inside */
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card h3 {
  font-size: var(--text-h3);
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-md); /* 12px */
}

.card p {
  font-size: var(--text-body);
  line-height: var(--lh-normal);
  color: #4a4a4a;
  margin-bottom: var(--space-lg); /* 24px */
}

.card button {
  margin-top: var(--space-base); /* 16px */
}

/* Cards in a grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-xl); /* 32px between cards */
}
```

### Scenario 2: Form Layout

```css
.form-group {
  margin-bottom: var(--space-lg); /* 24px between fields */
}

.form-group label {
  display: block;
  font-size: var(--text-body);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-sm); /* 8px */
}

.form-group input,
.form-group textarea {
  width: 100%;
  font-size: var(--text-body);
  padding: var(--space-md) var(--space-base); /* 12px × 16px */
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-actions {
  margin-top: var(--space-2xl); /* 48px before submit button */
  display: flex;
  gap: var(--space-base); /* 16px between buttons */
}
```

### Scenario 3: Section Breaks

```css
section {
  padding: var(--space-3xl) var(--space-lg); /* 64px vertical, 24px horizontal */
}

section + section {
  margin-top: var(--space-3xl); /* 64px between sections */
}

section h2 {
  font-size: var(--text-h2);
  margin-bottom: var(--space-2xl); /* 48px after section heading */
}
```

---

## Vertical Rhythm Verification

Use this CSS to visualize your 8px baseline grid during development:

```css
/* DEBUG ONLY - Remove before delivery */
body.debug-grid {
  background-image: 
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 7px,
      rgba(255, 0, 0, 0.1) 7px,
      rgba(255, 0, 0, 0.1) 8px
    );
}
```

Add `class="debug-grid"` to body, then verify:
- All text baselines align to red lines
- All margins/paddings are multiples of 8px
- Remove the class before delivery

---

## Common Mistakes & Fixes

### Mistake 1: Inconsistent Paragraph Spacing

❌ **Wrong:**
```css
p { margin-bottom: 20px; } /* Random value */
```

✅ **Correct:**
```css
p { margin-bottom: var(--space-lg); } /* 24px from scale */
```

### Mistake 2: Image Too Close to Text

❌ **Wrong:**
```css
img { margin: 10px 0; } /* Too tight */
```

✅ **Correct:**
```css
img { 
  margin-top: var(--space-xl); /* 32px */
  margin-bottom: var(--space-base); /* 16px */
}
```

### Mistake 3: Tiny Body Text

❌ **Wrong:**
```css
p { font-size: 14px; } /* Too small for body */
```

✅ **Correct:**
```css
p { 
  font-size: var(--text-body); /* 18px */
  line-height: var(--lh-normal); /* 1.5 */
}
```

### Mistake 4: Insufficient Line Height

❌ **Wrong:**
```css
p { 
  font-size: 18px;
  line-height: 1.2; /* Too tight for body text */
}
```

✅ **Correct:**
```css
p { 
  font-size: 18px;
  line-height: 1.5; /* Comfortable reading */
}
```

### Mistake 5: Too Many Font Weights

❌ **Wrong:**
```css
h1 { font-weight: 900; }
h2 { font-weight: 700; }
h3 { font-weight: 600; }
p { font-weight: 400; }
small { font-weight: 300; }
/* 5 weights = confusion */
```

✅ **Correct:**
```css
h1 { font-weight: 700; }
h2 { font-weight: 600; }
h3 { font-weight: 600; }
p { font-weight: 400; }
small { font-weight: 400; }
/* 3 weights = clear hierarchy */
```

---

## Quick Reference Table

| Element | Font Size | Line Height | Margin Bottom | Use Case |
|---------|-----------|-------------|---------------|----------|
| Display | 64px | 1.1 | 24px | Hero headlines |
| H1 | 48px | 1.2 | 16px | Page titles |
| H2 | 32px | 1.2 | 12px | Section headings |
| H3 | 24px | 1.3 | 12px | Subsections |
| Body | 18px | 1.5 | 24px | Paragraphs |
| Small | 14px | 1.6 | 16px | Captions |
| Image | — | — | 32px (top), 16px (bottom) | After text |
| Section | — | — | 64px | Between sections |

---

## Before Delivery Checklist

Run through this list before taking the final screenshot:

1. **Font sizes**: All text uses values from the scale
2. **Line heights**: Body text ≥ 1.5, headings ≥ 1.2
3. **Spacing**: All margins/paddings are multiples of 8px
4. **Image spacing**: 24-32px top, 12-16px bottom
5. **Section breaks**: 48-64px minimum
6. **Font weights**: Using only 2-3 weights
7. **Body text**: Never smaller than 16px (web) or 24px (slides)
8. **Line length**: Body text max-width 65ch
9. **Vertical rhythm**: Enable debug grid, verify alignment
10. **Consistency**: Same elements have same spacing throughout

If any item fails, fix it before delivery.
