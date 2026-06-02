# Notion Landing Page

## Overview
- **Type:** Product page (All-in-one workspace)
- **Style:** Playful + Professional
- **Primary color:** Black with colorful accents
- **Typography:** Primary: Custom sans-serif, Secondary: System fonts

## Why It Works

1. **Personality through color** — Notion uses a full rainbow palette, but in a controlled way. Each section gets one accent color.

2. **Approachable complexity** — The product is complex (notes + docs + wiki + projects), but the design makes it feel simple and friendly.

3. **Illustration style** — Custom illustrations add warmth and personality without feeling childish.

4. **Clear use cases** — Instead of listing features, Notion shows "for teams," "for personal," "for students" — making it easy to see yourself using it.

## Design Techniques

### Visual Hierarchy
- **Hero headline:** 64-80px, bold, black
- **Section headlines:** 48-56px, creating clear breaks
- **Use case cards:** 20-24px headlines, 16px body
- **Testimonials:** 18-20px, italic for quotes

### Color Usage
- **Base:** Black text on white/cream background
- **Accents:** Full spectrum (red, orange, yellow, green, blue, purple) — one per section
- **Illustrations:** Pastel versions of accent colors
- **Buttons:** Black (primary), colored (secondary)

**Key insight:** Using different colors for different sections creates visual variety without chaos. Each section has its own identity.

### Typography
- **Font pairing:** Single custom sans-serif, multiple weights
- **Playful touches:** Slightly rounded letterforms, friendly proportions
- **Hierarchy through weight:** 400 (body), 500 (labels), 600 (subheads), 700 (headlines)

## Reusable Patterns

### Pattern 1: Use Case Cards

```css
.use-case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  padding: 80px 48px;
}

.use-case-card {
  padding: 40px;
  border-radius: 16px;
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  transition: transform 0.2s ease;
}

.use-case-card:hover {
  transform: translateY(-4px);
}

.use-case-card .icon {
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}

.use-case-card h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.use-case-card p {
  font-size: 16px;
  line-height: 1.6;
  color: oklch(0.40 0 0);
}
```

### Pattern 2: Colorful Section Breaks

```css
.section-colored {
  background: var(--section-color);
  padding: 120px 48px;
  color: var(--section-text);
}

/* Example: Blue section */
.section-blue {
  --section-color: oklch(0.95 0.05 240);
  --section-text: oklch(0.20 0.10 240);
}

/* Example: Yellow section */
.section-yellow {
  --section-color: oklch(0.95 0.08 85);
  --section-text: oklch(0.25 0.10 85);
}
```

## When to Use This Approach

**Perfect for:**
- Products with multiple use cases
- Tools that need to feel approachable
- Products targeting both individuals and teams
- Brands that want to feel friendly but professional

**Key Takeaway:** Color can add personality without sacrificing professionalism. The key is using it systematically, not randomly.
