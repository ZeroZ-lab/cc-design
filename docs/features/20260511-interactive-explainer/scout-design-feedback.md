# Design Scout Feedback: Interactive Explainer

Verdict date: 2026-05-11
Spec reviewed: `01-spec.md`

---

## Verdict

**Important** -- direction is sound, no blocking user-journey failures, but several information-structure and interaction-design gaps need resolution before entering template design.

---

## Evidence Used

- **local:** `01-spec.md`, `brainstorm-interactive-explainer.md`, `SKILL.md` routing table and workflow, `load-manifest.json` taskType definitions, `references/interaction-design-theory.md`, `references/responsive-design.md`, `references/interactive-prototype.md`, existing `templates/` inventory (all JSX)
- **external:** general knowledge of interactive explainer patterns (Stripe architecture diagrams, AWS architecture center, Miro/Lucidchart interactive exports, Excalidraw embeddable diagrams)
- **inferred:** pure HTML/CSS/SVG capability envelope for node-graph rendering; AI code-generation reliability with complex SVG path layouts; mobile touch behavior for diagram interactions

---

## Findings

### Blocking Issues

None. The core user path (user describes a concept -> cc-design generates an interactive HTML explainer -> user opens in browser and interacts) is viable. The three template types map well to distinct mental models.

---

### Important Issues

**1. [Important] Step-by-step + Hover + Entry animation interaction priority is undefined.**

Spec lists three interaction modes and says templates "support" all three simultaneously, but does not define priority when they conflict. When a user is on step 3 and hovers over an unrelated node, what wins -- the step highlight or the hover highlight? Does entry animation block step navigation? Can a user skip the entry animation?

The three modes operate at different temporal layers (page load / session state / micro-gesture) and need an explicit priority stack. Without it, AI-generated templates will implement conflicting behaviors.

- **source:** inferred (interaction layering is a standard HCI concern), local (spec section "交互模式详细定义" describes all three but does not address conflict)
- **recommendation:** Define an explicit interaction priority: (1) entry animation runs once on load, auto-skippable after 1.5s or on first user input; (2) step-by-step is the primary session state, always visible in the nav; (3) hover is a transient overlay that suppresses step highlight while active and restores on mouse-leave. Document this in `explainer-interaction-patterns.md`.

**2. [Important] Flow template's left-to-right layout has no overflow strategy for >5 nodes.**

Spec suggests flow max 8 nodes, but 8 nodes left-to-right on a 1024px viewport means ~120px per node including gaps. Nodes with labels, borders, and kind-colored backgrounds will be cramped. For mobile vertical layout, 8 stacked nodes with interconnecting SVG paths will require significant scrolling and the step narrative panel will compete for screen space.

The spec says "responsive layout: desktop full, mobile simplified/vertical" but does not define what "simplified" means for flow diagrams specifically.

