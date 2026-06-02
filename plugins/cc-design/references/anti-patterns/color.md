# Color Anti-Patterns

**Purpose:** Identify color mistakes that signal poor design judgment, not provide "correct" color schemes.

**Principle:** Color is about hierarchy, emotion, and brand. These anti-patterns break hierarchy or create visual chaos.

---

## 1. Rainbow Gradients

**Problem:** Full-spectrum gradients (purple → pink → blue → green) as backgrounds or primary elements.

**Why it fails:**
- No focal point — every hue competes for attention
- Signals "I discovered gradients and used all of them"
- Overused in AI-generated designs (the default AI aesthetic)
- Rarely serves brand or content — just decoration

**Real failure case:** Landing page with purple-to-blue mesh gradient covering 80% of viewport. The gradient was the loudest element on the page, drowning out the actual product.

**Boundary:** Gradients work when subtle (single hue, lightness shift) or when they're core to brand identity. Don't use gradients as default decoration.

---

## 2. Pure Black Text on Pure White

**Problem:** `#000000` text on `#FFFFFF` background (or vice versa).

**Why it fails:**
- Maximum contrast is harsh, not optimal — causes eye strain
- Real print and screens use near-black (`#1a1a1a`) and off-white (`#fafafa`)
- Signals inexperience — professionals know to soften extremes

**Boundary:** Use near-black and off-white for body text. Reserve pure black for emphasis (headlines, icons) and pure white for overlays on dark images.

---

## 3. Neon Accent Colors

**Problem:** Highly saturated accent colors (`hsl(210, 100%, 50%)`) used for buttons, links, or highlights.

**Why it fails:**
- Neon colors vibrate on screen — uncomfortable to look at
- Accessibility nightmare — often fails contrast requirements
- Signals "developer who never learned color theory"

**Real failure case:** SaaS dashboard with `#00ffff` (cyan) as primary button color. Buttons were unreadable and visually painful.

**Boundary:** Accent colors should be saturated enough to stand out, but not at 100% saturation. Aim for 60-80% saturation in HSL, or use oklch for perceptually uniform color.

---

## 4. Too Many Accent Colors

**Problem:** 3+ accent colors competing for attention (blue buttons, green success, red error, purple badges, orange highlights).

**Why it fails:**
- Destroys visual hierarchy — everything is "important"
- Creates visual noise
- Signals lack of restraint

**Real failure case:** Admin panel with 5 accent colors. Every action button was a different color. Users couldn't tell which actions were primary.

**Boundary:** One primary accent, one semantic set (success/warning/error). If you need more colors, you probably need better information architecture.

---

## 5. Low-Contrast Text

**Problem:** Light gray text on white background, or dark gray on black, failing WCAG contrast requirements.

**Why it fails:**
- Unreadable for users with low vision
- Looks "designed" but is functionally broken
- Signals prioritizing aesthetics over usability

**Boundary:** Body text must meet WCAG AA (4.5:1 contrast). Large text (18pt+) can use 3:1. Use browser DevTools to check contrast ratios.

---

## 6. Inverted Colors for Dark Mode

**Problem:** Taking light mode colors and inverting them (white → black, black → white) to create dark mode.

**Why it fails:**
- Saturation and contrast need adjustment, not just inversion
- Bright accent colors that work on white are blinding on black
- Signals "I didn't actually design dark mode, I just flipped it"

**Real failure case:** App with light mode using `#2563eb` (blue-600) for links. Dark mode inverted to white background and kept the same blue — links were nearly invisible.

**Boundary:** Dark mode requires re-tuning saturation, lightness, and contrast. If you can't do it properly, don't offer dark mode.

---

## 7. Brand Color Everywhere

**Problem:** Using brand color for every interactive element, every heading, every accent.

**Why it fails:**
- Brand color loses meaning when overused
- Creates monotony
- Signals "I only know one color"

**Boundary:** Brand color is for primary actions and brand moments (logo, hero, CTA). Use neutral grays for secondary UI. Reserve brand color for emphasis.

---

## 8. Fabricated Brand Colors

**Problem:** Guessing or inventing brand colors instead of extracting them from real assets.

**Why it fails:**
- Brand colors are precise — `#1a73e8` is not the same as `#0066ff`
- Off-brand colors break brand consistency
- Signals laziness or lack of process

**Real failure case:** Designer "remembered" a brand's blue as `#0080ff`. Actual brand blue was `#0052cc`. Client rejected the entire design.

**Boundary:** Always extract colors from real brand assets (logo SVG, website, brand guidelines). Use `grep -hoE '#[0-9A-Fa-f]{6}'` or color picker tools. Never guess.

---

## Quick Checklist

Before finalizing colors, ask:

- **Is there a gradient?** If yes, is it subtle or is it the loudest thing on the page?
- **Is text readable?** Check contrast ratios with DevTools.
- **How many accent colors?** If more than 2, can you consolidate?
- **Is brand color overused?** Reserve it for primary actions.
- **Did you extract colors from real assets?** Never guess brand colors.
- **Is dark mode inverted or designed?** If inverted, don't ship it.

**Remember:** Color anti-patterns are about what NOT to do. Within these boundaries, you have infinite creative freedom.
