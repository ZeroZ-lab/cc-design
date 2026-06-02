# Design Red Flags — 运行时自省信号

> **Load when:** Any design task in progress. These are not design-system rules — they are behavioural signals that tell you to stop and re-evaluate.
> **Why it matters:** Most design defects come from not noticing you are on the wrong path early enough.

---

## Design Competence Red Flags — STOP and re-evaluate

| Signal | What it means | Action |
|---|---|---|
| Colour chosen from memory, not extracted from brand assets | Design context failure | STOP. Extract real brand colours before continuing. See `references/design-context.md`. |
| Spacing set without a consistent scale | Missing design system | STOP. Establish the 8px spacing scale first. See `references/typography-design-system.md`. |
| Font selected without a role rationale (body/display/mono) | Decoration over system | STOP. Assign every font by role. At most 2 core families + 1 mono. |
| Using the same layout for all sections | Pattern laziness | STOP. Vary layout density by content type. See `references/layout-systems.md`. |
| Hero looks polished; everything below is broken | Selective verification | STOP. Verify every section independently. See `references/verification-protocol.md`. |
| Multiple full-spectrum gradients on one page | AI slop signal | STOP. Remove all but at most one subtle gradient. See P2 rules in SKILL.md. |
| Elements added to fill whitespace | Fear of empty space | STOP. Whitespace is a design element, not wasted area. If the content does not need filling, do not fill it. |
| Fabricated metrics, reviews, or data | P0 violation — never fixable | STOP. Delete all fabricated data. Replace with labeled placeholders or factual source. |
| Interactive elements added without state coverage | Incomplete interaction design | STOP. Every interactive element needs: default, hover, active, disabled (if applicable), error (if input). |
| Layout works at one viewport but not tested at others | Structural debt | STOP. Responsiveness is structural. Test at least desktop + one narrow viewport. |
| Font sizes do not follow the declared scale | Inconsistent typography | STOP. Map every text element to the scale. See `references/typography-design-system.md`. |

## Signals from Human Partner — STOP and re-evaluate

| User says | What it means | Action |
|---|---|---|
| "This does not feel right" | Core visual hierarchy or direction is off | STOP. Revisit focal point and information hierarchy, not font/colour details. |
| "It is missing something" | Probably a grouping or hierarchy problem, not lack of elements | STOP. Re-examine Gestalt grouping and spacing before adding any new element. |
| "Just make it look good" | Missing reference context | STOP. Ask for at least one reference or brand constraint. Guessing produces generic work. |
| "Can you try X instead?" (after seeing a direction) | The previous direction was fundamentally wrong | STOP. Revisit assumptions from the Understand step before producing more variations. |
| "This is not what I meant" | Misunderstanding of scope or audience | STOP. Go back to Understand step (workflow Step 1), not more iterations. |
| (Silence after seeing the plan) | Unsure what to approve | STOP. Provide specific options with a recommendation. Silence does not mean approval. |
| "We keep going back and forth" (3+ rounds) | Iteration gate trigger | STOP. Enter the Iteration Gate protocol. See `references/workflow.md`. |
| "Why did you choose this [colour/font/style]?" | Design decision not communicated | STOP. Explain the rationale. If there is no rationale for the choice, it was a bad choice — pick again with intent. |

## Reference from SKILL.md

The SKILL.md Core Principles section says:

> See `references/design-red-flags.md` for behavioural stop signals — read at any STOP moment during the workflow.
