# Design Quality Checklist

> **Load when:** Every design review (auto-run), final delivery, quality audit
> **Skip when:** Never (always check)
> **Why it matters:** Catches objective quality issues that subjective reviews miss
> **Typical failure it prevents:** Accessibility violations, inconsistency, cognitive overload, AI slop

This document provides objective, measurable quality checks. Unlike principle-based review (subjective judgment) or 5-dimension review (holistic scoring), this is a binary pass/fail checklist.

---

## How to Use This Checklist

1. **Run on every design review** — This is Layer 3 (automated checks)
2. **Check each item** — Pass ✅ or Fail ❌
3. **Document failures** — Note which items failed and severity
4. **Fix before shipping** — All Critical items must pass

**Severity levels:**
- **Critical**: Must fix (blocks shipping)
- **High**: Should fix (degrades experience)
- **Medium**: Nice to fix (polish)
- **Low**: Optional (edge case)

---

## Category 1: Accessibility (WCAG AA Compliance)

### 1.1 Color Contrast

**Rule:** Text contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text ≥18px or 14px bold)

**Check:**
- [ ] Body text contrast ≥ 4.5:1
- [ ] Heading text contrast ≥ 3:1 (if ≥18px)
- [ ] Link text contrast ≥ 4.5:1
- [ ] Button text contrast ≥ 4.5:1
- [ ] Placeholder text contrast ≥ 4.5:1
- [ ] Disabled text contrast ≥ 3:1 (if must be visible)

**How to check:**
```
Use contrast checker: https://webaim.org/resources/contrastchecker/
Or browser DevTools: Inspect element → Accessibility panel
```

**Common failures:**
- Light gray text on white background (2.8:1)
- Yellow text on white background (1.1:1)
- Placeholder text too light (2.5:1)

**Severity:** Critical (WCAG AA requirement)

---

### 1.2 Touch Targets

**Rule:** Interactive elements ≥ 44×44px (WCAG 2.1 Level AAA, iOS HIG, Material Design)

**Check:**
- [ ] Buttons ≥ 44×44px
- [ ] Links ≥ 44×44px (or adequate padding)
- [ ] Form inputs ≥ 44px height
- [ ] Checkboxes/radio buttons ≥ 44×44px (including padding)
- [ ] Icon buttons ≥ 44×44px
- [ ] Tap targets have ≥ 8px spacing between them

**How to check:**
```
Measure in design tool (Figma/Sketch)
Or use browser DevTools: Inspect element → Box model
```

**Common failures:**
- Icon-only buttons 24×24px (too small)
- Close buttons 32×32px (too small)
- Links with no padding (hard to tap)

**Severity:** Critical (usability blocker on mobile)

---

### 1.3 Typography Readability

**Rule:** Line height ≥ 1.5 for body text (WCAG 1.4.12)

**Check:**
- [ ] Body text line-height ≥ 1.5
- [ ] Paragraph spacing ≥ 2× font size
- [ ] Letter spacing adjustable (not fixed)
- [ ] Word spacing adjustable (not fixed)
- [ ] Line length 45-75 characters (optimal readability)

**How to check:**
```
Measure in design tool or browser DevTools
Line length: count characters in one line
```

**Common failures:**
- Line height 1.2 (too tight)
- Line length 120+ characters (too long)
- No paragraph spacing

**Severity:** High (readability issue)

---

### 1.4 Color Independence

**Rule:** Color is not the sole indicator of information

**Check:**
- [ ] Links distinguishable without color (underline, icon, etc.)
- [ ] Error states have icon + text (not just red color)
- [ ] Success states have icon + text (not just green color)
- [ ] Required fields marked with * or "Required" (not just red color)
- [ ] Charts/graphs have patterns or labels (not just color-coded)

**Common failures:**
- Links only distinguished by color (no underline)
- Error messages only in red (no icon)
- Form validation only by border color

**Severity:** Critical (accessibility blocker for colorblind users)

---

### 1.5 Keyboard Navigation

**Rule:** All interactive elements accessible via keyboard

