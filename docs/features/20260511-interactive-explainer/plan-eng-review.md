# Engineering Plan Review: Interactive Explainer

> Reviewer: Engineering Plan Reviewer | Date: 2026-05-11 | Plan: `03-plan.md`

---

## Blocking

### B1. T7 misses behavior-contract file changes that `check-behavior-contract.sh` requires

**Ref:** T5 (SKILL.md), T7 (version + behavior contract)

`check-behavior-contract.sh` enforces that `SKILL.md`, `README.md`, and `references/workflow.md` must all change together when any one of them changes. T5 modifies `SKILL.md` (routing table + route-shaping questions). But:

- T5 does not mention `README.md` changes, and no task in the plan touches `README.md`.
- T5 does not mention `references/workflow.md` changes, and no task in the plan touches it.
- T7 says it runs `check-behavior-contract.sh` but does not add the missing contract files to any task's scope.

If T5 edits SKILL.md without also editing README.md and references/workflow.md, the script will fail at T7. If README.md genuinely does not need to change, then the plan must either (a) argue why the script should be updated to allow partial changes, or (b) explicitly state that no SKILL.md change will be made and all routing will live in load-manifest.json only.

**Recommendation:** Add explicit scope to T5 to update `README.md` (add interactive-explainer to example prompts / feature list) and `references/workflow.md` (add explainer to route-shaping guidance if applicable). Or restructure so routing is purely in `load-manifest.json` with no SKILL.md change.

---

### B2. T3 "Parallel: Unsafe" but no spike task to validate the HTML+SVG hybrid rendering approach

**Ref:** T3 (template), Design KD4/KD5

The template relies on an unproven pattern within this codebase: HTML nodes positioned via flexbox + SVG overlay connected via `getBoundingClientRect()`. While Design doc calls this "mature" (it is a standard web pattern), it has never been implemented inside cc-design's single-file JSX+Babel CDN constraint. Specific risks:

1. `getBoundingClientRect()` coordinates are viewport-relative. In a scrollable mobile container these drift. The Design mentions using `offsetTop/offsetLeft` for mobile, but the Plan does not require a spike to confirm this works inside a React+Babel CDN environment with no build step.
2. `ResizeObserver` + debounce to recalculate SVG paths -- this has non-trivial interaction with React's state model in a single-file template without a bundler.
3. `path.getTotalLength()` for dynamic dasharray -- needs verification that this works correctly in the CDN-only rendering context.

All of these are plausible but unvalidated assumptions. T3 is marked L (large) with High risk, which acknowledges the complexity, but there is no spike or proof-of-concept task before committing to the full template build.

**Recommendation:** Add a T0 (or T2.5) spike task: "Validate HTML+SVG hybrid rendering in a single-file JSX+Babel CDN template" with exit criteria: a minimal 2-node diagram with correct SVG edge positioning, responsive resize, and no console errors. This spike should be S complexity and can run in parallel with T1/T2. If the spike fails, the architecture decision (KD4) needs revisiting before T3 starts.

---

### B3. Dependency graph has T6 listed in both Wave 1 and Wave 3 with conflicting parallelism

**Ref:** Plan "Parallel Execution" section, Dependency Graph

The Dependency Graph shows T6 with `Depends: None`, correctly placing it in Wave 1. But the Parallel Execution section lists T6 in both Wave 1 AND Wave 3:

```
Wave 1: T1 + T2 + T6
Wave 3: T4 + T6  (T4 depends on T3)
```

T6 (exit-conditions.md) has no dependency on T4. It should only appear in Wave 1. The Wave 3 listing is an error.

**Recommendation:** Remove T6 from Wave 3. T6 should only be in Wave 1.

---

## Important

### I1. T4 keyword overlap with existing taskTypes is not validated

**Ref:** T4 (load-manifest.json)

The plan lists keywords like `"explain how"`, `"interactive flow"`, `"interactive process"`. Existing `interactive-prototype` already has `"interactive flow"` in its detect keywords. The keyword `"system architecture"` in `design-system-architecture` could overlap with `"system flow explainer"`. T4's verification only says "no overlap" as a checkbox but does not specify how to validate this. A keyword match test against all existing taskTypes is needed.

