# Principle-Based Design Review

> **Load when:** Final delivery, design system review, high-stakes projects, principle conflicts
> **Skip when:** WIP feedback, quick iterations, daily design reviews
> **Why it matters:** Ensures design aligns with core principles, catches strategic issues that quick reviews miss
> **Typical failure it prevents:** Principle violations, strategic misalignment, design decisions that contradict stated values

This document provides a systematic method for evaluating designs against the 10 core design principles. Unlike the 5-dimension quick review (critique-guide.md), this is a Pass/Warning/Fail diagnostic tool focused on principle alignment.

---

## When to Use Which Review Method

| Scenario | Use |
|----------|-----|
| Daily iteration feedback | 5-Dimension Quick Review (critique-guide.md) |
| Final delivery review | 5-Dimension + 10-Principle Review (this file) |
| Design system review | 10-Principle Review (this file) + system-design-theory.md |
| Anti-slop check | Design Checklist (design-checklist.md) |
| Principle conflict resolution | 10-Principle Review (this file) + design-principles.md |

---

## Review Method

For each of the 10 principles, evaluate: **Pass** / **Warning** / **Fail**

- **Pass**: Principle is satisfied, no issues
- **Warning**: Minor violation, should fix but not blocking
- **Fail**: Critical violation, must fix before shipping

For each Warning or Fail, document:
1. **Severity**: Critical / High / Medium / Low
2. **Issue**: What's wrong (specific, not generic)
3. **Fix**: How to resolve (actionable, not vague)

---

## Principle 1: Clarity > Beauty

**Question:** Can users understand it in 3 seconds?

**Pass criteria:**
- [ ] Visual hierarchy clear (title ≥ 3x body size)
- [ ] Information grouped logically (≤ 7 chunks per group)
- [ ] Reading path obvious (F-pattern or Z-pattern)
- [ ] No ambiguous visual entry point

**Common failures:**
- Title and body size gap < 2.5x
- More than 7 items at same level without grouping
- No clear visual starting point
- Competing focal points

**Example:**
```
❌ Fail: Title 20px, body 16px (1.25x ratio)
✅ Pass: Title 48px, body 16px (3x ratio)
```

**If Warning/Fail:**
- Severity: [Critical if users can't find key info, High if hierarchy unclear, Medium if minor ambiguity]
- Issue: [Specific problem, e.g., "Title 20px, body 16px (1.25x, need 3x)"]
- Fix: [Specific action, e.g., "Change title to 48px"]

---

## Principle 2: Context > Convention

**Question:** Does it fit the user's context?

**Pass criteria:**
- [ ] Matches user's mental model (not designer's)
- [ ] Conventions broken for good reasons (documented)
- [ ] Platform-appropriate (iOS/Android/Web guidelines followed)
- [ ] User's workflow respected

**Common failures:**
- Generic design ignoring user context
- Following conventions blindly (e.g., hamburger menu on desktop)
- Platform inconsistencies (iOS patterns on Android)
- Designer's mental model imposed on users

**Example:**
```
❌ Fail: Hamburger menu on desktop (mobile convention on wrong platform)
✅ Pass: Horizontal nav on desktop, hamburger on mobile
```

**If Warning/Fail:**
- Severity: [Critical if breaks user expectations, High if platform mismatch, Medium if minor convention issue]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 3: Problem Definition > Solution

**Question:** Does it solve the right problem?

**Pass criteria:**
- [ ] Problem clearly defined (not assumed)
- [ ] Solution addresses root cause (not symptoms)
- [ ] User's actual problem (not designer's interpretation)
- [ ] Success criteria defined

**Common failures:**
- Solving symptoms, not root cause
- Problem statement missing or vague
- Solution looking for a problem
- Designer's problem, not user's problem

**Example:**
```
❌ Fail: "Users don't click the button" → make button bigger
       (Symptom: low clicks. Root cause: button unclear purpose)
✅ Pass: "Users don't understand what the button does" → add clear label
```

**If Warning/Fail:**
- Severity: [Critical if solving wrong problem, High if symptom-focused, Medium if problem unclear]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 4: Validation > Assumption

**Question:** Is it based on evidence?

