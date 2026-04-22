# Color Theory

**Purpose:** Foundation for using color effectively in digital products — hierarchy, emotion, brand, and systems.

**Principle:** Color is not decoration. Color is function. Every color decision should serve hierarchy, emotion, or brand identity.

---

## 1. Modern Color Spaces

### RGB is for Screens, Not Designers

**Problem:** RGB is device-dependent and not perceptually uniform.

**Why it fails:**
- `hsl(120, 50%, 50%)` and `hsl(240, 50%, 50%)` have the same saturation value but look very different
- Adjusting lightness in HSL doesn't preserve perceived brightness
- Color mixing is unpredictable

**Use OKLCH instead (2024+ standard):**

```css
/* Perceptually uniform — same L = same perceived brightness */
oklch(0.5 0.15 250)  /* muted blue */
oklch(0.5 0.15 150)  /* muted green — same perceived brightness */
```

**Benefits:**
- Lightness (L) is perceptually uniform
- Chroma (C) is saturation that works across hues
- Hue (H) is the actual color wheel

**Migration path:**
- Design in OKLCH if your tool supports it (Figma 2024+, CSS Color Level 4)
- Fall back to HSL if needed, but be aware of its limitations
- Never rely on RGB hex values for color relationships

---

## 2. Semantic Color Systems

### Function Over Form

**Principle:** Colors in digital products should be semantic, not decorative.

**Semantic structure:**

```javascript
// Base colors — neutral palette
neutral: {
  50:  '#fafafa',  // off-white backgrounds
  100: '#f5f5f5',  // subtle backgrounds
  200: '#e5e5e5',  // borders
  300: '#d4d4d4',  // disabled borders
  400: '#a3a3a3',  // placeholder text
  500: '#737373',  // secondary text
  600: '#525252',  // primary text
  700: '#404040',  // emphasized text
  800: '#262626',  // near-black
  900: '#171717',  // pure black substitute
}

// Brand colors — identity
primary: '#0066ff',   // brand blue
primaryLight: '#3385ff',
primaryDark: '#0052cc',

// Semantic colors — meaning
success: '#10b981',   // green
warning: '#f59e0b',   // amber
error: '#ef4444',     // red
info: '#3b82f6',      // blue
```

**Rules:**
- Neutral palette carries 80% of UI weight
- Brand color is used sparingly (10-15% of interface)
- Semantic colors have fixed meanings — don't repurpose error red for something else

---

## 3. Color Hierarchy

### Three-Tier System

**Tier 1: Neutral (Background)**
- Purpose: Canvas for content
- Usage: 70-80% of interface
- Examples: White, off-white, near-black, dark grays
- Rule: Should be "invisible" — user shouldn't notice it

**Tier 2: Secondary (Structure)**
- Purpose: Organize content, show relationships
- Usage: 15-20% of interface
- Examples: Borders, dividers, secondary text, backgrounds
- Rule: Should be visible but not compete with content

**Tier 3: Accent (Emphasis)**
- Purpose: Draw attention to actions and information
- Usage: 5-10% of interface
- Examples: Primary buttons, links, badges, notifications
- Rule: Use sparingly — overuse = no emphasis

**Test:** If you squint at your design, can you instantly identify the 3 accent elements? If not, you have too many.

---

## 4. Contrast & Readability

### WCAG Standards (Minimum)

**Text contrast:**
- Normal text (< 18pt): 4.5:1 minimum (AA), 7:1 enhanced (AAA)
- Large text (≥ 18pt or bold 14pt): 3:1 minimum (AA), 4.5:1 enhanced (AAA)
- UI components: 3:1 minimum (icons, borders)

**Tools:**
- Chrome DevTools: Color picker shows contrast ratio
- Figma: Plugin "Contrast" (by Figma)
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

### Beyond Compliance

**WCAG is minimum, not optimal.**

**Best practices:**
- Body text: 7:1 or higher for extended reading
- Headlines: 4.5:1 is fine, but higher is better for impact
- Disabled states: Don't just lower opacity — use a lighter color
- Dark mode: Reduce overall contrast, not just invert

**Real-world example:**
```
❌ Bad: #666666 on white (3.8:1 — fails WCAG)
✅ Good: #525252 on white (7.2:1 — AAA)
✅ Better: #404040 on white (10.1:1 — excellent)
```

---

## 5. Dark Mode Color Systems

### Not Just Inversion

**Principle:** Dark mode is a separate color system, not an inverted version of light mode.

**Common mistakes:**
- Pure black (`#000000`) backgrounds — harsh, causes OLED smearing
- Simply inverting lightness — loses depth and hierarchy
- Same accent colors — too bright on dark backgrounds

**Best practices (2024+):**

