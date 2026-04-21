# Design Review In-Depth Guide

> Detailed reference for Phase 7. Provides scoring criteria, scenario-specific focus areas, and common issues checklist.

---

## Scoring Criteria Explained

### 1. Philosophy Alignment

| Score | Criteria |
|-------|----------|
| 9-10 | Design perfectly embodies the core spirit of the chosen philosophy; every detail has a philosophical basis |
| 7-8 | Overall direction is correct, core characteristics are in place, occasional detail deviations |
| 5-6 | Intent is visible, but execution mixes in other style elements, not pure enough |
| 3-4 | Surface-level imitation only, without understanding the philosophical core |
| 1-2 | Basically unrelated to the chosen philosophy |

**Review points**:
- Does it use the signature techniques of the chosen designer/studio?
- Do colors, typography, and layout match the philosophical system?
- Are there contradictory elements? (e.g., chose Kenya Hara but crammed with content)

### 2. Visual Hierarchy

| Score | Criteria |
|-------|----------|
| 9-10 | User's eye naturally follows the designer's intent, zero-friction information access |
| 7-8 | Clear primary-secondary relationship, occasional 1-2 ambiguous hierarchy points |
| 5-6 | Can distinguish title from body, but middle levels are muddled |
| 3-4 | Information laid flat, no clear visual entry point |
| 1-2 | Chaotic, user doesn't know where to look first |

**Review points**:
- Is the title-to-body font size ratio sufficient? (at least 2.5x)
- Do color/weight/size establish 3-4 clear hierarchy levels?
- Is whitespace guiding the eye?
- "Squint test": squint your eyes — is hierarchy still clear?

### 3. Craft Quality

| Score | Criteria |
|-------|----------|
| 9-10 | Pixel-perfect, alignment, spacing, colors have no flaws |
| 7-8 | Overall refined, 1-2 minor alignment/spacing issues |
| 5-6 | Basically aligned, but spacing inconsistent, color usage not systematic |
| 3-4 | Obvious alignment errors, chaotic spacing, too many colors |
| 1-2 | Rough, looks like a draft |

**Review points**:
- Is a consistent spacing system used (e.g., 8pt grid)?
- Is spacing consistent for similar elements?
- Is the number of colors controlled? (typically no more than 3-4)
- Is the font family unified? (typically no more than 2)
- Are edge alignments precise?

### 4. Functionality

| Score | Criteria |
|-------|----------|
| 9-10 | Every design element serves the goal, zero redundancy |
| 7-8 | Functionally oriented, a small amount of removable decoration |
| 5-6 | Basically usable, but obvious decorative elements distract |
| 3-4 | Form over function, user has to work to find information |
| 1-2 | Completely overwhelmed by decoration, lost ability to convey information |

