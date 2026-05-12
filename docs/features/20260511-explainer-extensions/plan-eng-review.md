# Engineering Plan Review: Explainer Extensions v0.2

> Reviewer: Engineering Perspective | Date: 2026-05-11
> Plan: `03-plan.md` | Spec: `01-spec.md` | Design: `02-design.md`

---

## Blocking

### B-01: check-behavior-contract.sh will FAIL on v0.2 changes, but the plan treats it as a pass

**Task ref:** T9 (VERSION Bump + Behavior Contract Verification)

The plan says at line 407: "run `scripts/check-behavior-contract.sh` verification (should now pass because SKILL.md + README.md + workflow.md were synced in T7)." This assumption is wrong.

The script (`check-behavior-contract.sh`, lines 18-23) checks whether any of the three behavior-contract files (SKILL.md, README.md, references/workflow.md) changed. If ANY of them changed, it requires VERSION to also change AND requires ALL THREE contract files to be present in the same change. This is correct behavior.

However, the script's logic has a subtle issue for v0.2: it checks whether the files changed at all, not whether they changed first-turn behavior. T7 explicitly modifies all three contract files (adding Compare/DT routing rows, route-shaping questions, and sub-template routing logic). This means the script WILL detect a behavior-contract change and WILL require VERSION to be bumped. That part is fine -- T9 does bump VERSION.

But the real question the plan does not address: **does v0.2 actually change first-turn behavior?** The spec says "2 new templates + extended routing, but first-turn behavior (question-first delivery flow) is unchanged." If first-turn behavior is unchanged, then the behavior-contract files are being modified only to ADD routing entries, not to ALTER behavior. The script cannot distinguish between "additive routing change" and "behavior-altering change" -- it treats any modification to SKILL.md/README.md/workflow.md as a behavior change requiring VERSION bump.

This is a policy decision, not a bug in the script. Two options:

1. Accept that ANY change to behavior-contract files requires a VERSION bump (current script behavior). This means v0.2 MUST bump VERSION even though first-turn behavior is unchanged. The plan already does this (0.6.0 -> 0.7.0), so it will pass the script. But the plan's rationale ("should now pass because files synced") is misleading -- it passes because VERSION is bumped, not because the changes are non-behavioral.

2. Modify the script to distinguish additive routing changes from behavioral changes. This would require a more sophisticated check (e.g., diffing only specific sections of SKILL.md). This is not proposed in the plan and is probably not needed for v0.2, but it should be noted as a limitation.

**Recommended action:** Clarify in T9 that the script will pass because VERSION is bumped, not because the changes are non-behavioral. The plan's wording should not imply that v0.2 is exempt from the VERSION bump requirement. Additionally, update the Risk Notes section (item 5) to acknowledge that any modification to behavior-contract files triggers the script regardless of whether first-turn behavior changed.

### B-02: T4/T5 parallel execution has an implicit shared dependency on T2+T3 output format

**Task ref:** T4, T5, Wave 2 parallel execution

The plan states T4 and T5 "can be developed by different agents in parallel" because they are "different files." This is correct at the file level. However, both T4 and T5 depend on T2 (interaction patterns) and T3 (node-graph visuals) as reference docs. The plan does not specify what happens if T2 and T3 produce content that contradicts each other or that is incomplete relative to what T4/T5 need.

Specific risk: T2 and T3 are both "incremental" updates to existing reference files. If T2 adds Compare interaction patterns but T3 adds Compare visual parameters that are inconsistent (e.g., different stroke widths, different node size ranges), then T4 (which reads both) must resolve the conflict. When T4 and T5 are built by different agents simultaneously, neither agent can see the other's interpretation of the T2/T3 output, leading to divergent implementations.

**Recommended action:** Add a gate condition between Wave 1 and Wave 2 that requires T2+T3 outputs to be reviewed for consistency before T4/T5 begin. Specifically, verify that Compare parameters in T2 (interaction) and T3 (visuals) are consistent (e.g., same stroke width, same node sizes, same animation timings), and that DT parameters are similarly consistent. This can be a lightweight review step (~15 minutes) rather than a full approval cycle.

---

## Important

### I-01: T0 and T1 spikes overlap significantly with v0.1 validated architecture

**Task ref:** T0, T1