```javascript
// Dark mode base colors
dark: {
  background: '#0a0a0a',    // near-black, not pure black
  surface: '#171717',       // elevated surfaces
  border: '#262626',        // subtle borders
  textPrimary: '#fafafa',   // off-white, not pure white
  textSecondary: '#a3a3a3', // muted gray
}

// Dark mode accent colors — reduce saturation
primary: '#3385ff',   // lighter than light mode primary
success: '#34d399',   // shift toward lighter green
error: '#f87171',     // lighter, not as saturated
```

**Rules:**
- Use near-black (`#0a0a0a`, `#171717`) instead of pure black
- Reduce saturation of accent colors by 20-30%
- Add more intermediate gray steps for depth
- Test in actual dark environments, not just with developer tools

---

## 6. Color Psychology in Digital Products

### Functional Emotions

**Principle:** Color emotions are contextual. Red means "error" in forms but "hot deal" in e-commerce.

**Common associations (Western digital products):**

| Color | Primary Association | Secondary | When to Avoid |
|-------|-------------------|-----------|---------------|
| Blue | Trust, technology | Calm, professionalism | Food, luxury (overused) |
| Green | Success, growth | Nature, money | Finance (too common) |
| Red | Error, danger | Hot, urgent, love | Healthcare (alarm) |
| Yellow/Orange | Warning, attention | Energy, fun | Luxury, serious contexts |
| Purple | Premium, creative | Mystery, luxury | Finance, utilities |
| Black | Premium, modern | Serious, luxury | Children, healthcare |
| White | Clean, simple | Pure, medical | Luxury (can feel cheap) |

**Cultural considerations:**
- **Western:** White = purity, Black = death
- **Eastern:** White = death, Red = luck
- **Middle East:** Green = Islam, avoid dark green in secular contexts
- **Latin America:** Purple = death (avoid in branding)

**Rule:** When designing for global audiences, test color associations with local users.

---

## 7. Brand Color Systems

### Single Brand Color

**Most brands should have ONE primary brand color.**

**Why:**
- Recognition — one color is memorable
- Discipline — forces strategic color use
- Flexibility — can expand system later

**Examples:**
- Facebook: `#1877f2` (blue)
- Spotify: `#1db954` (green)
- Airbnb: `#ff385c` (coral/red)

**Brand color usage:**
- Logo and brand identity
- Primary CTAs (10-15% of interface)
- Key brand moments (hero, pricing highlight)
- Not for: secondary buttons, borders, backgrounds

### Brand Color Extensions

**When to add secondary brand colors:**
- Distinct product lines (e.g., Pro vs Enterprise)
- Seasonal campaigns (holiday branding)
- Sub-brands (company with multiple products)

**Rules for extensions:**
- Keep same saturation level as primary
- Maintain contrast ratio requirements
- Test for color blindness (deuteranopia, protanopia, tritanopia)

---

## 8. Gradient Best Practices (2024+)

### Subtle Over Showy

**Principle:** Gradients should enhance, not dominate.

**Good gradients (2024+ trends):**

```css
/* Single hue, lightness shift */
background: linear-gradient(135deg, #0066ff 0%, #3385ff 100%);

/* Subtle mesh gradient */
background: radial-gradient(at 0% 0%, rgba(0, 102, 255, 0.1) 0%, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0, 102, 255, 0.05) 0%, transparent 50%);

/* Accent gradient (for buttons, cards) */
background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
```

**Bad gradients (avoid):**
- Rainbow gradients (purple → pink → blue → green)
- Multiple competing hues
- High saturation gradients
- Gradients that make text hard to read

**When to use gradients:**
- Hero backgrounds (subtle, single hue)
- Button accents (brand color → lighter)
- Card backgrounds (very subtle, 5-10% opacity)
- Not for: body backgrounds, large sections, text

---

## 9. Color Accessibility (Beyond Contrast)

### Color Blindness

**Types:**
- Protanopia: Red-blind (1% of males)
- Deuteranopia: Green-blind (6% of males)
- Tritanopia: Blue-blind (rare)
- Achromatopsia: Total color blindness (very rare)

**Testing tools:**
- Chrome DevTools: Rendering → Emulate vision deficiencies
- Figma: Plugin "Sim Daltonism"
- WebAIM: https://webaim.org/resources/contrastchecker/

**Best practices:**
- Don't rely on color alone for meaning (use icons + text)
- Test with color blindness simulators
- Provide alternative indicators (patterns, labels)
- Avoid red/green as the only differentiation

**Example:**

```javascript
// ❌ Bad: color only
<span style="color: green">Success</span>
<span style="color: red">Error</span>

// ✅ Good: color + icon
<span style="color: green">✓ Success</span>
<span style="color: red">✕ Error</span>

// ✅ Better: color + icon + text
<span class="success-icon" aria-label="Success">✓</span>
<span class="error-icon" aria-label="Error">✕</span>
```

