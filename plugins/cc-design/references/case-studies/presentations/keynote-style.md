# Keynote-Style Presentation

## Overview
- **Type:** Presentation (Product keynote)
- **Style:** Excitement + Professional
- **Primary color:** Black background with vibrant accents
- **Typography:** Large, bold headlines (SF Pro Display / Helvetica Neue style)

## Why It Works

1. **Dark backgrounds, bright content** — Black background makes product shots and accent colors pop dramatically.
2. **Extreme scale contrast** — Headlines can be 120-200px. Supporting text is 24-32px. The gap creates drama.
3. **One image fills the slide** — Full-bleed product photos create immersive moments.
4. **Rhythm variation** — Alternates between text-only slides, image-only slides, and hybrid slides.

## Key Patterns

### Full-Bleed Image Slide
```css
.slide-fullbleed {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background: black;
}

.slide-fullbleed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-fullbleed .caption {
  position: absolute;
  bottom: 60px;
  left: 120px;
  font-size: 24px;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
```

### Statement Slide
```css
.slide-statement {
  width: 1920px;
  height: 1080px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: black;
  color: white;
}

.slide-statement h1 {
  font-size: clamp(80px, 10vw, 160px);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.03em;
  max-width: 1400px;
}
```

### Data Reveal Slide
```css
.slide-data {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
}

.big-number {
  font-size: 240px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, oklch(0.70 0.25 270), oklch(0.65 0.25 330));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.big-number-label {
  font-size: 36px;
  font-weight: 400;
  color: oklch(0.70 0 0);
  margin-top: 24px;
}
```

## When to Use
Product launches, tech keynotes, visually dramatic presentations where impact matters.

## Key Takeaway
The key to keynote-style slides is extreme contrast: huge vs tiny, bright vs dark, image vs text. The drama comes from the contrast, not from decoration.
