# Slide Decks: HTML Slide Production Guide

Slide deck creation is one of the most common design tasks. This document covers how to produce HTML slide decks, from architecture selection and individual slide design, through the complete PDF/PPTX export pipeline.

**This skill's export capabilities**:
- HTML playback / PDF export → this document + `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- Editable PPTX export → `references/editable-pptx.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs --mode editable`
- Image-based PPTX (non-editable but visually faithful) → `scripts/export_deck_pptx.mjs --mode image`

---

## Confirm Delivery Format Before Starting (Hardest Checkpoint)

**This decision comes before "single-file vs multi-file".** Real-world lesson from a 2026-04-20 project: not confirming delivery format upfront = 2-3 hours of rework.

### Decision Tree

```
│ Q: What is the final deliverable?
├── Browser-only presentation / local HTML    → Maximum visual freedom, go wild
├── PDF (print / share / archive)             → Maximum visual freedom, any architecture can export
└── Editable PPTX (colleagues will edit text) → From the first line of HTML, follow the 4 hard constraints in `references/editable-pptx.md`
```

### Why "PPTX means Path A from the start"

The prerequisite for editable PPTX is that `html2pptx.js` can translate DOM elements into PowerPoint objects. It requires **4 hard constraints**:

1. body fixed at 720pt x 405pt (not 1920x1080px)
2. All text wrapped in `<p>`/`<h1>`-`<h6>` (no bare text in divs, no `<span>` for main text)
3. `<p>`/`<h*>` cannot have background/border/shadow (put those on the wrapping div)
4. No `background-image` on `<div>` (use `<img>` tags)
5. No CSS gradients, no web components, no complex SVG decorations

**This skill's default HTML has high visual freedom** — extensive spans, nested flex, complex SVG, web components (like `<deck-stage>`), CSS gradients — **almost none of these naturally pass html2pptx's constraints** (testing shows visually-driven HTML passed html2pptx at < 30%).

### Cost Comparison of Two Real Paths (2026-04-20 Real Incident)

| Path | Approach | Result | Cost |
|------|----------|--------|------|
| **Write free HTML first, retrofit PPTX later** | Single-file deck-stage + lots of SVG/span decoration | For editable PPTX, only two options remain:<br>A. Hand-write hundreds of lines of pptxgenjs with hardcoded coordinates<br>B. Rewrite 17 pages of HTML into Path A format | 2-3 hours rework, and hand-written version has **permanent maintenance cost** (change one word in HTML, must manually sync PPTX) |
| **Follow Path A constraints from the start** | Each page as independent HTML + 4 hard constraints + 720x405pt | One command exports 100% editable PPTX, and pages also work in browser presentation (Path A HTML is standard browser-playable HTML) | 5 extra minutes thinking about "how to wrap text in `<p>`" during HTML writing, zero rework |

### Opening Script (Copy and Use)

> Before starting, let's confirm the delivery format:
> - **Browser presentation / PDF** → I'll maximize visual freedom (animations, web components, complex SVG, CSS gradients all OK)
> - **Editable PPTX needed** (colleagues will edit text) → I must follow the 4 hard constraints in `references/editable-pptx.md` from the first line. Visual capabilities will be more limited (no gradients, no web components, no complex SVG), but export is one command
>
> Which path?

### What About Hybrid Delivery

User says "I want HTML presentation **and** editable PPTX" — **this isn't hybrid**, the PPTX requirement subsumes the HTML requirement. Path A HTML works in browser presentation natively (just add a `deck_index.html` assembler). **No extra cost.**

User says "I want PPTX **and** animations / web components" — **this is a real contradiction**. Tell the user: editable PPTX requires sacrificing these visual capabilities. Let them make the tradeoff. Don't secretly write a hand-crafted pptxgenjs solution (it becomes permanent maintenance debt).

### What If PPTX Requirement Comes After HTML Is Done (Emergency Recovery)

Rare case: HTML is already written when the PPTX requirement surfaces. Two imperfect options:

1. **Image-based PPTX** (`scripts/export_deck_pptx.mjs` image mode) — 100% visual fidelity but text is non-editable. Best for "present with PowerPoint, don't edit content"
2. **Hand-written pptxgenjs rebuild** (manually write addText/addShape + image PNG embedding for each page) — text is editable, but positions, fonts, alignment all need manual tuning, high maintenance cost. **Only go this route if user explicitly accepts "any HTML source change requires re-tuning PPTX"**

Always present the options to the user. Let them decide. **Never make hand-writing pptxgenjs your first instinct** — that's the last resort.

---

## Choose Architecture First: Single-File or Multi-File?

**This choice is the first step in slide creation. Get it wrong and you'll trip over the same issues repeatedly. Read this section before starting.**

### Architecture Comparison

| Dimension | Single-File + `deck_stage.js` | **Multi-File + `deck_index.html` Assembler** |
|-----------|-------------------------------|---------------------------------------------|
| Code structure | One HTML, all slides are `<section>` | Each page is independent HTML, `index.html` assembles via iframe |
| CSS scope | Global, one page's styles can affect all pages | Naturally isolated, each iframe is its own world |
| Verification granularity | Need JS goTo to switch to a specific page | Single page file opens in browser with double-click |
| Parallel development | One file, multiple agents editing causes conflicts | Multiple agents can work on different pages simultaneously, zero-conflict merges |
| Debugging difficulty | One CSS error breaks the entire deck | One page error only affects itself |
| In-deck interaction | Cross-page state sharing is easy | Between iframes requires postMessage |
| Print to PDF | Built-in | Assembler's beforeprint iterates iframes |
| Keyboard navigation | Built-in | Built-in in assembler |

### Which to Choose? (Decision Tree)

```
│ Q: How many slides will the deck have?
├── ≤10 slides, needs in-deck animation or cross-page interaction, pitch deck → single-file
└── ≥10 slides, academic lectures, courseware, long decks, multi-agent parallel → multi-file (recommended)
```

**Default to multi-file.** It's not the "alternative" — it's the **primary path for long decks and team collaboration**. Reason: multi-file has every advantage of single-file (keyboard navigation, print, scale), plus scope isolation and verifiability that single-file can't recover.

### Why Is This Rule So Hard? (Real Incident Record)

Single-file architecture hit four bugs during an AI psychology lecture deck:

1. **CSS specificity override**: `.emotion-slide { display: grid }` (specificity 10) overrode `deck-stage > section { display: none }` (specificity 2), causing all pages to render simultaneously, stacked on top of each other.
2. **Shadow DOM slot rules suppressed by outer CSS**: `::slotted(section) { display: none }` couldn't override the outer rule, sections refused to hide.
3. **localStorage + hash navigation race condition**: After refresh, instead of jumping to hash position, it stayed at the old localStorage-recorded position.
4. **High verification cost**: Must `page.evaluate(d => d.goTo(n))` to screenshot a specific page, twice as slow as direct `goto(file://.../slides/05-X.html)`, and frequently errored.

All root causes trace back to **a single global namespace** — multi-file architecture physically eliminates these problems.

---

## Path A (Default): Multi-File Architecture

### Directory Structure

```
MyDeck/
├── index.html              # Copied from assets/deck_index.html, modify MANIFEST
├── shared/
│   ├── tokens.css          # Shared design tokens (color palette, font sizes, common chrome)
│   └── fonts.html          # <link> importing Google Fonts (included by each page)
└── slides/
    ├── 01-cover.html       # Each file is a complete 1920x1080 HTML
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### Slide Template Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>P05 · Chapter Title</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* Page-specific styles. Any class name here won't pollute other pages. */
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920x1080 content (body width/height locked by tokens.css) -->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**Key constraints**:
- `<body>` is the canvas. Lay out directly on it. Don't wrap in `<section>` or other wrappers.
- `width: 1920px; height: 1080px` is locked by `shared/tokens.css`'s `body` rule.
- Import `shared/tokens.css` for shared design tokens (colors, font sizes, page-header/footer, etc.).
- Font `<link>` is written per page (font imports are cheap individually and ensure each page opens independently).

### Assembler: `deck_index.html`

**Copy directly from `assets/deck_index.html`**. You only need to change one thing — the `window.DECK_MANIFEST` array, listing all slide filenames and human-readable labels in order:

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "Cover" },
  { file: "slides/02-agenda.html",   label: "Agenda" },
  { file: "slides/03-problem.html",  label: "Problem Statement" },
  // ...
];
```

The assembler has built-in: keyboard navigation (arrows/Home/End/number keys/P for print), scale + letterbox, bottom-right counter, localStorage memory, hash page-jump, print mode (iterates iframes for per-page PDF output).

### Per-Page Verification (Multi-File's Killer Advantage)

Each slide is an independent HTML file. **After finishing one, double-click to open it in the browser**:

```bash
open slides/05-personas.html
```

Playwright screenshots also use direct `goto(file://.../slides/05-personas.html)`, no JS page-switching needed, no interference from other pages' CSS. This makes the "change a little, verify a little" workflow near-zero cost.

### Parallel Development

Assign each slide's task to a different agent, run simultaneously — HTML files are independent, no merge conflicts. Long decks using this parallel approach can compress production time to 1/N.

### What Belongs in `shared/tokens.css`

Only things **truly shared across pages**:

- CSS variables (color palette, font-size scale, spacing scale)
- Canvas lock like `body { width: 1920px; height: 1080px; }`
- Identical chrome like `.page-header` / `.page-footer` used the same way on every page

**Don't** put single-page layout classes in here — that degrades back to single-file architecture's global pollution problem.

---

## Path B (Small Decks): Single-File + `deck_stage.js`

For ≤10 slides, when you need cross-page shared state (e.g., a React tweaks panel controlling all pages), or for pitch deck demos requiring maximum compactness.

### Basic Usage

1. Read content from `assets/deck_stage.js`, embed in HTML's `<script>` (or `<script src="deck_stage.js">`)
2. Wrap slides in `<deck-stage>` inside body
3. Script tag must go **after** `</deck-stage>` (see hard constraint below)

```html
<body>

  <deck-stage>
    <section>
      <h1>Slide 1</h1>
    </section>
    <section>
      <h1>Slide 2</h1>
    </section>
  </deck-stage>

  <!-- Correct: script after deck-stage -->
  <script src="deck_stage.js"></script>

</body>
```

### Script Position Hard Constraint (2026-04-20 Real Bug)

**Don't put `<script src="deck_stage.js">` in `<head>`.** Even though it can define `customElements` in `<head>`, the parser triggers `connectedCallback` when it hits the `<deck-stage>` opening tag — at that point child `<section>` elements haven't been parsed yet, `_collectSlides()` gets an empty array, counter shows `1 / 0`, and all pages render simultaneously, stacked.

**Three compliant approaches** (pick any one):

```html
<!-- Most recommended: script after </deck-stage> -->
</deck-stage>
<script src="deck_stage.js"></script>

<!-- Also works: script in head with defer -->
<head><script src="deck_stage.js" defer></script></head>

<!-- Also works: module scripts are naturally deferred -->
<head><script src="deck_stage.js" type="module"></script></head>
```

`deck_stage.js` has built-in `DOMContentLoaded` deferred collection defense — even with script in head it won't completely blow up — but `defer` or placing at body bottom is still cleaner, avoiding reliance on the defense branch.

### Single-File Architecture CSS Pitfalls (Must Read)

The most common pitfall in single-file architecture — **`display` property stolen by individual page styles**.

Common mistake 1 (writing display: flex directly on section):

```css
/* External CSS specificity 2, overrides shadow DOM's ::slotted(section){display:none} (also 2) */
deck-stage > section {
  display: flex;            /* All pages will render simultaneously, stacked! */
  flex-direction: column;
  padding: 80px;
  ...
}
```

Common mistake 2 (section has a higher-specificity class):

```css
.emotion-slide { display: grid; }   /* Specificity: 10, even worse */
```

Both cause **all slides to render simultaneously, stacked on top of each other** — counter may show `1 / 10` pretending everything is fine, but visually page 1 covers page 2 covers page 3.

### Starter CSS (Copy at Start, No Pitfalls)

**Section itself** only handles "visible/invisible"; **layout (flex/grid etc.) goes on `.active`**:

```css
/* section only defines non-display general styles */
deck-stage > section {
  background: var(--paper);
  padding: 80px 120px;
  overflow: hidden;
  position: relative;
  /* Do NOT put display here! */
}

/* Lock "inactive = hidden" — specificity + weight double insurance */
deck-stage > section:not(.active) {
  display: none !important;
}

/* Active page gets display + layout */
deck-stage > section.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Print mode: all pages visible, override :not(.active) */
@media print {
  deck-stage > section { display: flex !important; }
  deck-stage > section:not(.active) { display: flex !important; }
}
```

Alternative approach: **put per-page flex/grid on an inner wrapper `<div>`**, section itself only toggles `display: block/none`. This is the cleanest approach:

```html
<deck-stage>
  <section>
    <div class="slide-content flex-layout">...</div>
  </section>
</deck-stage>
```

### Custom Dimensions

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 portrait -->
</deck-stage>
```

---

## Slide Labels

Both deck_stage and deck_index label each page (shown in counter). Give them **meaningful** labels:

**Multi-file**: In `MANIFEST`, write `{ file, label: "04 Problem Statement" }`
**Single-file**: Add `data-screen-label` to section: `<section data-screen-label="04 Problem Statement">`

**Key: Slide numbering starts at 1, not 0.**

When a user says "slide 5" they mean the 5th slide, never array index `[4]`. Humans don't use 0-indexed numbering.

---

## Speaker Notes

**Don't add by default.** Only add when user explicitly requests.

With speaker notes you can minimize text on slides and focus on impactful visuals — notes carry the complete script.

### Format

**Multi-file**: In `index.html`'s `<head>`:

```html
<script type="application/json" id="speaker-notes">
[
  "Script for slide 1...",
  "Script for slide 2...",
  "..."
]
</script>
```

**Single-file**: Same location.

### Notes Writing Tips

- **Complete**: Not an outline, but the actual words to say
- **Conversational**: Like normal speech, not formal writing
- **Aligned**: Array index N corresponds to slide N
- **Length**: 200-400 words ideal
- **Emotional arc**: Mark emphasis points, pauses, and key moments

---

## Slide Design Patterns

### 1. Establish a System (Required)

After exploring design context, **verbally state the system you'll use**:

```markdown
Deck system:
- Background colors: max 2 (90% white + 10% dark section dividers)
- Typography: Instrument Serif for display, Geist Sans for body
- Rhythm: section dividers use full-bleed color + white text, regular slides use white background
- Imagery: hero slides use full-bleed photos, data slides use charts

I'll build with this system. Let me know if any adjustments are needed.
```

Proceed after user confirms.

### 2. Common Slide Layouts

- **Title slide**: Solid background + huge title + subtitle + author/date
- **Section divider**: Colored background + chapter number + chapter title
- **Content slide**: White background + title + 1-3 bullet points
- **Data slide**: Title + large chart/number + brief caption
- **Image slide**: Full-bleed photo + small caption at bottom
- **Quote slide**: Generous whitespace + large quote + attribution
- **Two-column**: Left-right comparison (vs / before-after / problem-solution)

Use at most 4-5 layout types in a deck.

### 3. Scale (Emphasized Again)

- Body text minimum **24px**, ideal 28-36px
- Titles **60-120px**
- Hero text **180-240px**
- Slides are viewed from 10 meters away. Text must be large enough.

### 4. Visual Rhythm

Decks need **intentional variety**:

- Color rhythm: mostly white backgrounds + occasional colored section dividers + occasional dark segments
- Density rhythm: a few text-heavy + a few image-heavy + a few quote slides with whitespace
- Font-size rhythm: normal titles + occasional giant hero text

**Don't make every slide look the same** — that's a PPT template, not design.

### 5. Spatial Breathing Room (Required Reading for Data-Dense Pages)

**Most common beginner mistake**: cramming all possible information into one page.

Information density ≠ effective information delivery. Academic/presentation decks especially need restraint:

- List/matrix pages: Don't draw all N elements at the same size. Use **hierarchical layering** — the 5 items being discussed today get enlarged as protagonists, the remaining 16 get shrunk as background hints.
- Big number pages: The number itself is the visual protagonist. Surrounding caption should not exceed 3 lines, or the audience's eyes will bounce around.
- Quote pages: There should be whitespace separating the quote from the attribution. Don't stick them together.

Self-check against two criteria: "Is the data the protagonist?" and "Is text crowding together?" Adjust until the whitespace makes you slightly uncomfortable.

---

## Print to PDF

**Multi-file**: `deck_index.html` handles the `beforeprint` event, outputting PDF page by page.

**Single-file**: `deck_stage.js` does the same.

Print styles are already written. No additional `@media print` CSS needed.

---

## Export to PPTX / PDF (Self-Service Scripts)

HTML is the first-class citizen. But users often need PPTX/PDF delivery. Two general-purpose scripts are provided in `scripts/`, usable with **any multi-file deck**:

### `export_deck_pdf.mjs` — Export Vector PDF (Multi-File Architecture)

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**Features**:
- Text **retained as vectors** (copyable, searchable)
- 100% visual fidelity (Playwright's embedded Chromium renders then prints)
- **No changes to HTML needed**
- Each slide gets an independent `page.pdf()`, then merged with `pdf-lib`

**Dependencies**: `npm install playwright pdf-lib`

**Limitation**: PDF text is not re-editable — go back to HTML for changes.

### `export_deck_stage_pdf.mjs` — Single-File deck-stage Architecture Only

**When to use**: deck is a single HTML file with `<deck-stage>` web component wrapping N `<section>` elements (i.e., Path B architecture). At this point `export_deck_pdf.mjs`'s approach of "one `page.pdf()` per HTML file" doesn't work — use this dedicated script.

```bash
node scripts/export_deck_stage_pdf.mjs --html deck.html --out deck.pdf
```

**Why `export_deck_pdf.mjs` Can't Be Reused** (2026-04-20 Real Debugging Record):

1. **Shadow DOM beats `!important`**: deck-stage's shadow CSS has `::slotted(section) { display: none }` (only the active one gets `display: block`). Even using `@media print { deck-stage > section { display: block !important } }` in light DOM can't override it — `page.pdf()` triggers print media and Chromium's final render only shows the active slide, resulting in **the entire PDF being 1 page** (repeating the currently active slide).

2. **Looping goto per page still produces 1 page**: The intuitive solution "navigate to each `#slide-N` then `page.pdf({pageRanges:'1'})`" also fails — because print CSS outside shadow DOM has `deck-stage > section { display: block }` being overridden, the final render always shows the first section in the list (not the one you navigated to). Result: 17 iterations produce 17 copies of P01 cover.

3. **Absolute children spill to next page**: Even if all sections render successfully, if sections themselves are `position: static`, their absolute-positioned `cover-footer`/`slide-footer` will be positioned relative to the initial containing block — when sections are forced to 1080px height by print, absolute footers may get pushed to the next page (manifesting as PDF having 1 more page than section count, with the extra page containing only an orphaned footer).

**Fix Strategy** (implemented in script):

```js
// After opening HTML, use page.evaluate to extract sections from deck-stage slots,
// attach them to a plain div under body, with inline styles ensuring position:relative + fixed dimensions
await page.evaluate(() => {
  const stage = document.querySelector('deck-stage');
  const sections = Array.from(stage.querySelectorAll(':scope > section'));
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
      @page { size: 1920px 1080px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; }
      deck-stage { display: none !important; }
    `,
  }));
  const container = document.createElement('div');
  sections.forEach(s => {
    s.style.cssText = 'width:1920px!important;height:1080px!important;display:block!important;position:relative!important;overflow:hidden!important;page-break-after:always!important;break-after:page!important;background:#F7F4EF;margin:0!important;padding:0!important;';
    container.appendChild(s);
  });
  // Last page: disable page break to avoid trailing blank page
  sections[sections.length - 1].style.pageBreakAfter = 'auto';
  sections[sections.length - 1].style.breakAfter = 'auto';
  document.body.appendChild(container);
});

