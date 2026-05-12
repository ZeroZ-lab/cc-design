# Scout Design Feedback: Explainer Extensions (Compare, Decision Tree, Layer)

Date: 2026-05-11
Reviewer: design-scout (experience perspective)
Inputs: `01-spec.md`, `external-scan-results.md`, `flow_explainer.jsx` v0.1, `explainer-interaction-patterns.md`, `explainer-node-graph-visuals.md`, `load-manifest.json`

---

## Verdict

**Important** -- The spec is structurally sound and the three templates have genuine differentiation, but several interaction paths have unresolved edge cases and information-structure gaps that will cause real-user friction if not addressed before build. No single issue blocks the project, but the combined set of Important findings requires spec adjustments before entering design/build phases.

---

## Evidence Used

- **local:** `01-spec.md` (template definitions, state machines, layout strategies), `flow_explainer.jsx` v0.1 implementation (animation constants, entry sequence, DetailPopup), `explainer-interaction-patterns.md` (priority stack, state table, dimming strategy), `explainer-node-graph-visuals.md` (node style, edge style, color palette, WCAG table), `exit-conditions.md` (current explainer verification criteria), `load-manifest.json` (detection keywords)
- **external:** `external-scan-results.md` (Baymard F-03/F-04, NN/g F-04, WCAG F-01/F-02, hover tooltip F-06, Baymard P-02/P-03/P-06, dtreeviz P-12, Reingold-Tilford F-07/F-08, Structurizr P-23/P-25, ciechan.dev F-27, Distill.pub P-32/P-34, R-01/R-02/R-11)
- **inferred:** Analysis of user path completeness from spec state definitions, gap-filling from comparing v0.1 state table vs v0.2 sub-state definitions, mobile interaction viability from v0.1 DetailPopup pattern vs new overlay patterns

---

## Findings

### [Important] Compare: multi-dimension switching leaves the user without a "home" state mental anchor

The spec defines `dimension` as the primary sub-state, and the user switches dimensions by clicking dimension tabs. However, the spec does not define an initial default dimension or a "return to overview" affordance. When the user first lands on the page after the entering phase, they see one dimension's items. There is no way to see all dimensions at once (an overview or "all" mode). This contradicts the external scan finding P-03 (68% of users want a "differences only" toggle), which implies users expect to see the full picture first and then filter. The current design forces the user into one dimension immediately, making them explore dimensions before understanding the overall comparison scope. This adds an unnecessary exploration step to the core user path.

- source: inferred (from spec state definition gap) + external (P-03, F-03)

### [Important] Compare: hover detail on mobile uses "fixed bottom bar" but no explicit close mechanism is defined

The spec says: "tap-to-inspect 替代 hover" and "固定底部栏显示当前维度说明 + 简要详情". But the mobile tap flow is: tap item -> detail overlay appears in bottom bar -> tap other area or return arrow closes. The "tap other area" dismissal is ambiguous on a dense comparison layout -- the user might tap another comparison item intending to see its detail, but the tap closes the current overlay AND opens the new one. This creates a double-action-per-tap ambiguity. The v0.1 DetailPopup solves this cleanly (backdrop click closes, tap on another node toggles), but the spec does not specify whether the bottom bar overlay uses backdrop dismissal or tap-to-toggle. This is a key interaction decision that will affect mobile usability.

- source: inferred (from spec mobile interaction description ambiguity) + local (v0.1 DetailPopup pattern)

### [Important] Decision Tree: BFS layout will produce overlapping nodes for trees with 6+ siblings at any level

The spec defines: "树布局算法: BFS 层级 + 同层水平均匀分布" with "同层节点间距 32px horizontal gap" and "节点样式 圆角矩形 96x48-160x72px". If a single level has 6 siblings, each at max 160px wide + 32px gap, the minimum horizontal span is 6*160 + 5*32 = 1120px. On a desktop layout where the tree area is only ~65% of viewport (say 650px on a 1024px screen), this exceeds available space. The external scan explicitly notes: "对于宽树（>8 siblings），径向布局选项应该可用" (I-06). The spec says "不做" for "决策树路径回溯面包屑" but does not list "radial layout" as "不做". However, the spec also says the tree area "可滚动（当节点数 > 10 或移动端）". Scrolling a horizontally overflowing tree on mobile is a poor experience -- the user cannot see the full tree at once, which is the entire point of the "全景展开" interaction. This is not a blocking issue (scrolling is functional), but it means the "全景展开" promise is broken for wide trees.

