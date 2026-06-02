# Question-First Delivery: Worked Examples

This file supports `SKILL.md` P1.5. It contains canonical examples for structured confirmation using `AskUserQuestion` (Claude Code) and text fallback (Codex).

---

## AskUserQuestion Usage

- `question` — clear and specific, ending with `?`
- `header` — short label, max 12 chars (e.g. `"Context"`, `"Direction"`, `"Variations"`)
- `options` — 2-4 options, each with `label` (1-5 words) and `description` (1 sentence explaining the choice)
- `multiSelect: true` — only when multiple answers can apply simultaneously

**Text fallback (Codex only — do NOT use on Claude Code):**
```
<question>
<number>) <option>
<number>) <option>
```

Rules:
- **Step-by-step** — 1 question per step, not one giant questionnaire
- **2-4 short options** per question — never more
- Stop asking once blocking uncertainty is resolved
- Rich briefs skip most questions, but still require a visible plan before build
- Explicit speed requests compress to a mini-plan, but still plan unless the user explicitly says to skip

---

## Canonical Example — Claude Code

Use `AskUserQuestion` for each step:

**Step 1 — context**
→ `AskUserQuestion` with header `"Context"`, question `"Do you already have a design system or screenshots I should match?"`, options:
  1. `"Yes, I have references"` — brand guide, screenshots, UI kit, or design files to match
  2. `"No, work from scratch"` — create a new design direction without references

**Step 2 — direction confirmation**
→ `AskUserQuestion` with header `"Direction"`, question `"I understand we're building a landing page (Stripe-style) for SaaS buyers, with sign-up as the core action. Is this correct?"`, options:
  1. `"Yes, proceed"` — direction is correct, continue to next step
  2. `"No, adjust the type"` — the output format needs to change
  3. `"No, adjust the audience"` — the target audience needs to change

**Step 3 — variations**
→ `AskUserQuestion` with header `"Variations"`, question `"How broad should the exploration be?"`, options:
  1. `"1 direction"` — close to expected, single focused design
  2. `"3 directions"` — conservative → bold, multiple options to compare

**Step 4 — fidelity/scope**
→ `AskUserQuestion` with header `"Scope"`, question `"What should I build first?"`, options:
  1. `"One screen"` — single high-fidelity screen
  2. `"One complete flow"` — full user journey across screens
  3. `"Wireframe pass first"` — low-fidelity structure before detailed design

**Step 5 — plan**
Present the plan inline, then:
→ `AskUserQuestion` with header `"Plan"`, question `"Approve this plan, or tell me what to change before I build."`, options:
  1. `"Approve"` — proceed with the build
  2. `"Adjust scope"` — change fidelity, screen count, or variation breadth
  3. `"Adjust direction"` — change the design approach or assumptions

---

## Canonical Example — Text Fallback (Codex Only)

```markdown
Step 1 — context
Do you already have a design system or screenshots I should match?
1) Yes, I have references
2) No, work from scratch

Step 2 — direction confirmation
Based on our answers so far, I understand we're building:
- Type: landing page
- Context: brand reference (Stripe)
- Audience: SaaS buyers, technical
- Core action: sign up for free trial

Is this direction correct?
1) Yes, proceed
2) No, adjust the type
3) No, adjust the audience

Step 3 — variations
How broad should the exploration be?
1) 1 direction, close to expected
2) 3 directions, conservative → bold

Step 4 — fidelity/scope
What should I build first?
1) One screen
2) One complete flow
3) A low-fi wireframe pass first

Step 5 — plan
Plan
- Goal: ...
- Confirmed facts: ...
- Assumptions: ...
- First artifact: ...
- Variation axes: ...
- Verification: ...

Approve this plan, or tell me what to change before I build.
```