await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
```

**Why This Works**:
- Pulls sections from shadow DOM slots into a plain div in light DOM — completely bypasses `::slotted(section) { display: none }` rule
- Inline `position: relative` keeps absolute children positioned relative to their section, no overflow
- `page-break-after: always` makes the browser print each section as its own page
- `:last-child` no page break avoids trailing blank page

**Note on `mdls -name kMDItemNumberOfPages` verification**: macOS Spotlight metadata has caching. After PDF rewrite, run `mdimport file.pdf` to force refresh, otherwise it shows old page count. Use `pdfinfo` or `pdftoppm` to count actual pages.

---

### `export_deck_pptx.mjs` — Export PPTX (Two Modes)

```bash
# Image-based (100% visual fidelity, non-editable text)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode image

# Each text as independent text box (editable, but font fallbacks apply)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode editable
```

| Mode | Visual Fidelity | Text Editable | How It Works | Limitations |
|------|----------------|---------------|-------------|-------------|
| `image` | 100% | No | Playwright screenshot → pptxgenjs addImage | Text becomes images |
| `editable` | ~70% | Yes | html2pptx extracts each text box | See constraints below |

**Editable mode hard constraints** (user's HTML must satisfy these, otherwise that page is skipped):
- All text must be in `<p>`/`<h1>`-`<h6>`/`<ul>`/`<ol>` (no bare text divs)
- `<p>`/`<h*>` tags cannot have background/border/shadow (put on outer div)
- No `::before`/`::after` for decorative text (pseudo-elements can't be extracted)
- Inline elements (span/em/strong) cannot have margin
- No CSS gradients (not renderable)
- No `background-image` on divs (use `<img>`)

Script has built-in **auto-preprocessor** — wraps "bare text in leaf divs" into `<p>` (preserving class). This fixes the most common violation. But other violations (border on p, margin on span, etc.) still require HTML source compliance.

**Editable mode caveat — font fallbacks**:
- Playwright measures text-box dimensions using webfonts; PowerPoint/Keynote renders with local fonts
- When they differ, **overflow or misalignment** occurs — every page needs visual review
- Recommend installing HTML fonts on target machine, or falling back to `system-ui`

### Making HTML Export-Friendly from the Start

For the most robust decks: **write HTML following editable mode constraints from the beginning**. Then `--mode editable` passes everything. The extra cost is minimal:

```html
<!-- Bad -->
<div class="title">Key Finding</div>

