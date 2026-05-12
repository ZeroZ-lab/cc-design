# CEO Review: Explainer Extensions v0.2 Plan

> Reviewer: CEO perspective | Date: 2026-05-11 | Plan: `03-plan.md` | Spec: `01-spec.md`

---

## 1. v0.2 Scope: Compare + DT Only, Layer Deferred

### Assessment: Correct decision, well-justified

The spec explicitly names Compare and Decision Tree as the two highest-value explainer extensions. The reasoning is sound:

- **Compare** addresses a measurable pain point (72% of top e-commerce sites offer comparison; 68% of users prefer "only differences" toggle, per L3-01). This is a GTM/sales-facing feature with direct revenue impact.
- **Decision Tree** addresses a technical decision-making pain point (tech selection, architecture choices). This is a developer/advocate-facing feature with community growth impact.
- **Layer** is architecturally different (click-to-expand + inter-layer connections) and does not share the same interaction model surface. Deferring it avoids mixing two distinct interaction paradigms in one release.

The "不做" list in the spec is disciplined. Nine items are explicitly excluded with clear reasons. This is good scope control.

**One concern:** The plan adds "architecture layers" as a detection keyword in T6, but the corresponding template (`layer_explainer.jsx`) won't exist until v0.3. This means v0.2 will route "architecture layers" prompts to `flow_explainer.jsx` as a fallback. This is acceptable only if the routing logic in T7/SKILL.md explicitly documents this gap. If a user says "make an architecture layer explainer" and gets a flow diagram, that is a broken expectation -- not just a missing feature.

---

## 2. Wave Execution Order: Is It Optimal?

### Assessment: Wave 1 is optimal. Wave 2 has a risk that should be mitigated.

**Wave 1 (T0 + T1 + T2 + T3, all parallel)** is the right order. Spikes and reference docs have zero downstream risk and maximum upstream value. Running all four in parallel is the highest-leverage opening move.

**Wave 2 (T4 + T5, two large templates in parallel)** is where the plan's ROI could be improved:

- T4 (compare_explainer.jsx, 1400-1700 lines) and T5 (decision_tree.jsx, 1300-1600 lines) are both estimated at 3h each. Combined, they represent 6h -- half the total 12h estimate.
- The plan says they can be developed by "different agents in parallel." But if a spike fails (T0 or T1), the corresponding template's architecture changes, which cascades into T2/T3 reference docs needing revision.
- **Higher ROI alternative:** Serialize T4 first, then T5. Compare has more interaction complexity (13-state transition table, 4-phase animation sequence, overview/dimension/hoveredItem three-layer state) and is the higher-value GTM feature. Building it first means:
  - Spike failure on T0 is discovered and resolved before T5 starts.
  - The compare template's patterns (dual encoding, connections, detail panel) can inform DT's simpler model, reducing DT's build time.
  - If timeline pressure hits, DT can be cut from v0.2 without losing the highest-value deliverable.

**Wave 3 and Wave 4** are correctly sequenced. T6 -> T7 -> T9 is a tight dependency chain that cannot be parallelized further. T8 alongside T7 is a valid parallelization.

---

## 3. T4/T5 Parallel Risk: Two Large Templates Simultaneously

### Assessment: Risk is real but manageable. The plan should add a fallback gate.

The two templates share ~60% utility code (expoOut, debounce, animateValue, prefersReducedMotion, ResizeObserver debounce, SVG overlay pattern). But they have fundamentally different interaction models:

- Compare: 3-state dimension model (overview + dimension + hoveredItem), cross-column connections, verdict badges
- Decision Tree: 2-state model (hoveredNode + highlightedPath), BFS layout, path computation

Building both simultaneously means:

1. If T0 spike reveals that HTML+SVG overlay for cross-column connections doesn't work (pointer-events conflict, coordinate drift), T4 needs an architecture pivot that may invalidate T2/T3 reference assumptions.
2. If T1 spike reveals that BFS parent-centering produces unacceptable layouts for trees with 6+ levels, T5 needs layout algorithm changes.
3. Both scenarios require T2/T3 revision, which blocks the other template.