- source: inferred (from layout math) + external (I-06, P-14)

### [Important] Decision Tree: "hover 路径高亮" has no touch-device equivalent beyond "tap + bottom overlay"

The spec says mobile uses "tap 节点 -> 路径高亮 + 底部 overlay 显示路径信息/结论 -> tap 其他区域关闭". But a decision tree on mobile in vertical-scroll layout will have many nodes visible simultaneously. After tapping one node, the path highlights, and the bottom overlay shows path text. If the user then scrolls to see a different node, the bottom overlay stays (no auto-dismiss on scroll). The spec does not define scroll-dismiss behavior. Additionally, on mobile vertical layout, "path highlighting" across a long scrollable tree means some highlighted nodes may be above or below the viewport -- the user cannot see the full highlighted path without scrolling, but scrolling might dismiss the overlay. This creates a conflict between "show me the path" and "scroll to see the whole path".

- source: inferred (from mobile scroll + overlay interaction conflict)

### [Important] Layer: no "all collapsed" home state -- the user must click a layer to see anything beyond labels

The spec says: "不做: render all layers fully expanded by default (R-10)". This means on initial load, after the entering animation, the user sees only collapsed layer strips (56px each, just labels). With 4 layers, the entire diagram area shows 4 narrow horizontal bars with labels like "Presentation Layer", "API Gateway", "Service Layer", "Data Layer". The user must click one to see any content. This is a valid progressive-disclosure choice, but it means the "home" state (all collapsed) shows zero content detail. The right panel during this state is empty (no expanded layer info to display). The spec does not define what the right panel shows when `expandedLayer === null`. If it shows nothing, the page feels incomplete at first interaction. If it shows a generic overview, that needs to be defined. This is an information-structure gap.

- source: inferred (from spec state definition + R-10)

### [Important] Layer: expand/collapse transition creates layout shift that breaks SVG overlay line positions

The v0.1 architecture uses `ResizeObserver + 50ms debounce` to recalculate SVG edge positions when nodes resize. When a layer expands from 56px to 120-200px, the container layout shifts dramatically -- all other layer strips move down, and the SVG overlay lines between layers must be recalculated. The 50ms debounce means there is a 50ms window where lines point to stale positions. On a 300ms expand animation, the user will see lines lagging behind the expanding content for ~50-150ms. This is a known issue from v0.1 (lines recalculated after layout stabilizes), but v0.1 nodes are small (96-160px) and rarely resize. Layer expansion is a large layout shift that makes this recalculation lag more visible. The spec should define whether lines animate with the expand/collapse transition or appear only after the transition completes.

- source: local (v0.1 ResizeObserver pattern) + inferred (from expand/collapse layout shift magnitude)

### [Important] All three templates: detection keywords in load-manifest.json are insufficient for routing compare/DT/layer

The current `interactive-explainer` taskType detection keywords include "interactive explainer", "interactive flow diagram", "explain how", "product flow diagram", "system flow explainer", "interactive process", and Chinese equivalents. None of these keywords would match "对比解释" (compare), "决策树" (decision tree), "分层架构" (layer), or their English equivalents ("comparison", "decision tree", "architecture layers"). The spec says "更新 load-manifest.json -- interactive-explainer taskType 新增 3 个模板关联 + 检测关键词补充" but does not specify the actual keywords to add. Without compare/DT/layer-specific keywords, the routing will default to `flow_explainer.jsx` for these requests, producing the wrong template type. This is a functional routing failure.

- source: local (load-manifest.json current keywords) + inferred (from spec routing requirement)

### [Suggestion] Compare: the "connections" field creates cross-object SVG lines, but their visual purpose is unclear to the user

