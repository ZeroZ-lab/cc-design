# Pitch Deck Example

## Overview
- **Type:** Presentation (Investor pitch)
- **Style:** Professional + Trust
- **Primary color:** Navy blue
- **Typography:** Sans-serif headlines, serif body (optional)

## Why It Works

1. **One idea per slide** — No walls of text. Each slide makes one point clearly.
2. **Visual hierarchy** — Headline dominates (60-80px), supporting text is minimal (24-32px).
3. **Data visualization** — Charts and graphs are clean, not cluttered.
4. **Consistent template** — Every slide follows the same grid, creating rhythm.

## Key Patterns

### Slide Structure
```
┌──────────────────────────────────┐
│  [Slide number]                  │
│                                  │
│  HEADLINE (one line)             │
│                                  │
│  Supporting text (1-2 sentences) │
│  or visual (chart/image)         │
│                                  │
│                                  │
│  [Logo]                          │
└──────────────────────────────────┘
```

### CSS Template
```css
.slide {
  width: 1920px;
  height: 1080px;
  padding: 80px 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
}

.slide-number {
  position: absolute;
  top: 40px;
  right: 120px;
  font-size: 18px;
  color: oklch(0.60 0 0);
}

.slide h1 {
  font-size: 72px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 32px;
  max-width: 1200px;
}

.slide p {
  font-size: 28px;
  line-height: 1.5;
  color: oklch(0.40 0 0);
  max-width: 1000px;
}
```

## When to Use
Investor pitches, board presentations, formal business contexts.

## Key Takeaway
Simplicity wins. One idea per slide, large text, minimal decoration.
