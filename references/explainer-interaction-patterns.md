# Explainer Interaction Patterns: Interactive Flow Explainer Behavioral Specification

> **Scope:** Defines the complete interaction model for `flow_explainer.jsx` templates -- state machine, animation timing, focus/context strategy, responsive degradation, and step-by-step playback.
>
> **Design source:** `docs/features/20260511-interactive-explainer/02-design.md` (KD2, KD3, KD4, KD5)
>
> **Cross-references:** `animation-best-practices.md` (easing, stagger, focus switch), `interaction-design-theory.md` (Fitts/Hick, feedback delay), `responsive-design.md` (breakpoints)

---

## 1. Interaction Priority Stack

Three interaction layers are ordered by priority. When multiple layers are active simultaneously, the highest-priority layer wins visually.

| Priority | Layer | Description |
|----------|-------|-------------|
| Lowest | **entry** | Phase `entering`. All node/edge entrance animations play. Step navigation and hover are blocked. |
| Medium | **step** | Phase `ready`, `currentStep` drives which nodes are highlighted/dimmed. Active by default after entry completes. |
| Highest | **hover** | Phase `ready`, `hoveredNode !== null`. Overrides step highlighting for the hovered node and its direct edges. |

**Resolution rules:**
- When hover activates during a step, the step's visual highlighting is suppressed (not cleared) -- step state persists so it can be restored when hover ends.
- CTA visibility at `step=last` is not suppressed by hover; CTA remains visible regardless of hover state.
- During `entering` phase, all user-driven interactions (step change, hover, tap-to-inspect) are queued and execute only after transition to `ready`.

---

## 2. Complete State Transition Table

The explainer's behavior is governed by a finite state machine with two top-level phases (`entering`, `ready`) and two sub-state variables (`currentStep`, `hoveredNode`).

| # | From State | Trigger | To State | Behavior |
|---|-----------|---------|----------|----------|
| 1 | `entering` | Animation sequence completes | `ready, step=0` | Step panel displays step 0 content; first step's focus nodes are highlighted |
| 2 | `entering` | User input: `click` / `keydown` / `touchstart` (any) | `ready, step=0` | Skip all remaining entry animations immediately; render final positions; display step 0 |
| 3 | `ready, step=N` | Click Next button / keyboard ArrowRight | `ready, step=N+1` | Highlight nodes in `steps[N+1].focus`; dim all others; scroll step panel to top |
| 4 | `ready, step=N` | Click Prev button / keyboard ArrowLeft | `ready, step=N-1` | Highlight nodes in `steps[N-1].focus` (only if N > 0) |
| 5 | `ready, step=0` | Click Prev button / keyboard ArrowLeft | No state change | Prev button is disabled; no transition occurs |
| 6 | `ready, step=last` | (automatic on entry to last step) | CTA visible | Call-to-action button appears at bottom of step panel |
| 7 | `ready` | Mouse hover enters node area (desktop) | `hoveredNode=id` | Hovered node and its directly connected edges are highlighted; all other nodes dim; step highlight is visually suppressed |
| 8 | `ready` | Mouse leaves node area (desktop) | `hoveredNode=null` | Restore step highlight to current `currentStep` configuration |
| 9 | `ready` | Tap on node (mobile) | `hoveredNode=id` | Tap-to-inspect overlay appears with node detail; step highlight suppressed |
| 10 | `ready` | Tap on empty area / tap back arrow (mobile) | `hoveredNode=null` | Close tap-to-inspect overlay; restore step highlight |
| 11 | `ready, hoveredNode, step=last` | Hover activates | `hoveredNode=id` | CTA remains visible; hover visual takes effect but CTA is not suppressed |

**Additional rule for touch navigation (mobile):**
- Touch on Prev/Next buttons triggers step change (row 3 or 4). Tap targets are 48x48px minimum. Button tap areas do not overlap with node tap areas, so there is no conflict between step navigation and tap-to-inspect.

---

## 3. Step-by-Step Playback Mode

### 3.1 Navigation Controls

| Control | Position | Style | Desktop Trigger | Mobile Trigger |
|---------|----------|-------|----------------|----------------|
| Prev button | Bottom of step panel (desktop) / bottom bar (mobile) | 48x48px tap target, icon + label, disabled state at step=0 | Click / ArrowLeft | Tap |
| Next button | Bottom of step panel (desktop) / bottom bar (mobile) | 48x48px tap target, icon + label | Click / ArrowRight | Tap |
| Progress indicator | Top of step panel | Linear progress bar + "N/M" text label | Always visible | Always visible |
| CTA button | Below navigation buttons | Full-width within panel, brand primary color | Visible only at step=last | Visible only at step=last |

### 3.2 Highlight / Dim Strategy

When a step activates, its `focus` array specifies which node IDs are "active":

- **Active nodes:** Full opacity, normal colors, full interaction.
- **Dimmed nodes:** See Section 6 (Focus+Context Dimming Strategy).
- **Connected edges between active nodes:** Highlighted (full opacity, optional accent stroke color).
- **Other edges:** Dimmed to opacity 0.2.