The spec defines `connections` as "跨对象连线（表示对比关系或数据流动）", rendered as SVG cubic bezier between items of different subjects within the same dimension. But what does a line between "React: Virtual DOM diffing" and "Vue: Reactive dependency tracking" communicate? The external scan (P-08) describes "interactive comparison slider" for visual before/after, and P-04 describes "hover cross-column highlighting" for row/column emphasis. Neither uses explicit cross-object lines in a comparison context. The connection label "different reactivity model" is helpful, but the user needs to understand why two items are linked before the line adds value. If the AI does not consistently populate meaningful `connections`, the lines will be noise. Consider making `connections` optional in the schema (currently it is -- not in the "Required fields" list, but the example data includes them). If the connection semantics are not clear, the template should gracefully handle the `connections` array being empty.

- source: inferred (from schema design + external P-04/P-08)

### [Suggestion] Decision Tree: "conclusion" nodes use emerald (#10B981) which is the same as the "output" kind color

The spec says conclusion kind = `#10B981` (emerald). The v0.1 kind palette defines `output` = `#10B981` (emerald). This means a conclusion node in the Decision Tree and an output node in the Flow Explainer use the same color. While they share the semantic concept of "result/endpoint", this means the color system does not differentiate between "process output" (flow) and "decision conclusion" (tree). For users who encounter both templates, this is fine (consistent "green = result" mental model). But the spec also defines the Compare template's `pro` kind as `#10B981`, creating a third semantic mapping for the same hex value: "pro/advantage" vs "output" vs "conclusion". This creates a potential cognitive overload when users switch between templates. Consider differentiating conclusion nodes with a distinct shade (e.g., #059669 emerald-600) or adding a visual modifier (glow/shadow per the spec's "轻微 glow/shadow").

- source: local (v0.1 KIND_COLORS) + inferred (from spec color definitions)

### [Suggestion] Compare: score visualization using "small dots/bars" lacks a clear visual grammar

The spec defines `score` as optional (1-5) and says "score 可视化: 小圆点/条形（1-5），仅当 score > 0 时显示". But it does not specify whether dots or bars are used, their size, color, or alignment. The external scan (P-10) notes "visual indicator rows" as a proven pattern. Without specifying the score visual grammar, the AI will produce inconsistent score renderings across generated pages. Define one canonical score visualization (e.g., 5 small circles, filled vs unfilled based on score value, aligned to the left of the item label) and include it in the visual parameters table.

- source: inferred (from spec visual parameter gap) + external (P-10)

### [Suggestion] Layer: animated data flow lines (stroke-dashoffset) between layers should define direction semantics

The spec says "脉冲动画表示数据流方向（4 次，与 v0.1 一致）". The v0.1 pulse animation flows along edges from source to target. In the Layer template, data flows go "downward" (from presentation to gateway, from gateway to service). The animated dashoffset direction should always flow downward (matching the architectural dependency direction). But the spec does not specify whether the animation direction matches `fromLayerId -> toLayerId` order or uses a fixed downward convention. If a `flow` entry defines `fromLayerId: 'data'` and `toLayerId: 'service'` (upward callback), the animation direction would need to be reversed. The spec says "flow 只在相邻层之间", but does not address callback/event flows (upward arrows per P-27). The external scan (A-18) recommends "dependency-direction enforcement (downward arrows, dotted upward arrows for callbacks)". The spec should define how pulse direction and line style differ for downward vs upward flows.

- source: inferred (from pulse animation direction ambiguity) + external (P-27, A-18)

---

## 1. Interaction Differentiation Assessment

The three templates are genuinely differentiated in their primary interaction models:

| Template | Primary Interaction | User Path | Information Structure |
|----------|---------------------|-----------|----------------------|
| Compare | Dimension switching (multi-perspective) | Select perspective -> scan items -> hover detail | Tabular/matrix, organized by dimension |
| Decision Tree | Full-tree overview + hover path highlighting | Scan tree -> hover node -> trace path to root | Hierarchical tree, organized by decision depth |
| Layer | Click-to-expand layer (progressive disclosure) | Click layer -> see components + flows -> hover detail | Horizontal bands, organized by abstraction level |

