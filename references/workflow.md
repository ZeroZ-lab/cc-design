# Workflow: Supporting Guide for Question-First Delivery

This file supports `SKILL.md`. It does not define an independent product workflow.

The runtime contract lives in `SKILL.md`:
- new ambiguous tasks start with structured step-by-step confirmation
- richly specified briefs can skip most clarification, but still require a visible plan
- follow-up iterations and minor fixes act directly unless scope changes

Use this file to structure the step-by-step confirmation flow and the follow-through after that decision has already been made.

---

## Relationship to 8-Layer Design Framework

This workflow is the **execution process**. The 8-layer framework (`design-thinking-framework.md`) is the **thinking structure**.

**Mapping:**

| Workflow Step | 8-Layer Framework | Purpose |
|---------------|-------------------|---------|
| **Step 1: Understand** (Structured confirmation) | Layer 1 (Goal) + Layer 2 (Information) | Clarify objectives, audience, scope, information priorities |
| **Step 2: Route** (Load references) | Layer 2-7 (task-dependent) | Load theory and patterns for relevant layers |
| **Step 3: Acquire Context** (Design system/brand) | Layer 6 (Brand) + Layer 7 (System) | Understand existing constraints and brand personality |
| **Step 4: Plan** (Visible execution plan) | Layer 1-7 (condensed) | Turn confirmed facts and assumptions into a build plan |
| **Step 5: Approval** (Manager review) | Layer 8 (Validation) | Confirm direction before expensive execution |
| **Step 6: Design** (Build artifacts) | Layer 3 (Structure) + Layer 4 (Interaction) + Layer 5 (Visual) | Execute structure, interaction, and visual design |
| **Step 7: Verify** (Check quality) | Layer 8 (Validation) | Test technical feasibility, usability, design quality |
| **Step 8: Iterate** (Refine based on feedback) | Layer 8 → Layer 1 (feedback loop) | Use validation results to refine goals and execution |

**When to use which:**
- **Use workflow.md** for step-by-step execution guidance
- **Use design-thinking-framework.md** when you need to diagnose problems, resolve conflicts, or understand "why" behind decisions
- **Use both together** for complex multi-screen flows or design system creation

## Runtime Load Announcements

Treat runtime loading as visible work, not invisible thought. `load-manifest.json` is the source of truth for route bundles, checkpoint bundles, and optional inspiration bundles. Bundle matching is done by an Agent subagent that reads the catalog from `scripts/generate-bundle-catalog.mjs` and semantically matches the user's prompt. `scripts/resolve-load-bundles.mjs` is kept as a keyword-based fallback.

Rules:
- announce before reading runtime references or copying templates
- use the exact line format: `Load: because=<reason> loaded=<comma-separated paths>`
- if the bundle is already loaded, say `Load: because=<reason> already_loaded=<comma-separated paths>`
- use stable reasons from `load-manifest.json` such as `all-design-tasks`, `question-first-delivery`, `deep-design-review`, `react-prototype`, `before-animation`, `before-delivery`
- do not announce ordinary codebase reads that are not part of the skill runtime bundle
- do not silently skip bundle loads; explicit dedupe is part of the contract

Bundle classes:
- **Base-required bundles (`基础必载`)** — always load for every design task
- **Conditionally required bundles (`条件命中后必载`)** — load when a `taskType` or `checkpoint` is triggered
- **Truly optional inspirations (`真正可选`)** — load only when case-study inspiration helps

## Two-Stage Routing

Use a two-stage route instead of loading every plausible reference up front.

**Stage 1: Base-required load**
- always load `all-design-tasks`
- if the task is new or underspecified, also load `question-first-delivery`

**Stage 2: Route-shaping questions**
- ask the fixed question batch below
- map those answers directly to `taskTypes` and `checkpoints`
- only after explicit mapping, use semantic matching to supplement unresolved `taskTypes` or `optionalInspirations`

