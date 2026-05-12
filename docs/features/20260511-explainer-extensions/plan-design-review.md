# Plan Design Review: Explainer Extensions v0.2

> Reviewer: Design Perspective | Date: 2026-05-11
> Reviewed: `03-plan.md` against `02-design.md` (Final) + `01-spec.md` (Final)

---

## Blocking

### B-1: T4 verification checklist misses several Compare State Transition Table rows

T4 verification lists 19 items. The Compare State Transition Table in 02-design.md has 13 rows. Cross-mapping:

| State Row | T4 Coverage | Gap |
|-----------|-------------|-----|
| Row 1 (entering -> ready, overview) | Covered (entry animation items) | OK |
| Row 2 (entering -> user skip -> ready) | Covered (entry skip item) | OK |
| Row 3 (overview, hover verdict badge) | Covered ("verdict badge hover" item) | OK |
| Row 4 (overview, hover diff summary item) | **NOT explicitly covered** | The checklist says "hover item -> detail + connections highlight + other dimmed" but that maps to Row 7 (dimension-mode hover). Overview-mode diff item hover (Row 4) has different behavior: no connections to highlight (overview has no connections), only diff items dim. This behavioral distinction is not verified. |
| Row 5 (overview, hover leaves -> restore) | Implicitly covered via "hover ends -> restore" general behavior | OK but not explicit |
| Row 6 (overview -> click dimension tab) | Covered ("overview switch to dimension" items) | OK |
| Row 7 (dimension=X, hover item) | Covered ("hover item" item) | OK |
| Row 8 (dimension=X, hover leaves) | Implicitly covered | OK |
| Row 9 (dimension=X -> click another tab) | Covered ("dimension-to-dimension switch" item) | OK |
| Row 10 (dimension=X -> click overview tab) | Covered ("dimension back to overview" item) | OK |
| Row 11 (mobile, tap item) | Covered ("mobile tap-to-inspect" item) | OK |
| Row 12 (mobile, tap close/outside) | **NOT explicitly covered** | No verification item checks the dismiss mechanism of the mobile overlay (X button, tap outside). The design hard constraint #5 explicitly requires "hover/tap detail must have dismiss mechanism (L3-14) -- not hover-only". This is a gap. |
| Row 13 (mobile, tap another item) | **NOT explicitly covered** | No verification item checks that tapping another item closes the old overlay first, then opens new (no intermediate state per Row 13). |

