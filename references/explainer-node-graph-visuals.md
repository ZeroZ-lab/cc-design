# Explainer Node-Graph Visuals Reference

> Source: `docs/features/20260511-interactive-explainer/02-design.md` (KD1, KD5, Inf-1 through Inf-4)
> Purpose: Single-source-of-truth for every visual and rendering parameter used in the interactive explainer node-graph template.

---

## 1. Node Style

| Parameter | Value | Source |
|-----------|-------|--------|
| Shape | Rounded rectangle (all kinds, no diamonds) | KD1, A11 |
| Border radius | 8 px | KD1 |
| Min size | 96 x 48 px | KD1, Inf-4 |
| Max size | 160 x 72 px | KD1 |
| Background fill | Kind color (see palette below) | KD1 |
| Border / shadow | None (flat, no decoration) | KD1, Pattern 1 |
| Horizontal spacing | 32 px | KD1 |
| Vertical spacing | 24 px | KD1 |

Rationale: 96 px minimum width accommodates 6 characters of 15 px text with 3 px horizontal padding on each side (Inf-4). The 8 px radius follows the cc-design 8 px spacing grid (L1.5). All kinds share the same shape; color alone encodes semantic kind (A11).

---

## 2. Edge / Connection Style

| Parameter | Value | Source |
|-----------|-------|--------|
| Stroke width | 2 px | KD1 |
| Stroke color | Inherits kind color of source node or neutral gray | KD1, Pattern 1 |
| Path type | Cubic Bezier (SVG `C` command) | KD5 |
| Bezier control-point offset | Horizontal offset = 40% of the gap between connected nodes | KD5 |
| Arrow | Hand-drawn small triangle via SVG `<polygon>` | KD1, A5, R1 |
| Arrowhead placement | End of path, pointing at target node | KD5 |
| Edge labels / annotations | opacity: 1 (active), opacity: 0.25 (dimmed) | Pattern 3 |

Bezier control-point geometry:

```
source anchor = sourceNode.rightCenter
target anchor = targetNode.leftCenter
gap = targetAnchor.x - sourceAnchor.x
cp1 = (sourceAnchor.x + gap * 0.4, sourceAnchor.y)
cp2 = (targetAnchor.x - gap * 0.4, targetAnchor.y)
path = M sourceAnchor C cp1 cp2 targetAnchor
```

Why `<polygon>` instead of SVG `<marker>`: `<marker>` conflicts with `stroke-dasharray` animation (L4.3, R1).

---

## 3. Color Palette

### 3.1 Kind Colors

| Kind | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| input | `#3B82F6` | blue-500 | Data-source / trigger nodes |
| process | `#6B7280` | gray-500 | Processing / transformation nodes |
| output | `#10B981` | emerald-500 | Result / output nodes |
| decision | `#F59E0B` | amber-500 | Conditional / routing nodes |

### 3.2 Text Colors

| Context | Hex | Source |
|---------|-----|--------|
| Node label on colored background (input, output, decision) | `#1F2937` (gray-800) | Inf-3 correction |
| Node label on process background | `#FFFFFF` | Inf-3 (process gray-500 + white passes AA) |
| Step panel body text | `#1F2937` | Inf-3 |
| Dimmed node text | `#1F2937` at opacity 0.4 | Pattern 3 |

### 3.3 Background

| Context | Hex | Source |
|---------|-----|--------|
| Diagram area background | `#FAFAFA` | KD1 |

### 3.4 Brand-Color Override Rules

- Every default kind color can be replaced by a brand token of the same semantic role.
- Override must maintain the same WCAG AA contrast ratios listed in section 4.
- Background `#FAFAFA` may be replaced with a brand light tint, provided text contrast remains compliant.

---

## 4. WCAG Contrast Reference Table

Background for all measurements: `#FAFAFA` (approximates `#FFFFFF`).

### 4.1 Active State

| Kind | Background | Text | Contrast Ratio | WCAG Level |
|------|-----------|------|----------------|------------|
| input | `#3B82F6` | `#1F2937` | 4.35 : 1 | AA Normal text |
| process | `#6B7280` | `#FFFFFF` | 4.56 : 1 | AA Normal text |
| output | `#10B981` | `#1F2937` | 4.87 : 1 | AA Normal text |
| decision | `#F59E0B` | `#1F2937` | 6.32 : 1 | AA Normal text |

All active-state nodes pass WCAG 2.1 AA for normal text (>= 4.5 : 1) or better.

### 4.2 Dimmed State

Dimmed state is achieved via `opacity: 0.35`. WCAG compliance is not required for dimmed context elements (they are not user-reading targets), but visual distinction from active state must be clear.

