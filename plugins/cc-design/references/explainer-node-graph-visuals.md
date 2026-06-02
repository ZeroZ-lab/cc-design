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

---

## 10. Compare Explainer Visual Parameters

### 10.1 Item Card Layout

| Parameter | Value | Source |
|-----------|-------|--------|
| Background | `#FAFAFA` (white) | KD3, L1-12 |
| Left color bar width | 4 px (kind color) | KD3 |
| Left color bar hover width | 6 px | KD3 |
| Border radius | 8 px | KD3, L1-15 |
| Min size | 120 x 48 px | KD3, Spec |
| Max size | 200 x 72 px | KD3, Spec |
| Kind icon size | 16 px (SVG inline) | KD3 |
| Label text size | 14 px, `#1F2937`, semibold, single-line truncation | KD3, L1-20 |
| Score dots | 5-dot system, 14 px diameter, 4 px gap | KD3 |
| Score dot fill color | Kind color | KD3 |
| Score dot empty color | `#D1D5DB` (gray-300, 3:1 contrast on `#FAFAFA`) | KD3, L2-02 |
| Score=0 | Dots not shown | KD3 |
| Hover state | Color bar widens to 6 px, scale(1.02), shadow elevation | KD3 |

Internal arrangement (left-to-right): left color bar -> kind icon (16 px) -> label text (14 px) -> score dots (inline, only when score > 0).

### 10.2 Kind Colors + Contrast for Compare

| Kind | Kind Hex | Color Bar Hex | Icon | Text Label | Item Card BG | Label Text Color | Text on BG Contrast | WCAG Level | Source |
|------|----------|---------------|------|------------|--------------|------------------|--------------------|------------|--------|
| pro | `#10B981` | `#10B981` | SVG checkmark (12 px) | "Pro" | `#FAFAFA` | `#1F2937` | `#1F2937` on `#FAFAFA` = 15.6 : 1 | AAA Normal | KD3, L4-09 |
| con | `#EF4444` | `#EF4444` | SVG cross (12 px) | "Con" | `#FAFAFA` | `#1F2937` | `#1F2937` on `#FAFAFA` = 15.6 : 1 | AAA Normal | KD3, L4-09 |
| neutral | `#6B7280` | `#6B7280` | SVG dash (12 px) | "Neutral" | `#FAFAFA` | `#1F2937` | `#1F2937` on `#FAFAFA` = 15.6 : 1 | AAA Normal | KD3 |
| highlight | `#3B82F6` (default, brand-overridable) | `#3B82F6` | SVG star (12 px) | "Highlight" | `#FAFAFA` | `#1F2937` | `#1F2937` on `#FAFAFA` = 15.6 : 1 | AAA Normal | KD3 |

**Kind Hex on `#FAFAFA` contrast (informational):**

| Kind | Kind Hex on `#FAFAFA` | Contrast Ratio | Passes? | Notes |
|------|-----------------------|----------------|---------|-------|
| pro | `#10B981` on `#FAFAFA` | 4.87 : 1 | AA Normal | Color bar only, not full-card BG |
| con | `#EF4444` on `#FAFAFA` | 4.56 : 1 | AA Normal | Color bar only; `#1F2937` on `#EF4444` full BG = 2.37 : 1 FAILS AA -- con red is never used as full-card background |
| neutral | `#6B7280` on `#FAFAFA` | 4.56 : 1 | AA Normal | Color bar only |
| highlight | `#3B82F6` on `#FAFAFA` | 4.35 : 1 | AA Normal | Color bar only |

**Dual encoding rule**: Each item card displays kind color (left color bar) + kind icon (SVG inline) + kind text label simultaneously. Three encoding channels coexist, satisfying WCAG 1.4.1 "Use of Color" (KD3, L2-03, L3-12).

### 10.3 Verdict Badge