**Review points**:
- Remove any single element — does the design suffer? (if not, it should be removed)
- Are CTA/key messages in the most prominent position?
- Are there elements added "because they look nice"?
- Does information density match the medium? (slides shouldn't be too dense, PDFs can be denser)

### 5. Originality

| Score | Criteria |
|-------|----------|
| 9-10 | Refreshingly original, finds unique expression within the philosophical framework |
| 7-8 | Has its own ideas, not a simple template application |
| 5-6 | Conventional, looks like a template |
| 3-4 | Heavy use of clichés (e.g., gradient spheres to represent AI) |
| 1-2 | Entirely a template or stock asset collage |

**Review points**:
- Are common clichés avoided? (see "Common Issues Checklist" below)
- Is there personal expression while following the design philosophy?
- Are there "unexpected but reasonable" design decisions?

---

## Scenario-Specific Review Focus

Different output types have different review priorities:

| Scenario | Most Important | Secondary | Can Relax |
|----------|---------------|-----------|-----------|
| Social media cover/image | Originality, Visual Hierarchy | Philosophy Alignment | Functionality (single image, no interaction) |
| Infographic | Functionality, Visual Hierarchy | Craft Quality | Originality (accuracy first) |
| Slides/Keynote | Visual Hierarchy, Functionality | Craft Quality | Originality (clarity first) |
| PDF/Whitepaper | Craft Quality, Functionality | Visual Hierarchy | Originality (professionalism first) |
| Landing page/Website | Functionality, Visual Hierarchy | Originality | — (full requirements) |
| App UI | Functionality, Craft Quality | Visual Hierarchy | Philosophy Alignment (usability first) |
| Social media post image | Originality, Visual Hierarchy | Philosophy Alignment | Craft Quality (atmosphere first) |

---

## Common Design Issues Top 10

### 1. AI Tech Cliché
**Issue**: Gradient spheres, digital rain, blue circuit boards, robot faces
**Why it's a problem**: Users are visually fatigued by these, can't distinguish you from others
**Fix**: Use abstract metaphors instead of literal symbols (e.g., "dialogue" metaphor instead of chat bubble icon)

### 2. Insufficient Font Size Hierarchy
**Issue**: Title and body text gap too small (<2.5x)
**Why it's a problem**: Users can't quickly locate key information
**Fix**: Title at least 3x body text (e.g., body 16px → title 48-64px)

### 3. Too Many Colors
**Issue**: Using 5+ colors with no primary-secondary relationship
**Why it's a problem**: Visual chaos, weak brand identity
**Fix**: Limit to 1 primary + 1 secondary + 1 accent + grayscale

### 4. Inconsistent Spacing
**Issue**: Element spacing is random, no system
**Why it's a problem**: Looks unprofessional, visual rhythm is chaotic
**Fix**: Establish 8pt grid system (spacing only uses 8/16/24/32/48/64px)

### 5. Insufficient Whitespace
**Issue**: All space filled with content
**Why it's a problem**: Information density causes reading fatigue, actually reduces communication efficiency
**Fix**: Whitespace should be at least 40% of total area (minimalist styles 60%+)

### 6. Too Many Fonts
**Issue**: Using 3+ typefaces
**Why it's a problem**: Visual noise, weakens unity
**Fix**: Maximum 2 typefaces (1 heading + 1 body), use weight and size for variation

### 7. Inconsistent Alignment
**Issue**: Some left-aligned, some centered, some right-aligned
**Why it's a problem**: Destroys visual order
**Fix**: Choose one alignment (left-aligned recommended), apply globally

### 8. Decoration Over Content
**Issue**: Background patterns/gradients/shadows steal focus from main content
**Why it's a problem**: Putting the cart before the horse — users come for information, not decoration
**Fix**: "Would the design suffer if this decoration were removed?" If not, remove it

### 9. Cyber-Neon Overuse
**Issue**: Deep blue background (#0D1117) + neon glow effects
**Why it's a problem**: Default aesthetic exclusion zone (this skill's taste baseline), and has become one of the biggest clichés — users can override with their own brand
**Fix**: Choose a more distinctive color scheme (see 20 philosophy schools' color systems)

### 10. Information Density Mismatch with Medium
**Issue**: Full page of text in slides / 10 elements crammed into a cover image
**Why it's a problem**: Different media have different optimal information densities
**Fix**:
- Slides: 1 core idea per page
- Cover image: 1 visual focal point
- Infographic: Layered presentation
- PDF: Can be denser, but needs clear navigation

---

## Review Output Template

```
## Design Review Report

**Overall Score**: X.X/10 [Excellent(8+)/Good(6-7.9)/Needs Improvement(4-5.9)/Unacceptable(<4)]

**Dimension Scores**:
- Philosophy Alignment: X/10 [one-sentence explanation]
- Visual Hierarchy: X/10 [one-sentence explanation]
- Craft Quality: X/10 [one-sentence explanation]
- Functionality: X/10 [one-sentence explanation]
- Originality: X/10 [one-sentence explanation]

### Strengths (Keep)
- [Specific examples of what works well, described in design language]

### Issues (Fix)
[Sorted by severity]

**1. [Issue Name]** — ⚠️Critical / ⚡Important / 💡Optimization
- Current: [Describe current state]
- Problem: [Why this is a problem]
- Fix: [Specific action with values]

### Quick Wins
If you only have 5 minutes, prioritize these 3 things:
- [ ] [Highest-impact fix]
- [ ] [Second most important fix]
- [ ] [Third most important fix]
```

---

**Version**: v1.0
**Updated**: 2026-02-13
