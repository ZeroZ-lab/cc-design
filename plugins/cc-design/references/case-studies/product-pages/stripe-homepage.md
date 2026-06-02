# Stripe Homepage

## Overview
- **Type:** Product page (SaaS landing page)
- **Style:** Trust + Professional
- **Primary color:** Indigo/Purple (`oklch(0.50 0.15 270)`)
- **Typography:** Primary: Custom sans-serif (similar to Inter), Secondary: System fonts

## Why It Works

1. **Immediate clarity** — The headline "Financial infrastructure for the internet" tells you exactly what Stripe does in 5 words. No jargon, no fluff.

2. **Trust through simplicity** — The design is deliberately understated. No flashy animations, no aggressive gradients. This restraint signals confidence and professionalism.

3. **Social proof hierarchy** — Logo wall appears early but doesn't dominate. The message is "these companies trust us" not "look at our clients."

4. **Progressive disclosure** — The page reveals complexity gradually. Start simple (payments), then show depth (full financial stack), then prove it (case studies).

## Design Techniques

### Visual Hierarchy
- **Hero headline:** 56-64px, bold weight, high contrast
- **Supporting text:** 20-22px, regular weight, slightly muted
- **Section headlines:** 40-48px, creating clear breaks
- **Body text:** 16-18px, generous line-height (1.6)

The size jumps are significant (2-3x between levels), making the hierarchy unmistakable.

### Color Usage
- **Background:** Pure white or very light gray (`oklch(0.99 0 0)`)
- **Text:** Near-black (`oklch(0.15 0 0)`) for primary, medium gray for secondary
- **Accent:** Single purple/indigo used sparingly for CTAs and highlights
- **No gradients in primary UI** — Gradients appear only in decorative backgrounds, never on interactive elements

**Key insight:** The restraint makes the purple CTA buttons impossible to miss. When everything else is neutral, the accent color has maximum impact.

### Typography
- **Font pairing:** Single sans-serif family, multiple weights (400, 500, 600, 700)
- **Letter spacing:** Slightly tighter on headlines (-0.02em), normal on body
- **Line height:** Tight on headlines (1.1-1.2), generous on body (1.6-1.7)
- **Alignment:** Left-aligned for text blocks, center-aligned for hero

**Key insight:** Using one font family with multiple weights is more cohesive than mixing fonts. Weight creates hierarchy without introducing visual noise.

### Whitespace
- **Hero section:** Massive top/bottom padding (120-160px)
- **Between sections:** 80-120px vertical spacing
- **Within sections:** 40-60px between elements
- **Card padding:** 32-48px internal padding

**Key insight:** The generous whitespace makes the page feel premium and easy to scan. Nothing feels cramped.

## Reusable Patterns

### Pattern 1: Trust-Building Hero

**Structure:**
```
[Logo wall - subtle, above the fold]
        ↓
[Clear value proposition headline]
        ↓
[One-sentence explanation]
        ↓
[Primary CTA] [Secondary CTA]
        ↓
[Visual proof - dashboard screenshot or demo]
```

**Code:**
```css
.hero-trust {
  text-align: center;
  padding: 120px 24px 80px;
  max-width: 800px;
  margin: 0 auto;
}

.logo-wall {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 64px;
  opacity: 0.6;
}

.logo-wall img {
  height: 32px;
  filter: grayscale(100%);
}

.hero-trust h1 {
  font-size: clamp(48px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: oklch(0.15 0 0);
  margin-bottom: 20px;
}

.hero-trust .subtitle {
  font-size: 20px;
  line-height: 1.5;
  color: oklch(0.45 0 0);
  margin-bottom: 32px;
}

.cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}
```

**When to use:** Financial services, enterprise SaaS, any product where trust is the primary concern.

### Pattern 2: Feature Grid with Icons

**Structure:**
```
[Section headline]
        ↓
[Grid of 3-4 feature cards]
Each card: [Icon] [Title] [Description]
```

**Code:**
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  padding: 80px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 32px;
  border-radius: 12px;
  border: 1px solid oklch(0.90 0 0);
  background: oklch(0.99 0 0);
  transition: border-color 0.2s ease;
}

.feature-card:hover {
  border-color: oklch(0.50 0.15 270);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: oklch(0.95 0.05 270);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: oklch(0.15 0 0);
}

.feature-card p {
  font-size: 15px;
  line-height: 1.6;
  color: oklch(0.45 0 0);
}
```

**When to use:** Showcasing multiple product features or benefits in a scannable format.

### Pattern 3: Subtle Gradient Background

**Technique:** Stripe uses very subtle gradients in background sections to add visual interest without distraction.

**Code:**
```css
.section-with-gradient {
  background: linear-gradient(
    135deg,
    oklch(0.99 0.01 270) 0%,
    oklch(0.97 0.02 270) 100%
  );
  padding: 120px 48px;
}
```

**Key insight:** The gradient is barely perceptible (lightness changes by only 2-3%). It adds depth without calling attention to itself.

## Key Code Snippets

### Stripe-Style Button

```css
.btn-stripe-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: oklch(0.50 0.15 270);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn-stripe-primary:hover {
  background: oklch(0.45 0.15 270);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.btn-stripe-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### Stripe-Style Card

```css
.card-stripe {
  padding: 40px;
  border-radius: 12px;
  border: 1px solid oklch(0.90 0 0);
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}

.card-stripe:hover {
  border-color: oklch(0.85 0 0);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
```

### Stripe-Style Section Spacing

```css
.section {
  padding: 120px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 64px;
}

.section-header h2 {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 16px;
}

.section-header p {
  font-size: 20px;
  line-height: 1.5;
  color: oklch(0.45 0 0);
}
```

## When to Use This Approach

**Perfect for:**
- Financial services and fintech products
- Enterprise B2B SaaS platforms
- Developer tools and APIs
- Any product where trust and credibility are paramount
- Products with complex features that need clear explanation

**Not ideal for:**
- Consumer entertainment products (too serious)
- Creative agencies (too corporate)
- Products targeting Gen Z (too formal)
- Anything that benefits from bold, playful energy

## Key Takeaways

1. **Restraint is a design choice** — Stripe's minimalism isn't lazy, it's strategic. Every element earns its place.

2. **One accent color is enough** — The purple does all the heavy lifting. No need for a rainbow.

3. **Whitespace = premium** — The generous spacing makes the product feel expensive and well-crafted.

4. **Trust through clarity** — Complex products need simple explanations. Stripe nails this.

5. **Subtle > flashy** — The hover effects, shadows, and gradients are all understated. This builds trust.

## Further Analysis

Compare Stripe's approach to competitors:
- **Square:** More colorful, more consumer-friendly
- **PayPal:** More traditional, less modern
- **Adyen:** Similar restraint, but less personality

Stripe found the sweet spot: professional enough for enterprises, modern enough for startups.