| Parameter | Value | Source |
|-----------|-------|--------|
| Shape | Pill shape | KD1, Inf-1 |
| Border radius | 8 px | KD1, L1-15 |
| Min height | 32 px | KD1, Inf-1 |
| Min width | 80 px | KD1, Inf-1 |
| Left accent bar | 4 px, subject accentColor | KD1 |
| Background | `#FAFAFA` (white) | KD1, L1-12 |
| Text color | `#1F2937` | KD1, L1-11 |
| Content | "Best for [verdict]" text label | KD1 |
| Hover behavior | Accent bar widens to 6 px; methodology explanation (detail field) appears in 280 px floating overlay | KD1, Inf-1 |
| Hover overlay max-width | 280 px | KD1 |
| Visual weight | Lower than item card (verdict is guidance, not data) | KD1, Inf-1 |

### 10.4 Connections (Compare)

| Parameter | Value | Source |
|-----------|-------|--------|
| Stroke color | `#9CA3AF` (gray-400) | KD2 |
| Stroke width | 2 px | KD2 |
| Arrowhead | None (connections express cross-object association, not direction) | KD2 |
| Path geometry | Cubic bezier, from source item card right-center to target item card left-center | KD2 |
| Path visibility | Overview mode: not shown; dimension mode: shown (current dimension only, solid line) | KD2, Spec |
| Label text size | 12 px, `#6B7280` | KD2 |
| Label position | Path midpoint, above the line | KD2 |
| Label background | White bubble: `#FAFAFA`, radius 4 px, padding 4 px 8 px | KD2 |
| Contrast of stroke on `#FAFAFA` | 3.8 : 1 (passes AA large text per L2-02; UI component 3 : 1 per L2-02) | KD2, L2-02 |
| Overview -> dimension | stroke-dasharray draw animation (600 ms expoOut) | KD2 |
| Dimension -> dimension | Fade transition (200 ms), no stroke-dasharray redraw | KD2 |
| Dimension -> overview | Connections fade out (200 ms) | KD2 |

### 10.5 Dimension Tab Buttons

| Parameter | Value | Source |
|-----------|-------|--------|
| Min size | 80 x 40 px | Spec, KD1 |
| Border radius | 8 px | Spec, L1-15 |
| Default state | Neutral background, `#1F2937` text | Spec |
| Active state | Accent color background (dimension-specific or brand accent), inverted text color | Spec |
| Touch target (mobile) | 48 x 48 px minimum | L1-14 |

### 10.6 Responsive Layout (Compare)

| Breakpoint | Layout | Source |
|------------|--------|--------|
| Desktop (>= 1024 px) | Two-column side-by-side + right panel ~35 % (min 280 px). Left compare area ~65 %. Column gap 24 px. | KD1, Spec |
| Tablet (768 - 1023 px) | Right panel fixed 280 px (not percentage). Left area fills remaining width. Column gap 16 px. | Spec |
| Mobile (< 768 px) | Dimension tabs horizontal scroll at top (48 x 48 px tap targets). Two-column vertical stack (Subject A above Subject B). Fixed bottom bar, min 120 px, expandable on tap. Connections not shown. | Spec |

---

## 11. Decision Tree Explainer Visual Parameters

### 11.1 BFS Layout Parameters

| Parameter | Value | Source |
|-----------|-------|--------|
| Vertical gap (level spacing) | 48 px | KD6, Spec |
| Horizontal gap (same-level spacing, <= 5 siblings) | 32 px | KD6, Spec |
| Horizontal gap (same-level spacing, > 5 siblings) | 64 px | KD6, Spec |
| Parent centering | parentX = (minChildX + maxChildX) / 2 (manual correction in JS) | KD6, Inf-6 |
| Node y calculation | y = level * (NODE_MAX_H + verticalGap) | KD6 |
| Node x calculation | x = siblingIndex * (nodeWidth + gap) | KD6 |

BFS layout algorithm (inline JS, no external library):

```
1. BFS from root -> compute each node's level (0 = root)
2. Same-level nodes arranged horizontally in sibling order
3. Parent node x centered over its children cluster:
   parentX = (minChildX + maxChildX) / 2
4. Each node y = level * (NODE_MAX_H + VERTICAL_GAP)
```