This keeps typography, layout, and visual/color theory in the default context while preserving conditional loading for brand, interaction, export, animation, device mockups, and review work.

## First-Turn Rule

Treat this as supporting guidance, not an override:

- **Use structured confirmation** for new tasks with missing audience, scope, output shape, hard constraints, or reference context
- **Skip most questions** only when the brief is already rich, or the user explicitly asks to move fast
- **Act directly** for follow-up iterations and minor fixes

If you are unsure which path applies, default to the next blocking confirmation step. Do not invent a fourth path.

## The Art of Asking Questions

Ask **in steps**, not as a long unstructured dump.

Default target:
- 3 to 4 confirmation steps

Preferred shape:
- 1 blocking question per step
- 2 to 4 short options
- optional freeform when the platform supports it

Fallback:
- if the platform has no structured question UI, compress these steps into one compact batch message

After the steps:
- stop once blocking fields are resolved
- ask at most one open follow-up round if critical details remain
- if critical fields are still unknown after that, convert them into explicit assumptions in the visible plan

Critical blocking fields:
- output shape
- audience
- scope
- hard constraints that would materially change the direction
- reference source, or an explicit "no reference"
- success criteria
- existing contract update mode (`DESIGN.md`: append / merge / overwrite) when relevant

Non-blocking fields:
- optional refinements
- tweak controls
- secondary taste preferences

## Required Question Checklist

When you are in the question-first path, ask these **route-shaping questions first** and stop once bundle selection is clear:

### 1. Output Type

- What is the first artifact: page, deck, clickable prototype, animation, design system, critique, or export target?
- Route mapping:
  `page → landing-page`
  `deck → slide-deck`
  `clickable prototype → interactive-prototype`
  `animation → animation-motion`
  `design system → design-system-creation`
  `critique/review/audit → deep-design-review`
  `pdf/pptx/video target → pdf-export` / `editable-pptx-export` / `video-export`

### 2. Task State

- Is this a new task, a localized edit, or an approved follow-up iteration?
- Route mapping:
  `new or underspecified → question-first-delivery`
  `localized edit / approved follow-up → skip question-first unless scope changed`

### 3. Available Context

- Is there an existing design system, UI kit, codebase, screenshots, or a brand reference?
- Is there an existing `DESIGN.md` or equivalent contract file?
- Route mapping:
  `brand reference / clone → brand-style-clone`
  `need real assets/logo sourcing → brand-asset-acquisition`
  `no references → no-design-system`

**If there is already a `DESIGN.md`:**
- Ask how to update it before touching it
- Required mode selection: **Append / Merge / Overwrite**
- Recommend **Merge** by default
- Do not silently rewrite the file just because a new direction sounds better

### 4. Interaction, Device, and Export Constraints

- Does the task need interaction, an iOS/Android frame, or export output?
- Route mapping:
  `interactive flow → interactive-prototype` or `interaction-design`
  `iOS → mobile-mockup + before-ios-mockup`
  `PDF / PPTX / video → matching export task type + before-export`

### 5. Primary Design Risk

- What is most likely to go wrong: layout, typography, color, information hierarchy, interaction, or brand tone?
- Route mapping:
  `layout → layout-problems`
  `typography → typography-problems`
  `color → color-problems`
  `information hierarchy → information-architecture`
  `interaction → interaction-problems`
  `brand tone → brand-tone`

## After Routing Is Locked

After bundle selection is clear, ask only the remaining blocking product questions. For example:

**Building a landing page**:
- What is the target conversion action?
- Primary audience?
- Competitor references?
- Who provides the copy?

**Building an iOS App onboarding**:
- How many steps?
- What does the user need to do?
- Skip paths?
- Target retention rate?

**Building an animation**:
- Duration?
- Final use (video asset/website/social)?
- Rhythm (fast/slow/segmented)?
- Key frames that must appear?

## Structured Confirmation Example