---

## 10. Creating Color Palettes

### Step-by-Step Process

**Step 1: Start with brand color**
```
Primary: #0066ff (oklch(0.55 0.2 250))
```

**Step 2: Create neutral palette (shades of gray)**
```
50:  #fafafa (oklch(0.98 0 0))
100: #f5f5f5 (oklch(0.95 0 0))
200: #e5e5e5 (oklch(0.90 0 0))
300: #d4d4d4 (oklch(0.84 0 0))
400: #a3a3a3 (oklch(0.68 0 0))
500: #737373 (oklch(0.50 0 0))
600: #525252 (oklch(0.38 0 0))
700: #404040 (oklch(0.30 0 0))
800: #262626 (oklch(0.20 0 0))
900: #171717 (oklch(0.14 0 0))
```

**Step 3: Create semantic colors (fixed meanings)**
```
success: #10b981 (oklch(0.60 0.15 145))
warning: #f59e0b (oklch(0.70 0.15 85))
error:   #ef4444 (oklch(0.60 0.20 25))
info:    #3b82f6 (oklch(0.60 0.20 250))
```

**Step 4: Create brand color scale (light/dark variants)**
```
primaryLight:  #3385ff (oklch(0.65 0.18 250))
primary:       #0066ff (oklch(0.55 0.20 250))
primaryDark:   #0052cc (oklch(0.45 0.22 250))
```

**Step 5: Test contrast ratios**
```
All text on backgrounds must meet WCAG AA (4.5:1)
All UI components must meet 3:1
```

**Step 6: Test in context**
```
Create a sample UI with all colors
Test in light mode
Test in dark mode
Test with color blindness simulator
```

---

## 11. Common Color Mistakes

### 1. Too Many Colors

**Problem:** 5+ accent colors competing for attention.

**Solution:** One primary accent, one semantic set. If you need more, fix your information architecture.

### 2. Pure Black/White

**Problem:** `#000000` and `#FFFFFF` are harsh on screens.

**Solution:** Use near-black (`#171717`) and off-white (`#fafafa`).

### 3. Low Contrast Text

**Problem:** Light gray text (`#999`) on white fails WCAG.

**Solution:** Never use lighter than `#525252` on white for body text.

### 4. Inverted Dark Mode

**Problem:** Taking light colors and inverting for dark mode.

**Solution:** Design dark mode separately — reduce saturation, adjust lightness.

### 5. Brand Color Everywhere

**Problem:** Using brand color for every interactive element.

**Solution:** Reserve brand color for primary actions (10-15% of interface).

### 6. Guessing Brand Colors

**Problem:** "Remembering" a brand color instead of extracting it.

**Solution:** Always extract from real assets (SVG logo, website, brand guidelines).

---

## 12. Color Tools & Resources

**Color picker & conversion:**
- OKLCH picker: https://oklch.com/
- Color converter: https://www.littlewebtools.com/color-converter/
- Contrast checker: https://webaim.org/resources/contrastchecker/

**Design tools:**
- Figma: Native OKLCH support (2024+)
- Adobe Color: https://color.adobe.com/
- Coolors: https://coolors.co/

**Inspiration:**
- Refactoring UI: https://refactoringui.com/
- Tailwind CSS Colors: https://tailwindcss.com/docs/customizing-colors
- Radix Colors: https://www.radix-ui.com/docs/colors

**Testing:**
- Chrome DevTools: Color picker with contrast ratio
- Figma Plugin: "Contrast"
- WebAIM: Contrast checker and color blindness simulator

---

## Quick Checklist

Before finalizing colors:

- **Did you test contrast ratios?** All text must meet WCAG AA (4.5:1)
- **Is there a clear color hierarchy?** Neutral → Secondary → Accent
- **Is brand color used sparingly?** Should be 10-15% of interface
- **Did you test dark mode separately?** Not just inverted
- **Did you test for color blindness?** Use simulators
- **Are colors semantic?** Success = green, Error = red (consistently)
- **Did you extract brand colors from real assets?** Never guess
- **Are gradients subtle?** If they're the loudest thing, remove them

**Remember:** Color theory is about what TO do. Color anti-patterns are about what NOT to do. You need both.

---

## Further Reading

- OKLCH specification: https://oklch.com/
- WCAG 2.1 contrast requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Refactoring UI (Adam Wathan & Steve Schoger): https://refactoringui.com/
- A List Apart: Color theory for web design: https://alistapart.com/article/living-in-a-browser/
- MDN: CSS Color Module Level 4: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
