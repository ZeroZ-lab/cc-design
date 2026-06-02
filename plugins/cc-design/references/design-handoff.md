# Design Handoff Guide

**Purpose:** Complete guide to transferring designs from design tools to development — specs, assets, collaboration, and workflow.

**Principle:** Design handoff is not a file transfer. It's a collaboration process that ensures designs are implemented accurately and efficiently.

---

## 1. Why Design Handoff Matters

### The Business Impact

**Principle:** Poor handoff = implementation gaps = rework + delays + frustrated developers.**

**Impact:**
- **Speed:** Good handoff reduces back-and-forth by 50-70%
- **Accuracy:** Clear specs prevent implementation errors
- **Relationship:** Smooth handoff builds trust between design and engineering
- **Consistency:** Proper design tokens ensure system-wide consistency

**The reality:**
Developers are not mind readers. If it's not specified, they'll guess — and guesses are often wrong. Good handoff is proactive, not reactive.

---

## 2. Handoff Deliverables

### Design Specifications

**Principle:** Specs should answer every implementation question without requiring a meeting.**

**Essential specs:**
1. **Layout:**
   - Spacing (margins, padding, gaps)
   - Dimensions (width, height, max-width)
   - Position (absolute, relative, flex, grid)
   - Responsive breakpoints (375px, 768px, 1024px, 1440px)

2. **Typography:**
   - Font family and weights
   - Font sizes (line-height included)
   - Line heights and letter spacing
   - Text colors (with hover/active states)

3. **Colors:**
   - All color values (hex, RGB, or tokens)
   - Gradient definitions (if any)
   - Dark mode variants
   - Semantic color names (primary, success, error)

4. **Components:**
   - Component structure (nested elements)
   - Props/variants (size, state, type)
   - Interaction states (hover, active, focus, disabled)
   - Animation/transition specs

5. **Assets:**
   - Icons (SVG preferred, PNG fallback)
   - Images (optimized formats, sizes)
   - Export settings (scale, format, compression)

6. **Behavior:**
   - Hover effects (color change, shadow, transform)
   - Transitions (duration, easing, delay)
   - Micro-interactions (loading, success, error)
   - Animation specs (keyframes, timing)

### Interaction Specifications

**Principle:** Define behavior, not just appearance.**

**Specify:**
- **Click actions:** What happens when clicked?
- **Hover states:** What changes on hover?
- **Focus states:** What does focus look like? (keyboard accessibility)
- **Loading states:** What shows while loading?
- **Error states:** What shows on error?
- **Empty states:** What shows when no data?
- **Success feedback:** How do users know it worked?

**Example spec:**
```
Primary Button:
- Default: Blue background (#0066FF), white text
- Hover: Darker blue (#0052CC), subtle lift (translateY(-2px))
- Active: Pressed down (translateY(0)), darker blue
- Focus: Blue outline (#0066FF), 2px, offset 2px
- Disabled: Gray background (#D4D4D4), not interactive
- Loading: Spinner replaces text, button stays same size
```

### Responsive Specifications

**Principle:** Design mobile-first, specify all breakpoints.**

**Breakpoints:**
```
Mobile: 375px - 767px
Tablet: 768px - 1023px
Desktop: 1024px - 1439px
Wide: 1440px+
```

**Specify for each breakpoint:**
- Layout changes (stacking, hiding elements)
- Font size adjustments
- Image sizes and crops
- Navigation changes (hamburger menu vs. full nav)
- Touch target sizes (44×44px minimum on mobile)

---

## 3. Handoff Tools

### Figma Handoff

**Dev Mode (2024+ standard):**

**Features:**
- **Inspect:** Click any element to see CSS, iOS, and Android code
- **Measurements:** Distances, sizes, spacing between elements
- **Export:** Assets at multiple scales (1x, 2x, 3x)
- **Code Connect:** Links design to actual code components
- **Comments:** Context-specific discussion threads

**Best practices:**
- **Organize pages:** Separate designs by screen/user flow
- **Name layers:** Use semantic names (not "Rectangle 1")
- **Group elements:** Use frames for components, auto-layout for structure
- **Add comments:** Explain non-obvious decisions
- **Pin comments:** Use pins for specific element discussions

**Figma Code Connect:**

Links Figma components to code components in your design system.

**Benefits:**
- Shows actual code in Dev Mode (not just CSS approximations)
- Ensures consistency between design and code
- Reduces implementation errors
- Speeds up development (copy-paste real code)