When encountering a new task, prefer this structure:

```markdown
Step 1 — Output
What is the first artifact?
- Landing page / marketing page
- Deck / presentation
- Clickable prototype
- Animation / motion study

Step 2 — Task state
What kind of task is this?
- New task
- Localized edit
- Approved follow-up

Step 3 — Context
What should I route around?
- Existing design system / codebase
- Brand reference or clone
- Need asset sourcing
- No references

Step 4 — Constraints
Any special delivery or device constraints?
- Interactive flow
- iOS mockup
- Export PDF / PPTX / video
- No special constraints

Step 5 — Primary risk
Where should I deepen theory?
- Layout / information hierarchy
- Typography
- Color / tone
- Interaction

Step 6 — Plan
Plan
- Goal: ...
- Confirmed facts: ...
- Assumptions: ...
- First artifact: ...
- Variation axes: ...
- Verification: ...

Approve this plan, or tell me what to change before I build.
```

If the platform lacks structured question UI, convert the same flow into one compact text block.

## After the Confirmation Steps

Once the confirmation steps are answered, or once unanswered critical fields have been converted into explicit assumptions, do not move straight into delivery. First confirm direction understanding, then produce a visible plan, wait for approval, then build.

### Direction Confirmation (new)

Before writing the plan, summarize what you understand and ask the user to confirm:

```markdown
Based on our answers, I understand we're building:
- Type: [landing page / deck / prototype / animation / ...]
- Context: [brand reference / design system / codebase / scratch]
- Audience: [target user]
- Core action / purpose: [what the user should do]

Is this direction correct?
1) Yes, proceed to Plan
2) No, adjust the type
3) No, adjust the audience / purpose
```

Don't build yet if the user adjusts — re-confirm the adjusted fields, then proceed to plan.
This step is skip-able for simple edits but **required for new tasks**.

### Planning Gate

A task is ready for planning when:
- audience is known or explicitly assumed
- output shape is known
- scope is known
- hard constraints are known
- reference context is known or explicitly absent
- success criteria are known or explicitly assumed

If these are incomplete, keep clarifying. If the user wants speed, compress the questions, but do not skip the plan.

### Execution Plan

Before building, show a short plan:

```html
<!--
Execution plan:
- Goal: ...
- Confirmed facts: ...
- Assumptions: ...
- First artifact: ...
- Variation axes: ...
- Verification: ...

Approve this plan before I continue into the full build.
-->
```

Rules:
- 4 to 6 bullets maximum
- this is visible to the user
- approval is required before the first full build
- rich briefs may skip questioning, but not planning
- do not reopen the full question flow unless audience, scope, or output type changes

### Main Work

After the plan is approved:
- Write React components to replace placeholders
- Create variations (using design_canvas or Tweaks)
- If it's slides/animation, start with starter components
- announce any newly loaded runtime bundle before reading it, even mid-task when a checkpoint triggers
- if you chose the question-first path, route with `question-first-delivery` plus the bundles locked by the route-shaping answers
- if the user asked for critique/review/audit/score, route with `deep-design-review` before judging the work

Use a **per-section preview pattern** instead of a single halfway checkpoint:
- For multi-section pages: finish one section → render → show user → approve → next section
- For slide decks: finish title + one content slide → show → approve → build remaining slides
- For animations: finish storyboard → show → approve → build animation frames
- For prototypes: finish one screen → show → approve → next screen
The first section is the minimum viable preview. If the user rejects direction here, zero code is wasted.

### Detail Polish

After the user is satisfied with the overall direction, polish:
- Font size/spacing/contrast fine-tuning
- Animation timing
- Edge cases
- Tweaks panel refinement

### Verification + Delivery

