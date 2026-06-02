# Data Story

## Overview
- **Type:** Presentation (Data-driven pitch / report deck)
- **Style:** Analytical + Persuasive
- **Primary color:** Neutral background with one accent for data highlights (e.g., `oklch(0.55 0.20 250)`)
- **Typography:** Sans-serif for numbers (tabular lining), serif or geometric sans for headlines

## Why It Works

1. **One metric per slide** -- The audience remembers one number at a time. A slide that shows "Revenue grew 73%" with a single large number is more persuasive than a dense table of quarterly figures.

2. **Progressive data reveal** -- Charts build incrementally (first the axes, then past data, then the new data point) so the audience follows the story arc instead of decoding a complex graphic all at once.

3. **Color as information, not decoration** -- Muted palette for context, one saturated accent for the data point that matters. The highlight color is reserved for "what I want you to remember."

4. **Comparison over absolute numbers** -- A raw metric ("4.2 million users") is forgettable. A comparison ("4.2 million users -- more than the population of Los Angeles") is memorable. Before/after, benchmark-vs-actual, and ranked-list layouts all exploit this.

5. **Typography carries the narrative** -- Huge numerals (180--240px) anchor each slide. Context labels and units are smaller (28--36px) but never orphaned from their number.

## Design Techniques

### Visual Hierarchy
- **Hero number:** 180--240px, bold, accent color -- the single focal point.
- **Unit / context label:** 28--36px, regular weight, muted -- placed directly below or beside the number, never more than 3 lines.
- **Chart annotations:** 20--24px, used sparingly to call out a specific data point.
- **Source footnote:** 14--16px, bottom of slide, low contrast -- present but invisible during a live talk.

### Color Usage
- **Background:** White or very light warm gray (`oklch(0.98 0.005 75)`) for most slides; dark section dividers (`oklch(0.15 0 0)`) for pacing.
- **Muted data:** Gray tones (`oklch(0.70 0 0)`) for past periods, benchmarks, or context bars.
- **Highlight:** One saturated accent (e.g., `oklch(0.55 0.20 250)`) for the metric that matters on this slide.
- **Category colors:** When comparing groups, use a fixed palette of 3--5 colors. Never introduce a new color mid-deck.

**Key insight:** When everything is colorful, nothing stands out. Restrict saturation to the insight you are making.

### Typography
- **Numbers:** Tabular lining font feature (`font-variant-numeric: tabular-nums`) so columns align. Extra-condensed or regular width depending on magnitude.
- **Headlines:** 48--72px, tight letter-spacing (`-0.02em`), left-aligned for reading flow.
- **Body / annotations:** 24--32px, generous line-height (1.5). Right-aligned numbers in tables.

### Whitespace / Spacing
- **Hero number slides:** Centered with at least 200px vertical breathing room above and below the number.
- **Chart slides:** Chart area takes 60--70% of slide; title and annotation occupy the rest.
- **Comparison slides:** A clear vertical or horizontal divider, with generous padding on each side.

### Animation / Transition
- **Progressive reveal:** Data points appear one at a time (opacity + slight translateY). Never animate the axes or grid lines.
- **Counter animation:** Hero numbers can count up from 0 on reveal for dramatic effect. Keep duration under 1.5 seconds.
- **Slide transitions:** Simple fade or horizontal slide (300ms ease). Avoid 3D flips, morphs, or any transition that draws attention to itself.
- **Within-slide pacing:** Each reveal step is triggered by a click/advance, not auto-timed.

## Reusable Patterns

### Pattern 1: Hero Number Slide
The workhorse of a data story. One metric, full screen.

```html
<section>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
              width:100%;height:100%;background:oklch(0.98 0.005 75);">
    <p style="font-size:200px;font-weight:700;line-height:1;
              color:oklch(0.55 0.20 250);font-variant-numeric:tabular-nums;">
      73%
    </p>
    <p style="font-size:28px;margin-top:24px;color:oklch(0.40 0 0);text-align:center;">
      year-over-year revenue growth
    </p>
    <p style="font-size:16px;color:oklch(0.60 0 0);margin-top:64px;">
      Q1 2026 vs Q1 2025 &middot; Internal financials
    </p>
  </div>
</section>
```

### Pattern 2: Before / After Comparison
Two-column layout with a visual divider. Works for metrics, screenshots, or process changes.

```css
.compare-slide {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  padding: 80px 120px;
  align-items: center;
}
.compare-divider {
  width: 2px; height: 400px;
  background: oklch(0.85 0 0);
  margin: 0 48px;
}
.compare-label {
  font-size: 20px; text-transform: uppercase;
  letter-spacing: 0.08em; color: oklch(0.55 0 0);
}
.compare-value {
  font-size: 120px; font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.compare-value.positive { color: oklch(0.55 0.18 145); }
.compare-value.negative { color: oklch(0.55 0.18 25); }
```

### Pattern 3: Progress Bar
For showing growth or completion without a full chart library.

```css
.progress-bar {
  width: 100%; height: 48px;
  background: oklch(0.92 0 0);
  border-radius: 8px; overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: 8px;
  background: oklch(0.55 0.20 250);
  transition: width 1s ease-out;
}
```

## Key Code Snippets

### deck-stage Data Deck Base CSS

```css
deck-stage > section {
  background: var(--paper, oklch(0.98 0.005 75));
  overflow: hidden; position: relative;
}
deck-stage > section:not(.active) { display: none !important; }
deck-stage > section.active { display: flex; flex-direction: column; }
section.dark { --paper: oklch(0.15 0 0); color: white; }
```

Wrap slides in `<deck-stage>` with `<section data-screen-label="01 Title">` children. Place `<script src="deck_stage.js"></script>` after `</deck-stage>`. See `templates/deck_stage.js` for the full web component.

### Hero Number Entrance Animation

```css
@keyframes countUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-number {
  animation: countUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  font-size: 200px; font-weight: 700;
  font-variant-numeric: tabular-nums;
}
```

## When to Use This Approach

**Perfect for:**
- Quarterly business reviews and board reports
- Fundraising pitch decks with heavy metrics
- Product launches with market data
- Annual reports and retrospective presentations
- Any deck where the audience needs to remember specific numbers

**Not ideal for:**
- Vision / brand storytelling decks (emotion > data)
- Workshop or interactive sessions
- Technical deep-dives where the audience expects detailed tables

**Key Takeaway:** A data story is not about showing all the data -- it is about showing the right data at the right time. One metric per slide, color as highlight, progressive reveal. The numbers tell the story; the design makes them unforgettable.