**Why blocking**: Rows 4, 12, 13 define distinct behaviors from the general hover items. Row 4 has different dimming behavior (no connections). Rows 12/13 are mobile-specific dismiss/transition rules that are hard constraints (design boundary #5: "hover/tap detail must have dismiss mechanism"). Without explicit verification, these state transitions could be implemented incorrectly or omitted.

---

### B-2: T5 verification checklist misses DT State Transition Table row 6-8 mobile-specific behaviors

T5 verification lists 17 items. The DT State Transition Table has 8 rows. Cross-mapping:

| State Row | T5 Coverage | Gap |
|-----------|-------------|-----|
| Row 1 (entering -> ready) | Covered (entry animation items) | OK |
| Row 2 (entering -> user skip) | Covered (entry skip item) | OK |
| Row 3 (desktop hover node -> path) | Covered ("path highlight" item) | OK |
| Row 4 (hover leaves -> restore) | Implicitly covered | OK |
| Row 5 (hover moves to adjacent node) | Covered ("hover switch smooth" item) | OK |
| Row 6 (mobile tap node) | **Partially covered** | "Mobile overlay sticky" item exists, but does not verify that tap triggers path highlight + sticky overlay shows node detail + path description simultaneously. |
| Row 7 (mobile tap close/outside) | **NOT explicitly covered** | No verification item for mobile overlay dismiss (X button / tap outside). |
| Row 8 (mobile tap another node) | **NOT explicitly covered** | No verification item for "close old overlay then open new, no intermediate state". |

**Why blocking**: Rows 7/8 are mobile-specific dismiss/transition behaviors. Design hard constraint "hover/tap detail must have dismiss mechanism" (shared constraint #5) and spec #15c explicitly require sticky overlay with close button. Without explicit verification for dismiss and sequential tap, these critical mobile interactions could be broken.

---

### B-3: Compare "cross-column hover highlighting" (A-17) has no task or verification coverage

02-design.md Adopt Matrix A-17 explicitly adopts "Cross-column hover highlighting in Compare" citing L3-04 as evidence. This means when a user hovers an item in Subject A's column, the corresponding row in Subject B's column should also get a subtle background highlight for visual scanning.

03-plan.md:
- T0 spike verification does not mention cross-column highlighting
- T4 template structure does not include a cross-column highlighting component or behavior
- T4 verification checklist has no item for cross-column highlighting
- T8 exit-conditions has no item for cross-column highlighting

**Why blocking**: A-17 is an adopted design decision with explicit evidence backing. It defines a specific interaction behavior (Material Design proven pattern for comparison scanning) that must be implemented. The plan completely omits it -- this is a design decision with no corresponding execution task, which is exactly the "design constraint without task coverage" pattern this review checks for.

---

### B-4: Compare "hover cross-highlight: row + column" (U-08 resolution) has no task coverage

02-design.md Unknowns U-08 states the resolution: "Use both (row + column) on desktop; row-only on mobile". This resolves a design ambiguity into a concrete decision. T4 verification has no item checking desktop row+column highlighting vs mobile row-only highlighting.

**Why blocking**: This is a design decision (resolution of an unknown) that must be implemented. Without a verification item, the implementer may default to a different behavior, effectively re-making the design decision during build -- which is the "design decision incorrectly pushed down to build" pattern.

---

## Important

### I-1: T4 "hoveredItem state domain" description is incomplete for overview mode

T4 Template Structure item 7 says: "hoveredItem 状态域（null / itemId / 'verdict-{subjectId}', per KD1 'Overview hover 状态归属'）". This correctly lists the value domain from KD1. However, the verification checklist does not separately verify the three distinct hoveredItem value behaviors:

1. `hoveredItem="verdict-{subjectId}"`: verdict badge highlight + diff items dim (Row 3)
2. `hoveredItem=itemId` in **overview mode**: diff item highlight + other items dim, NO connections highlight (Row 4)
3. `hoveredItem=itemId` in **dimension mode**: item highlight + connections highlight + other items dim (Row 7)

These three states have different rendering behaviors, but the verification checklist only has one combined "hover item" check that implicitly covers Row 7 behavior. The overview-mode item hover (Row 4) and verdict hover (Row 3) have distinct behaviors that should be verified separately.

**Impact**: Without separate verification, the implementer may apply dimension-mode hover behavior (with connections highlighting) to overview-mode hover, which would violate the design constraint "connections not shown in overview mode" (design boundary #8, KD2).

---

### I-2: T4/T5 spike verification items do not cover all KD parameters

T0 spike verifies 7 items. Missing from T0:
- Cross-column hover highlighting (A-17) -- spike should verify feasibility of row+column highlight on hover
- Overview mode rendering (verdict badge + diff summary + diff count) -- spike only validates verdict badge shape, not the overview mode as a whole with its filtering logic
- Dimension switch animation sequence feasibility -- spike validates "dimension tab switch logic" but not the 4-phase animation sequence timing feasibility

T1 spike verifies 8 items. Missing from T1:
- Sticky overlay on mobile tap (spec #15c) -- spike only validates "mobile indented vertical list", not the sticky overlay interaction
- Path description text rendering in right panel -- spike validates the text format but not the panel rendering

**Impact**: Spikes are meant to validate feasibility before building. If critical design behaviors (cross-column highlight, overview mode, sticky overlay) are not validated in spikes, T4/T5 may discover implementation problems late, after significant code has been written.

---

### I-3: Compare connections "no arrowhead" decision (KD2) is not explicitly verified

KD2 explicitly decides: "Arrowhead: none (connections express cross-object association, not direction, unlike v0.1 flow edge which has arrowhead)". T4 verification item "跨对象连线: 维度切换时正确显示/隐藏" checks visibility but does not verify that connections have NO arrowhead. T3 ref doc update item 6 mentions "no arrowhead" in the content outline, but the verification checklist only checks bezier curve parameters, not the absence of arrowhead.

**Impact**: The implementer, following v0.1 flow_explainer.jsx patterns which include polygon arrowhead, may inadvertently add arrowheads to Compare connections. This would violate the design decision that connections express association (not direction).

---

### I-4: T4 "error boundary" verification only checks "0 dimensions" but misses other edge cases

T4 verification item 18 checks "0 dimensions -> static list no switching". But design boundary constraints specify:
- subjects.length 2-4, dimensions.length 3-8 (schema rules)
- 0 connections -> no SVG overlay
- Schema validation errors -> console warning not crash

T4 mentions these in Template Structure item 11, but the verification checklist only has one item for "0 dimensions". Missing verification for:
- 0 connections (no SVG overlay should render)
- Edge cases in overview diff calculation (e.g., all items identical -> diff count = "0/N items differ", still renders correctly)
- subjects.length = 3 or 4 (three/four-column layout feasibility, since spike only tests 2 subjects)

**Impact**: Without verification, edge cases that the design explicitly addresses may be handled incorrectly or crash the template.

---

### I-5: DT "conclusion node kind visual distinction without icon" (KD4, R-08) is not explicitly verified

KD4 states: "no icon per L1-08 (color alone encodes kind)". R-08 rejects "Diamond/rhombus shape for question nodes" because "shape differentiation violates L1-08 'same shape, color encodes kind'". T5 verification checks "Conclusion 强调: emerald 背景 + shadow, 与 question/factor 视觉可区分" which covers the shadow distinction. But no verification item explicitly checks that:
1. All three kinds use the same shape (rounded rect)
2. No kind-specific icons are added to nodes
3. Color is the primary kind encoder (not shape or icon)

**Impact**: The implementer may add kind-specific icons (question mark icon on question nodes, checkmark on conclusion nodes) thinking it improves UX, but this would violate the design decision (L1-08 rationale: icons add visual noise for 6-15 nodes; color alone is sufficient with 3 kinds).

---

### I-6: T2 ref doc verification mentions "KD1-KD7" but does not map specific KDs to specific content items

T2 verification item 1 says "覆盖 KD1-KD7 所有交互参数". This is a broad claim. Cross-checking the content outline against KDs:

| KD | T2 Content Coverage | Gap |
|----|---------------------|-----|
| KD1 (Overview mode) | Items 3, 7, 11, 12 | OK |
| KD2 (Dimension switch animation) | Items 4, 11 | OK |
| KD3 (Compare pro/con/score colors) | Items 11, 12 | OK |
| KD4 (DT node kind) | Item 13 | OK |
| KD5 (DT hover path highlight) | Items 7, 9 | OK |
| KD6 (DT BFS layout) | Items 9, 10 | OK |
| KD7 (Entry animation direction) | Item 10 | OK |

However, KD1's "Overview hover 状态归属" (hoveredItem value domain with "verdict-{subjectId}" prefix) is listed as a verification item (item 4 in T2), which is good. But the content outline does not explicitly mention the "verdict-{subjectId}" prefix pattern -- it says "Compare overview hoveredItem 值域定义" which could be interpreted broadly. The verification item is the real check, so this is adequately covered.

**Impact**: Minor -- the content outline could be more explicit about the verdict-{subjectId} prefix, but the verification item catches it. No substantive gap.

---

### I-7: Design Adopt Matrix items A-01 through A-18 are not systematically mapped to plan tasks

The design Adopt Matrix has 18 items (A-01 to A-18). The plan's "Acceptance Criteria Source Mapping" table maps spec criteria to design sources, but does not explicitly map Adopt Matrix items to tasks. Some Adopt items are implicitly covered through KD references, but several are not:

| Adopt Item | Plan Coverage |
|------------|---------------|
| A-01 (verdict badge) | Covered via KD1/T4 |
| A-02 (overview default) | Covered via KD1/T4 |
| A-03 (differences-only toggle) | Covered via KD1/T4 |
| A-04 (dual encoding) | Covered via KD3/T4 |
| A-05 (5-dot score) | Covered via KD3/T4 |
| A-06 (dimension switch animation) | Covered via KD2/T4 |
| A-07 (symmetric horizontal entry) | Covered via Inf-7/T4 |
| A-08 (BFS + parent centering) | Covered via KD6/T5 |
| A-09 (full path highlight) | Covered via KD5/T5 |
| A-10 (conclusion shadow) | Covered via KD4/T5 |
| A-11 (vertical entry DT) | Covered via Inf-7/T5 |
| A-12 (mobile DT indented list) | Covered via T5 mobile |
| A-13 (mobile Compare stack) | Covered via T4 mobile |
| A-14 (connections only dimension) | Covered via KD2/T4 |
| A-15 (connections fade transition) | Covered via KD2/T4 |
| **A-16 (sticky overlay mobile DT)** | Covered (T5 verification item) | OK but see B-2 |
| **A-17 (cross-column hover)** | **NOT covered** | See B-3 |
| A-18 (4px stroke minimum SVG) | Partially covered (T3 content outline mentions stroke parameters) |

**Impact**: A-17 is a blocking gap (B-3). A-18 is partially covered through T3 visual parameters. The systematic gap is that Adopt Matrix items are not explicitly tracked as a checklist in any task.

---

### I-8: Compare "overview -> dimension" animation draws connections, but "dimension -> dimension" uses fade transition -- this behavioral distinction needs explicit verification

KD2 and A-15 define: overview->dimension uses stroke-dasharray draw (600ms); dimension->dimension uses fade transition (200ms, no redraw). T4 verification items separately check:
- "From overview switch to dimension: fade out -> fade in -> connections draw 600ms" (correct, checks draw)
- "Dimension-to-dimension switch: current fade out -> new fade in -> connections fade transition 200ms" (correct, checks fade)

This is adequately covered. However, the distinction is subtle and the verification items should explicitly state the difference in connection behavior (draw vs fade). Currently they do, so this is OK. No gap, but worth noting for build-phase attention.

---

## Suggestion

### S-1: Add a "Design Constraint Checklist" task or section that explicitly maps all design decisions to verification items

Currently the plan relies on spec acceptance criteria and KD references. But the design document has multiple layers of decisions: KDs, Inferences, Adopt Matrix, Design Boundaries, Reject Matrix. A single checklist that maps each design decision to a specific verification item (in T4, T5, or T8) would make the coverage auditable and reduce the risk of missed decisions.

The Acceptance Criteria Source Mapping table at the end of 03-plan.md is a good start but only maps spec criteria, not all design decisions. Extending it to cover KD1-KD7, Inf-1 through Inf-7, Adopt A-01 through A-18, and Design Boundaries (Compare 8 items, DT 8 items, General 8 items) would provide complete traceability.

---

### S-2: T0/T1 spikes should verify mobile interaction patterns, not just layout

T0 spike verifies desktop layout (two columns, SVG overlay, connections). T1 spike verifies desktop BFS layout and path highlighting. Both spikes mention mobile layout (T0: "5-dot score rendering", T1: "mobile indented list"), but neither spike verifies mobile interaction patterns:
- T0: should verify tap-to-inspect overlay (dismiss mechanism, tap another item transition)
- T1: should verify sticky overlay (sticky behavior, dismiss, tap sequential)

Without mobile interaction spike validation, T4/T5 may discover that sticky overlay or tap dismiss patterns are harder to implement than expected, especially on different mobile browsers.

---

### S-3: T5 "hover switch smooth" verification should specify the transition timing

T5 verification item "hover 切换平滑: hover from X to Y -> direct switch, expoOut 200ms transition, no intermediate state" is good and references DT State Table Row 5. This is the only verification item that explicitly specifies transition timing (200ms expoOut). Consider adding similar specificity to other transition verification items in T4 (e.g., "hover leave -> restore: expoOut 200ms transition").

---

### S-4: Compare "connections not shown in overview" needs explicit verification

Design boundary #8 states: "connections only shown in dimension mode, not overview". T4 verification has "Overview 模式正确: default overview, verdict badge + diff summary + diff count visible" but does not explicitly verify that NO connections SVG overlay is rendered in overview mode. This could be an implicit assumption, but making it explicit prevents accidental connection rendering in overview.

---

### S-5: T8 exit-conditions should include "mobile overlay dismiss mechanism" for both templates

T8 Compare exit-conditions list 7 items. None explicitly mention the mobile overlay dismiss mechanism (X button + tap outside). T8 DT exit-conditions list 7 items. None explicitly mention mobile overlay dismiss.

Per design hard constraint (shared #5: "hover/tap detail must have dismiss mechanism, not hover-only"), this should be an explicit exit condition for both templates.

---

## Summary

| Level | Count | Key Issues |
|-------|-------|------------|
| Blocking | 4 | B-1 (Compare State Table Rows 4/12/13 not verified), B-2 (DT State Table Rows 7/8 not verified), B-3 (A-17 cross-column highlight has no task), B-4 (U-08 resolution has no verification) |
| Important | 8 | I-1 (hoveredItem value domain behaviors not separately verified), I-2 (spikes miss key design behaviors), I-3 (connections no-arrowhead not verified), I-4 (error boundary incomplete), I-5 (DT no-icon constraint not verified), I-6 (KD coverage in T2 adequate but could be more explicit), I-7 (Adopt Matrix not systematically mapped), I-8 (draw vs fade distinction covered but subtle) |
| Suggestion | 5 | S-1 (design constraint checklist), S-2 (mobile interaction spikes), S-3 (transition timing specificity), S-4 (overview no-connections explicit), S-5 (mobile dismiss exit condition) |

The most critical pattern across all Blocking items is: **design decisions with no corresponding execution task or verification item**. Specifically, A-17 (cross-column hover highlighting) and U-08 resolution (row+column desktop, row-only mobile) are adopted/resolved design decisions that the plan completely omits. This is the core "design constraint not mapped to task" problem that must be fixed before build.

Additionally, both templates' mobile-specific state transitions (dismiss, sequential tap) are not verified, which means critical accessibility and UX behaviors (hard constraints per design boundary) could be missing in the final implementation.