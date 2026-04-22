# Workflow: Supporting Guide for Question-First Delivery

This file supports `SKILL.md`. It does not define an independent product workflow.

The runtime contract lives in `SKILL.md`:
- new ambiguous tasks start with one batch of clarifying questions
- richly specified briefs can skip to explicit assumptions
- follow-up iterations and minor fixes act directly unless scope changes

Use this file to structure the question batch and the follow-through after that decision has already been made.

---

## Relationship to 8-Layer Design Framework

This workflow is the **execution process**. The 8-layer framework (`design-thinking-framework.md`) is the **thinking structure**.

**Mapping:**

| Workflow Step | 8-Layer Framework | Purpose |
|---------------|-------------------|---------|
| **Step 1: Understand** (Question batch) | Layer 1 (Goal) + Layer 2 (Information) | Clarify objectives, audience, scope, information priorities |
| **Step 2: Route** (Load references) | Layer 2-7 (task-dependent) | Load theory and patterns for relevant layers |
| **Step 3: Acquire Context** (Design system/brand) | Layer 6 (Brand) + Layer 7 (System) | Understand existing constraints and brand personality |
| **Step 4: Design** (Build artifacts) | Layer 3 (Structure) + Layer 4 (Interaction) + Layer 5 (Visual) | Execute structure, interaction, and visual design |
| **Step 5: Verify** (Check quality) | Layer 8 (Validation) | Test technical feasibility, usability, design quality |
| **Step 6: Iterate** (Refine based on feedback) | Layer 8 → Layer 1 (feedback loop) | Use validation results to refine goals and execution |

**When to use which:**
- **Use workflow.md** for step-by-step execution guidance
- **Use design-thinking-framework.md** when you need to diagnose problems, resolve conflicts, or understand "why" behind decisions
- **Use both together** for complex multi-screen flows or design system creation

## First-Turn Rule

Treat this as supporting guidance, not an override:

- **Ask a batch** for new tasks with missing audience, scope, output shape, hard constraints, or reference context
- **Skip to assumptions** only when the brief is already rich, or the user explicitly asks to move fast
- **Act directly** for follow-up iterations and minor fixes

If you are unsure which path applies, default to the question batch. Do not invent a fourth path.

## The Art of Asking Questions

Ask one batch, not a back-and-forth drip.

Default target:
- 7 questions

Allowed range:
- 5 questions for narrow tasks
- 10 questions for broad multi-surface tasks

After the batch:
- ask at most one follow-up round
- only ask follow-ups for critical blocking fields
- if critical fields are still unknown after one follow-up round, proceed with explicit assumptions

Critical blocking fields:
- output shape
- audience
- scope
- hard constraints that would materially change the direction

Non-blocking fields:
- optional refinements
- tweak controls
- secondary taste preferences

## Required Question Checklist

When you are in the question-first path, clarify these 5 categories:

### 1. Design Context (Most Important)

- Is there an existing design system, UI kit, or component library? Where?
- Is there a brand guideline, color spec, typography spec?
- Are there screenshots of an existing product/page to reference?
- Is there a codebase to read?

**If the user says "no"**:
- Help them find it -- look through project directories, check for reference brands
- Still nothing? Say explicitly: "I'll work from general intuition, but this usually can't produce work that fits your brand. Would you consider providing some references first?"
- If you must proceed, follow the fallback strategy in `references/design-context.md`

### 2. Variations Dimensions

- How many variations do you want? (Recommend 3+)
- Which dimensions to vary on? Visual/interaction/color/layout/copy/animation?
- Do you want all variations "close to the expected result" or "a map from conservative to wild"?

### 3. Fidelity and Scope

- How high fidelity? Wireframe / semi-finished / full hi-fi with real data?
- How much flow to cover? One screen / one flow / entire product?
- Are there specific "must include" elements?

### 4. Tweaks

- Which parameters should be adjustable in real time? (color/font size/spacing/layout/copy/feature flags)
- Will the user want to continue tweaking after completion?

### 5. Task-Specific Questions (At Least 4)

Ask 4+ detail questions specific to the task. For example:

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

## Question Template Example

When encountering a new task, you can copy this structure to ask in the conversation:

```markdown
Before starting, I want to align on a few questions. List them all at once, you can answer in batch:

**Design Context**
1. Do you have a design system/UI kit/brand guidelines? If so, where?
2. Are there existing products or competitor screenshots to reference?
3. Is there a codebase in the project I can read?

**Variations**
4. How many variations do you want? On which dimensions (visual/interaction/color/...)?
5. Do you want all variations "close to the answer" or a map from conservative to wild?

**Fidelity**
6. Fidelity: wireframe / semi-finished / full hi-fi with real data?
7. Scope: one screen / one entire flow / entire product?

**Tweaks**
8. Which parameters should be adjustable in real time after completion?

**Task-Specific**
9. [Task-specific question 1]
10. [Task-specific question 2]
...
```

## After the Question Batch

Once the question batch is answered, or once unanswered critical fields have been converted into explicit assumptions, move into delivery.

### Direction Memo (Only When Needed)

If questions were skipped, or the user explicitly asked for speed, write a short direction memo before building:

```html
<!--
Direction memo:
- This is for XX audience
- Output shape: XX
- Tone: XX
- The main flow is A→B→C
- Key constraints: XX
-->
```

Rules:
- 3 to 6 bullets maximum
- this is not a separate deliverable
- this is only a bridge into the actual build
- do not reopen the full question flow unless audience, scope, or output type changes

### Main Work

After the direction is clear:
- Write React components to replace placeholders
- Create variations (using design_canvas or Tweaks)
- If it's slides/animation, start with starter components

Show again halfway through. If the design direction is wrong, showing late means wasted work.

### Detail Polish

After the user is satisfied with the overall direction, polish:
- Font size/spacing/contrast fine-tuning
- Animation timing
- Edge cases
- Tweaks panel refinement

### Verification + Delivery

- Use Playwright to screenshot (see `references/verification.md`)
- Open in browser and visually confirm
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