- Use Playwright to screenshot (see `references/verification.md`)
- Open in browser and visually confirm after the **final** edit
- Review the full page **and** every changed section; do not stop at the first viewport
- For responsive work, check at least desktop + one narrow/mobile viewport
- For iterative edits on an existing long page, treat touched sections as mandatory coverage targets
- Never declare "done" from code inspection alone
- Summarize **minimally**: only mention caveats and next steps

## The Deep Logic of Variations

Giving variations is not creating choice paralysis for the user, it is **exploring the possibility space**. Let the user mix and match to arrive at the final version.

### What good variations look like

- **Clear dimensions**: each variation varies on a different dimension (A vs B only changes color, C vs D only changes layout)
- **Gradient**: from "by-the-book conservative version" to "bold novel version" in progressive steps
- **Labels**: each variation has a short label explaining what it's exploring

### Implementation Methods

**Pure visual comparison** (static):
→ Use `assets/design_canvas.jsx`, grid layout side by side. Each cell has a label.

**Multi-option/interaction differences**:
→ Build complete prototypes, switch with Tweaks. For example, building a login page, "layout" is one tweak option:
- Left copy, right form
- Top logo + centered form
- Full-bleed background image + floating form overlay

The user toggles Tweaks to switch, no need to open multiple HTML files.

### Exploration Matrix Thinking

For every design, mentally go through these dimensions and pick 2-3 to give variations on:

- Visual: minimal / editorial / brutalist / organic / futuristic / retro
- Color: monochrome / dual-tone / vibrant / pastel / high-contrast
- Typography: sans-only / sans+serif contrast / all serif / monospace
- Layout: symmetric / asymmetric / irregular grid / full-bleed / narrow column
- Density: sparse breathing / moderate / information-dense
- Interaction: minimal hover / rich micro-interactions / exaggerated large animations
- Texture: flat / layered shadows / textured / noise / gradient

## When Facing Uncertainty

- **Don't know how to proceed**: Honestly say you're unsure, ask the user, or put a placeholder and continue. **Don't fabricate.**
- **User's description is contradictory**: Point out the contradiction, let the user choose one direction.
- **Task is too large to handle at once**: Break into steps, do the first step for the user to review, then proceed.
- **Effect the user wants is technically difficult**: Explain the technical boundary clearly, provide alternatives.

## Iteration Gate

If the design direction is rejected 3+ times, or if feedback keeps changing direction each round:

**STOP producing more variations. Do not produce a 4th direction.**

### Assessment checklist

1. Is the brief complete? Are audience, scope, output shape, and constraints all clear?
2. Are we working from the right reference context (brand assets, design system, competitor references)?
3. Has the user provided explicit, specific feedback on what is wrong?
4. Is there a fundamental mismatch between what was requested and what was built?

### Protocol

1. Present the impasse to the user: "We have explored 3 directions and none matched. Let me make sure I understand the core requirement."
2. Re-confirm the 6 blocking fields from workflow Step 1 (Understand): audience, output shape, scope, hard constraints, reference source, success criteria.
3. If the brief has changed since the original spec, update it explicitly on the conversation. Do not build on the old brief.
4. Propose **ONE** new direction with explicit reasoning about why it differs from the rejected three.
5. If the user still cannot articulate what they want, provide 2-3 concrete visual references for them to react to — "pick the closest" is easier than "describe the ideal".

**Never cycle through a 4th, 5th, or 6th variation without going back to the foundation.** Each additional wasted iteration erodes trust and consumes budget.

See also: `references/design-red-flags.md` for human partner signals that indicate an imminent iteration gate.

## Summary Rules

When delivering, the summary should be **extremely brief**:

```markdown
✅ Slides completed (10 slides), with Tweaks to switch "night/day mode".

Note:
- Data on slide 4 is fake, waiting for you to provide real data for replacement
- Animation uses CSS transition, no JS needed

Next step suggestion: open in your browser first, tell me if any issues on which page/which part.
```

Don't:
- List the contents of every page
- Repeatedly explain what technology you used
- Brag about how good your design is

Caveats + next steps, done.