### 3.3 Transition Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Step transition easing | `expoOut` | Primary easing per `animation-best-practices.md` Section 2 |
| Step transition duration | `250ms` | Fast enough to feel responsive, slow enough for visual tracking |
| Dimming easing | `expoOut` | Consistent with primary easing |
| Dimming duration | `300ms` | Slightly longer than step highlight to create depth perception |
| Hover focus easing | `expoOut` | Consistent with primary easing |
| Hover focus duration | `200ms` | Perceived feedback < 100ms after rendering delay (satisfies `interaction-design-theory.md` < 100ms feedback requirement) |

---

## 4. Hover Focus / Tap-to-Inspect Mode

### 4.1 Desktop: Hover Focus

- **Trigger:** Mouse enters a node's bounding box.
- **Visual effect:** The hovered node transitions to full opacity and full color saturation. All other nodes dim per Section 6. Edges connected to the hovered node highlight; all other edges dim to opacity 0.2.
- **Step suppression:** The current step's highlight is visually suppressed but `currentStep` state is unchanged.
- **Exit:** Mouse leaves the node. Step highlight restores with `expoOut 250ms`.
- **Edge case:** Hovering a node that is already highlighted by the current step produces no additional visual change (idempotent).

### 4.2 Mobile: Tap-to-Inspect

- **Trigger:** Tap on a node.
- **Visual effect:** Same dimming as hover (Section 6), plus a floating detail overlay appears near the tapped node showing the node's extended description.
- **Overlay positioning:** Positioned above or below the tapped node depending on available viewport space. Max-width 280px. Background: card color with slight elevation shadow.
- **Dismiss:** Tap on any area outside the overlay, or tap a dedicated close arrow icon.
- **Step suppression:** Same as desktop hover -- `currentStep` state preserved.

### 4.3 Hover/Step Conflict Resolution

| Condition | Resolution |
|-----------|------------|
| Hover active + step=N | Hover visual wins; step highlight suppressed |
| Hover ends + step=N | Step highlight restores |
| Hover active + step=last | Hover visual wins; CTA remains visible (not suppressed) |
| Tap-to-inspect active (mobile) + tap Next/Prev | Step changes; tap-to-inspect overlay closes; new step highlight renders |
| During `entering` phase | No hover or tap-to-inspect; all interaction blocked until `ready` |

---

## 5. Entry Animation Sequence

### 5.1 Timeline

```
t=0ms        Page load
t=0-400ms    Title + subtitle fade-in (expoOut, translateY -12px -> 0)
t=300ms      Node[0] entrance (expoOut, translateX -16px -> 0, duration 400ms)
t=350ms      Node[1] entrance
t=400ms      Node[2] entrance
...
t=300+50*(N-1)ms  Node[N-1] entrance
t=300+50*(N-1)+200ms  Edges start drawing (stroke-dasharray, expoOut, duration 600ms)
t=300+50*(N-1)+800ms  Entry complete -> phase transitions to `ready` -> step panel shows step 0
```

**Total entry duration formula:** `50ms * (N-1) + 400ms + 600ms`
- 5 nodes = 50 * 4 + 400 + 600 = **1200ms**
- 8 nodes = 50 * 7 + 400 + 600 = **1350ms**

### 5.2 Node Entrance

| Parameter | Value |
|-----------|-------|
| Easing | `expoOut` |
| Duration | `400ms` per node |
| Stagger | `50ms` between consecutive nodes |
| Motion | Fade in (opacity 0 -> 1) + horizontal slide (translateX -16px -> 0) |

**Stagger rationale:** The cc-design standard stagger is 30ms (`animation-best-practices.md` Section 4.3), but flow explainer nodes are larger (96-160px) with wider spacing (32px). At 30ms, adjacent nodes appear to enter simultaneously. 50ms provides perceptible sequencing without making 8-node diagrams feel sluggish.

### 5.3 Edge Drawing

| Parameter | Value |
|-----------|-------|
| Easing | `expoOut` |
| Duration | `600ms` |
| Technique | `stroke-dasharray` + `stroke-dashoffset` animated from full path length to 0 |
| Start delay | 200ms after last node begins its entrance |

**Implementation note:** Edge paths must be measured via `path.getTotalLength()` in JS. Set `stroke-dasharray` and initial `stroke-dashoffset` to the total length, then animate `stroke-dashoffset` to 0.

### 5.4 Data-Flow Pulse Animation

| Parameter | Value |
|-----------|-------|
| Easing | `expoOut` |
| Dash pattern | Dynamic `dasharray` based on `path.getTotalLength()` |
| Repeat count | **4 pulses**, then stop |
| Purpose | Visual indicator of data/information flow direction on edges |

**Rationale for 4 pulses:** Infinite pulse loops distract from the step-by-step narrative. 4 pulses provide enough visual information to convey flow direction without becoming ambient noise.

### 5.5 Skip-on-Any-Input

Any user input during the `entering` phase immediately terminates all entry animations and transitions to `ready, step=0`:

- `click` (anywhere on page)
- `keydown` (any key)
- `touchstart` (any touch)

**Implementation:** Attach a single listener to the container during `entering` that calls a skip function, then removes itself. The skip function cancels all active animations (via `Animation.cancel()` or clearing requestAnimationFrame IDs) and sets all nodes/edges to their final positions immediately.

### 5.6 `prefers-reduced-motion` Degradation