**Recommendation:** Add a concrete verification step to T4: run `scripts/resolve-load-bundles.mjs --prompt "<each keyword>"` and verify that each prompt resolves to `interactive-explainer` only, not to `interactive-prototype` or `design-system-architecture`. Remove `"interactive flow"` from the proposed keywords (it conflicts with `interactive-prototype`).

---

### I2. T3 verification criteria mix "no console errors" with complex interaction tests that require manual browser inspection

**Ref:** T3 Verification checklist

Items like "Step-by-step playback: all 5 steps navigable, highlight/dim correct" and "Hover focus: desktop hover shows detail + associated edge highlight" require a human or complex automated test to verify. But T8 (e2e test) is the only task that does actual testing, and T8 depends on ALL other tasks. This means T3 can be "complete" without any actual verification, and bugs are only caught at T8.

**Recommendation:** Split T3 verification into two tiers:
- **Build-complete criteria** (verifiable by code inspection): schema comment exists, all component functions defined, RAG example data present, prefers-reduced-motion media query present, CSS for 3 breakpoints present.
- **Runtime criteria** (moved to T8 or a new T3.5 browser-test task): all interactive behaviors verified in browser.

This makes T3's exit condition honest about what code review can verify vs. what needs runtime testing.

---

### I3. T8 does not specify who runs the tests or how

**Ref:** T8

T8 says "Use 5 different prompts to test the full pipeline, verify schema compliance rate >= 4/5." But it does not specify:
- Who generates these prompts (the AI agent? a human?)
- How "schema compliance" is measured (manual inspection? automated validation?)
- What "route correctly identified" means in practice -- is this checked by inspecting which references were loaded?

Without these details, T8's exit criteria ("5/5 pass or >=4/5 with fix path") is ambiguous.

**Recommendation:** Specify the test execution method. For an AI-driven skill, the most realistic approach is: the implementing agent runs each prompt through itself, records which taskType was matched (from the Load announcement), generates the HTML, opens it in browser, and checks for console errors + basic interaction. Add a concrete checklist per test case.

---

### I4. Missing `references/react-setup.md` from the interactive-explainer taskType references

**Ref:** T4 (load-manifest.json), Design "Technical constraints"

Design says "Use React+Babel CDN (same as other cc-design templates)" and the Technical Constraints section of T3 mentions this. But the proposed load-manifest.json entry for `interactive-explainer` does not include `references/react-setup.md` in its references array. Every other React-template taskType (`react-prototype`, `interactive-prototype`, `mobile-mockup`, `desktop-mockup`) includes `references/react-setup.md`.

**Recommendation:** Add `"references/react-setup.md"` to the `interactive-explainer` references array in T4.

---

### I5. T3 error boundary requirements are underspecified

**Ref:** T3 item 10: "Error boundary (schema validation failure, 0 steps, single node degradation)"

"Error boundary" in a React+Babel CDN context (no build step, no React.ErrorBoundary class component easy use) needs clarification. The plan does not specify what the degraded rendering looks like for edge cases:
- 0 steps: show the flow diagram only, no step panel?
- Single node: show a single box with no edges?
- Schema validation failure: show a fallback message? crash?

**Recommendation:** Define concrete fallback behavior for each edge case in T3's description, or move error boundary to v0.2 and have the template assume well-formed data (since AI generates the data from the embedded schema).

---

### I6. Complexity estimate for T8 (M) may be too low

**Ref:** T8 Complexity Summary

T8 requires running 5 end-to-end tests through the AI skill, each involving: prompt interpretation, route resolution, reference loading, template copying, AI generation, browser rendering, and interaction verification. This is the most manual and unpredictable task. M seems right for effort, but the risk should be High (not Medium) because failures in T8 may reveal fundamental issues in the template or routing that require going back to T3/T4.