The plan proposes two separate spikes (T0 Compare, T1 DT) to validate HTML+SVG hybrid architecture. However, v0.1 (`flow_explainer.jsx`, 1256 lines) has already validated:
- HTML nodes + SVG overlay (pointer-events:none, aria-hidden) -- L1-17
- React+Babel CDN IIFE pattern -- L4-07
- expoOut easing, stroke-dasharray animation, ResizeObserver + debounce -- L1-01 through L1-04
- getBoundingClientRect / offsetTop/offsetLeft positioning -- L4-02, L4-03
- Three-breakpoint responsive layout -- L1-13

The spikes' verification items that are genuinely NEW (not already validated in v0.1):
- T0: #2 (dimension tab switcher), #4 (cross-column cubic bezier from A-right to B-left), #5 (verdict badge), #6 (5-dot score), #7 (dual encoding card layout)
- T1: #1 (BFS layout + parent centering), #2 (>5 siblings overflow), #3 (path highlighting via parent-pointer traversal), #6 (mobile indented vertical list)

Items that are NOT new and do not need re-validation:
- T0: #1 (two-column flexbox -- trivially different from v0.1 single-column), #3 (SVG overlay pointer-events:none -- already validated)
- T1: #4 (cubic bezier from parent bottom to child top -- same SVG overlay pattern, different endpoint calculation), #5 (conclusion shadow vs flat -- CSS property difference, not architecture question)

The spike scope is reasonable for risk mitigation, but the plan should explicitly acknowledge which items are already validated and which are genuinely novel. This prevents wasted effort re-testing known patterns and focuses spike time on the unknown items.

**Recommended action:** Refine T0/T1 verification lists to mark items as "validated in v0.1" vs "novel for v0.2." Spike time should focus exclusively on novel items. The "already validated" items can be checked during T4/T5 browser verification instead. This could reduce spike time from 1-2h each to ~30-45min each.

### I-02: Compare line estimate (1400-1700) is optimistic given interaction complexity

**Task ref:** T4