When `prefers-reduced-motion: reduce` is active:

| Feature | Normal Behavior | Reduced-Motion Behavior |
|---------|----------------|------------------------|
| Entry animation | Full stagger + fade + slide sequence | **Skip entirely**; render all nodes/edges in final positions; transition to `ready` immediately |
| Step transition | expoOut 250ms opacity/transform animation | **Instant state switch**; no transition duration |
| Hover focus | expoOut 200ms opacity/blur transition | **Outline only**; 2px solid outline on hovered node, no opacity/blur change |
| Pulse animation | 4-pulse dasharray loop | **Disabled entirely** |
| Dim/restore | expoOut 300ms opacity/blur | **Instant**; opacity/blur changes apply without transition |

**CSS implementation:**

```css
@media (prefers-reduced-motion: reduce) {
  .explainer-node,
  .explainer-edge,
  .explainer-step-panel {
    transition-duration: 0ms !important;
    animation: none !important;
  }
  .explainer-node:hover {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}
```

---

## 6. Focus+Context Dimming Strategy

### 6.1 Desktop (viewport >= 1024px)

Full execution of `animation-best-practices.md` Section 3.8 Focus Switch recipe.

| Element | Active State | Dimmed State |
|---------|-------------|-------------|
| Node | opacity: 1, normal colors | opacity: 0.35, filter: blur(4px) |
| Node text | opacity: 1 | opacity: 0.4 |
| Edge (connected to active) | opacity: 1, optional highlight color | -- |
| Edge (not connected) | -- | opacity: 0.2 |
| Edge label | opacity: 1 | opacity: 0.25 |

**Why blur is mandatory (per L1.1 Section 3.8):** With only opacity reduction, out-of-focus elements remain visually sharp and compete for attention. `blur(4px)` creates genuine depth separation -- dimmed nodes perceptually recede to a background layer. At <= 8 nodes, the performance cost of blur is negligible.

### 6.2 Mobile (viewport < 768px)

Opacity-only degradation. No blur.

| Element | Active State | Dimmed State |
|---------|-------------|-------------|
| Node | opacity: 1, normal colors | opacity: 0.35 (no blur) |
| Node text | opacity: 1 | opacity: 0.4 |
| Edge | Same as desktop | Same as desktop |

**Rationale:** Mobile CPUs/GPUs are weaker, and simultaneously running SVG rendering + CSS blur + touch event handling produces higher total load than desktop. Additionally, mobile nodes are smaller, so blur's visual benefit diminishes while its performance cost does not.

### 6.3 Tablet (viewport 768-1023px)

Same as desktop dimming strategy (opacity + blur). Tablet devices in this breakpoint typically have sufficient GPU capability for blur on <= 8 nodes.

---

## 7. Responsive Interaction Degradation

Three breakpoints with distinct interaction capabilities.

### 7.1 Desktop (>= 1024px) -- Full Feature Set

| Feature | Behavior |
|---------|----------|
| Step panel | Right side, ~35% width, min 280px |
| Navigation | Keyboard arrows + click buttons |
| Hover focus | Mouse hover on nodes |
| Dimming | opacity 0.35 + blur(4px) |
| Entry animation | Full stagger + edge draw + pulse |

### 7.2 Tablet (768-1023px) -- Panel Narrows

| Feature | Behavior |
|---------|----------|
| Step panel | Right side, fixed 280px width (not percentage-based) |
| Navigation | Click buttons; keyboard if hardware keyboard connected |
| Hover focus | Mouse hover if pointer device; otherwise tap-to-inspect |
| Dimming | opacity 0.35 + blur(4px) (same as desktop) |
| Entry animation | Full (same as desktop) |

### 7.3 Mobile (< 768px) -- Bottom Bar + Tap

| Feature | Behavior |
|---------|----------|
| Step panel | Fixed bottom bar, min-height 120px, expandable to show full body text |
| Navigation | Tap-only; 48x48px Prev/Next buttons; no keyboard |
| Hover focus | Replaced by tap-to-inspect overlay |
| Dimming | opacity 0.35 only (no blur) |
| Entry animation | Same timing; but node translate distances may be shorter on narrow viewports |

### 7.4 Touch Target Compliance

All interactive elements on mobile/tablet:

| Element | Minimum size | Grid alignment |
|---------|-------------|----------------|
| Prev/Next buttons | 48 x 48px | 8px grid |
| Node tap area | Full node bounding box | N/A |
| CTA button | 48px height, full panel width | 8px grid |
| Expand handle (bottom bar) | 48 x 48px | 8px grid |

Per `interaction-design-theory.md` Fitts's Law and WCAG 2.1 AA: minimum touch target 44px; cc-design standard is 48px (8px grid multiple above 44px).

---

## 8. Step Panel Layout Parameters

### 8.1 Desktop (>= 1024px)

```
+----------------------------------+--------------+
|                                  |   Step 3/5   |
|     [Flow Diagram Area]          |  ---------   |
|     (flexbox, ~65%)              |  Headline    |
|                                  |  Body text   |
|     Node A -> Node B -> ...      |  (overflow:  |
|                                  |   auto)      |
|                                  |              |
|                                  | <- Prev Next->|
|                                  |  [CTA button]|
+----------------------------------+--------------+
```