The differentiation is real and covers distinct cognitive tasks (comparison, decision-making, architecture understanding). However, the "hover detail" layer is structurally identical across all three (hover -> dim others -> show detail). This is intentional (shared pattern from Distill.pub P-34) and works well -- it provides consistency while the primary interaction provides differentiation.

**Assessment: differentiation is sufficient.** The three templates solve genuinely different problems, and the shared hover/detail pattern is a strength, not a weakness.

- source: local (spec interaction definitions) + external (P-32, P-34)

---

## 2. Visual Consistency with flow_explainer v0.1

**Shared elements (consistent):**
- ExpoOut easing: `cubic-bezier(0.16, 1, 0.3, 1)` -- identical
- Entry animation timing: 400ms node entrance, 50ms stagger, 600ms edge draw -- identical
- Dimming strategy: opacity 0.35 + blur 4px (desktop), opacity-only (mobile) -- identical
- Three breakpoints: >=1024, 768-1023, <768 -- identical
- Skip-on-any-input during entering phase -- identical
- prefers-reduced-motion degradation -- identical
- SVG overlay architecture (pointer-events: none, aria-hidden) -- identical
- ResizeObserver + 50ms debounce -- identical
- Pulse: 4 times then stop -- identical
- CTA placement in side panel -- identical
- Node shape: rounded rectangle, 8px radius -- identical

**Divergent elements (justified):**
- Node sizing: Compare items are wider (min 120px vs 96px in v0.1) -- justified because comparison items need more text space
- Layer strips: 56px collapsed, auto-height expanded -- justified by the expand/collapse interaction
- Vertical gaps: Decision Tree uses 48px (vs 24px in v0.1) -- justified because tree levels need more visual separation
- Kind colors: Compare adds `pro`/`con`, Layer adds `presentation`/`gateway`/`service`/`data`/`infrastructure`, Decision Tree maps `question`/`factor`/`conclusion` to existing colors -- justified by domain semantics
- State machine: entering -> ready framework is identical, but sub-states differ per template -- justified by different interaction needs

**Consistency gap (Suggestion level):**
- v0.1 uses `translateX(-16px -> 0)` for node entrance. The spec says "主元素入场时长 400ms, fade + 轻微位移" but does not specify the displacement direction or magnitude for Compare items, Decision Tree nodes, or Layer strips. Decision Tree nodes should enter from a different direction (vertical `translateY` for top-down tree) vs horizontal `translateX` for flow. Layer strips should enter from top (`translateY`). Compare items could enter from either direction. The spec should specify entrance displacement per template for visual coherence.

- source: local (v0.1 entry animation implementation) + inferred (from spec "轻微位移" ambiguity)

---

## 3. Mobile Interaction Degradation Assessment

**Compare mobile:**
- Dimension tabs -> horizontal swipeable tabs (good)
- Hover -> tap-to-inspect with bottom bar (acceptable, but needs close-mechanism clarity -- see Important finding)
- Two-column layout preserved (good for comparison semantics)
- Score visualization and connections may be hard to see on small screens (Suggestion: connections should be hidden on mobile or simplified)

**Decision Tree mobile:**
- Vertical scroll layout (acceptable)
- Tap-to-inspect with bottom overlay (acceptable, but scroll-dismiss conflict -- see Important finding)
- Wide trees overflow horizontally, requiring scroll (breaks "全景展开" promise for wide trees)
- Path text description in bottom overlay (good -- compensates for not seeing the full highlighted path visually)

**Layer mobile:**
- Tap to expand/collapse layers (good -- direct mapping from desktop click)
- Bottom overlay for layer detail (acceptable)
- Vertical stacking preserves layer ordering semantics (good)
- Layer expand within vertical scroll may push other layers far down, requiring extensive scrolling for 4+ layers

**Overall mobile assessment:** The degradation strategy follows the v0.1 pattern (hover -> tap, side panel -> bottom bar, blur -> opacity-only) and is structurally sound. The specific interaction issues are noted in the Important findings above.

- source: local (v0.1 responsive strategy) + inferred (from spec mobile definitions)

---

## 4. Interaction Conflict / Dead Path Assessment

**No dead paths identified.** All three templates define clear state transitions with defined entry and exit conditions:

- Compare: dimension switch -> hover -> hover end -> restore dimension view
- Decision Tree: hover node -> path highlight -> hover end -> restore full tree
- Layer: click layer -> expand -> hover component -> hover end -> restore expanded view -> click layer again -> collapse

**One interaction conflict identified (Suggestion level):**
- Compare: when a user hovers an item while a dimension is active, the spec says "hover/tap 激活时维度切换器的当前状态不被清除". This means the dimension state persists during hover. But when the user clicks a dimension tab while hovering an item, does the hover state clear? The spec does not define this. In v0.1, step change clears hover on mobile (`setHoveredNode(null)`), but the desktop behavior is: hover persists until mouse leaves. The resolution rule should be: clicking a dimension tab during hover -> hover state clears -> new dimension items appear -> user must re-hover to see detail in the new dimension. This should be explicitly defined.

- source: inferred (from spec state interaction ambiguity) + local (v0.1 goToStep clears hoveredNode)

---

## 5. Entry Animation / State Machine Consistency with v0.1

**Entering phase: consistent.** The spec defines:
- Same two-phase framework (entering -> ready)
- Same skip-on-any-input (click/keydown/touchstart)
- Same reduced-motion degradation (skip entry, instant transitions, outline for hover)
- Same entering -> ready transition trigger (animation complete or first user input)

**Ready phase: divergent (by design).** Each template defines its own sub-states within the ready phase:
- Compare: `{ dimension, hoveredItem }` -- two sub-state variables
- Decision Tree: `{ hoveredNode, highlightedPath }` -- two sub-state variables (but `highlightedPath` is derived from `hoveredNode`, not independently set)
- Layer: `{ expandedLayer, hoveredFlow }` -- two sub-state variables

This divergence is intentional and correct. The v0.1 has `{ currentStep, hoveredNode }` which is structurally similar to Compare's `{ dimension, hoveredItem }`. The priority stack (entry < primary < hover) is identical across all templates.

**State machine gap (Suggestion level):** The spec defines `highlightedPath` as a Decision Tree sub-state, but the path is computed by BFS traversal from root to the hovered node. This means `highlightedPath` is a derived value, not an independent state variable. The spec should clarify whether `highlightedPath` is stored in state or computed on render. In v0.1, `activeNodeIds` is computed from `currentStep.focus` (derived), not stored. The Decision Tree should follow the same pattern for consistency.

- source: local (v0.1 state machine) + inferred (from spec state definition)

---

## Spec Impact

### adopt:
- Define initial/default dimension state for Compare (e.g., first dimension in array, or an optional "overview" mode showing differences-only)
- Define right-panel content when no layer is expanded in Layer (e.g., overview text, or prompt to "click a layer to explore")
- Define mobile tap-to-inspect close mechanism explicitly for Compare (tap backdrop closes, tap another item toggles -- matching v0.1 DetailPopup)
- Define scroll-dismiss behavior for Decision Tree mobile overlay
- Add compare/decision-tree/layer-specific detection keywords to load-manifest.json (e.g., "comparison", "compare", "vs", "decision tree", "tech selection", "architecture layers", "layer explainer", "对比", "决策树", "分层架构")
- Specify entrance displacement direction per template (Compare: translateY, Decision Tree: translateY, Layer: translateY) for visual coherence with the layout direction
- Define one canonical score visualization for Compare (5-dot filled/unfilled pattern)
- Define animated flow direction semantics for Layer (downward = solid line, upward callback = dashed line with reversed pulse direction)

### reject:
- No findings to reject from the spec. The external scan Adopt/Reject recommendations are already well-integrated into the spec.

### ask user:
- Should Compare have an "all dimensions overview" initial state, or always start on the first dimension?
- Should Layer show overview text in the side panel when no layer is expanded, or leave it empty with a subtle prompt?
- For wide Decision Trees (>6 siblings at a level), should the mobile layout switch to a stepper/wizard mode (P-17) instead of horizontal scroll, or accept horizontal scroll as the mobile solution?
- Should `connections` in Compare be visually styled differently from regular edges (dashed vs solid, different color) to signal "comparison relationship" vs "data flow"?