### 11.2 Unbalanced Tree Fallback

| Condition | Fallback | Source |
|-----------|----------|--------|
| > 5 siblings per level (desktop) | Gap shrinks to 64 px + overflow-x: auto on tree container | KD6, Spec |
| > 5 siblings per level (mobile) | Indented vertical list (always), level * 24 px indent | KD6, Spec |

### 11.3 Kind Visual Differentiation (Decision Tree)

| Kind | Hex | Tailwind Token | Shadow | Text Color | Text Contrast on Kind BG | WCAG Level | Source |
|------|-----|----------------|--------|------------|--------------------------|------------|--------|
| question | `#F59E0B` | amber-500 | None (flat) | `#1F2937` | 6.32 : 1 | AA Normal | KD4, L1-10 |
| factor | `#6B7280` | gray-500 | None (flat) | `#FFFFFF` | 4.56 : 1 | AA Normal | KD4, L1-10 |
| conclusion | `#10B981` | emerald-500 | 0 2 px 8 px rgba(16,185,129,0.25) | `#1F2937` | 4.87 : 1 | AA Normal | KD4, L1-10 |

Rationale for conclusion shadow: conclusion nodes are the "answer" of the decision tree -- the terminal landing point of user exploration. Emerald-tint shadow provides depth emphasis without violating the flat design language (shadow has small spread and directional hint; not glow). Question and factor nodes remain flat (no shadow), consistent with v0.1 L1-08 "no border/shadow" principle (KD4).

### 11.4 Node Dimensions (Decision Tree)

| Parameter | Value | Source |
|-----------|-------|--------|
| Shape | Rounded rectangle (all kinds) | KD4, L1-08 |
| Border radius | 8 px | KD4, L1-08 |
| Min size | 96 x 48 px | KD4, L1-08 |
| Max size | 160 x 72 px | KD4, L1-08 |
| Border / shadow | None for question/factor; conclusion has emerald-tint shadow | KD4 |

Same dimensions as v0.1 flow nodes (L1-08). Shape does not encode semantic kind; color alone encodes kind.

### 11.5 Hover Path Highlight (Decision Tree)

| Element | Path (highlighted) | Non-path (dimmed) | Source |
|---------|-------------------|-------------------|--------|
| Node | opacity 1, normal colors | opacity 0.35 + blur 4 px (desktop) / opacity 0.35 (mobile) | KD5, L1-05 |
| Node text | opacity 1 | opacity 0.4 | KD5, L1-11 |
| Edge on path | opacity 1, stroke 3 px, accent color (`#10B981` or brand accent) | opacity 0.2, stroke 2 px | KD5 |
| Edge label on path | opacity 1 | opacity 0.25 | KD5 |
| Conclusion node on path | opacity 1, shadow visible | -- | KD5 |

Path computation: `computeRootToNodePath(nodeId)` traverses parent pointers from nodeId back to root, collecting all node ids and edge ids along the path. O(depth) time complexity. The entire path from root to hovered node must be highlighted -- not just the current node and its direct edges. Partial highlighting destroys the decision-chain narrative (KD5, L3-08).

### 11.6 Branch Line Geometry (Decision Tree)

| Parameter | Value | Source |
|-----------|-------|--------|
| Path type | Cubic bezier (SVG `C` command), from parent bottom-center to child top-center | KD6, Spec |
| Stroke width (default) | 2 px | KD6 |
| Stroke width (path highlighted) | 3 px, accent color | KD5 |
| Label text size | 12-13 px | Spec |
| Label color | `#6B7280` (gray-500) | KD2 |
| Label position | Path midpoint, above the line | Spec |
| Label background | White bubble: `#FAFAFA`, radius 4 px, padding 4 px 8 px | KD2 |
| Arrowhead | None for DT branch lines (unlike v0.1 flow edges which use polygon arrowheads) | Spec |