| Parameter | Value |
|-----------|-------|
| Panel width | ~35% of container, minimum 280px |
| Diagram area | Remaining ~65% |
| Panel internal overflow | `overflow: auto` for long body text |
| Progress indicator | Linear progress bar + "N/M" text at panel top |
| Navigation buttons | Bottom of panel, horizontally adjacent |
| CTA | Full-width button, below navigation, visible only at last step |

### 8.2 Tablet (768-1023px)

| Parameter | Value |
|-----------|-------|
| Panel width | Fixed 280px (not percentage) |
| Diagram area | Remaining space (fluid) |
| All other parameters | Same as desktop |

### 8.3 Mobile (< 768px)

```
+----------------------------------+
|                                  |
|     [Flow Diagram Area]          |
|     (vertical layout, scrollable)|
|                                  |
+----------------------------------+
| Step 3/5    --------             | <- Fixed bottom bar
| Headline                         |
| <- Prev              Next ->     |
| (expandable to show full body)   |
+----------------------------------+
```

| Parameter | Value |
|-----------|-------|
| Panel position | Fixed to viewport bottom |
| Panel min-height | 120px (collapsed, shows headline + nav) |
| Panel max-height | 50vh (expanded, shows full body) |
| Expand behavior | Tap to toggle between collapsed and expanded |
| Diagram area | Full width, scrollable vertically above the bottom bar |
| Prev/Next buttons | 48 x 48px, horizontally adjacent |
| Body text | Hidden in collapsed state; visible when expanded |

---

## Appendix A: Easing Reference

All durations in this document use one easing function unless otherwise specified.

| Easing | CSS Equivalent | Formula | Usage in Explainer |
|--------|---------------|---------|-------------------|
| `expoOut` | `cubic-bezier(0.16, 1, 0.3, 1)` | `t === 1 ? 1 : 1 - Math.pow(2, -10 * t)` | All transitions (entry, step, hover, dim) |

Source: `animation-best-practices.md` Section 2, `animations.jsx` Easing library.

## Appendix B: Timing Summary Table

| Animation | Duration | Easing | Stagger / Delay |
|-----------|----------|--------|-----------------|
| Node entrance (fade + slide) | 400ms | expoOut | 50ms per node |
| Edge drawing (stroke-dasharray) | 600ms | expoOut | 200ms after last node starts |
| Data-flow pulse | dynamic | expoOut | 4 repetitions then stop |
| Step transition highlight | 250ms | expoOut | -- |
| Hover focus | 200ms | expoOut | -- |
| Dim/restore | 300ms | expoOut | -- |
| Title/subtitle entrance | 400ms | expoOut | Starts at t=0 |

## Appendix C: State Variable Summary

| Variable | Type | Values | Description |
|----------|------|--------|-------------|
| `phase` | string | `'entering'` / `'ready'` | Top-level phase of the explainer |
| `currentStep` | number | `0` to `steps.length - 1` | Currently displayed step index |
| `hoveredNode` | string or null | `null` / node ID | Currently hovered or tapped node; null when no node is focused |
| `ctaVisible` | boolean | derived from `currentStep === steps.length - 1` | Whether the CTA button is shown |

---

## 9. Compare Explainer Interaction Patterns

> **Scope:** Defines the complete interaction model for `compare_explainer.jsx` templates -- priority stack, state machine, overview mode, dimension switching, hover focus, and mobile degradation.
>
> **Design source:** `docs/features/20260511-explainer-extensions/02-design.md` (KD1, KD2, KD3)
>
> **Cross-references:** Sections 1-8 (v0.1 flow_explainer patterns, shared dimming/entry/responsive framework); `animation-best-practices.md` (easing, stagger, narrative rhythm)

---

### 9.1 Interaction Priority Stack

Three interaction layers ordered by priority. When multiple layers are active simultaneously, the highest-priority layer wins visually.

| Priority | Layer | Description |
|----------|-------|-------------|
| Lowest | **entry** | Phase `entering`. Title, dimension labels, and overview comparison items animate in sequentially. Dimension switching and hover are blocked. |
| Medium | **dimension switching / overview** | Phase `ready`, `dimension` drives which comparison items and connections are displayed. Active by default after entry completes. Overview is the initial default dimension. |
| Highest | **hover** | Phase `ready`, `hoveredItem !== null`. Overrides dimension/overview visual highlighting for the hovered item and its associated connections. |

**Resolution rules:**

- When hover activates during a dimension view, the dimension's visual highlighting is suppressed (not cleared) -- dimension state persists so it can be restored when hover ends.
- CTA visibility is not suppressed by hover; CTA remains visible regardless of hover state.
- During `entering` phase, all user-driven interactions (dimension switch, hover, tap-to-inspect) are queued and execute only after transition to `ready`.
- When switching dimensions, `hoveredItem` is forced to `null` because the old item id may not exist in the new dimension. The hover context loss is acceptable -- the user has explicitly changed focus by clicking a different dimension tab.

---

### 9.2 Complete State Transition Table

The Compare explainer's behavior is governed by a finite state machine with two top-level phases (`entering`, `ready`) and two sub-state variables (`dimension`: string, `hoveredItem`: string | null).

