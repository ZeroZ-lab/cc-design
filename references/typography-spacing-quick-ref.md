# Typography & Spacing Quick Reference

**Print this mentally before every design task.**

---

## Font Sizes (Never Deviate)

### Web/Mobile
- Display: 48-72px
- H1: 36-48px
- H2: 28-36px
- H3: 20-24px
- Body: **16-18px** (minimum 16px)
- Small: 14-16px

### Slides
- Title: 80-120px
- Section: 56-72px
- Heading: 36-48px
- Body: **24-32px** (minimum 24px)
- Caption: 18-20px

---

## Line Heights (Match to Size)

- 48px+: **1.1-1.2**
- 24-48px: **1.2-1.3**
- 16-20px: **1.5-1.6** (never less than 1.5)
- 14px: **1.6-1.7**
- CJK: Add +0.1

---

## Spacing Scale (Only Use These)

**4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128**

### Common Patterns

**Text blocks:**
- Heading → Body: **12-16px**
- Paragraph → Paragraph: **16-24px**
- Section → Section: **48-64px**

**Images:**
- Text → Image: **24-32px** ⬆️
- Image → Caption: **12-16px** ⬇️
- Caption → Next: **32-48px** ⬇️

**Containers:**
- Card padding: **24-32px**
- Section padding: **48-64px** (V) × **24-48px** (H)
- Button padding: **12px** (V) × **24px** (H)

**Components:**
- Form fields: **16-24px** gap
- List items: **12-16px** gap
- Grid items: **24-32px** gap

---

## Font Weights (2-3 Maximum)

- **400**: Body text
- **600**: Subheadings, buttons
- **700**: Main headings

Never: 100, 300, 900 (unless brand-specific)

---

## Critical Rules

1. ✅ All vertical spacing = multiples of 8px
2. ✅ Body text ≥ 16px (web) or ≥ 24px (slides)
3. ✅ Body line-height ≥ 1.5
4. ✅ Image top margin ≥ 24px
5. ✅ Section breaks ≥ 48px
6. ✅ Max 2-3 font weights
7. ✅ Line length ≤ 65ch for body text

---

## Pre-Screenshot Checklist

Before taking the final screenshot, verify:

- [ ] Body text size correct
- [ ] Line heights correct
- [ ] Heading → body gaps: 12-16px
- [ ] Paragraph gaps: 16-24px
- [ ] Image spacing: 24-32px top, 12-16px bottom
- [ ] Section breaks: 48-64px
- [ ] All spacing from scale
- [ ] All spacing multiples of 8px
- [ ] Only 2-3 font weights used

**If any fails, fix before delivery.**

---

## CSS Variables Template

```css
:root {
  /* Sizes */
  --text-display: 64px;
  --text-h1: 48px;
  --text-h2: 32px;
  --text-h3: 24px;
  --text-body: 18px;
  --text-small: 14px;
  
  /* Line heights */
  --lh-tight: 1.2;
  --lh-normal: 1.5;
  --lh-relaxed: 1.6;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-base: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  
  /* Weights */
  --weight-normal: 400;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

Copy this into every HTML file.

---

## Debug Grid (Development Only)

```css
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

Add `class="debug-grid"` to verify 8px rhythm. Remove before delivery.