**Check:**
- [ ] Tab order logical (top-to-bottom, left-to-right)
- [ ] Focus indicators visible (not removed with outline: none)
- [ ] Skip links for long navigation
- [ ] Modal dialogs trap focus (can't tab out)
- [ ] Dropdown menus keyboard-accessible

**How to check:**
```
Tab through the interface
Shift+Tab to go backwards
Enter/Space to activate
Esc to close modals
```

**Common failures:**
- No focus indicators (outline: none without replacement)
- Illogical tab order
- Can't close modal with Esc

**Severity:** Critical (accessibility blocker for keyboard users)

---

## Category 2: Cognitive Load (Miller's Law)

### 2.1 Information Chunking

**Rule:** ≤ 7 items per group (Miller's Law: 7±2)

**Check:**
- [ ] Navigation menu ≤ 7 items
- [ ] Form sections ≤ 7 fields per section
- [ ] Dashboard widgets ≤ 7 per screen
- [ ] List items grouped (not 20+ flat items)
- [ ] Dropdown options ≤ 7 (or grouped/searchable)

**Common failures:**
- Navigation with 12 items (overwhelming)
- Form with 15 fields on one page (cognitive overload)
- Dashboard with 10+ widgets (can't focus)

**Severity:** High (usability issue)

---

### 2.2 Visual Hierarchy

**Rule:** Clear hierarchy with ≥ 3 levels (title, subtitle, body)

**Check:**
- [ ] Title ≥ 3× body text size
- [ ] Subtitle ≥ 1.5× body text size
- [ ] 3-4 clear hierarchy levels (not all same size)
- [ ] Whitespace separates sections
- [ ] Visual weight matches content importance

**How to check:**
```
Squint test: squint your eyes, hierarchy should still be clear
Measure font sizes: title/body ratio ≥ 3
```

**Common failures:**
- Title 20px, body 16px (1.25× ratio, too small)
- All text same size
- No whitespace between sections

**Severity:** High (clarity issue)

---

### 2.3 Progressive Disclosure

**Rule:** Show only relevant information at each step

**Check:**
- [ ] Advanced options hidden by default
- [ ] Multi-step forms (not all fields at once)
- [ ] Expandable sections for details
- [ ] Tooltips for explanations (not inline text)
- [ ] No information dumping (all 20 features on one screen)

**Common failures:**
- All 20 settings visible at once
- Single-page form with 30 fields
- No "Show more" for long lists

**Severity:** Medium (usability issue)

---

## Category 3: Consistency

### 3.1 Spacing System

**Rule:** Spacing follows 8px grid (or 4px for fine-tuning)

**Check:**
- [ ] All spacing values are multiples of 8px (8, 16, 24, 32, 48, 64)
- [ ] Consistent spacing for similar elements
- [ ] No random values (13px, 19px, 27px)
- [ ] Padding consistent across components
- [ ] Margin consistent across sections

**How to check:**
```
Measure spacing in design tool
Check CSS: margin, padding values
```

**Common failures:**
- Random spacing (13px, 19px, 27px, 31px)
- Inconsistent button padding
- No spacing system

**Severity:** High (consistency issue)

---

### 3.2 Color Palette

**Rule:** ≤ 3 primary colors + neutrals

**Check:**
- [ ] 1 primary color (brand)
- [ ] 1-2 accent colors (secondary, tertiary)
- [ ] Grayscale for text/backgrounds (5-7 shades)
- [ ] Semantic colors (success, warning, error, info)
- [ ] No random colors outside palette

**Common failures:**
- 5+ primary colors (no clear hierarchy)
- Random colors (not from palette)
- Too many shades (10+ grays)

**Severity:** High (consistency issue)

---

### 3.3 Typography System

**Rule:** ≤ 2 font families, modular scale for sizes

**Check:**
- [ ] 1 font family for UI (or 1 for headings + 1 for body)
- [ ] Font sizes follow modular scale (1.25, 1.5, or 1.618 ratio)
- [ ] ≤ 7 font sizes total
- [ ] Consistent font weights (400, 600, 700)
- [ ] No random font sizes (17px, 19px, 23px)

**How to check:**
```
List all font sizes used
Check if they follow a ratio (e.g., 16, 20, 25, 31, 39, 49)
```

**Common failures:**
- 3+ font families
- Random font sizes (17px, 19px, 23px)
- 10+ font sizes

**Severity:** High (consistency issue)

---

### 3.4 Component Consistency

**Rule:** Same component looks the same everywhere

**Check:**
- [ ] All primary buttons same style
- [ ] All secondary buttons same style
- [ ] All form inputs same style
- [ ] All cards same style
- [ ] All modals same style

**Common failures:**
- Primary button blue on page 1, green on page 2
- Form inputs different heights
- Cards with different border radius

**Severity:** High (consistency issue)

---

## Category 4: Anti-AI Slop

### 4.1 Visual Clichés

**Rule:** Avoid overused AI-generated imagery

**Check:**
- [ ] No gradient spheres/orbs
- [ ] No digital rain / matrix effect
- [ ] No generic circuit boards
- [ ] No robot faces / humanoid robots
- [ ] No abstract "tech" backgrounds (blue particles, glowing lines)
- [ ] No low-poly geometric shapes (unless brand-appropriate)

**Common failures:**
- Gradient sphere to represent AI
- Blue circuit board background
- Matrix-style digital rain

**Severity:** Medium (originality issue)

---

### 4.2 Typography Clichés

**Rule:** Avoid overused fonts

**Check:**
- [ ] Not using Poppins for everything
- [ ] Not using Montserrat for everything
- [ ] Not using Roboto for everything (unless Material Design)
- [ ] Font choice matches brand personality
- [ ] Not using "tech startup" font stack by default

**Common failures:**
- Poppins for every project (no differentiation)
- Default to Montserrat without considering alternatives

**Severity:** Low (originality issue)

---

### 4.3 Animation Clichés

**Rule:** Avoid unnecessary showoff animations

**Check:**
- [ ] No 2-second animations on every interaction
- [ ] No parallax scrolling for the sake of it
- [ ] No particle effects (unless brand-appropriate)
- [ ] No "floating" elements (unless functional)
- [ ] Animations serve purpose (feedback, guidance, delight)

**Common failures:**
- 2-second fade-in on every element
- Parallax scrolling that makes users dizzy
- Floating shapes that distract from content

**Severity:** Medium (usability issue)

---

### 4.4 Layout Clichés

**Rule:** Avoid generic templates

**Check:**
- [ ] Not using "hero section + 3 features + testimonials + CTA" template
- [ ] Not using "centered logo + hamburger menu" without considering alternatives
- [ ] Layout serves content (not template-driven)
- [ ] Unique structure (not Wix/Squarespace template)

**Common failures:**
- Every landing page looks the same
- Template-driven design (not content-driven)

**Severity:** Low (originality issue)

---

## Category 5: Edge Cases

### 5.1 Content Variations

**Rule:** Design handles content variations gracefully

**Check:**
- [ ] Works with 1 character (minimum)
- [ ] Works with 1000 characters (maximum)
- [ ] Works with no content (empty state)
- [ ] Works with special characters (emoji, accents, CJK)
- [ ] Works with long words (German, Finnish)

**Common failures:**
- Layout breaks with long text
- No empty state
- Emoji breaks layout

**Severity:** High (scalability issue)

---

### 5.2 Interaction States

**Rule:** All interactive elements have all states

**Check:**
- [ ] Default state
- [ ] Hover state
- [ ] Active/pressed state
- [ ] Focus state (keyboard)
- [ ] Disabled state
- [ ] Loading state
- [ ] Error state
- [ ] Success state

**Common failures:**
- No hover state
- No disabled state
- No loading state (button just freezes)

**Severity:** High (usability issue)

---

### 5.3 Responsive Design

**Rule:** Works on mobile, tablet, desktop

**Check:**
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Touch-friendly on mobile (44×44px targets)
- [ ] Readable on small screens (no tiny text)

**Common failures:**
- Desktop-only design
- Text too small on mobile
- Touch targets too small

**Severity:** Critical (mobile users blocked)

---

## Output Format

After checking all items, produce this report:

```markdown
## Design Quality Checklist Report

### Summary
- **Total items:** 50
- **Passed:** 42 ✅
- **Failed:** 8 ❌
- **Pass rate:** 84%

### Failed Items (by severity)

#### Critical (must fix)
1. **[1.1] Color Contrast** — Body text 3.2:1 (need 4.5:1)
2. **[1.2] Touch Targets** — Close button 32×32px (need 44×44px)
3. **[5.3] Responsive Design** — No mobile layout

#### High (should fix)
4. **[2.2] Visual Hierarchy** — Title 20px, body 16px (1.25× ratio, need 3×)
5. **[3.1] Spacing System** — Random spacing (13px, 19px, 27px)
6. **[3.2] Color Palette** — 5 primary colors (need ≤3)

#### Medium (nice to fix)
7. **[4.1] Visual Clichés** — Gradient sphere for AI representation
8. **[4.3] Animation Clichés** — 2-second fade-in on every element

### Recommendation
**Fix 3 Critical + 3 High issues before shipping.**
Medium issues can be addressed in next iteration.
```

---

## Automation Potential

These checks can be automated:

**Fully automatable:**
- Color contrast (tools: axe, Lighthouse)
- Touch target size (tools: Lighthouse, custom script)
- Line height (tools: CSS linter)
- Spacing system (tools: CSS linter, design tokens validator)
- Font sizes (tools: CSS linter)

**Partially automatable:**
- Keyboard navigation (tools: axe, manual testing)
- Content variations (tools: visual regression testing)
- Responsive design (tools: Lighthouse, BrowserStack)

**Manual only:**
- Visual clichés (requires human judgment)
- Layout clichés (requires human judgment)
- Animation clichés (requires human judgment)

---

## Relationship to Other Documents

- **critique-guide.md**: 5-dimension quick review (subjective)
- **principle-review.md**: 10-principle review (strategic)
- **design-excellence.md**: Execution standards (how to implement)
- **anti-patterns/**: Detailed anti-pattern guides (what to avoid)

---

## Remember

1. **This is objective, not subjective** — Pass/fail based on measurable criteria
2. **Run on every review** — This is Layer 3 (always check)
3. **Critical items block shipping** — Must fix before delivery
4. **Automate where possible** — Use tools to catch issues early
5. **Combine with other reviews** — This complements, not replaces, subjective reviews

**A quality checklist catches objective issues that subjective reviews miss.**
