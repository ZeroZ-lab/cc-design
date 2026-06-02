# Frontend Design

> **Load when:** Project has no design system, or user says "make it look good" / "design a screen" without specifying visual direction
> **Skip when:** Project has existing DESIGN.md, token files, or CSS variable system
> **Why it matters:** Without a design system, AI defaults to generic web tropes (Inter, blue gradients, rounded containers). This reference gives concrete aesthetic starting points.
> **Typical failure it prevents:** Generic-looking output that violates the "avoid AI slop" guideline; fonts and colors that clash instead of harmonize

## Visual Taste Principles

### Principle 1: Distinctive Typography Creates Identity

**Why it works:** Typography is the fastest way to establish visual identity. Generic system fonts (Inter, Roboto, Arial) are invisible because they're everywhere. Distinctive fonts create recognition and personality.

**How to apply:** Choose fonts that match the project's emotional tone. Pair a distinctive primary font with a complementary secondary font for hierarchy. Use weight variation (400/500/700) within the same family before switching fonts.

**Positive examples:**
- Startup/SaaS: DM Sans (clean geometric) + Source Serif 4 (professional serif)
- Creative portfolio: Space Grotesk (distinctive sans) + Playfair Display (classic serif)
- Dev tools: JetBrains Mono (monospace identity) + Outfit (modern sans)

**Negative examples:**
- Inter everywhere (no identity, looks like every other SaaS)
- Mixing 3+ font families (visual chaos)
- Using decorative fonts for body text (readability suffers)

### Principle 2: Perceptual Color Harmony Over RGB

**Why it works:** oklch color space ensures colors feel equally bright and saturated to human eyes. RGB/hex colors can look muddy or clash even when mathematically "correct" because they don't match human perception.

**How to apply:** Pick one identity color, then generate harmonious variants by rotating hue (±30° for analogous, 180° for complement). Keep lightness and chroma consistent across the palette for visual coherence.

**Positive examples:**
- `oklch(0.55 0.18 240)` for primary, `oklch(0.55 0.18 270)` for accent (30° rotation, same L/C)
- Surface at L=0.95, text at L=0.15, accent at L=0.55 (clear contrast hierarchy)

