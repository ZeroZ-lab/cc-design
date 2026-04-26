# Verification Protocol

> **Load when:** Reaching the Verify step (step 5) in the workflow, or preparing to deliver a final artifact
> **Skip when:** Still in the Build step iterating on intermediate changes
> **Why it matters:** Platform-native design tools run two-phase verification automatically. Without this protocol, defects slip through to delivery.
> **Typical failure it prevents:** Delivering artifacts with console errors, broken scaling, invisible text, or misaligned elements

---

## Relationship to 8-Layer Framework

This verification protocol implements **Layer 8 (Validation)** of the design thinking framework (`design-thinking-framework.md`).

**Mapping:**

| Verification Phase | 8-Layer Framework | What It Validates |
|--------------------|-------------------|-------------------|
| **Phase 1: Structural** | Layer 3 (Structure) + Layer 4 (Interaction) | Technical feasibility, layout structure, interaction functionality |
| **Phase 2: Visual** | Layer 5 (Visual) + Layer 6 (Brand) | Visual hierarchy, typography, spacing, brand consistency |
| **Phase 3: Design Excellence** | Layer 2 (Information) + Layer 7 (System) | Information clarity, system consistency, anti-slop compliance |

**Complete validation requires all 3 phases.** Phase 1-2 are defined here. Phase 3 uses `design-checklist.md` for objective quality checks.

---

## Phase 1: Structural Verification

Run these checks first. Any failure = stop and fix before proceeding to Phase 2.

| Check | Method | Pass criteria | Fix if fail |
|-------|--------|---------------|-------------|
| Console errors | `browser_console_messages` (level: error) | 0 errors | Read error message, fix source, re-verify |
| Console warnings | `browser_console_messages` (level: warning) | 0 warnings about missing resources | Fix asset paths or missing imports |
| Layout structure | `browser_snapshot` | All expected elements present in accessibility tree | Check rendering conditions (display:none, conditional logic) |
| Fixed-size scaling | `browser_evaluate` — check deck_stage or stage transform | Content fills intended viewport without overflow | Verify transform:scale calculation, check container dimensions |
| Asset loading | `browser_evaluate` — check `document.querySelectorAll('[src],[href]')` | No broken links (404) | Fix relative paths, ensure assets exist |

### Console check command

```
browser_console_messages → level: error
browser_console_messages → level: warning
```

If Phase 1 has any failure: fix the issue, re-navigate the page, re-run Phase 1. Do not proceed to Phase 2 until Phase 1 passes clean.

## Phase 2: Visual Verification

Run these after Phase 1 passes. Requires human judgment via screenshot review.
This is a **maker self-check**. The person who made the change must inspect the screenshots after the final edit.

| Check | Method | Pass criteria |
|-------|--------|---------------|
| Screenshot taken | `browser_take_screenshot` | Screenshot captured successfully |
| Coverage | Full-page screenshot + targeted section screenshots for touched areas | Every changed region inspected, not just first screen |
| Viewport coverage | Additional screenshot at narrow/mobile viewport for responsive work | Layout and typography remain coherent across target widths |
| Typography | Visual check on screenshot | Headings distinct from body, no text < 12pt (print) or < 24px (1080p slides) |
| Alignment | Visual check on screenshot | Elements aligned to grid, no drift, consistent margins |
| Contrast | Visual check on screenshot | Text readable against background, no low-contrast pairs |
| Spacing | Visual check on screenshot | Consistent use of spacing tokens, no arbitrary gaps |
| Tweaks panel | Visual check (if applicable) | Tweaks toggle visible, panel functional, no UI artifacts when hidden |
| Content | Visual check on screenshot | No placeholder text left in, no filler content |

### Visual review flow

```
1. browser_take_screenshot → capture full page after the final edit
2. Capture targeted screenshots for every changed section / component / slide
3. For responsive work, capture at least one narrow/mobile viewport
4. Review all screenshots against criteria above
5. If any criterion fails → fix in Build step, re-verify from Phase 1
6. If all pass → proceed to Phase 4 (User Review)
```

## Task-Type-Specific Verification

In addition to the three-phase protocol, verify task-type-specific items:

| Task Type | Additional Verification |
|---|---|
| Landing Page | Responsive at desktop + mobile. CTA prominence checked. Body font >= 16px. |
| Slide Deck | Every slide has `[data-screen-label]`. Body font >= 24px. `deck_stage` used. |
| Animation | `__ready` signal present. Phase dwell times >= 3s. Easing correct (out/in). |
| Interactive Prototype | All paths tested. No dead ends. State transitions smooth. |
| Brand Clone | Colours from real assets. Fonts exact. Tone matches brand personality. |
| Design Critique | Each dimension scored. Severity labels on all findings. |
| Export | File opens correctly. Tool dependencies confirmed. |

Full details in `references/exit-conditions.md`.

## Fix Loop

The verification loop is strict:

```
Phase 1 fail → fix → re-navigate → Phase 1 again
Phase 2 fail → fix → re-navigate → Phase 1 + Phase 2 again
```

Never skip Phase 1 to "just check visuals." Structural errors cause visual defects that are symptoms, not root causes.

If the fix loop repeats 3+ times on the same issue, or if fixing one thing breaks another, enter the structured recovery protocol: see `references/failure-mode-handling.md`.

## Phase 4: User Review (new)

**Purpose**: Get human approval before delivery. After all three phases pass, present results to the user.

Steps:
1. Present exit conditions checklist results (checked / failed items) from `references/exit-conditions.md`
2. Present Phase 2 screenshot(s)
3. Wait for user decision:
   - **Approve** → proceed to Deliver step
   - **Request changes** → re-enter fix loop (back to Phase 1), fix the specific item, re-run all phases
   - **Rethink direction** → trigger Iteration Gate in `references/workflow.md` (back to Step 1 — Understand)
