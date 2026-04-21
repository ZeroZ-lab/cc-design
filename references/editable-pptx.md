# Editable PPTX Export: HTML Hard Constraints + Sizing Decisions + Common Errors

This document covers the path of using `scripts/html2pptx.js` + `pptxgenjs` to translate HTML elements into truly editable PowerPoint text boxes. This is different from `export_deck_pptx.mjs --mode image` (which places screenshots as images, making text non-editable).

> **Core prerequisite**: To take this path, the HTML must follow the 4 constraints below from the very first line. **Not written-first-then-converted** -- retrofitting triggers 2-3 hours of rework (real-world experience from a 2026 project).

---

## Canvas Size: Use 960x540pt (LAYOUT_WIDE)

PPTX units are **inches** (physical dimensions), not pixels. Decision principle: the body's computedStyle dimensions must **match the presentation layout's inch dimensions** (within +/-0.1", enforced by `html2pptx.js`'s `validateDimensions`).

### 3 Candidate Sizes Compared

| HTML body | Physical size | PPT layout | When to use |
|---|---|---|---|
| **`960pt x 540pt`** | **13.333" x 7.5"** | **pptxgenjs `LAYOUT_WIDE`** | Recommended default (modern PowerPoint 16:9 standard) |
| `720pt x 405pt` | 10" x 5.625" | Custom | Only when user specifies "legacy PowerPoint Widescreen" template |
| `1920px x 1080px` | 20" x 11.25" | Custom | Non-standard size; fonts appear abnormally small when projected |

**Don't think of HTML dimensions as resolution.** PPTX is a vector document -- body size determines **physical dimensions** not clarity. An oversized body (20"x11.25") won't make text sharper -- it makes font pt sizes relatively smaller within the canvas, looking worse when projected/printed.

### Three equivalent body declarations

```css
body { width: 960pt;  height: 540pt; }    /* Clearest, recommended */
body { width: 1280px; height: 720px; }    /* Equivalent, px convention */
body { width: 13.333in; height: 7.5in; }  /* Equivalent, inch intuition */
```

Corresponding pptxgenjs code:

```js
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';  // 13.333 x 7.5 inch, no custom layout needed
```

---

## 4 Hard Constraints (Violations Produce Errors)

`html2pptx.js` translates HTML DOM elements into PowerPoint objects. PowerPoint's format constraints projected onto HTML = these 4 rules.

### Rule 1: No bare text in DIVs -- wrap with `<p>` or `<h1>`-`<h6>`

```html
<!-- Wrong: bare text inside div -->
<div class="title">Q3 revenue up 23%</div>

<!-- Correct: text inside <p> or <h1>-<h6> -->
<div class="title"><h1>Q3 revenue up 23%</h1></div>
<div class="body"><p>New users are the main driver</p></div>
```

**Why**: PowerPoint text must exist inside a text frame, which corresponds to HTML paragraph-level elements (p/h*/li). A bare `<div>` has no corresponding text container in PPTX.

**Also don't use `<span>` for main text** -- span is an inline element, can't be independently aligned as a text box. Spans can only be used **inside p/h\*** for local styling (bold, color change).

### Rule 2: No CSS gradients -- solid colors only

```css
/* Wrong */
background: linear-gradient(to right, #FF6B6B, #4ECDC4);

/* Correct: solid color */
background: #FF6B6B;

/* If you need multi-color stripes, use flex children with solid colors each */
.stripe-bar { display: flex; }
.stripe-bar div { flex: 1; }
.red   { background: #FF6B6B; }
.teal  { background: #4ECDC4; }
```

**Why**: PowerPoint's shape fill only supports solid/gradient-fill types, but pptxgenjs's `fill: { color: ... }` only maps to solid. Gradients via PowerPoint's native format require separate structure that the toolchain doesn't support.

### Rule 3: Background/border/shadow only on DIVs, not on text tags

```html
<!-- Wrong: <p> has background color -->
<p style="background: #FFD700; border-radius: 4px;">Key content</p>

<!-- Correct: outer div holds background, <p> handles text only -->
<div style="background: #FFD700; border-radius: 4px; padding: 8pt 12pt;">
  <p>Key content</p>
</div>
```

**Why**: In PowerPoint, shape (rectangle/rounded rectangle) and text frame are two separate objects. HTML's `<p>` only translates to a text frame; background/border/shadow belong to shape -- must be on the **wrapping div**.

### Rule 4: No `background-image` on DIVs -- use `<img>` tags

```html
<!-- Wrong -->
<div style="background-image: url('chart.png')"></div>

<!-- Correct -->
<img src="chart.png" style="position: absolute; left: 50%; top: 20%; width: 300pt; height: 200pt;" />
```

**Why**: `html2pptx.js` only extracts image paths from `<img>` elements, it doesn't parse CSS `background-image` URLs.

---

## Path A HTML Template Skeleton

Each slide is a separate HTML file, with isolated scope (avoids single-file deck CSS pollution).

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 960pt; height: 540pt;           /* Matches LAYOUT_WIDE */
    font-family: system-ui, -apple-system, sans-serif;
    background: #FEFEF9;                    /* Solid color, no gradients */
    overflow: hidden;
  }
  /* DIVs handle layout/background/border */
  .card {
    position: absolute;
    background: #1A4A8A;                    /* Background on DIV */
    border-radius: 4pt;
    padding: 12pt 16pt;
  }
  /* Text tags handle font styling only, no background/border */
  .card h2 { font-size: 24pt; color: #FFFFFF; font-weight: 700; }
  .card p  { font-size: 14pt; color: rgba(255,255,255,0.85); }
</style>
</head>
<body>

  <!-- Title area: outer div positions, inner text tags -->
  <div style="position: absolute; top: 40pt; left: 60pt; right: 60pt;">
    <h1 style="font-size: 36pt; color: #1A1A1A; font-weight: 700;">Title as assertion, not topic</h1>
    <p style="font-size: 16pt; color: #555555; margin-top: 10pt;">Subtitle with additional context</p>
  </div>

  <!-- Content card: div handles background, h2/p handle text -->
  <div class="card" style="top: 130pt; left: 60pt; width: 240pt; height: 160pt;">
    <h2>Point One</h2>
    <p>Brief description</p>
  </div>

  <!-- List: use ul/li, not manual bullet symbols -->
  <div style="position: absolute; top: 320pt; left: 60pt; width: 540pt;">
    <ul style="font-size: 16pt; color: #1A1A1A; padding-left: 24pt; list-style: disc;">
      <li>First key point</li>
      <li>Second key point</li>
      <li>Third key point</li>
    </ul>
  </div>

  <!-- Illustration: use <img> tag, not background-image -->
  <img src="illustration.png" style="position: absolute; right: 60pt; top: 110pt; width: 320pt; height: 240pt;" />

</body>
</html>
```

---

## Common Errors Quick Reference

| Error message | Cause | Fix |
|---------|------|---------|
| `DIV element contains unwrapped text "XXX"` | Bare text inside div | Wrap text in `<p>` or `<h1>`-`<h6>` |
| `CSS gradients are not supported` | Used linear/radial-gradient | Change to solid color, or use flex children for segments |
| `Text element <p> has background` | `<p>` tag has background color | Wrap in `<div>` to hold background, `<p>` for text only |
| `Background images on DIV elements are not supported` | div uses background-image | Change to `<img>` tag |
| `HTML content overflows body by Xpt vertically` | Content exceeds 540pt | Reduce content or font size, or use `overflow: hidden` to clip |
| `HTML dimensions don't match presentation layout` | Body size doesn't match pres layout | Use `960pt x 540pt` with `LAYOUT_WIDE`; or defineLayout for custom size |
| `Text box "XXX" ends too close to bottom edge` | Large font `<p>` is < 0.5 inch from body bottom | Move up, leave adequate bottom margin; PPT bottom gets partially obscured |

---

## Basic Workflow (3 Steps to PPTX)

### Step 1: Write each slide as a separate HTML following constraints

```
MyDeck/
  ├── slides/
  │   ├── 01-cover.html    # Each file is a complete 960x540pt HTML
  │   ├── 02-agenda.html
  │   └── ...
  └── illustration/        # All <img> referenced images
      ├── chart1.png
      └── ...
```

### Step 2: Write build.js calling `html2pptx.js`

```js
const pptxgen = require('pptxgenjs');
const html2pptx = require('../scripts/html2pptx.js');  // This skill's script

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 x 7.5 inch, matches HTML's 960x540pt

  const slides = ['01-cover.html', '02-agenda.html', '03-content.html'];
  for (const file of slides) {
    await html2pptx(`./slides/${file}`, pres);
  }

  await pres.writeFile({ fileName: 'deck.pptx' });
})();
```

### Step 3: Open and verify

- Open exported PPTX in PowerPoint/Keynote
- Double-click any text -- it should be directly editable (if it's an image, Rule 1 was violated)
- Verify overflow: each slide should be within body bounds, not clipped

---

## This Path vs Other Options (When to Choose What)

| Need | Choose |
|------|------|
| Colleagues will edit text in PPTX / send to non-technical users | **This path** (editable, requires writing HTML from scratch with 4 constraints) |
| Presentation only / archival, won't be edited | `export_deck_pdf.mjs` (multi-file) or `export_deck_stage_pdf.mjs` (single-file deck-stage), outputs vector PDF |
| Visual freedom priority (animations, web components, CSS gradients, complex SVG), acceptable that it's non-editable | `export_deck_pptx.mjs --mode image` (image-based PPTX) |

**Never run html2pptx on visually-driven HTML** -- real-world pass rate is < 30%, and the remaining per-page retrofit takes longer than starting over.

---

## Why the 4 Constraints Aren't Bugs But Physical Limitations

These 4 aren't laziness on `html2pptx.js`'s part -- they are **PowerPoint file format (OOXML) constraints** projected onto HTML:

- PPTX text must be in a text frame (`<a:txBody>`), corresponding to paragraph-level HTML elements
- PPTX shapes and text frames are two objects, can't have background and text in the same element
- PPTX shape fill has limited gradient support (only certain preset gradients, not arbitrary CSS angle gradients)
- PPTX picture objects must reference actual image files, not CSS properties

Understanding this, **don't expect the tool to get smarter** -- the HTML writing style must adapt to PPTX format, not the other way around.