**Negative examples:**
- Random hex colors picked from a gradient generator (no perceptual consistency)
- Using pure black (#000) and pure white (#fff) (harsh, no warmth)
- Accent colors with wildly different chroma values (some pop, some fade)

### Principle 3: Intentional Whitespace Creates Hierarchy

**Why it works:** Whitespace isn't empty space, it's active design. More space around an element = more importance. Consistent spacing creates rhythm and makes content scannable.

**How to apply:** Use an 8px base grid. Scale by multiples (4px, 8px, 16px, 24px, 32px, 48px, 64px). Give hero sections 60% whitespace, data-dense sections 40% whitespace. One dominant element per section gets the most breathing room.

**Positive examples:**
- Hero with 64px top/bottom padding, 32px between headline and subhead
- Card grid with 24px gap, 16px internal padding
- Section breaks using 48-64px vertical spacing

**Negative examples:**
- Equal spacing everywhere (no hierarchy, everything feels the same)
- Cramped layouts with 4-8px everywhere (claustrophobic, hard to scan)
- Random spacing values (13px, 19px, 27px) that break the grid

### Principle 4: One Visual Weight Per Section

**Why it works:** Human attention is limited. When everything screams for attention (bold text, bright colors, large size), nothing stands out. One dominant element per section creates clear focal points.

**How to apply:** Pick the most important element in each section. Make it 2-3x larger, bolder, or brighter than everything else. Everything else supports it with smaller size, lighter weight, or muted color.

**Positive examples:**
- Hero: 72px headline, 18px body text (4x size difference)
- Feature card: Bold 24px title, regular 16px description
- Stats section: 80px number, 18px label

**Negative examples:**
- Everything bold (no hierarchy, visual noise)
- Headline and body text the same size (no entry point)
- Multiple competing focal points (split attention, confusion)

### Principle 5: Consistent Depth Language

**Why it works:** Shadows and borders create depth. Mixing shadow styles creates visual inconsistency. Pick one depth language and use it everywhere.

**How to apply:** Choose either subtle shadows (`0 1px 3px rgba(0,0,0,0.1)`) for modern/flat or dramatic shadows (`0 8px 30px rgba(0,0,0,0.12)`) for depth. Use borders (`1px solid var(--border)`) for dense layouts where shadows would clutter. Never mix shadow styles on the same page.

**Positive examples:**
- All cards use `0 1px 3px rgba(0,0,0,0.1)` (consistent subtle depth)
- All separators use `1px solid oklch(0.80 0.02 0)` (consistent borders)
- Modals use `0 8px 30px rgba(0,0,0,0.12)`, nothing else does (clear hierarchy)

**Negative examples:**
- Some cards with subtle shadows, others with dramatic shadows (inconsistent)
- Mixing borders and shadows on similar elements (visual confusion)
- Heavy shadows on every element (muddy, claustrophobic)

## Font Selection

**Recommended fonts by project type:**

| Type | Primary | Secondary | Rationale |
|------|---------|-----------|-----------|
| Startup / SaaS | `DM Sans` | `Source Serif 4` | Clean geometric, professional serif for emphasis |
| Creative / Portfolio | `Space Grotesk` | `Playfair Display` | Distinctive geometric sans, classic serif contrast |
| Technical / Dev tool | `JetBrains Mono` | `Outfit` | Monospace identity, modern sans for body |
| Presentation / Deck | `Bricolage Grotesque` | `Instrument Serif` | Warm grotesque, elegant serif |
| Mobile app UI | `Plus Jakarta Sans` | `Fraunces` (only as accent) | Friendly sans, quirky serif accent |
| Minimal / Editorial | `Sora` | `Cormorant Garamond` | Precise sans, refined serif |

Load from Google Fonts: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">`

## Color System (oklch)

When no design system exists, build a palette using oklch for perceptual uniformity.

### Method

1. Pick one **identity color** (the brand/accent) — ask the user or pick from context
2. Generate 3 harmonious colors using oklch hue rotation:
   - Complement: rotate hue by 180°
   - Analogous: rotate by ±30°
3. Set lightness range: surface=0.95, text=0.15, muted=0.6, accent=0.55
4. Map to CSS custom properties

```css
:root {
  --surface: oklch(0.95 0.02 hue);
  --text:    oklch(0.15 0.02 hue);
  --muted:   oklch(0.60 0.04 hue);
  --accent:  oklch(0.55 0.18 hue);
  --accent-light: oklch(0.85 0.08 hue);
  --border:  oklch(0.80 0.02 hue);
}
```

Replace `hue` with the actual value (0-360). Example: warm orange = hue 55.

### Common starting palettes

| Mood | Hue | Accent oklch | Use case |
|------|-----|-------------|----------|
| Warm | 55 | oklch(0.55 0.18 55) | Consumer, lifestyle |
| Cool | 240 | oklch(0.55 0.18 240) | Enterprise, data |
| Fresh | 150 | oklch(0.55 0.15 150) | Health, sustainability |
| Bold | 25 | oklch(0.60 0.22 25) | Entertainment, gaming |
| Neutral | 0 (achromatic) | oklch(0.50 0.02 0) | Dev tools, docs |

## Spacing System

Use an 8px base grid. Scale by multiples of 4px for density control.

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | 4px | Icon gaps, tight inline |
| `--space-2` | 8px | Button padding, list items |
| `--space-3` | 16px | Card padding, section gaps |
| `--space-4` | 24px | Section padding, card margins |
| `--space-5` | 32px | Page margins, hero spacing |
| `--space-6` | 48px | Section breaks |
| `--space-7` | 64px | Full-bleed separators |

## Composition Rules

1. **Contrast hierarchy**: Headings 2-3x body size. Body 16-18px for web, 24px+ for 1920x1080 slides.
2. **Visual weight**: One element dominant per section. Everything else supports it.
3. **Whitespace ratio**: 60% space, 40% content for hero/cover. 40% space, 60% content for data-dense sections.
4. **Alignment**: One alignment per section (left, center, or right). Mix across sections, not within.
5. **Depth**: Use only 1 shadow level across the entire page. Either `0 1px 3px rgba(0,0,0,0.1)` for subtle or `0 8px 30px rgba(0,0,0,0.12)` for dramatic. Never both.
6. **Borders**: Prefer `1px solid var(--border)` over shadows for separation in dense layouts. Shadows for isolation in sparse layouts.