**Mitigation:** Add a spike-to-template gate review between Wave 1 and Wave 2. If either spike fails, stop the corresponding template's Wave 2 entry and re-plan. Do not proceed on assumptions.

---

## 4. Complexity Estimates: Are They Reasonable?

### Assessment: Template estimates are optimistic. Total workload is borderline acceptable.

**Line count comparison:**

- `flow_explainer.jsx` (v0.1): 1256 lines actual
- `compare_explainer.jsx` estimate: 1400-1700 lines
- `decision_tree.jsx` estimate: 1300-1600 lines

Compare has more interaction states (13 transitions vs. flow's simpler step model), overview mode, verdict badges, dual encoding, score dots, and cross-column connections. The 1400-1700 estimate seems plausible but tight -- the additional interaction complexity could push it to 1800+.

Decision Tree has BFS layout computation, path highlighting, and conclusion emphasis. 1300-1600 seems reasonable but also tight -- BFS layout with parent-centering and mobile indented list is two distinct layout engines in one template.

**Time estimates:**

| Task | Estimate | Concern |
|------|----------|---------|
| T0 | 1-2h | Reasonable for a spike |
| T1 | 1-2h | Reasonable |
| T2 | 1h | Reasonable (incremental doc) |
| T3 | 1h | Reasonable (incremental doc) |
| T4 | 3h | **Underestimated.** 1400-1700 lines of interactive JSX with 3-state model, 4-phase animation, responsive breakpoints, WCAG dual encoding, and error boundary. 4-5h is more realistic. |
| T5 | 3h | **Underestimated.** Two layout engines (BFS desktop + indented mobile) plus path computation plus sticky overlay. 4-5h is more realistic. |
| T6 | 0.5h | Reasonable |
| T7 | 1.5h | Reasonable (3-file sync with routing logic) |
| T8 | 0.5h | Reasonable |
| T9 | 0.5h | Reasonable |
| T10 | 2h | Reasonable but could stretch if schema compliance issues surface |

**Revised total: ~14-16h** instead of the plan's ~12h. This is a 25-33% underestimate on the two hardest tasks.

For a single-agent execution, 14-16h is a significant commitment. For a multi-agent execution (as the plan envisions for T4/T5), it's feasible but requires coordination overhead that isn't accounted for.

---

## Review Findings

### Blocking

1. **T6 detection keywords include "architecture layers" but no layer template exists in v0.2.** If a user prompt contains "architecture layers," cc-design will route to `flow_explainer.jsx`, which is a step-by-step flow -- not a layered architecture. This is a broken user expectation, not just a missing feature.
   - **Fix:** Remove "architecture layers" and "架构分层" and "分层解释" from T6's keyword list. Add them back when `layer_explainer.jsx` ships in v0.3. Document this in T7's route-shaping questions as "分层架构" -> "currently uses flow_explainer as fallback, v0.3 will have dedicated template."

2. **T4 and T5 time estimates are 25-33% too low.** 3h each for 1400-1700 line interactive templates with multi-state interaction models, responsive breakpoints, animation sequences, and WCAG compliance is unrealistic.
   - **Fix:** Re-estimate T4 at 4-5h and T5 at 4-5h. Update total to ~14-16h. If this exceeds acceptable budget, consider serializing T5 after T4 to allow partial delivery if time runs out.

### Important

3. **Serialize T4 before T5 for higher ROI.** Compare is the higher-value GTM feature (directly addresses sales/presales comparison needs). Building it first means: (a) spike failures are resolved before DT starts, (b) Compare patterns inform DT's simpler build, (c) DT can be cut from v0.2 if timeline pressure hits without losing the primary value deliverable. Parallel execution of T4/T5 saves wall-clock time but increases risk of both templates needing rework if either spike fails.
   - **Suggestion:** Change Wave 2 to: "T4 first, T5 after T4 completes (or after T0 spike gate)." If parallel agents are available and both spikes pass, T5 can still start early -- but T4 should complete first.

4. **Add a spike gate review between Wave 1 and Wave 2.** If T0 or T1 spike fails (HTML+SVG hybrid architecture doesn't work), the corresponding template needs an architecture pivot. Currently the plan has no formal review point -- it assumes spikes pass and proceeds directly to T4/T5.
   - **Fix:** Add an explicit gate condition after Wave 1: "Review T0 and T1 spike results. If either fails, replan the corresponding template before starting Wave 2." This prevents wasted work on templates built on invalid assumptions.

5. **VERSION bump logic needs clarification.** The plan says "current VERSION=0.6.0, v0.2 -> 0.7.0." But v0.2 refers to the explainer extension's version, while 0.6.0/0.7.0 refers to cc-design's overall version. The mapping between "explainer v0.2" and "cc-design 0.7.0" is implicit. If other features ship between 0.6.0 and this release, the bump should still be 0.7.0 (one minor version bump per release), but the plan should document this assumption explicitly.
   - **Fix:** Add a note in T9: "VERSION bump is cc-design minor version, not explainer version. If other features ship first, adjust bump accordingly."

### Suggestion

6. **T10 acceptance test prompt #5 ("对比 Docker vs Kubernetes 的部署策略") tests a Compare+DT hybrid tendency.** This is valuable for testing routing accuracy, but the plan does not define what "correct" routing looks like for a hybrid prompt. Is it Compare? DT? Flow? The spec has no guidance for ambiguous prompts.
   - **Suggestion:** Add a routing expectation for test #5 in T10. For example: "Expected route: compare_explainer (because the prompt emphasizes comparison, not decision paths). If routed to decision_tree, that is also acceptable (because deployment strategy involves decisions). Flow is incorrect."

7. **T2 and T3 reference docs should be reviewed by the template builder.** The plan has T2/T3 in Wave 1 and T4/T5 in Wave 2, but the reference docs are written without seeing the actual template implementation. If the spike reveals architectural changes, T2/T3 may need revisions that aren't accounted for.
   - **Suggestion:** Add a lightweight "ref doc sanity check" step in Wave 2 before starting T4/T5. The template builder should read T2/T3 and confirm the interaction patterns and visual parameters match what the spike validated. If they diverge, update T2/T3 first.

8. **The plan does not mention `scripts/lint-load-manifest.mjs` and `scripts/generate-bundle-catalog.mjs`, which are required by CLAUDE.md contributing rules.** T6 should explicitly include running both scripts as part of verification.
   - **Suggestion:** Add to T6 verification: "Run `node scripts/lint-load-manifest.mjs` and `node scripts/generate-bundle-catalog.mjs` -- both must pass."

9. **Error boundary testing is mentioned in T4/T5 verification but not in T10 acceptance tests.** The acceptance test should include at least one scenario that tests error boundary behavior (e.g., a prompt that produces 0 connections for Compare, or 0 edges for DT).
   - **Suggestion:** Add a 6th test prompt to T10: "做一个只有两个对象的对比，不提供连线数据" (tests Compare with 0 connections). Or document that error boundary testing is covered by the template verification in T4/T5, not by T10.

---

## Summary

| Dimension | Rating | Key Issue |
|-----------|--------|-----------|
| Scope priority | Good | Compare + DT are the right v0.2 deliverables; Layer deferral is correct |
| Wave execution | Needs adjustment | Serialize T4 before T5; add spike gate review |
| T4/T5 parallel risk | Manageable | Spike failure cascades to reference docs; needs formal gate |
| Complexity estimates | Underestimated | T4/T5 should be 4-5h each; total ~14-16h not 12h |
| Keyword routing | Has a bug | "architecture layers" keyword without template is a broken expectation |

**Overall:** The plan is well-structured and the spec/design groundwork is thorough. The two blocking issues (keyword routing gap and time underestimate) are fixable without re-architecting the plan. The important suggestion (serialize T4 first) improves ROI and reduces risk. With these adjustments, the plan is ready for execution.