**Sub-state variable definitions:**

- `dimension`: `"overview"` or a dimension id (e.g. `"performance"`, `"cost"`, `"security"`)
- `hoveredItem`: `null`, an item id (e.g. `"react-performance-1"`), or a verdict id (e.g. `"verdict-react"`). See Section 9.3 for value domain details.

| # | From State | Trigger | To State | Behavior |
|---|-----------|---------|----------|----------|
| 1 | `entering` | Animation sequence completes | `ready, dimension="overview", hoveredItem=null` | Overview items visible; verdict badges + diff summary rendered; connections not shown |
| 2 | `entering` | User input: click / keydown / touchstart (any) | `ready, dimension="overview", hoveredItem=null` | Skip all remaining entry animations; render final positions immediately; show overview |
| 3 | `ready, dimension="overview"` | Mouse hover enters verdict badge (desktop) | `hoveredItem="verdict-{subjectId}"` | Hovered verdict badge highlighted; all diff summary items dimmed (opacity 0.35 + blur 4px desktop); badge accent bar widens to 6px |
| 4 | `ready, dimension="overview"` | Mouse hover enters diff summary item (desktop) | `hoveredItem=itemId` | Hovered item highlighted (full opacity); all other summary items dimmed (opacity 0.35 + blur 4px desktop); item color bar widens to 6px + scale(1.02) |
| 5 | `ready, dimension="overview"` | Mouse leaves hovered element (desktop) | `hoveredItem=null` | Restore overview normal brightness; all items return to full opacity |
| 6 | `ready, dimension="overview"` | Click dimension tab | `dimension=tabId, hoveredItem=null` | Trigger Section 9.4 overview->dimension animation sequence; connections draw; detail panel shows dimension content |
| 7 | `ready, dimension=X` | Mouse hover enters item (desktop) | `hoveredItem=itemId` | Hovered item highlighted; all other items in current dimension dimmed; non-associated connections dimmed; associated connections highlighted |
| 8 | `ready, dimension=X` | Mouse leaves hovered element (desktop) | `hoveredItem=null` | Restore current dimension normal brightness; all items return to full opacity |
| 9 | `ready, dimension=X` | Click another dimension tab | `dimension=newTabId, hoveredItem=null` | hoveredItem cleared (old id may not exist in new dimension; hover context loss is acceptable -- user has explicitly changed focus); trigger Section 9.4 dimension->dimension animation sequence |
| 10 | `ready, dimension=X` | Click overview tab | `dimension="overview", hoveredItem=null` | Trigger Section 9.4 dimension->overview animation sequence; connections fade out; overview items fade in |
| 11 | `ready, *` (mobile) | Tap item | `hoveredItem=itemId` | Show tap-to-inspect overlay with item detail; item highlighted; other items dimmed |
| 12 | `ready, *` (mobile) | Tap X/close button or tap outside overlay | `hoveredItem=null` | Dismiss overlay; restore normal brightness |
| 13 | `ready, *` (mobile) | Tap another item | `hoveredItem=newItemId` | Close old overlay first, then open new overlay with new item detail; no intermediate state |

**Additional rules:**

- During `entering` phase, dimension switch clicks are blocked. First user input skips entry and transitions to `ready, dimension="overview"`.
- Overview mode does not show score dots or connections -- only verdict badges, diff summary items, and diff count label.
- Connections are only rendered in dimension mode (not overview). When switching from overview to a dimension, connections draw via stroke-dasharray animation; when switching between dimensions, connections use a fade transition (no stroke-dasharray redraw).

---

### 9.3 Overview Mode

The Compare explainer enters `ready` phase with `dimension="overview"` as the default state (not the first user-defined dimension). Overview is the "decision entry point" -- it provides a rapid judgment framework before the user dives into specific dimensions.

**Overview content:**