**Example setup:**
```tsx
// figma-connect.tsx
import figma from '@figma/code-connect'
import { Button } from './Button'

figma.connect(Button, 'https://figma.com/file/abc123', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ variant, size, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      Click me
    </Button>
  ),
})
```

### Zeplin

**Legacy handoff tool (less common in 2024+):**

**Features:**
- Design specs with measurements
- Styleguides and code snippets
- Assets export
- Version history
- Project management

**When to use:** If your team already uses it. Figma Dev Mode has largely replaced Zeplin.

### Storybook with Design Integration

**Combining design documentation with live components:**

**Benefits:**
- Single source of truth for components
- Live code examples
- Design documentation + implementation in one place
- Easy to keep in sync

**Setup:**
```tsx
// Button.stories.tsx
import type { StoryParameters } from '@figma/code-connect'
import { Button } from './Button'

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://figma.com/file/abc123/Design?node-id=1:456',
      props: {
        variant: figma.enum('Variant', {
          Primary: 'primary',
          Secondary: 'secondary',
        }),
        disabled: figma.boolean('Disabled'),
      },
      examples: [
        (props) => <Button variant={props.variant} disabled={props.disabled}>Click me</Button>,
      ],
      links: [
        { name: 'Documentation', url: 'https://docs.example.com/button' },
      ],
    },
  } satisfies StoryParameters,
}
```

---

## 4. Design Tokens

### What Are Design Tokens?

**Principle:** Design tokens are the visual atoms of your design system — stored as variables, used in code.**

**Examples:**
```javascript
// tokens.js
export const tokens = {
  color: {
    primary: '#0066FF',
    primaryHover: '#0052CC',
    success: '#10B981',
    error: '#EF4444',
    text: '#171717',
    textSecondary: '#525252',
    background: '#FFFFFF',
    border: '#E5E5E5',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontSize: {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
}
```

### Benefits of Design Tokens

**1. Consistency:**
Same values used everywhere — no more "slightly different blue"

**2. Maintainability:**
Update token, change propagates everywhere

**3. Platform-agnostic:**
Same tokens for web, iOS, Android

**4. Theming:**
Easy dark mode, multiple brands

**5. Documentation:**
Tokens serve as living style guide

### Implementing Design Tokens

**Web (CSS variables):**
```css
:root {
  --color-primary: #0066FF;
  --spacing-md: 16px;
  --font-size-md: 16px;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
}
```

**React (with tokens):**
```jsx
import { tokens } from './tokens'

<Button
  backgroundColor={tokens.color.primary}
  padding={tokens.spacing.md}
>
  Click me
</Button>
```

**Figma (with Design Tokens plugin):**
- Sync tokens from code to Figma
- Use tokens in designs
- Stay in sync automatically

---

## 5. Asset Preparation

### Icon Export

**Principle:** SVG for everything, PNG as fallback.**

**SVG export settings:**
- **Format:** SVG
- **Outline stroke:** Convert to outlines
- **Simplify:** Remove unnecessary points
- **Optimize:** Run through SVGO or similar
- **Size:** Typically 24×24px (scalable)

**PNG fallback (when needed):**
- **Format:** PNG-24 (supports transparency)
- **Scale:** 1x, 2x, 3x (for retina displays)
- **Compression:** Optimize with TinyPNG or similar

**Naming convention:**
```
icon-name.svg
icon-name@1x.png
icon-name@2x.png
icon-name@3x.png
```

### Image Export

**Principle:** Provide multiple formats and sizes for optimal loading.**

**Formats:**
- **WebP:** Modern, great compression (use as primary)
- **JPEG:** Photos (fallback)
- **PNG:** Graphics with transparency (fallback)

**Sizes:**
```
image-small.webp   (400px wide, mobile)
image-medium.webp  (800px wide, tablet)
image-large.webp   (1200px wide, desktop)
```

**Export checklist:**
- [ ] Optimized file size (use ImageOptim, Squoosh)
- [ ] Progressive JPEG (if using JPEG)
- [ ] Correct aspect ratios
- [ ] Alt text documented
- [ ] Responsive sizes specified

### Asset Organization

**Folder structure:**
```
/assets
  /icons
    /actions
      icon-edit.svg
      icon-delete.svg
    /navigation
      icon-home.svg
      icon-menu.svg
  /images
    /hero
      hero-home.webp
      hero-home@2x.webp
    /avatars
      avatar-1.webp
  /logos
    logo-primary.svg
    logo-icon.svg
```

---

## 6. Collaboration Workflow

### Before Handoff

