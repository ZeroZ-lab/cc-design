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