**Pass criteria:**
- [ ] Key decisions backed by data/research/user feedback
- [ ] Assumptions explicitly stated (not hidden)
- [ ] Testable hypotheses (not unfalsifiable claims)
- [ ] Validation plan exists for unvalidated decisions

**Common failures:**
- Pure guesswork presented as fact
- "Users want X" without evidence
- Assumptions hidden in design rationale
- No plan to validate critical decisions

**Example:**
```
❌ Fail: "Users prefer dark mode" (no evidence)
✅ Pass: "67% of users in survey prefer dark mode" (validated)
⚠️ Warning: "Assuming users prefer dark mode, will A/B test" (assumption + plan)
```

**If Warning/Fail:**
- Severity: [Critical if high-risk assumption, High if key decision unvalidated, Medium if minor assumption]
- Issue: [Specific problem]
- Fix: [Specific action]

**Note:** This principle is less applicable to pure visual design reviews. Use primarily for product/UX strategy reviews.

---

## Principle 5: System > Local

**Question:** Does it fit the design system?

**Pass criteria:**
- [ ] Uses design tokens (not hard-coded values)
- [ ] Components reusable (not one-off)
- [ ] Consistent with existing patterns
- [ ] Extends system (doesn't break it)

**Common failures:**
- Hard-coded colors/spacing/fonts
- One-off components that duplicate existing ones
- Inconsistent with design system
- Breaking system conventions without justification

**Example:**
```
❌ Fail: Button with #FF5733 (hard-coded), padding 13px (random)
✅ Pass: Button with var(--color-primary), padding var(--space-3)
```

**If Warning/Fail:**
- Severity: [Critical if breaks system, High if inconsistent, Medium if minor deviation]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 6: Content > Form

**Question:** Does form serve content?

**Pass criteria:**
- [ ] Every element serves content (no decoration for decoration's sake)
- [ ] Visual hierarchy matches content hierarchy
- [ ] Form enhances readability (not hinders it)
- [ ] Remove any element → design suffers (nothing is removable)

**Common failures:**
- Decoration dominates content
- Form over function
- Visual elements that don't serve content
- Content buried by design

**Example:**
```
❌ Fail: Large decorative shapes obscure text
✅ Pass: Whitespace and typography enhance readability
```

**If Warning/Fail:**
- Severity: [Critical if content buried, High if form dominates, Medium if minor decoration]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 7: Subtraction > Addition

**Question:** Is everything necessary?

**Pass criteria:**
- [ ] Nothing can be removed without loss
- [ ] No redundant elements
- [ ] No "just in case" features
- [ ] Simplest solution that works

**Common failures:**
- Cluttered with unnecessary elements
- Redundant information
- "Just in case" features
- Over-designed

**Example:**
```
❌ Fail: 5 CTAs on one screen (overwhelming)
✅ Pass: 1 primary CTA, 1 secondary (clear priority)
```

**If Warning/Fail:**
- Severity: [Critical if overwhelming, High if cluttered, Medium if minor redundancy]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 8: Natural > Showoff

**Question:** Does it feel effortless?

**Pass criteria:**
- [ ] Interactions feel natural (not forced)
- [ ] No unnecessary animations
- [ ] No "look at me" design elements
- [ ] Users focus on content (not design)

**Common failures:**
- Forced interactions
- Showoff animations
- Design that draws attention to itself
- Awkward user flows

**Example:**
```
❌ Fail: 2-second animation on every button click (showoff)
✅ Pass: 150ms subtle transition (natural)
```

**If Warning/Fail:**
- Severity: [Critical if unusable, High if awkward, Medium if minor friction]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 9: Consistency > Innovation

**Question:** Is it consistent?

**Pass criteria:**
- [ ] Spacing consistent (8px grid)
- [ ] Colors from palette (not random)
- [ ] Typography scale followed
- [ ] Patterns reused (not reinvented)

**Common failures:**
- Inconsistent spacing (13px, 19px, 27px)
- Random colors (not from palette)
- Typography chaos (5+ font sizes)
- Reinventing patterns

**Example:**
```
❌ Fail: Spacing 13px, 19px, 27px, 31px (random)
✅ Pass: Spacing 8px, 16px, 24px, 32px (8px grid)
```

**If Warning/Fail:**
- Severity: [Critical if chaotic, High if inconsistent, Medium if minor deviation]
- Issue: [Specific problem]
- Fix: [Specific action]

---

## Principle 10: Scalability > Perfection

**Question:** Can it scale?

**Pass criteria:**
- [ ] Works with 10x content
- [ ] Works with 10x users
- [ ] Edge cases handled (empty, error, loading)
- [ ] Responsive (mobile, tablet, desktop)

**Common failures:**
- Breaks with more content
- Doesn't handle edge cases
- Not responsive
- Optimized for demo only

**Example:**
```
❌ Fail: Layout breaks with long text
✅ Pass: Layout handles 1-1000 characters gracefully
```

**If Warning/Fail:**
- Severity: [Critical if breaks at scale, High if edge cases missing, Medium if minor scaling issue]
- Issue: [Specific problem]
- Fix: [Specific action]

**Note:** This principle is most relevant for design systems and scalable products. Less applicable to one-off designs.

---

## Output Format

After evaluating all 10 principles, produce this table:

```markdown
## Principle Review Report

| # | Principle | Status | Severity | Issue | Fix |
|---|-----------|--------|----------|-------|-----|
| 1 | Clarity>Beauty | ❌ Fail | High | Title 20px, body 16px (1.25x, need 3x) | Change title to 48px |
| 2 | Context>Convention | ✅ Pass | - | - | - |
| 3 | Problem>Solution | ⚠️ Warning | Medium | Solves symptom, not root cause | Reframe problem statement |
| 4 | Validation>Assumption | ✅ Pass | - | - | - |
| 5 | System>Local | ❌ Fail | Critical | Hard-coded colors, no tokens | Use design tokens |
| 6 | Content>Form | ✅ Pass | - | - | - |
| 7 | Subtraction>Addition | ⚠️ Warning | Low | 1 removable decorative element | Remove background shape |
| 8 | Natural>Showoff | ✅ Pass | - | - | - |
| 9 | Consistency>Innovation | ❌ Fail | High | Random spacing (13px, 19px, 27px) | Use 8px grid (8, 16, 24, 32) |
| 10 | Scalability>Perfection | ⚠️ Warning | Medium | Breaks with long text | Add text truncation |

**Summary:**
- ✅ Pass: 5
- ⚠️ Warning: 3
- ❌ Fail: 2

**Critical Issues:** 1 (Principle 5)
**High Issues:** 2 (Principles 1, 9)

**Recommendation:** Fix Critical and High issues before shipping.
```

---

## Principle Priority (When Principles Conflict)

If two principles conflict, use this priority order (from design-principles.md):

1. **Clarity > Beauty** (most important)
2. **Context > Convention**
3. **Problem Definition > Solution**
4. **Content > Form**
5. **System > Local**
6. **Subtraction > Addition**
7. **Natural > Showoff**
8. **Consistency > Innovation**
9. **Validation > Assumption**
10. **Scalability > Perfection** (least important)

**Example conflict:**
- Principle 9 (Consistency) says: "Use existing button style"
- Principle 2 (Context) says: "This context needs a different button style"
- **Resolution:** Context wins (Principle 2 > Principle 9)

---

## Relationship to Other Documents

- **design-principles.md**: Defines the 10 principles (why they exist, when to break them)
- **critique-guide.md**: 5-dimension quick review (faster, less rigorous)
- **design-checklist.md**: Automated quality checks (objective pass/fail)
- **design-excellence.md**: Execution standards (how to implement)
- **design-thinking-framework.md**: 8-layer framework (when to apply which principle)

---

## Remember

1. **This is diagnostic, not scoring** — Pass/Warning/Fail, not 1-10 points
2. **Principles have priority** — When conflicts arise, use the priority order
3. **Not all principles apply to all designs** — Principle 4 (Validation) and 10 (Scalability) are context-dependent
4. **Use with quick review** — This complements, not replaces, the 5-dimension review
5. **Focus on Critical and High** — Medium and Low can be deferred

**A principle-based review ensures design decisions align with stated values, not just aesthetic preferences.**