**Designer responsibilities:**
- [ ] Review designs for consistency (spacing, colors, typography)
- [ ] Check all breakpoints (mobile, tablet, desktop)
- [ ] Define all interaction states (hover, active, focus, disabled)
- [ ] Name all layers and groups clearly
- [ ] Add comments for non-obvious decisions
- [ ] Prepare assets (icons, images, logos)
- [ ] Document animations and transitions
- [ ] Run accessibility check (contrast, focus states)

### During Development

**Communication channels:**
- **Design tools:** Figma comments (context-specific)
- **Slack/Teams:** Quick questions, clarifications
- **Issue tracker:** Bug reports, feature requests
- **Design reviews:** Regular syncs to review implementation

**Designer availability:**
- Be responsive (same-day replies)
- Join standups during active development
- Review PRs that touch design
- Test implementations before they ship

**Developer responsibilities:**
- Ask questions early (don't guess)
- Flag ambiguities in specs
- Suggest simplifications if implementation is complex
- Share progress regularly (screenshots, demos)
- Test on real devices (not just browser dev tools)

### After Implementation

**Design QA (Quality Assurance):**

**Checklist:**
- [ ] Visual accuracy (spacing, colors, typography match specs)
- [ ] All interaction states work (hover, active, focus, disabled)
- [ ] Responsive design works at all breakpoints
- [ ] Animations and transitions match specs
- [ ] Accessibility works (keyboard navigation, screen reader)
- [ ] Edge cases handled (long text, empty states, errors)
- [ ] Performance acceptable (load times, animation smoothness)

**When issues are found:**
1. **Document:** Create issue with screenshot and spec reference
2. **Prioritize:** Severity (critical, serious, minor)
3. **Fix:** Developer updates implementation
4. **Verify:** Designer signs off

---

## 7. Common Handoff Mistakes

### 1. Ambiguous Specs

**Problem:** "Make it pop", "more space here", "better alignment"

**Solution:** Use specific values: "Add 16px padding", "Center-align text", "Increase contrast to 4.5:1"

### 2. Missing States

**Problem:** Only default state designed, no hover/error/loading

**Solution:** Design all states: Default, Hover, Active, Focus, Disabled, Loading, Error, Empty

### 3. Inconsistent Naming

**Problem:** Figma layers don't match component names in code

**Solution:** Use semantic naming convention across design and code (e.g., `PrimaryButton` in both)

### 4. No Responsive Specs

**Problem:** Only desktop design provided

**Solution:** Design and specify all breakpoints (mobile-first approach)

### 5. Ignoring Accessibility

**Problem:** No focus states, low contrast, no alt text

**Solution:** Design for accessibility from the start (focus states, 4.5:1 contrast, semantic HTML)

### 6. Late Changes

**Problem:** Design changes after development started

**Solution:** Freeze designs before handoff. If changes are necessary, communicate immediately and assess impact.

### 7. Over-Specifying

**Problem:** Specifying implementation details instead of outcomes

**Solution:** Specify what, not how. Example: "Button should lift on hover" not "Use transform: translateY(-2px)"

---

## 8. Handoff Checklist

### Design Preparation
- [ ] All breakpoints designed (mobile, tablet, desktop)
- [ ] All states designed (default, hover, active, focus, disabled)
- [ ] All edge cases covered (loading, error, empty)
- [ ] Layers and groups named clearly
- [ ] Assets prepared (icons, images, logos)
- [ ] Interactions documented (animations, transitions)
- [ ] Accessibility checked (contrast, focus, keyboard)

### Documentation
- [ ] Layout specs (spacing, dimensions, positioning)
- [ ] Typography specs (fonts, sizes, line-heights, colors)
- [ ] Color specs (all colors, dark mode variants)
- [ ] Component specs (props, variants, structure)
- [ ] Behavior specs (hover, click, loading, error)
- [ ] Responsive specs (breakpoints, layout changes)
- [ ] Asset list (icons, images, formats, sizes)

### Communication
- [ ] Share designs with development team
- [ ] Schedule handoff meeting (if complex)
- [ ] Set expectations for timeline and availability
- [ ] Establish communication channels (Slack, Figma comments)
- [ ] Clarify process for questions and issues

### Post-Handoff
- [ ] Be available for questions (respond same-day)
- [ ] Review implementation before it ships
- [ ] Test on real devices (not just dev tools)
- [ ] Document learnings for next handoff
- [ ] Sign off on implementation or create issues

---

## 9. Measuring Handoff Success

### Metrics

**Speed:**
- Time from handoff to implementation complete
- Number of back-and-forth rounds
- Time to resolve questions

**Accuracy:**
- Number of design bugs found in QA
- Visual deviation from specs (subjective 1-5 rating)
- Number of clarification questions

**Satisfaction:**
- Developer satisfaction (survey 1-5)
- Designer satisfaction (survey 1-5)
- Relationship quality (qualitative feedback)

### Benchmarks

**Good handoff:**
- <5 clarification questions per component
- <2 rounds of revisions
- Design bugs <10% of total issues
- Developer satisfaction 4+/5

**Needs improvement:**
- >10 clarification questions per component
- >3 rounds of revisions
- Design bugs >25% of total issues
- Developer satisfaction <3/5

---

## 10. Design System Integration

### Living Design System

**Principle:** Design system is the bridge between design and development.**

**Benefits:**
- Single source of truth for components
- Pre-built components = faster implementation
- Consistency guaranteed
- Documentation embedded

**Workflow:**
1. **Design:** Create component in Figma
2. **Spec:** Add to design system (Storybook, Zeroheight, etc.)
3. **Implement:** Build component in code
4. **Link:** Connect Figma to code (Code Connect)
5. **Document:** Add usage guidelines and examples
6. **Maintain:** Update in one place, sync everywhere

### Component-First Handoff

**Instead of handing off pages, hand off components:**

**Old way:**
- Design page
- Hand off entire page
- Developer builds from scratch

**New way:**
- Design with components
- Hand off components (already built)
- Developer composes page from components

**Benefits:**
- Faster development (components already exist)
- Consistent (same components used everywhere)
- Scalable (build once, use everywhere)
- Maintainable (update component, updates everywhere)

---

## 11. Handoff for Different Platforms

### Web (React, Vue, etc.)

**Focus on:**
- Responsive breakpoints
- CSS specifications (flex, grid, positioning)
- Accessibility (ARIA, keyboard, semantic HTML)
- Performance (image optimization, lazy loading)

**Deliverables:**
- Figma Dev Mode link
- Design tokens (CSS variables or JavaScript)
- Component code (Storybook)
- Assets (SVG icons, optimized images)

### Mobile Apps (iOS, Android)

**Focus on:**
- Platform-specific patterns (iOS vs. Android)
- Touch targets (44×44px minimum)
- Device frames and safe areas
- Platform-specific fonts and interactions

**Deliverables:**
- Figma Dev Mode (iOS/Android code snippets)
- Design tokens (platform-specific)
- Assets (icons @1x, @2x, @3x)
- Interaction specs (gestures, animations)

### Email Design

**Focus on:**
- Table-based layouts (no modern CSS)
- Inline CSS (styles in elements)
- Fallback fonts
- Image blocking (alt text critical)
- Client-specific quirks (Outlook, Gmail)

**Deliverables:**
- HTML with inline CSS
- Tested in major email clients
- Fallback images
- Text-only version

---

## 12. Quick Reference

### Essential Specs
- **Layout:** Spacing, dimensions, positioning, breakpoints
- **Typography:** Fonts, sizes, weights, line-heights, colors
- **Colors:** All values, semantic names, dark mode
- **States:** Default, hover, active, focus, disabled, loading, error
- **Assets:** Icons (SVG), images (optimized, multiple sizes)
- **Behavior:** Animations, transitions, interactions

### Communication
- **Be proactive:** Answer questions before asked
- **Be specific:** Use numbers, not adjectives
- **Be available:** Respond same-day during active development
- **Be collaborative:** Join reviews, test implementations

### Tools
- **Figma Dev Mode:** Primary handoff tool (2024+)
- **Code Connect:** Link designs to code components
- **Design tokens:** Variables for colors, spacing, typography
- **Storybook:** Live component documentation

### Process
1. **Design:** All states, all breakpoints, all edge cases
2. **Document:** Specs, assets, interactions
3. **Share:** Figma link, design tokens, component code
4. **Support:** Answer questions, review implementation
5. **Verify:** Test on real devices, sign off or create issues

---

## Further Reading

- **Figma Dev Mode:** https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode
- **Figma Code Connect:** https://www.figma.com/developers/code-connect
- **Design Tokens W3C:** https://tr.designtokens.org/
- **Salesforce UX Design Tokens:** https://www.lightningdesignsystem.com/design-tokens/
- **Storybook Documentation:** https://storybook.js.org/docs/react/writing-docs/introduction

---

**Remember:** Good handoff is proactive, not reactive. Specify everything, communicate often, test on real devices.

**Design handoff is not a handoff — it's a handover. You're still responsible until it ships.**