| Kind | Active Hex | Dimmed Effective Hex (at 0.35 on #FAFAFA) | Active vs Dimmed Distinction |
|------|-----------|------------------------------------------|------------------------------|
| input | `#3B82F6` | `#9FC2FA` | Clear |
| process | `#6B7280` | `#B0B4BA` | Clear |
| output | `#10B981` | `#88D4B8` | Clear |
| decision | `#F59E0B` | `#FBD26E` | Clear |

### 4.3 Dimmed Text (informational)

Dimmed text opacity: 0.4 on `#1F2937`. Not required to meet WCAG threshold.

---

## 5. Layout Rules

### 5.1 Horizontal Flow (Desktop, >= 1024 px)

- Node spacing: 32 px horizontal gap
- Zigzag two-row layout: nodes alternate between row 0 and row 1, vertical gap 24 px
- Diagram area occupies ~65 % of viewport; step panel occupies ~35 % (min 280 px)

### 5.2 Tablet (768 - 1023 px)

- Same horizontal flow as desktop
- Step panel fixed at 280 px (not percentage-based)
- Diagram area fills remaining width

### 5.3 Mobile (< 768 px)

- Vertical layout: nodes stacked top-to-bottom
- Node spacing: 16 - 24 px vertical gap
- Diagram area above, scrollable
- Step panel: fixed bottom bar, min-height 120 px, expandable on tap
- Prev / Next button size: 48 x 48 px (>= 44 px touch target)

### 5.4 Grid System

All spacing values are multiples of 8 px (cc-design 8 px grid, L1.5). Exceptions: the 32 px node gap (4 x 8), 24 px vertical gap (3 x 8), 16 px mobile gap (2 x 8).

---

## 6. Typography

| Element | Size | Weight | Source |
|---------|------|--------|--------|
| Node label | 14 - 15 px | semibold (600) | KD1 |
| Step panel headline | 16 - 18 px | body weight | KD1 |
| Step panel body | 16 - 18 px | body weight | KD1 |
| Step counter (e.g. "3/5") | 14 px | medium | KD3 |
| CTA button | inherits cc-design button system | — | KD3 |

---

## 7. SVG Rendering Constraints

### 7.1 Layer Architecture

```
Container (position: relative)
 +-- HTML nodes (flexbox/grid, position: relative, z-index: 1)
 +-- SVG overlay (position: absolute, top: 0, left: 0, width: 100%, height: 100%, z-index: 0, pointer-events: none)
```

### 7.2 pointer-events

- SVG overlay: `pointer-events: none` at all times.
- All interactivity (hover, click, tap) is handled by HTML node elements.
- Source: KD5, Pattern 4.

### 7.3 Position Calculation

- Desktop: use `getBoundingClientRect()` relative to the container.
- Mobile / scrollable containers: use `offsetTop` / `offsetLeft` (container-relative), NOT viewport-relative, to avoid scroll-offset errors.
- Source: KD5, Pattern 4.

### 7.4 ResizeObserver + Debounce

- Observe the container and each node element with `ResizeObserver`.
- Debounce recalculation at 50 ms to prevent layout thrash.
- On callback: recalculate all edge positions and update SVG `path` `d` attributes.
- Source: A12, KD5.

### 7.5 Coordinate System

- All SVG coordinates are container-relative (0, 0 = container top-left).
- SVG has no `viewBox`; it uses the container's pixel dimensions directly (`width: 100%`, `height: 100%`).
- Source: R7 (no SVG viewBox scaling for nodes, since nodes are HTML).

---

## 8. Pulse Animation Constraints

### 8.1 stroke-dasharray Entrance Draw

- On edge entrance: animate `stroke-dashoffset` from `path.getTotalLength()` to 0.
- Duration: 600 ms.
- Easing: expoOut.
- Source: KD4, Pattern 2.

### 8.2 Data-Flow Pulse

| Parameter | Value | Source |
|-----------|-------|--------|
| dasharray gap | `path.getTotalLength()` (computed in JS per edge) | KD5 |
| Easing | expoOut | KD5, L1.1 |
| Repeat count | 4, then stop | KD5, A6 |
| Rationale for 4 | Avoids infinite-loop visual distraction while showing data flow direction | A6 |

Implementation sketch:

```js
const len = path.getTotalLength();
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len;
// animate offset -> 0 with expoOut over 600ms, repeat 4 times, then stop
```

### 8.3 prefers-reduced-motion

- Entrance draw: skipped (edges appear immediately).
- Data-flow pulse: disabled entirely.
- Step transitions: instant state change, no animation.
- Hover focus: use `outline` instead of opacity/blur.
- Source: KD2, "prefers-reduced-motion fallback".

---

## 9. Accessibility

### 9.1 Contrast

- All active-state node labels meet WCAG 2.1 AA for normal text (see section 4).
- Step panel text (#1F2937 on #FAFAFA) exceeds 15 : 1 contrast ratio.
- Dimmed nodes are exempt from contrast requirements (context, not reading targets).

### 9.2 Keyboard Navigation

- `Tab` moves focus between interactive elements (nodes, prev/next buttons, CTA).
- `Enter` or `Space` on a focused node activates it (equivalent to hover on desktop or tap on mobile).
- `ArrowRight` / `ArrowLeft` navigate to next / previous step.
- Source: KD2 state-transition table.

### 9.3 ARIA

- Each node: `role="button"` + `aria-label` describing the node's name and kind (e.g. `aria-label="Retriever, process node"`).
- SVG overlay: `aria-hidden="true"` (decorative; semantics carried by HTML nodes).
- Step panel: `role="region"` + `aria-label="Step explanation"` or `aria-live="polite"` on the headline/body container for screen-reader announcements on step change.
- Prev / Next buttons: `aria-label="Previous step"` / `aria-label="Next step"`.

### 9.4 Touch Targets (Mobile)

- Minimum touch target: 48 x 48 px for all interactive elements.
- Nodes smaller than 48 px in one dimension must have visible padding or an invisible hit area extending to 48 px.
- Source: KD3, L1.5.