<!-- Good (p wrapper, class inherited) -->
<p class="title">Key Finding</p>

<!-- Bad (border on p) -->
<p class="stat" style="border-left: 3px solid red;">41%</p>

<!-- Good (border on outer div) -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">41%</p>
</div>
```

### When to Choose Which

| Scenario | Recommendation |
|----------|---------------|
| Delivering to event organizers / archiving | **PDF** (universal, high-fidelity, searchable text) |
| Sending to collaborators for text tweaks | **PPTX editable** (accept font fallbacks) |
| Live presentation, no content changes | **PDF** or **PPTX image** |
| HTML is primary presentation medium | Browser playback directly, export is backup |

## Deep Path: Editable PPTX for Long-Term Projects

If your deck will be maintained long-term, repeatedly modified, or collaboratively edited — recommend **writing HTML to html2pptx constraints from the start**, making `--mode editable` pass consistently. See `references/editable-pptx.md` (4 hard constraints + HTML template + common errors quick reference).

---

## Common Issues

**Multi-file: iframe page won't load / blank**
→ Check that `MANIFEST`'s `file` path is correct relative to `index.html`. Use browser DevTools to see if the iframe's src is directly accessible.

**Multi-file: page style conflicts with another page**
→ Impossible (iframe isolation). If it seems like a conflict, it's cache — Cmd+Shift+R to force refresh.

**Single-file: multiple slides render simultaneously, stacked**
→ CSS specificity issue. See the "Single-File Architecture CSS Pitfalls" section above.

**Single-file: scaling looks wrong**
→ Check that all slides are direct children of `<deck-stage>` as `<section>`. No `<div>` wrappers in between.

**Single-file: want to jump to a specific slide**
→ Add hash to URL: `index.html#slide-5` jumps to slide 5.

**Both architectures: text positions inconsistent across different screens**
→ Use fixed dimensions (1920x1080) and `px` units. Don't use `vw`/`vh` or `%`. Scaling is handled uniformly.

---

## Verification Checklist (Must Pass After Completing Deck)

1. [ ] Open `index.html` (or main HTML) directly in browser, check first page has no broken images, fonts loaded
2. [ ] Press → key through every page, no blank pages, no layout misalignment
3. [ ] Press P for print preview, each page is exactly one A4 (or 1920x1080) with no clipping
4. [ ] Randomly pick 3 pages, Cmd+Shift+R force refresh, localStorage memory works correctly
5. [ ] Playwright batch screenshots (multi-file: iterate `slides/*.html`; single-file: use goTo switching), visually review each
6. [ ] Search for `TODO` / `placeholder` remnants, confirm all cleaned up