- **Verdict badges**: Each subject displays a "Best for [X]" pill-shaped badge (radius 8px, min-height 32px, min-width 80px) with a 4px left accent bar (subject accentColor) + white background (#FAFAFA) + dark text (#1F2937). Hover expands the methodology rationale in a 280px floating overlay (consistent with v0.1 detail overlay).
- **Diff summary items**: Only items where the two subjects differ (kind differs, or score gap >= 2, or any side is con). Diff items display: kind icon (SVG inline 12px) + kind text label ("Pro"/"Con"/"Neutral"/"Highlight") + item label text. Diff items have a 4px left border accent (subject accentColor).
- **Diff count label**: "N/M items differ" at the bottom of the overview area, 14px medium weight.
- Overview does not show score dots or connections -- only verdict badges, diff summary items, and diff count.

**Overview `hoveredItem` value domain:**

| `hoveredItem` value | Meaning | Visual effect |
|---------------------|---------|---------------|
| `null` | No hover active | All overview elements at normal opacity |
| `"verdict-{subjectId}"` | Hover over a verdict badge | Badge accent bar widens to 6px; badge highlighted; all diff summary items dimmed |
| `{itemId}` | Hover over a diff summary item card | Item color bar widens to 6px + scale(1.02); item highlighted; all other items dimmed |

The template distinguishes verdict badge hover from item card hover by checking the `"verdict-"` prefix on `hoveredItem`.

---

### 9.4 Dimension Switch Animation Sequence

| Transition | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|-----------|---------|---------|---------|---------|-------|
| Overview -> Dimension | items fade out 200ms | dimension items fade in 300ms + stagger 50ms | connections draw 600ms (stroke-dasharray) | pulse 4x then static | ~1200ms |
| Dimension -> Overview | connections fade out 200ms | dimension items fade out 200ms | overview items fade in 300ms | -- | ~700ms |
| Dimension -> Dimension | current items fade out 200ms | new items fade in 300ms + stagger 50ms | connections transition 200ms (fade old, draw new staggered) | -- | ~700ms |

All durations use `expoOut` easing (cubic-bezier(0.16, 1, 0.3, 1)), consistent with v0.1 Section 3.3.

**Key differences from v0.1 step transition:**

- Overview->dimension transition is longer (~1200ms) because connections need a full stroke-dasharray draw animation (first appearance narrative, per "show process, not magic result" philosophy).
- Dimension->dimension transition is shorter (~700ms) because connections use a fade transition rather than a full stroke-dasharray redraw (performance optimization; visual smoothness).
- The 4-phase sequence follows the Slow-Fast-Boom micro narrative rhythm: old content Slow fades out -> new content Fast enters -> connections Boom draw -> pulse iterations provide rhythmic emphasis then stop.

**Animation timing parameters:**

| Parameter | Value | Easing | Rationale |
|-----------|-------|--------|-----------|
| Fade out (Phase 1) | 200ms | expoOut | Quick exit, responsive feel |
| Fade in (Phase 2) | 300ms | expoOut | Primary content entrance |
| Fade in stagger (Phase 2) | 50ms per item | -- | Consistent with v0.1 node stagger |
| Connections draw (Phase 3) | 600ms | expoOut | Stroke-dasharray, consistent with v0.1 edge draw |
| Pulse (Phase 4) | 4 iterations then stop | expoOut | Consistent with v0.1 data-flow pulse |
| Connections fade (dimension switch) | 200ms | expoOut | Faster than draw; fade is smoother for existing content |

---

### 9.5 Hover Focus Strategy

**Desktop: Hover focus on comparison items**

- **Trigger:** Mouse enters an item card's bounding box.
- **Visual effect:** The hovered item transitions to full opacity, full color saturation, color bar widens to 6px, and slight scale(1.02). Associated connections highlight (stroke accent color, full opacity). All other items dim per Section 6 (v0.1 shared dimming). Non-associated connections dim to opacity 0.2.
- **Dimension/overview suppression:** The current dimension/overview visual state is suppressed but `dimension` state is unchanged.
- **Exit:** Mouse leaves the item. Dimension/overview visual restores with `expoOut 250ms`.
- **Edge case:** Hovering an item that is already highlighted by the current step produces no additional visual change (idempotent).

**Desktop: Hover focus on verdict badges (overview only)**

- **Trigger:** Mouse enters a verdict badge.
- **Visual effect:** Badge accent bar widens to 6px; badge receives subtle background elevation. All diff summary items dim. Methodology rationale text appears in a 280px floating overlay near the badge.
- **Exit:** Mouse leaves the badge. Overview visual restores.

**`hoveredItem` three value domains:**

| Domain | Value format | Trigger | Visual effect |
|--------|-------------|---------|---------------|
| Verdict badge | `"verdict-{subjectId}"` | Hover verdict badge (overview) | Badge highlight + method overlay; other items dim |
| Item in overview | `{itemId}` (diff summary item) | Hover diff summary item | Item highlight + color bar widen; other items dim |
| Item in dimension | `{itemId}` (dimension item) | Hover dimension item | Item highlight + associated connections highlight; other items + non-associated connections dim |

---

### 9.6 Mobile Interaction Degradation

**Tap-to-inspect replaces hover:**

- **Trigger:** Tap on a comparison item.
- **Visual effect:** Same dimming as desktop hover (opacity 0.35, no blur on mobile), plus a floating detail overlay near the tapped item showing the item's detail text.
- **Overlay positioning:** Positioned above or below the tapped item depending on available viewport space. Max-width 280px. Background: card color (#FAFAFA) with slight elevation shadow.
- **Dismiss mechanism (three ways):**
  1. Tap the X close button (48x48px, upper-left corner of overlay, per v0.1 tap overlay spec)
  2. Tap on any area outside the overlay (overlay has a semi-transparent backdrop indicating boundary)
  3. Tap another comparison item -- closes current overlay first, then opens new overlay (sequential, not simultaneous)
- **Step/dimension suppression:** Same as desktop hover -- `dimension` state preserved.

**Mobile dimension switching:**

- Dimension tabs displayed as horizontal scrollable tab strip at the top of the viewport.
- Current tab highlighted with accent color.
- Tab tap targets: 48x48px minimum, consistent with v0.1 Section 7.4.
- Optional: left/right swipe gesture to switch dimensions (equivalent to tab click).

**Mobile layout:**

- Two subject columns become vertical stack (Subject A above Subject B), not side-by-side.
- Connections are not shown on mobile (per spec; SVG connections on narrow viewports cause visual clutter).
- Bottom bar: fixed, min-height 120px, expandable to 50vh, showing current dimension headline + brief detail text.

**`prefers-reduced-motion` degradation:**

| Feature | Normal Behavior | Reduced-Motion Behavior |
|---------|----------------|------------------------|
| Entry animation | Full stagger + fade + slide sequence | **Skip entirely**; render all items in final positions; transition to `ready` immediately |
| Dimension switch | 4-phase animation sequence (~700-1200ms) | **Instant state switch**; no transition duration |
| Hover focus | expoOut 200ms opacity/blur transition | **Outline only**; 2px solid outline on hovered item, no opacity/blur change |
| Pulse animation | 4-pulse dasharray loop | **Disabled entirely** |
| Dim/restore | expoOut 300ms opacity/blur | **Instant**; opacity changes apply without transition |

---

## 10. Decision Tree Explainer Interaction Patterns

> **Scope:** Defines the complete interaction model for `decision_tree.jsx` templates -- priority stack, state machine, hover path highlighting, path description format, and mobile degradation.
>
> **Design source:** `docs/features/20260511-explainer-extensions/02-design.md` (KD4, KD5, KD6, KD7)
>
> **Cross-references:** Sections 1-8 (v0.1 flow_explainer patterns, shared dimming/entry/responsive framework); Section 9 (Compare explainer, shared priority stack architecture)

---

### 10.1 Interaction Priority Stack

Three interaction layers ordered by priority. When multiple layers are active simultaneously, the highest-priority layer wins visually.

| Priority | Layer | Description |
|----------|-------|-------------|
| Lowest | **entry** | Phase `entering`. Title + tree nodes animate in from root to leaves per BFS level (translateY -12px -> 0, 50ms stagger per level). Edges draw after last level. |
| Medium | **full-tree display** | Phase `ready`, all nodes and branches simultaneously visible (no collapse/expand). This is the baseline visual state after entry completes. |
| Highest | **hover path highlighting** | Phase `ready`, `hoveredNode !== null`. Entire root-to-node path highlighted; all non-path elements dimmed. Overrides full-tree baseline visual. |

**Resolution rules:**

- When hover activates, the full-tree baseline visual is suppressed (not cleared) -- all nodes are still rendered, but non-path elements are dimmed.
- Conclusion nodes on the highlighted path retain their emerald-tint shadow; this visual emphasis is not suppressed by hover.
- During `entering` phase, all user-driven interactions (hover, tap-to-inspect) are blocked. First user input skips entry and transitions to `ready`.
- `prefers-reduced-motion` skips entry animation entirely and uses outline-only hover instead of opacity/blur transitions.

---

### 10.2 Complete State Transition Table

The Decision Tree explainer's behavior is governed by a finite state machine with two top-level phases (`entering`, `ready`) and two sub-state variables (`hoveredNode`: string | null, `highlightedPath`: string[]).

**Sub-state variable definitions:**

- `hoveredNode`: `null` or a node id (e.g. `"root"`, `"react-spa"`)
- `highlightedPath`: array of node ids from root to hoveredNode, computed via parent-pointer traversal. Empty when `hoveredNode=null`.

| # | From State | Trigger | To State | Behavior |
|---|-----------|---------|----------|----------|
| 1 | `entering` | Animation sequence completes | `ready, hoveredNode=null, highlightedPath=[]` | Full tree visible; all nodes at normal opacity; right panel shows tree overview |
| 2 | `entering` | User input: click / keydown / touchstart (any) | `ready, hoveredNode=null, highlightedPath=[]` | Skip all remaining entry animations; render all nodes/edges in final positions immediately |
| 3 | `ready, hoveredNode=null` | Mouse hover enters node area (desktop) | `hoveredNode=nodeId, highlightedPath=computeRootToNodePath(nodeId)` | Path nodes: opacity 1, normal colors; path edges: stroke 3px accent color; non-path nodes: opacity 0.35 + blur 4px; non-path edges: opacity 0.2; right panel updates to show path description |
| 4 | `ready, hoveredNode=X` | Mouse leaves node area (desktop) | `hoveredNode=null, highlightedPath=[]` | Restore full-tree normal brightness; right panel returns to overview |
| 5 | `ready, hoveredNode=X` | Mouse moves to adjacent node Y (desktop) | `hoveredNode=Y, highlightedPath=computeRootToNodePath(Y)` | Direct switch: no intermediate state; path highlight transitions smoothly from X's path to Y's path; old path dims while new path highlights (expoOut 200ms) |
| 6 | `ready, hoveredNode=null` | Tap node (mobile) | `hoveredNode=nodeId, highlightedPath=computeRootToNodePath(nodeId)` | Show sticky overlay near tapped node with node detail + path description; path highlight same as desktop |
| 7 | `ready, hoveredNode=X` | Tap X/close button or tap outside overlay (mobile) | `hoveredNode=null, highlightedPath=[]` | Dismiss overlay; restore full-tree brightness |
| 8 | `ready, hoveredNode=X` | Tap another node Y (mobile) | `hoveredNode=Y, highlightedPath=computeRootToNodePath(Y)` | Close old overlay then open new overlay; path transitions from X to Y; no intermediate state |

**Additional rule for touch navigation (mobile):**

- Tap on a node triggers path highlighting (row 6). Node tap targets are the full node bounding box, minimum 48x48px. Overlay dismiss targets (X button, outside area) do not overlap with node tap areas.

---

### 10.3 Hover Path Highlighting Strategy

**Full root-to-node path highlighting** (not partial):

When a node is hovered, the entire path from the root to that node is highlighted. This is the core interaction value of a decision tree -- it transforms passive reading into active exploration of decision logic.

| Element | Path (highlighted) | Non-path (dimmed) |
|---------|-------------------|-------------------|
| Node | opacity 1, normal colors | opacity 0.35 + blur 4px (desktop) / opacity 0.35 (mobile) |
| Node text | opacity 1 | opacity 0.4 |
| Edge on path | opacity 1, stroke 3px, accent color (#10B981 or brand) | opacity 0.2, stroke 2px |
| Edge label on path | opacity 1 | opacity 0.25 |
| Conclusion node on path | opacity 1, emerald shadow (0 2px 8px rgba(16,185,129,0.25)) | -- |

**Path computation: `computeRootToNodePath(nodeId)`**

- Starting from the hovered node id, traverse parent pointers backward to the root node.
- Collect all node ids and edge ids along the traversal.
- Time complexity: O(depth), where depth is the tree depth from root to hoveredNode.
- Parent pointers are derived from the `edges` array during template initialization: for each edge `{from, to}`, `to`'s parent is `from`. The root node has no parent.

**Why full path, not just current node + direct edges:** Decision trees provide value by showing the complete decision chain -- from the root question to the final conclusion. Partial highlighting (only the current node and its immediate connections) would break this narrative; the user could not trace "why did I arrive at this node?"

**Hover transition between adjacent nodes:**

- When mouse moves from node X to node Y, there is no intermediate `hoveredNode=null` state. The path transitions directly from X's path to Y's path.
- Visual transition: old path dims with `expoOut 200ms`, new path highlights with `expoOut 200ms`.
- Right panel path description updates immediately on `hoveredNode` change.

---

### 10.4 Path Description Text Format

When a node is hovered (or tapped on mobile), the right panel (desktop) or bottom overlay (mobile) displays a text description of the highlighted path.

**Format rule:**

```
{Root node label} -> {branch label} -> {next node label} -> {branch label} -> ... -> {conclusion node label}
```

- Node labels use the `label` field from the `nodes` array (not the `id` or `kind`).
- Branch labels use the `label` field from the `edges` array (the edge connecting the previous node to the next node).
- Arrow delimiter: `->` with single space on each side.
- If the hovered node is a conclusion (terminal), the path description ends with the conclusion label and the panel additionally displays the conclusion's `conclusion` text field.

**Example:**

Hovering the `"react-spa"` conclusion node produces:

```
What is your project type? -> Web -> Interactive UI -> Real-time needed -> Complex state -> Choose React
```

The right panel also shows the conclusion verdict: "React + TypeScript is optimal for interactive SPAs with real-time data."

**Path description updates:** The text is recomputed and re-rendered on every `hoveredNode` change. No animation delay on text update -- text changes are instant to maintain responsiveness.

---

### 10.5 Mobile Interaction Degradation

**Indented vertical list replaces horizontal tree:**

On mobile (<768px), the tree is rendered as an indented vertical list rather than a horizontal BFS layout. This avoids horizontal overflow and is the standard mobile tree pattern.

- Each node is a row in a vertical list.
- Indent per level: `level * 24px` (left margin increases with tree depth).
- Node style: consistent with desktop (rounded rect, radius 8px, kind colors).
- Branch labels are shown as inline text before each child node: `"-> {branch label}"` prefix.
- No SVG edges on mobile -- the indentation visually encodes the tree structure.

**Tap-to-inspect replaces hover:**

- **Trigger:** Tap on a node in the vertical list.
- **Visual effect:** Path highlighting applied (same dimming rules as desktop, but opacity-only on mobile -- no blur). A sticky overlay appears at the bottom of the viewport.
- **Overlay content:** Path description text (Section 10.4 format) + node detail text + conclusion text (if terminal).
- **Overlay positioning:** Fixed to viewport bottom (sticky, does not scroll away with tree content). Min-height 120px, expandable to 50vh. User can scroll the tree list while overlay remains visible.
- **Dismiss:** X close button (48x48px, upper-right corner of overlay) or tap outside overlay area.

**Sticky overlay rationale:** Unlike the Compare explainer's dismiss-on-tap-outside overlay, the Decision Tree mobile overlay is sticky (fixed to viewport bottom). This is because path information must persist while the user continues exploring the tree -- scrolling to see other nodes should not dismiss the path detail they are currently reading.

**`prefers-reduced-motion` degradation:**

| Feature | Normal Behavior | Reduced-Motion Behavior |
|---------|----------------|------------------------|
| Entry animation | Full stagger + fade + translateY sequence | **Skip entirely**; render all nodes/edges in final positions; transition to `ready` immediately |
| Path highlight transition | expoOut 200ms opacity/blur transition | **Outline only**; 2px solid outline on path nodes, no opacity/blur change |
| Dim/restore | expoOut 300ms opacity/blur | **Instant**; opacity changes apply without transition |
| Edge draw | 600ms stroke-dasharray | **Instant**; edges rendered fully drawn |