- **source:** inferred (spatial math on spec's own constraints), local (spec section "技术约束" viewport breakpoints)
- **recommendation:** Add explicit overflow rules to the flow template definition: (a) if nodes <= 5, single horizontal row; (b) if nodes 6-8, allow a two-row zigzag layout with clear directional arrows; (c) on mobile, always use vertical scroll with sticky step panel at bottom. The "simplified" mobile strategy needs to be defined per template in `explainer-interaction-patterns.md`.

**3. [Important] Compare template lacks a clear mental model for "comparison of what."**

Flow and layer have strong spatial metaphors (left-to-right = sequence, top-to-bottom = hierarchy). Compare says "left-right or top-bottom" but does not specify what is being compared at the node level. Are these feature lists? Architecture diagrams? Timelines? Without defining the unit of comparison (feature row, component pair, metric card), the AI will produce inconsistent structures.

The spec defines `compare_explainer.html` schema with nodes but no `comparisonPoints` or `diff` structure. The schema in the spec (lines 57-79) is only shown for `flow_explainer`; compare and layer schemas are undefined.

- **source:** local (spec defines only flow schema, compare and layer are described narratively)
- **recommendation:** Define all three schemas. For compare, consider: `sides: [{label, items[]}]` + `diffs: [{dimension, left, right, verdict}]` instead of reusing the node/edge model. Layer needs: `layers: [{label, nodes[], connections}]`. Each schema should be documented in the template HTML as the flow schema is.

**4. [Important] Mobile touch interaction is underspecified.**

Spec says "触摸步骤切换" for mobile but does not address: (a) how hover-focus works on touch devices (hover does not exist); (b) step navigation tap targets and positioning; (c) pan/zoom for diagrams that exceed viewport; (d) whether entry animation is suppressed on mobile for performance.

Touch devices need a fundamentally different interaction model for the "hover" pattern. A long-press or tap-to-inspect pattern is needed.

- **source:** inferred (touch device HCI), local (spec mentions mobile only in "技术约束" and "验收标准" item 4)
- **recommendation:** For mobile: (a) replace hover with tap-to-inspect (tap node -> show detail panel, tap elsewhere or tap back arrow to dismiss); (b) step nav should be fixed bottom bar with prev/next buttons sized >=44px; (c) if diagram overflows, use horizontal scroll with momentum or a "focus mode" that zooms to the current step's nodes; (d) skip entry animation on mobile or reduce to a simple fade-in.

**5. [Important] The existing templates are all JSX/React but spec proposes HTML templates.**

All 9 templates in `templates/` are JSX files. The spec proposes 3 new `.html` templates. This creates an inconsistency in the template system -- some templates are React components (loaded via JSX/Babel), some are standalone HTML. The SKILL.md workflow says "copy template" and the current templates expect a React+Babel runtime.

If the explainer templates are pure HTML with inline CSS/JS, they do not need React. But the cc-design build workflow (as described in SKILL.md) seems oriented around JSX templates. The spec does not address this architectural mismatch.

- **source:** local (templates/ inventory vs spec's proposed .html templates)
- **recommendation:** Decide explicitly: either (a) explainer templates are standalone HTML and the load-manifest handles them as a different template type (requires workflow change in SKILL.md for how non-JSX templates are loaded/copied), or (b) explainer templates are also JSX files that render inline SVG + vanilla JS. Option (a) is more honest about the "pure HTML" constraint; option (b) is more consistent with existing infrastructure. Document the choice.

---

### Suggestions

**6. [Suggestion] Journey/timeline/funnel templates are deferred but the spec's target users need them.**

The spec lists "journey / timeline / funnel" as v2. But the target users (product teams explaining onboarding flows, GTM teams showing customer journeys, technical authors documenting release timelines) will hit these scenarios immediately. The current three templates (flow, layer, compare) cover "how it works" and "why it's better" but not "what happens over time."

Consider whether a simple timeline template (vertical timeline with step-by-step animation) is cheap enough to include in v0.1, since it reuses most of the step-by-step infrastructure already built for flow_explainer.

- **source:** inferred (user persona analysis), local (target user table)

**7. [Suggestion] Node kind color system needs accessibility validation.**

Spec defines: input=blue, process=gray/brand, output=green, decision=diamond. This 4-color system plus the "brand color override" mechanism could produce combinations that fail WCAG contrast requirements, especially when nodes are dimmed during step playback (nodes "变暗" per spec line 101).

The node-graph visuals reference doc should include explicit contrast ratios for: active node, dimmed node, active edge, dimmed edge, label on active node, label on dimmed node.

- **source:** inferred (accessibility), local (spec color definitions)

**8. [Suggestion] Step narrative panel placement needs a default position.**

Spec says steps show in "侧边面板或页面下方" but does not set a default per template. For flow_explainer (horizontal diagram), a right-side panel is natural on desktop but competes for space. For layer_explainer (vertical), the bottom is natural but may push content below fold.

Recommendation: flow -> right panel (desktop), bottom panel (mobile); layer -> bottom panel (always); compare -> integrated into the comparison area. Each template should have a fixed default, not a choice.

- **source:** inferred (layout reasoning), local (spec narrative placement)

**9. [Suggestion] CTA section positioning and visual weight.**

The spec includes a `cta` object in the flow schema (label + target) but does not describe: (a) where the CTA appears (always visible? only after last step? fixed position?), (b) visual weight relative to the diagram, (c) whether layer and compare templates also get CTAs.

For explainer pages, CTA timing matters: showing it before the user has engaged with the explanation is premature; showing it only at the end risks the user never reaching it.

- **source:** inferred (conversion UX), local (cta in schema)

**10. [Suggestion] Entry animation should have a "skip all" affordance.**

Spec mentions `prefers-reduced-motion` compliance but only for entry animation. For users who do not have this preference set but still want to skip the animation (e.g., returning viewers), a subtle "skip" control or making any click dismiss the animation would improve the experience. This is especially important for explainer pages that may be viewed repeatedly in meetings.

- **source:** external (common animation UX pattern), inferred

---

## Spec Impact

### Adopt

- Define interaction priority stack (entry < step-by-step < hover) in `explainer-interaction-patterns.md`
- Define all three schemas (flow, layer, compare) with template-specific fields, not just flow
- Define mobile touch interaction model (tap-to-inspect replaces hover)
- Define overflow/layout rules per template for max node counts
- Decide and document HTML vs JSX template format

### Reject

- None of the spec's core decisions should be reversed

### Ask User

1. **Template format:** Should explainer templates be standalone `.html` files (new workflow path) or `.jsx` files rendered via React (consistent with existing templates)?
2. **v0.1 scope:** Is a timeline template worth including given the target user personas, or is the three-template scope strict?
3. **CTA strategy:** Should CTA be always visible, appear after last step, or be configurable per template?
4. **Mobile pan/zoom:** Should the explainer support pinch-to-zoom on mobile for complex diagrams, or is that outside v0.1 scope?
