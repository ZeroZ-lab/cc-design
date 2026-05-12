# Scout-Eng Feedback: Explainer Extensions v0.2

Date: 2026-05-11
Reviewer: engineering scout
Inputs: 01-spec.md, external-scan-results.md, flow_explainer.jsx (1257 lines), react-setup.md, explainer-interaction-patterns.md, explainer-node-graph-visuals.md, load-manifest.json

---

## Verdict

**Important** -- The three templates are feasible within the React+Babel CDN constraint and share enough infrastructure with flow_explainer to make the shared-framework approach viable. However, several findings require clarification or scope adjustment before entering design phase. No hard blockers, but the Decision Tree layout algorithm choice and the per-template line count estimates need tightening.

---

## Evidence Used

- **local**: flow_explainer.jsx (1257 lines actual, IIFE pattern, window export, ResizeObserver+debounce, animateValue, expoOut, entry animation sequencing, SVG overlay with getBoundingClientRect, state machine entering/ready, DetailPopup mobile overlay), react-setup.md (3 non-negotiable rules: unique style names, manual window export, no scrollIntoView), explainer-interaction-patterns.md (priority stack, dimming strategy, responsive breakpoints), explainer-node-graph-visuals.md (node styles, edge bezier geometry, SVG rendering constraints, pulse animation), load-manifest.json (interactive-explainer taskType current config)
- **external**: External scan F-07 (Reingold-Tilford O(n), d3-hierarchy implements it), F-08 (d3.tree API), F-09 (node spacing guidelines), F-10 (W3C SVG accessibility), R-11 (reject external JS libraries in output HTML), A-07 (adopt Reingold-Tilford via d3-hierarchy), Baymard/NNg comparison research
- **inferred**: Shared framework extraction from flow_explainer patterns, Decision Tree BFS layout feasibility vs Reingold-Tilford, line count projection based on flow_explainer actual vs spec complexity

---

## Findings

### [Important] 1. JSX line count estimates are understated for Compare and Decision Tree

The spec says each template will be ~1200-1500 lines. flow_explainer.jsx is 1257 lines and handles a linear 5-node flow with a single interaction model (step playback + hover). The three new templates each add significant complexity beyond flow_explainer:

- **Compare**: multi-subject columns (2-3 side-by-side), dimension switching with fade-in/fade-out transitions, cross-object SVG connections that recompute per dimension, score visualization, kind color system with 4 values (pro/con/neutral/highlight) vs flow's 4 kinds, detail popup per item. Estimated actual: **1400-1700 lines** (the dimension-switch state management and per-dimension edge recomputation adds ~200-300 lines over flow_explainer baseline).

- **Decision Tree**: BFS-based layout computation (50-80 lines for layout algorithm alone), path traversal for hover highlighting (find root-to-node path in adjacency structure), path description string builder for sidebar, conclusion node special rendering. The BFS layout described in the spec is simpler than Reingold-Tilford but still requires non-trivial position computation. Estimated actual: **1300-1600 lines** (layout algorithm + path traversal add ~150-250 lines).