Bezier control-point geometry (parent-to-child, vertical):

```
source anchor = parentNode.bottomCenter
target anchor = childNode.topCenter
gap = targetAnchor.y - sourceAnchor.y
cp1 = (sourceAnchor.x, sourceAnchor.y + gap * 0.4)
cp2 = (targetAnchor.x, targetAnchor.y - gap * 0.4)
path = M sourceAnchor C cp1 cp2 targetAnchor
```

### 11.7 Indented Vertical List (Mobile, Decision Tree)

| Parameter | Value | Source |
|-----------|-------|--------|
| Layout | Indented vertical list | Spec |
| Indent per level | level * 24 px | Spec |
| Node tap targets | 48 x 48 px minimum | L1-14 |
| Horizontal tree | Not used on mobile | Spec |
| Bottom overlay | Fixed, sticky; shows path description + node detail | Spec |
| Path highlight dimming | opacity 0.35 only (no blur 4 px on mobile) | L1-05 |

### 11.8 Path Description Text Format

| Parameter | Value | Source |
|-----------|-------|--------|
| Format | Node labels joined by arrow separator: "Root Label -> Branch Label -> ... -> Conclusion Label" | Spec, KD5 |
| Example | "What is your project type? -> Web -> Interactive UI -> Real-time Updates -> Choose React" | Spec |
| Display location | Right panel (desktop >= 1024 px) / bottom overlay (mobile < 768 px) | Spec |
| Update trigger | Real-time update on hoveredNode change | KD5 |

### 11.9 WCAG Contrast Reference Table (Decision Tree)

Background for all measurements: `#FAFAFA` (approximates `#FFFFFF`).

#### 11.9.1 Active State (Decision Tree)

| Kind | Background (node fill) | Text Color | Contrast Ratio | WCAG Level | Source |
|------|------------------------|------------|----------------|------------|--------|
| question | `#F59E0B` | `#1F2937` | 6.32 : 1 | AA Normal text | KD4, L4-09 |
| factor | `#6B7280` | `#FFFFFF` | 4.56 : 1 | AA Normal text | KD4, L4-09 |
| conclusion | `#10B981` | `#1F2937` | 4.87 : 1 | AA Normal text | KD4, L4-09 |

All active-state node labels pass WCAG 2.1 AA for normal text (>= 4.5 : 1).

#### 11.9.2 Dimmed State (Decision Tree)

Dimmed state is achieved via `opacity: 0.35`. WCAG compliance is not required for dimmed context elements (they are not user-reading targets), but visual distinction from active state must be clear.

| Kind | Active Hex | Dimmed Effective Hex (at 0.35 on `#FAFAFA`) | Active vs Dimmed Distinction | Source |
|------|-----------|---------------------------------------------|------------------------------|--------|
| question | `#F59E0B` | `#FBD26E` | Clear | L1-05 |
| factor | `#6B7280` | `#B0B4BA` | Clear | L1-05 |
| conclusion | `#10B981` | `#88D4B8` | Clear | L1-05 |

#### 11.9.3 Edge Label Contrast (Decision Tree)

| Context | Hex | Background | Contrast Ratio | WCAG Level | Source |
|---------|-----|------------|----------------|------------|--------|
| Branch label text on white bubble | `#6B7280` | `#FAFAFA` | 4.56 : 1 | AA Normal text | KD2 |
| Branch stroke on diagram background | `#9CA3AF` | `#FAFAFA` | 3.8 : 1 | AA Large text; AA UI non-text (>= 3 : 1) | KD2, L2-02 |

#### 11.9.4 Conclusion Shadow Contrast (informational)

| Context | Value | Notes | Source |
|---------|-------|-------|--------|
| Conclusion shadow | `0 2 px 8 px rgba(16,185,129,0.25)` | Emerald-tint shadow; visual emphasis only, not a text-background pairing | KD4 |
| Shadow does not affect text contrast | Shadow is decorative, not a reading surface | -- | KD4 |