flow_explainer.jsx is 1256 lines with a relatively simple interaction model (linear step-through + hover focus). Compare has significantly more interaction complexity:
- Two-column layout with cross-column connections (vs single flow path)
- Overview/dimension state machine with 13 transitions (vs flow's ~6)
- Verdict badge hover with special "verdict-{subjectId}" ID format (unique to Compare)
- 4-phase animation sequences for 3 different transition types (overview->dimension, dimension->overview, dimension->dimension)
- Diff summary computation logic (kind comparison + score delta filtering)
- Dual encoding rendering (3 visual elements per card: color bar + icon + text label + 5-dot score)

The v0.1 flow_explainer handles: entering animation + 5-step linear progression + hover focus. The Compare template needs: entering animation + overview mode (verdict badges + diff summary + diff count) + dimension switcher + 4-phase animation sequences + hover detail with connections highlighting. This is approximately 2x the interaction surface of flow.

1256 lines * 1.5-1.8x (interaction complexity multiplier) = 1880-2250 lines, not 1400-1700. The schema comment + example data block alone is ~120 lines (based on the spec's React vs Vue example). Add component structure (CompareExplainer + SubjectColumn + ItemCard + VerdictBadge + DiffSummary + DimensionSwitcher + DetailPanel + CompareConnection + TapOverlay = 9 components vs flow's 5), animation logic, and responsive layout.

**Recommended action:** Adjust T4 estimate to 1500-2000 lines. This does not change the complexity rating (L) or time estimate (3h), but it sets more realistic expectations for the output size and makes the verification checklist more achievable within the time budget.

### I-03: DT line estimate (1300-1600) is reasonable but BFS layout may add unexpected complexity

**Task ref:** T5

DT's interaction model is simpler than Compare (8 state transitions vs 13, no dimension switching, no overview mode). However, the BFS layout computation is a novel algorithm that does not exist in v0.1. The plan acknowledges this in Risk Note #3, but the line estimate does not account for potential edge cases in BFS layout:

- What happens when a node has 0 children (leaf node at non-bottom level)?
- What happens when levels have different widths (unbalanced tree where level 2 has 1 node and level 3 has 5)?
- The parent centering rule (parentX = (minChildX + maxChildX) / 2) requires child positions to be computed first, which means layout must be computed bottom-up for centering but top-down for level assignment. This dual-pass is not mentioned in the plan or design.

The design (Inf-6) describes BFS layout as "BFS level + same-level horizontal uniform distribution + parent centering." The spec (decision_tree layout) says "BFS layer + same-layer horizontal uniform distribution." Neither document addresses the bottom-up centering pass requirement. This is exactly what T1 spike should validate, but the spike verification list does not explicitly test multi-level centering propagation (e.g., a 3-level tree where centering at level 2 shifts parent positions, which then requires re-centering level 1).

**Recommended action:** Add a specific test case to T1 spike: a 3-level tree where level 2 has 2 nodes (one with 3 children, one with 1 child) to verify that parent centering propagates correctly up the tree. Also add a note in T5 that BFS layout computation may need two passes (bottom-up centering + top-down level assignment), and adjust the estimate to 1400-1700 lines to account for this potential complexity.

### I-04: load-manifest.json keyword detection has a false-positive risk with "vs"

**Task ref:** T6

The plan proposes adding "vs" to the `anyKeywords` array for `interactive-explainer`. The current `interactive-prototype` taskType has "interactive flow" in its keywords (line 305), and `variant-exploration` has "compare options" (line 239). The keyword "vs" is extremely common in natural language ("vs yesterday", "vs the competition", "A vs B"). This creates two risks:

1. **False positives**: "vs" will match any prompt containing "vs" regardless of intent. A user saying "make a landing page for our product vs competitors" could be routed to interactive-explainer instead of landing-page.

2. **Overlap with variant-exploration**: "compare options" already exists in variant-exploration. The plan's T6 verification checks for overlap with interactive-prototype and data-visualization, but does NOT check variant-exploration.

The plan's keyword conflict avoidance section (lines 312-314) only mentions "interactive flow" (conflict with interactive-prototype) and "architecture layers" (low weight). It does not address "vs" or "compare" overlaps with variant-exploration's "compare options."

**Recommended action:** Remove "vs" from the anyKeywords list or restrict it to a regex pattern like `\b[A-Z][a-z]+\s+vs\s+[A-Z][a-z]+\b` (matching "React vs Vue" patterns but not generic "vs"). Also add variant-exploration to the T6 overlap verification checklist. Consider whether "compare" and "comparison" could similarly cause false positives with variant-exploration's "compare options" keyword.

### I-05: T7 updates three behavior-contract files but does not specify exact diff scope

**Task ref:** T7

T7 modifies SKILL.md, README.md, and references/workflow.md. The plan provides detailed SKILL.md changes (routing table rows + route-shaping questions) but is vague on README.md and workflow.md changes:

- README.md: "Add Compare Explainer + Decision Tree Explainer + short description to supported task type list." No specification of where in README this goes, what format, or how much detail.
- workflow.md: "Add interactive-explainer sub-template routing logic (flow vs compare vs decision_tree judgment rules)." No specification of which section, what format, or how this integrates with existing workflow content.

The check-behavior-contract.sh requires ALL THREE files to change together. If README.md or workflow.md changes are under-specified, an agent implementing T7 may make minimal changes that are inconsistent with the SKILL.md routing logic, or may inadvertently change first-turn behavior wording.

**Recommended action:** Add concrete content outlines for README.md and workflow.md changes to T7, similar to the detail provided for SKILL.md. For README.md, specify the exact section and format (e.g., "add two rows to the supported task types table in section X"). For workflow.md, specify the exact section and content format (e.g., "add sub-template routing decision tree in section Y, format: bullet list with condition -> template mapping").

---

## Suggestion

### S-01: Spike failure rollback path is underspecified

**Task ref:** T0, T1, Risk Note #1

Risk Note #1 says "if HTML+SVG hybrid architecture verification fails, rollback to pure SVG." But the plan does not define what "pure SVG" means in terms of implementation impact. Would it mean:
- All nodes rendered as SVG elements (losing HTML interactivity, CSS flexbox layout)?
- Or a different hybrid approach (e.g., Canvas instead of SVG overlay)?

Given that v0.1 has already validated the HTML+SVG hybrid architecture, the rollback probability is low. But if rollback is needed, the impact on T4/T5 estimates would be significant (pure SVG nodes require manual text layout, no CSS flexbox, different accessibility handling). The plan should at least acknowledge this impact on subsequent tasks.

**Recommended action:** Add a brief note: "If T0/T1 spike fails, T4/T5 estimates increase by ~50% and timeline extends by ~1h per template. Pure SVG fallback requires re-evaluating node layout strategy, accessibility compliance (SVG text vs HTML text), and responsive breakpoints."

### S-02: T10 acceptance test should include reduced-motion and keyboard navigation verification

**Task ref:** T10

T10's test prompts and verification checklist (lines 429-443) focus on routing, schema compliance, and visual correctness. The checklist does not include:
- prefers-reduced-motion behavior (skip entry, instant transitions, outline hover)
- Keyboard navigation (Tab to dimension buttons, Enter to switch dimensions, Tab to items, Esc to close overlay)
- Touch target size verification (48x48px minimum)

These are all part of the spec acceptance criteria (General #6, #7) and the exit-conditions (Interactive Explainer section, items about reduced-motion and keyboard). Without explicitly testing these, T10 may pass on visual/functional criteria while failing on accessibility criteria.

**Recommended action:** Add two verification items to T10:
- [ ] prefers-reduced-motion: at least one test run with `prefers-reduced-motion: reduce` enabled, verifying skip-entry + instant transitions + outline hover
- [ ] Keyboard navigation: at least one test navigating solely via Tab/Enter/Esc, verifying dimension switching and overlay dismiss

### S-03: VERSION bump from 0.6.0 to 0.7.0 may not align with semantic versioning expectations

**Task ref:** T9

The plan says "0.6.0 -> 0.7.0 because v0.2 is a feature extension version." But the current VERSION file contains "0.6.0" and the recent commits suggest 0.5.1 -> 0.6.0 was the v0.1 release bump. The "v0.2" label in the spec/design/plan refers to the explainer template product version, not the package version. This creates a naming collision: the product is "v0.2" but the VERSION file will be "0.7.0".

This is not a technical problem, but it could confuse future contributors who see "v0.2" in docs but "0.7.0" in VERSION. The plan should clarify this mapping explicitly.

**Recommended action:** Add a note in T9: "VERSION 0.7.0 corresponds to explainer product v0.2. The VERSION file follows the cc-design package versioning (0.x.y minor bumps for feature additions), while the spec/design/plan use 'v0.2' to refer to the explainer template release milestone."

### S-04: Wave 3 T8 dependency declaration is inconsistent

**Task ref:** T8

T8 (exit-conditions update) declares "Depends: None" (line 368) but also says "suggest committing in the same change as T7 to maintain consistency." The dependency graph (line 461) shows T8 -> T9 independently, with T8 parallel to T7. But if T8 is committed in the same change as T7 (per the suggestion), then T8 effectively depends on T7 for commit timing, even though it has no content dependency.

This inconsistency could cause execution confusion: an agent might start T8 immediately in Wave 3 while T7 is still in progress, produce the exit-conditions content, but then need to wait for T7 to finish before committing. The plan should either make T8 explicitly depend on T7 (for commit synchronization) or make T8 fully independent with a separate commit.

**Recommended action:** Either change T8's dependency to "T7 (for commit sync)" or remove the suggestion about same-change commit and let T8 be a standalone commit. Given that check-behavior-contract.sh requires behavior-contract files (SKILL.md, README.md, workflow.md) to change together but does NOT require exit-conditions to be in the same change, T8 can safely be an independent commit.

### S-05: Connection label bubble rendering is unspecified for edge midpoint calculation

**Task ref:** T0, T4, design KD2

The design (KD2, line 258) specifies connection labels at "path midpoint, 12px font, #6B7280, white bubble (#FAFAFA, radius 4px, padding 4px 8px)." However, the midpoint of a cubic bezier curve is not simply (start + end) / 2 -- it requires evaluating the bezier at t=0.5, which gives a different position than the arithmetic midpoint when the curve has significant curvature.

For cross-column connections (Compare: from A-column item right edge to B-column item left edge), the curvature may be significant (the curve bows upward or downward to avoid overlapping items). The midpoint calculation affects label placement, which in turn affects readability.

T0 spike verification item #4 checks "cross-column cubic bezier connection endpoint alignment" but does not check label midpoint positioning. T4's CompareConnection component will need to implement bezier midpoint evaluation.

**Recommended action:** Add to T0 spike verification: "connection label positioned at bezier curve midpoint (not arithmetic midpoint), visually centered on curve." In T4, specify that CompareConnection must evaluate bezier at t=0.5 for label placement using the standard cubic bezier formula: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3.