**Recommendation:** Upgrade T8 risk from Medium to High.

---

## Suggestion

### S1. T1 and T2 could include cross-reference to each other

**Ref:** T1, T2

Both reference documents describe aspects of the same system. T1 covers interaction patterns (how things behave), T2 covers visual specs (how things look). There are overlapping concerns (e.g., Focus+Context dimming appears in both interaction patterns and visual specs; responsive breakpoints appear in both). Without explicit cross-reference guidance, the two docs may contradict each other.

**Recommendation:** Add a note to T1 and T2: "Cross-reference explainer-node-graph-visuals.md for visual parameters of all interaction behaviors" / "Cross-reference explainer-interaction-patterns.md for the behavioral context of all visual specs."

---

### S2. Consider a `templates/flow_explainer.css` or inline style approach decision

**Ref:** T3

The plan does not specify whether CSS will be inline (style attributes), in a `<style>` block at the top, or extracted into a separate file. Other cc-design JSX templates vary in approach. Given the amount of CSS needed (3 breakpoints, animation keyframes, hover states, dimming states, responsive layout), a `<style>` block approach should be explicitly chosen and documented in T3 to avoid mid-build bikeshedding.

**Recommendation:** Add to T3's Technical Constraints: "All CSS in a single `<style>` block at the top of the JSX template (consistent with existing templates like `animations.jsx`)."

---

### S3. Plan does not mention updating `scripts/generate-bundle-catalog.mjs`

**Ref:** T4

Adding a new taskType to `load-manifest.json` means the bundle catalog (generated by `scripts/generate-bundle-catalog.mjs`) will automatically include it. But the plan does not mention regenerating or verifying the catalog. If the catalog generation script has any issues with the new entry format, it could break semantic matching.

**Recommendation:** Add a verification step to T4: "Run `node scripts/generate-bundle-catalog.mjs` and confirm the new `interactive-explainer` entry appears correctly in the output."

---

### S4. T5 Route-Shaping Questions should be more specific

**Ref:** T5

The proposed route-shaping logic says "if user request involves 'explaining flow/mechanism/architecture' + 'interactive' -> route to interactive-explainer." But this is vague. A concrete decision tree with example prompts would help the AI make correct routing decisions.

**Recommendation:** Provide 3-4 example prompts for each route (explainer vs. prototype vs. data-visualization) in T5, similar to how the spec's keyword list differentiates them.

---

### S5. T3 token estimate (~8K) may be tight for an L-complexity template

**Ref:** T3 Complexity Summary

A single-file JSX template with 7 React components (FlowExplainer, FlowDiagram, FlowNode, FlowEdge, StepPanel, StepNav, DetailPopup), complete RAG example data, animation sequences, responsive CSS, keyboard navigation, error handling, and prefers-reduced-motion support is substantial. 8K tokens is likely the lower bound. For comparison, `animations.jsx` alone is a complex single-file template.

**Recommendation:** Consider bumping T3 estimate to ~10-12K tokens to set realistic expectations. This does not change task complexity (L is correct) but helps with planning.

---

## Summary

| Level | Count | Key themes |
|-------|-------|------------|
| Blocking | 3 | Missing contract file changes (B1), unvalidated hybrid rendering architecture (B2), dependency graph error (B3) |
| Important | 6 | Keyword overlap risk (I1), unverifiable T3 criteria (I2), ambiguous T8 test method (I3), missing react-setup reference (I4), underspecified error boundaries (I5), T8 risk level (I6) |
| Suggestion | 5 | Cross-references between docs (S1), CSS approach decision (S2), catalog regeneration (S3), route-shaping specificity (S4), token estimate (S5) |

**Overall assessment:** The plan is well-structured with clear task boundaries and reasonable parallelization. The three blocking issues must be resolved before execution begins. B1 (contract files) is the most critical because it will cause a hard failure at T7. B2 (architecture spike) is important to avoid a costly rewrite if the HTML+SVG hybrid approach has issues in the CDN-only environment. B3 is a documentation fix that is trivial to resolve.