- **Layer**: expand/collapse with height animation, component stagger inside expanded layer, inter-layer SVG connections that only appear when a layer is expanded, flow lines with detail text on hover. This is closest in complexity to flow_explainer but the expand/collapse state + per-layer connections add overhead. Estimated actual: **1200-1500 lines** (most similar to flow_explainer's baseline).

**Recommendation**: Accept Layer estimate as stated. Revise Compare to 1400-1700 and Decision Tree to 1300-1600 in the spec. This matters for the single-file JSX constraint -- files over ~1600 lines become harder for AI agents to correctly modify, and Babel standalone compilation of large files can be slower on initial load.

### [Important] 2. Decision Tree layout: BFS "simple" layout vs Reingold-Tilford -- a deliberate divergence that needs acknowledgment

The spec says "BFS 层级 + 同层水平均匀分布" and explicitly states "简单可靠，不需要自动布局库". The external scan recommends adopting Reingold-Tilford via d3-hierarchy (A-07). However, the external scan also says "Do NOT require external JS libraries (D3, React Flow, GoJS) in the output HTML" (R-11). These two recommendations contradict each other if d3-hierarchy is treated as an external dependency in the output HTML.

**Key question**: Is d3-hierarchy being considered for:
- (a) Inclusion as a CDN script in the output HTML (violates R-11 and the self-contained principle)
- (b) Copying its algorithm logic inline into the JSX template (acceptable under R-11, but adds ~100-150 lines of algorithm code)
- (c) Not using it at all, relying on the BFS+uniform-distribution approach described in the spec

The spec's BFS+uniform approach works for trees with 6-15 nodes where siblings are roughly balanced, but it produces poor layouts for unbalanced trees (e.g., one branch has 5 conclusions while another has 1). The Reingold-Tilford algorithm handles unbalanced trees by shifting subtrees to avoid overlap, which BFS+uniform does not do.

**Recommendation**: The spec should explicitly state that the BFS+uniform approach is acceptable for the recommended node range (6-15, max 20) because trees in that size range rarely have extreme imbalance. If a user provides a tree with >15 nodes or extreme imbalance, the template should gracefully degrade (scroll + wider spacing) rather than trying to produce a perfect layout. This avoids the d3-hierarchy dependency entirely and keeps the self-contained constraint intact. Mark this as a known limitation in the spec.

### [Important] 3. Compare multi-dimension switching + hover: feasible but the dimension-switch edge recomputation needs careful implementation

Compare's primary interaction is dimension switching (click dimension tab -> items and connections change). This requires:
- Filtering items by `dimensionId` on each switch
- Filtering connections by `dimensionId` on each switch
- Fade-out current items (200ms), fade-in new items (300ms)
- SVG connections redraw (stroke-dasharray 600ms)
- ResizeObserver must recompute after the new items are rendered

This is fundamentally more complex than flow_explainer's edge computation because flow_explainer computes edges once (after entry animation) and only updates on resize. Compare must recompute edges on every dimension switch. The timing of "fade-out old items, remove them from DOM, fade-in new items, then recompute edges" needs a clear animation sequence definition that the spec currently lacks -- it says "切换过渡" durations but does not define the exact sequence order (do old items fade first, then new items appear? or simultaneous cross-fade?).

**Recommendation**: Add a dimension-switch animation timeline to the spec (similar to flow_explainer's entry animation timeline in Section 5.1). A reasonable sequence: old items fade (200ms) -> DOM update (instant) -> new items fade-in (300ms) -> edge draw (600ms, starting 100ms after new items begin). Total per switch: ~800ms. This avoids simultaneous cross-fade which creates visual confusion in a comparison layout.

### [Important] 4. Shared state machine framework: conceptually sound but extraction needs a concrete plan

The spec defines shared framework elements (entering/ready phase, priority stack, dimming, responsive breakpoints, entry animation parameters). flow_explainer.jsx implements these inline in ~1257 lines. Extracting shared code across 3 new templates raises a practical question: **Where does the shared code live?**

Options:
- (a) Each template copies the shared code inline (adds ~200-300 lines of duplication per template, but keeps each template self-contained)
- (b) A shared `explainer_common.jsx` file loaded via `<script type="text/babel" src=...>` before each template (cleaner, but requires the HTML host to load two Babel-compiled scripts in order, and react-setup.md Rule 2 requires manual window export for scope sharing)
- (c) Each template includes a condensed version of shared utilities (e.g., a 50-line `ExplainerUtils` section at the top of each template)

Option (b) is architecturally cleanest but introduces a multi-file loading dependency that the current flow_explainer template does not have. Option (a) is what flow_explainer already does. Option (c) is a middle ground.

**Recommendation**: Use option (c) -- each template contains a ~50-80 line shared-utilities block at the top (expoOut, debounce, animateValue, prefersReducedMotion, responsive breakpoints, dimming constants, KIND_COLORS). This keeps each template self-contained (one JSX file, one HTML file) while reducing the per-template duplication to a manageable 50-80 lines of utility code. The 80% infrastructure reuse claim in the spec is accurate at the pattern level (same state machine, same dimming, same responsive) but at the code level it will be ~60% reuse via shared-utility blocks, not 80% shared code in a separate file.

### [Suggestion] 5. SVG overlay ResizeObserver+debounce: directly reusable across all three templates

flow_explainer.jsx implements ResizeObserver + 50ms debounce for edge position recomputation. This pattern is identical for:
- Compare: recomputing cross-object connections on dimension switch + resize
- Decision Tree: recomputing tree edge paths on resize
- Layer: recomputing inter-layer flow lines on expand/collapse + resize

The implementation in flow_explainer (lines 298-388) is ~90 lines and covers: ResizeObserver setup, node element observation, debounced computeEdges callback, multi-pass setTimeout for layout stabilization. This can be extracted into the shared-utility block (option c from Finding 4) as a `useExplainerEdges(containerRef, nodeRefs, edgeDefs, computeEdgeGeometry)` hook-like function.

**Note**: Layer's expand/collapse triggers a height change that ResizeObserver will catch, but the timing needs adjustment. When a layer expands, its height transitions over 300ms. The ResizeObserver fires during the transition, causing edge positions to update at intermediate heights. The debounced 50ms delay is too short for a 300ms height transition. **Recommendation**: Layer template should use a longer debounce (150ms) or defer edge recomputation until after the expand transition completes (listen for transitionend event).

### [Suggestion] 6. Canvas vs SVG: no performance risk for the stated node counts

The spec says "SVG 在本规模完全够用" and the external scan confirms (R-11: reject external libraries, adopt CSS/SVG-only animations). The maximum node counts per template are:
- Compare: 2-3 subjects * 3-6 dimensions * ~4 items per subject/dimension = ~24-72 items (but only one dimension visible at a time, so max ~12-24 visible items)
- Decision Tree: 6-15 nodes, max 20
- Layer: 3-6 layers * 2-5 components per layer = ~6-30 components (but only one layer expanded, so max ~5-8 visible components at a time)

All these are well within SVG's comfortable rendering range (< 50 simultaneous interactive elements). Canvas would only be needed for > 100 elements, which is out of scope. **No risk here.**

However, there is a subtlety: Compare's SVG connections are drawn between items in two (or three) separate columns. The edge geometry computation is more complex than flow_explainer's simple left-to-right flow because items in each column can be at different vertical positions. The cubic bezier control points need to account for horizontal column gap + vertical offset, not just a simple horizontal gap. This is feasible but needs explicit geometry definition in the spec (currently missing).

### [Suggestion] 7. Decision Tree: mobile vertical layout needs scrolling + path info at bottom

The spec defines mobile layout as "树竖向展开，可滚动" with a "固定底部栏显示路径信息/结论". This means the tree SVG area is scrollable on mobile, and the bottom bar is fixed. This is analogous to flow_explainer's mobile layout (scrollable diagram + fixed bottom panel).

**Implementation concern**: On mobile, the tree will be taller than the viewport for any tree with > 3 levels. The SVG overlay must scroll with the tree content, not be fixed to the viewport. flow_explainer handles this by placing the SVG overlay inside the scrollable container (position: absolute relative to the container, not the viewport). Decision Tree must use the same pattern. This is not a blocker -- it is a known pattern from flow_explainer -- but it should be explicitly documented in the spec's Decision Tree SVG rendering constraints.

### [Suggestion] 8. Compare: connections schema has a data integrity gap

The spec defines connections with `fromItemId` and `toItemId`, but the example data's connections use composite IDs like `'react-performance-1'` and `'vue-performance-1'` that do not match any item `id` in the items array (the items array items do not have explicit `id` fields). The schema says items have `subjectId`, `dimensionId`, `label`, `kind`, `detail`, `score` -- but no `id` field.

**Recommendation**: Either (a) add an `id` field to the item schema (required for connection referencing), or (b) define connection references by `(subjectId, dimensionId, itemIndex)` tuple instead of `fromItemId/toItemId`. Option (a) is cleaner and consistent with how flow_explainer and Decision Tree reference nodes by `id`. The example data should also be updated to include item `id` fields that match the connection references.

### [Suggestion] 9. Layer expand animation: height auto transition is tricky in React+Babel CDN

Layer's expand/collapse animation requires transitioning from `height: 56px` (collapsed) to `height: auto` (expanded, containing component cards). CSS `height: auto` transitions are not animatable -- you cannot transition from a fixed height to `auto`.

Solutions:
- (a) Measure the expanded height via `getBoundingClientRect()` and animate to the measured pixel value (requires a two-phase render: first render expanded content to measure, then animate to that height)
- (b) Use `max-height` transition with an oversized `max-height` value (e.g., `max-height: 400px` for the expanded state) -- this works but the timing curve is wrong because the animation completes before reaching the actual content height
- (c) Use `overflow: hidden` + height animation to a pre-calculated value based on component count (each component card is ~56px, so expanded height = 56 + components.length * 56 + gaps)

Option (c) is simplest and most predictable for the recommended 2-5 components per layer. Option (a) is more robust but requires extra render cycles. **Recommendation**: Use option (c) for the initial implementation, with a fallback to `max-height` for layers with > 5 components (the max-height overshoot will be acceptable since the spec limits components to max 8).

---

## Spec Impact

- **adopt**: BFS+uniform layout for Decision Tree with explicit limitation documentation (Finding 2); shared-utility block pattern (Finding 4); item `id` field in Compare schema (Finding 8); dimension-switch animation timeline (Finding 3); height-precalculation for Layer expand (Finding 9); longer debounce for Layer ResizeObserver (Finding 5)
- **reject**: d3-hierarchy CDN dependency in output HTML (Finding 2); simultaneous cross-fade for dimension switching (Finding 3); separate shared-utility JSX file (Finding 4, option b)
- **ask user**: (1) Is the BFS+uniform layout limitation for unbalanced trees acceptable, or should we invest in an inline Reingold-Tilford implementation (~100-150 extra lines)? (2) Should Compare item schema include an explicit `id` field for connection referencing? (3) Are the revised line count estimates (Compare 1400-1700, DT 1300-1600) acceptable, or should we try to constrain each template to 1500 lines max?

---

## Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | Unbalanced Decision Tree layout overlapping nodes | Medium (depends on user data) | Medium (visual quality) | Document limitation; add scroll+spacing for >15 nodes |
| R2 | Compare dimension-switch edge recomputation timing mismatch | Medium | Medium (janky animation) | Define explicit timeline sequence; spike first |
| R3 | Layer height:auto animation not working smoothly | Low | Low (cosmetic) | Use pre-calculated height based on component count |
| R4 | Single JSX file >1500 lines causing Babel compilation slowdown | Low | Low (initial load time) | Monitor; split into sub-components within the same file if needed |
| R5 | Compare connections referencing items without id field | High (schema gap) | Medium (data integrity) | Add id field to item schema |