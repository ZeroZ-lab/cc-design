# Design Decision Record (DDR)

> **Load when:** Facing a design decision that sets direction — style philosophy, colour palette, typography system, layout approach, or brand tone.
> **Why it matters:** Design decisions without recorded rationale are lost. Six months later, no one knows why Takram was chosen over Pentagram, or why oklch was used over HSL.

---

## When to Write a DDR

**Required:**
- Choosing a design philosophy school or visual direction (see `references/design-styles.md`)
- Selecting colour palette strategy (monochrome / dual-tone / vibrant / muted)
- Deciding typography system (role-based font assignment, modular scale ratio)
- Committing to a layout approach (grid / asymmetric / full-bleed)
- Setting brand personality and emotional tone

**Not needed:**
- Minor colour adjustments within an approved palette
- Spacing tweaks on an established grid
- Font weight selection within an approved family hierarchy

## DDR Template

```markdown
# DDR-<NNN>: <Decision Title>

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded | Rejected

## Context

Why does this design decision need to be made? What constraints drive it?
(e.g. "The brand needs to feel premium but approachable — not cold luxury, not casual fun.")

## Options

### Option A: <Name>

- **Pros:**
- **Cons:**
- **Visual feel:**
- **Brand alignment:**

### Option B: <Name>

- **Pros:**
- **Cons:**
- **Visual feel:**
- **Brand alignment:**

## Decision

**Selected: Option <X>**

Rationale: Why this option, not the others. One paragraph.

## Consequences

### Positive
- [What we gain]

### Negative
- [What we sacrifice, what trade-offs we accept]

### Given Up
- [What the rejected options offered but we chose not to pursue]

## Related

- References to design-styles.md schools, colour theory principles, case studies
- Related DDRs, if any
```

## Design-Specific Adaptation

CC-design DDRs differ from software ADRs in three ways:

1. **Visual feel** is a first-class evaluation dimension. Software ADRs care about latency, throughput, maintainability. Design ADRs care about how it feels, what emotion it communicates, whether it fits the brand voice.
2. **Brand alignment** is non-negotiable. If an option looks great but mismatches the brand, it is disqualified, not "close enough".
3. **Rejection is information.** When a direction is superseded or rejected, keep the DDR. The next similar decision benefits from knowing what was tried and why it did not work.

## File Location

Save to: `docs/features/<feature-name>/design-adr/<num>-<title>.md`

Example: `docs/features/landing-page-redesign/design-adr/01-colour-palette.md`
