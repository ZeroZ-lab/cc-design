# Portfolio Site

## Overview
- **Type:** Personal portfolio (Designer / Developer)
- **Style:** Minimal + Expressive
- **Primary color:** Black on white, one accent (e.g. oklch(0.65 0.20 25) warm orange)
- **Typography:** Display: tight-tracked bold sans-serif, Body: clean geometric sans

## Why It Works

1. **Typography as hero** — A single oversized headline ("I design things.") does the job of an entire hero illustration. It loads fast, scales perfectly, and communicates confidence.

2. **Monochrome + one accent** — Black, white, and a single warm tone. The accent appears only on interactive elements (links, hover states, selected tags), making them impossible to miss.

3. **Project detail on hover** — Instead of navigating to a separate detail page, a hover interaction reveals project context (title, role, year) inline. The user never leaves the grid.

4. **"Hire me" clarity** — Personality lives in the type treatment and micro-interactions; the CTA ("Available for work" / "Get in touch") is always visible in the header or footer. Creative expression never hides the business purpose.

5. **Responsive grid** — The project showcase flows from a 3-column grid (desktop) to 2-column (tablet) to a single stack (mobile), with no layout hacks.

## Design Techniques

### Visual Hierarchy
- **Hero headline:** clamp(48px, 8vw, 120px), weight 800, letter-spacing -0.04em
- **Section labels:** 14px uppercase, wide-tracked, muted color
- **Project titles:** 24-32px, weight 600
- **Body / descriptions:** 16-18px, weight 400, line-height 1.65

### Color Usage
- **Background:** white (#fff) or near-white (oklch(0.98 0 0))
- **Text:** near-black (oklch(0.15 0 0))
- **Accent:** single warm color used for links, active states, and hover reveals
- **Muted:** oklch(0.55 0 0) for secondary text and labels

### Typography
- **Font pairing:** One variable-weight sans-serif (e.g. Inter, Sora, or Cabinet Grotesk)
- **Scale:** Two sizes only — massive (hero) and comfortable (body). No middle-weight subheads.
- **Tracking:** Tight (-0.03 to -0.05em) on large text, normal (0) on body text.

### Whitespace / Spacing
120-160px between sections, 24-32px grid gap, 80px+ hero side padding. Generous whitespace lets the type breathe.

### Animation / Interaction
Scroll-reveal via Intersection Observer, hover overlay on project cards, 300ms ease transitions, subtle cursor feedback.

## Reusable Patterns

### Pattern 1: Typography-Driven Hero
A single bold headline with a short subline. No image needed.
```html
<header class="hero">
  <h1>I design &amp; build digital products.</h1>
  <p>Currently available for freelance work.</p>
</header>
```

```css
.hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px clamp(24px, 8vw, 120px);
}

.hero h1 {
  font-size: clamp(48px, 8vw, 120px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.0;
  max-width: 14ch;
  color: oklch(0.15 0 0);
}

.hero p {
  font-size: 20px;
  color: oklch(0.55 0 0);
  margin-top: 24px;
}
```

### Pattern 2: Project Grid with Hover Reveal
A responsive masonry-style grid. Hover shows project context without navigating away.
```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  padding: 0 clamp(24px, 8vw, 120px);
}

.project-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  cursor: pointer;
}

.project-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-card:hover img {
  transform: scale(1.04);
}

.project-card .overlay {
  position: absolute;
  inset: 0;
  background: oklch(0.10 0 0 / 0.7);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .overlay {
  opacity: 1;
}

.overlay h3 {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.overlay span {
  font-size: 14px;
  color: oklch(0.75 0 0);
}
```

## Key Code Snippets

### Scroll-Triggered Reveal (Intersection Observer)
```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

### Responsive Grid Breakpoints
```css
/* Mobile-first base */
.project-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## When to Use This Approach

**Perfect for:**
- Freelance designers or developers showcasing selected work
- Agencies that want a clean, fast-loading portfolio
- Anyone whose brand is "quiet confidence" rather than flashy visuals

**Avoid when** the site needs heavy multimedia (video reels, 3D scenes) or the audience expects rich visual storytelling over type.

**Key Takeaway:** The best portfolio sites say exactly two things — "here is my work" and "here is how to contact me." Everything else (personality, craft, taste) should be communicated through restraint and typographic confidence, not decoration.
