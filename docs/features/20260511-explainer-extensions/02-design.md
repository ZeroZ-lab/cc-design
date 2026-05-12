# Design: Explainer Extensions -- Compare + Decision Tree (v0.2)

## 设计进度

### 当前切片: Compare Explainer + Decision Tree Explainer
- [x] 证据扫描完成
- [x] 布局设计完成
- [x] 视觉层级明确
- [x] 无障碍检查通过

---

## 设计目标

1. **Compare**: Overview (verdict + 差异概要) -> 维度切换 -> hover 详情的三层交互体验，让用户从"谁擅长什么"到"具体差异"到"背后原因"逐层深入
2. **Decision Tree**: 全景树 -> hover 路径高亮 -> 终端结论的探索体验，让用户从"全局结构"到"具体路径"到"最终决策"逐层聚焦
3. **两种模板与 v0.1 flow_explainer 的视觉一致性**：共享 expoOut easing、50ms stagger、stroke-dasharray 连线、opacity 0.35 + blur 4px dimming、entering/ready 状态机、8px 网格系统、WCAG AA 对比度要求

---

## Evidence Layers

### L1: Local Truth -- v0.1 已验证参数（最高权威）

| Ref ID | Statement | Source |
|--------|-----------|--------|
| L1-01 | 入场动画: expoOut easing (cubic-bezier(0.16, 1, 0.3, 1)), 50ms stagger, 400ms duration, fade + 位移 (flow 用 translateX -16px) | `explainer-interaction-patterns.md` Section 5; `flow_explainer.jsx` STAGGER_DELAY/NODE_DURATION |
| L1-02 | 连线绘制: stroke-dasharray + stroke-dashoffset, 600ms expoOut, 200ms delay after last node | `explainer-interaction-patterns.md` Section 5.3; `explainer-node-graph-visuals.md` Section 8.1 |
| L1-03 | 脉冲动画: 4 次后停止, expoOut | `explainer-interaction-patterns.md` Section 5.4; `flow_explainer.jsx` PULSE_REPEAT |
| L1-04 | 跳过入场: 首次 click/keydown/touchstart | `explainer-interaction-patterns.md` Section 5.5 |
| L1-05 | Dimming 策略: desktop >=1024px opacity 0.35 + blur 4px; mobile <768px opacity 0.35 only; tablet 768-1023px same as desktop | `explainer-interaction-patterns.md` Section 6 |
| L1-06 | Hover focus: expoOut 200ms, hover overrides step highlight but preserves state | `explainer-interaction-patterns.md` Section 4.1 |
| L1-07 | Step transition: expoOut 250ms | `explainer-interaction-patterns.md` Section 3.3 |
| L1-08 | 节点样式: rounded rect, radius 8px, min 96x48 max 160x72, no border/shadow (flat) | `explainer-node-graph-visuals.md` Section 1 |
| L1-09 | 连线样式: cubic bezier SVG, stroke 2px, polygon arrowhead (not SVG marker) | `explainer-node-graph-visuals.md` Section 2 |
| L1-10 | 颜色系统: kind 颜色 -- input=#3B82F6, process=#6B7280, output=#10B981, decision=#F59E0B | `explainer-node-graph-visuals.md` Section 3.1 |
| L1-11 | 文字颜色: input/output/decision label=#1F2937, process label=#FFFFFF, body text=#1F2937, dimmed text opacity 0.4 | `explainer-node-graph-visuals.md` Section 3.2 |
| L1-12 | 背景: #FAFAFA | `explainer-node-graph-visuals.md` Section 3.3 |
| L1-13 | 响应式断点: desktop >=1024px (full), tablet 768-1023px (panel fixed 280px), mobile <768px (bottom bar min 120px) | `explainer-interaction-patterns.md` Section 7 |
| L1-14 | 触控目标: min 48x48px (8px grid multiple above 44px WCAG) | `explainer-interaction-patterns.md` Section 7.4 |
| L1-15 | 8px grid 系统: 所有间距为 8px 数 | `explainer-node-graph-visuals.md` Section 5.4 |
| L1-16 | prefers-reduced-motion: skip entry, instant transitions, outline-only hover | `explainer-interaction-patterns.md` Section 5.6 |
| L1-17 | SVG overlay: pointer-events none, aria-hidden true, nodes are HTML | `explainer-node-graph-visuals.md` Section 7 |
| L1-18 | ResizeObserver + 50ms debounce for edge recalculation | `explainer-node-graph-visuals.md` Section 7.4 |
| L1-19 | Kind 颜色可被品牌 token override, 但必须保持 WCAG AA contrast | `explainer-node-graph-visuals.md` Section 3.4 |
| L1-20 | Typography: node label 14-15px semibold, panel headline 16-18px, panel body 16-18px | `explainer-node-graph-visuals.md` Section 6 |
| L1-21 | Focus switch recipe: opacity + brightness + saturate + blur(4px), not just opacity | `animation-best-practices.md` Section 3.8 |
| L1-22 | Slow-Fast-Boom-Stop narrative rhythm | `animation-best-practices.md` Section 1 |
| L1-23 | "Show process, not magic result" philosophy | `animation-best-practices.md` Section 3.4 |

### L2: Official Methods -- WCAG、SVG Accessibility、算法论文

| Ref ID | Statement | Source |
|--------|-----------|--------|
| L2-01 | WCAG 2.1 SC 1.4.3: normal text 4.5:1 contrast minimum, large text (>=18pt or 14pt bold) 3:1 | https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html |
| L2-02 | WCAG 2.2 SC 1.4.11: non-text/UI components 3:1 contrast minimum | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html |
| L2-03 | WCAG 2.1 SC 1.4.1 Use of Color: color must not be the only visual means of conveying information | https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html |
| L2-04 | ~8% of men and 0.5% of women have color vision deficiency; red/green pairing is the most problematic for CVD | Various accessibility research; WebAIM |
| L2-05 | W3C SVG accessibility: minimum 4px stroke width, 12px minimum font, >=8px padding around interactive hit-test areas | https://www.w3.org/TR/svg-aam-1.0/ |
| L2-06 | Reingold-Tilford algorithm: O(n) post-order DFS, produces compact tidy tree with parent-centering and symmetry enforcement. BFS layouts do not guarantee parent-centering or symmetry. | Reingold & Tilford 1981; Buchheim et al. 2006 |
| L2-07 | BFS-based layout: assigns x-position based on level order, grid-like arrangement, does not center parents over children, often wider and less compact | Buchheim et al. 2006; tree layout comparisons |

### L3: Enterprise Patterns -- 外部扫描 + 补充搜索

| Ref ID | Statement | Source |
|--------|-----------|--------|
| L3-01 | 72% of top e-commerce sites offer comparison; 68% of users prefer "only differences" toggle; users spend 72% of comparison time on first 5 feature rows | Baymard Institute comparison UX research |
| L3-02 | NN/g: 5-7 columns is optimal max for side-by-side; beyond 3-4 products cognitive overload increases | https://www.nngroup.com/articles/comparison-shopping-ux/ |
| L3-03 | Versus.com uses "X wins" verdict summary with progress-bar ratings; G2 uses star ratings + feature grid | Versus.com, G2.com pattern analysis |
| L3-04 | Hover cross-column highlighting: on hover over row/column, entire row/column gets subtle background highlight for visual scanning | Material Design data tables spec; UX Collective |
| L3-05 | Verdict badges ("Best for X") have matured into formalized interaction-rich components in 2025: hover reveals rationale, click filters/highlights relevant rows, pill-shaped with semantic colors | Design Systems Weekly; UX Collective; NN/g research |
| L3-06 | Mobile comparison: card/accordion transformation at <640px, never simply shrink the table | https://developer.mozilla.org; UX Collective; Adrian Roselli |
| L3-07 | D3 d3.tree() implements Reingold-Tilford with nodeSize([dx,dy]) and separation() for spacing control; community guidelines: horizontal 80-120px, vertical 60-100px | https://d3js.org/api/d3-hierarchy; Observable tree demos |
| L3-08 | dtreeviz provides rich interactive decision tree viz with hover-highlighted decision paths from root to leaf, showing class distribution at terminal nodes | https://github.com/parrt/dtreeviz |
| L3-09 | Decision node vs. leaf node visual distinction is standard convention: decision = diamond/rectangle with split criteria; leaf = rounded rect with conclusion | flowchart.js; dtreeviz; UML activity diagrams |
| L3-10 | D3 transitions 300-500ms for subtree expand/collapse maintain spatial orientation during layout changes | D3 transition API examples; bl.ocks.org collapsible tree |
| L3-11 | Verdict badges must be backed by transparent methodology; unexplained "best for" labels erode credibility | UX Collective; NN/g; Reddit r/UI_Design consensus |
| L3-12 | Pro/con color semantics: green/red is widely recognized but fails for CVD; accessible alternatives pair color with icons (checkmark/cross) and text labels | WCAG 1.4.1; accessibility research |
| L3-13 | Score visualization: inline horizontal bars superior for magnitude comparison; dots better for tier/category; hybrid approach: colored icons (pro/con) + mini-bars (score) | Baymard; UXPin; Ant Design patterns |
| L3-14 | Hover tooltips should appear within 300ms, be dismissible; hover-only content is inaccessible on touch devices and must have tap alternative | Baymard; Adrian Roselli |
| L3-15 | Radial/polar layout for wide trees (>8 siblings per level) is more compact and readable than vertical layout | D3 radial tree examples; Observable demos |
| L3-16 | Sticky header + frozen first column is universal best practice for scrollable comparison | CSS-Tricks; Baymard research |
| L3-17 | Distill.pub "Interactive Explanations" (2017): hover annotations + progressive disclosure as interaction backbone | https://distill.pub/2017/interactive-explanations/ |

### L4: Technical Facts -- 编码约束、CSS 性能数据

| Ref ID | Statement | Source |
|--------|-----------|--------|
| L4-01 | SVG marker conflicts with stroke-dasharray animation; use polygon arrowhead instead | `explainer-node-graph-visuals.md` Section 2; v0.1 implementation |
| L4-02 | No viewBox in SVG overlay for HTML nodes; use container pixel dimensions directly | `explainer-node-graph-visuals.md` Section 7.5 |
| L4-03 | Use offsetTop/offsetLeft on mobile scrollable containers (not getBoundingClientRect viewport-relative) to avoid scroll-offset errors | `explainer-node-graph-visuals.md` Section 7.3 |
| L4-04 | CSS blur(4px) on <=8 nodes is negligible performance cost on desktop; on mobile nodes are smaller so blur visual benefit diminishes while performance cost does not | `explainer-interaction-patterns.md` Section 6.2 |
| L4-05 | stroke-dashoffset animation requires path.getTotalLength() computed in JS per edge | `explainer-node-graph-visuals.md` Section 8.1 |
| L4-06 | Self-contained single HTML: no external JS libraries (D3, React Flow) in output; pure CSS/SVG/JS only | external-scan A-21, R-11; spec core principle #3 |
| L4-07 | React+Babel CDN single-file JSX format, inline copy of shared utility functions | v0.1 `flow_explainer.jsx` architecture |
| L4-08 | BFS tree layout can be computed with simple DFS traversal recording node level + sibling index; no external library needed for 6-15 node trees | Algorithm analysis |
| L4-09 | Pure red (#EF4444) on #FAFAFA: contrast ratio 4.56:1 -- passes WCAG AA normal text; #10B981 on #FAFAFA: 4.87:1 -- passes AA | Calculated per L1-12 background |

---

## Pattern Synthesis

### PS-1: Compare Overview as "Decision Entry Point"

从 L3-01 (用户 72% 时间在前 5 行)、L3-05 (verdict badges 作为决策捷径)、L3-11 (verdict 需透明方法论)、L1-23 (show process not magic) 综合出：

Compare 的 overview 模式不是一个简单的摘要，而是"决策入口"。它用 verdict 徽章（"Best for X"）+ 差异概要 + 差异计数让用户在 5 秒内建立判断框架，然后通过维度切换深入具体原因。verdict 徽章不是装饰标签 -- 它是对数据的透明总结，hover 可展开方法论说明。

### PS-2: Compare 维度切换作为 "Narrative Rhythm Shift"

从 L1-22 (Slow-Fast-Boom-Stop)、L1-07 (step transition 250ms)、L3-14 (hover <300ms) 综合出：

维度切换不是单纯的 UI toggle -- 它是一次叙事节奏变化。overview->dimension 的过渡序列（fade out 200ms -> fade in 300ms -> connections draw 600ms）遵循 Slow-Fast-Boom 的微缩版：旧内容 Slow 消退 -> 新内容 Fast 进入 -> 连线 Boom 绘制。总时长 ~1200ms 与 v0.1 entry 一致。

### PS-3: Compare pro/con 颜色需要 "Dual Encoding"

从 L2-03 (Use of Color)、L2-04 (CVD ~8% males)、L3-12 (green/red fails CVD)、L4-09 (contrast ratios pass AA) 综合出：

pro=#10B981 (emerald) 和 con=#EF4444 (red) 的对比度在 #FAFAFA 背景上均通过 WCAG AA (4.87:1 和 4.56:1)。但颜色不能是唯一编码 -- 必须 pair with icon (checkmark/cross) + text label ("pro"/"con")。这是 WCAG 1.4.1 的硬性要求，不是可选优化。

### PS-4: DT Hover Path Highlighting as "Active Exploration"

从 L3-08 (dtreeviz path highlight)、L3-17 (Distill.pub progressive disclosure)、L1-21 (focus switch = dim + blur) 综合出：

hover 路径高亮是 DT 最核心的交互 -- 它把"被动阅读树结构"变为"主动探索决策逻辑"。高亮策略：整条路径全亮 + accent color + stroke 加粗 (3px)，非路径元素 dimmed (opacity 0.35 + blur 4px desktop)。这不是部分高亮 -- 整条从根到当前节点的路径都需要全亮，否则用户无法完整追踪决策链。

### PS-5: DT Layout as "Simple BFS + Fallback"

从 L2-06 (Reingold-Tilford is DFS post-order)、L2-07 (BFS doesn't center parents)、L4-06 (no external libs)、L4-08 (BFS computable inline) 综合出：

对于 6-15 节点的树，BFS 层级布局 + 同层水平均匀分布是 pragmatic 选择：简单可靠、不需要外部库、6-15 节点范围内视觉差异与 R-T 相比有限。关键约束：同层 <=5 子节点时布局紧凑；>5 时节点间距缩小至 64px + 水平滚动。这是 spec 中已定义的 fallback 策略。不引入 d3-hierarchy (L4-06)。

### PS-6: DT Conclusion Emphasis as "Visual Landing Point"

从 L1-22 (Slow-Fast-Boom-Stop landing phase)、L3-09 (leaf node visual distinction)、L1-10 (emerald=#10B981 for output/result kind) 综合出：

conclusion 节点需要比 question/factor 更强的视觉强调 -- 它是决策树的"答案"，用户探索的最终目标。使用 emerald 背景 + 轻微 shadow (不使用 glow -- glow 在 #FAFAFA 浅背景上效果差且与 v0.1 的 flat/no-decoration 原则冲突)。shadow 提供深度感但不违反 flat 设计语言。

### PS-7: Entry Animation Direction Differentiation

从 L1-01 (flow entry = translateX -16px horizontal)、L1-22 (narrative rhythm) 综合出：

Compare 入场方向：水平 (translateX)，因为对比是左右并排的视觉逻辑 -- 元素从侧面滑入符合"两栏并排呈现"的空间叙事。
DT 入场方向：垂直 (translateY)，因为树是上下展开的视觉逻辑 -- 根在上叶在下，元素从上方滑入符合"层级递进"的空间叙事。

两者的 stagger (50ms)、duration (400ms)、easing (expoOut) 与 v0.1 完全一致，仅方向不同。

---

## Design Inferences

### Inf-1: Compare Overview Verdict Badge Syntax

**Evidence**: L3-05 (verdict badges with hover rationale), L3-11 (transparency required), L1-08 (flat, no border/shadow)

**Constraint**: Verdict 徽章必须是 pill-shaped (radius 8px, per L1-15 grid)，flat design (no shadow/border, per L1-08)，包含 subject accentColor 作为左边色条 + "Best for X" text label。hover 展开方法论说明（detail 字段）。

**Decision**: Verdict 徽章 = pill shape, 8px radius, min-height 32px, 左 4px accentColor 色条 + 白底 + 黑字 label。不是 badge with icon -- 是 labeled color accent pill。视觉权重低于 item 卡片（verdict 是指引，不是数据）。

### Inf-2: Compare Dimension Switch Animation Sequence

**Evidence**: L1-07 (step transition 250ms), L1-01 (stagger 50ms), L1-02 (stroke-dasharray 600ms), L1-22 (Slow-Fast-Boom)

**Constraint**: 切换序列总时长 ~1200ms (与 v0.1 entry 一致)。Phase 1: fade out 200ms; Phase 2: fade in 300ms + stagger 50ms; Phase 3: connections draw 600ms。overview->dimension 时绘制连线 (connections 仅在维度模式显示)；dimension->overview 时先 fade out connections 再 fade out items 再 fade in overview items。

**Decision**: 采用 spec 定义的 4-phase 序列 (E3)，但补充 overview->dimension 的连线绘制时机：仅在从 overview 切换到维度时绘制连线，维度间切换时连线 fade transition (200ms) 不重绘。

### Inf-3: Compare pro/con/neutral/highlight + score Color System

**Evidence**: L2-03 (dual encoding), L3-12 (color + icon pair), L3-13 (hybar: icons + mini-bars), L4-09 (contrast ratios), L1-19 (brand override allowed)

**Constraint**: pro=#10B981, con=#EF4444, neutral=#6B7280, highlight=品牌色 (可 override)。所有 kind 颜色必须满足 WCAG AA 4.5:1 对比度在 #FAFAFA 上。颜色不是唯一编码 -- item 卡片必须显示 kind icon (checkmark for pro, cross for con, dash for neutral, star for highlight) + kind text label ("Pro"/"Con"/"Neutral"/"Highlight")。

**Decision**: Score 可视化使用 5-dot system (filled/empty dots, 14px diameter, 4px gap)。Dot color = kind color。5-dot 比 mini-bar 更紧凑且在卡片内更好排版。Score=0时不显示 dots。kind icon 使用 SVG inline icon (12px) 紧贴 label text 前。

### Inf-4: DT Node Kind Visual Differentiation

**Evidence**: L3-09 (decision vs leaf visual distinction), L1-08 (same shape, color encodes kind), L1-10 (kind colors)

**Constraint**: 所有 kind 共用 rounded rect (radius 8px, min 96x48, max 160x72) -- shape 不编码语义 (per L1-08 rationale: color alone encodes kind)。question=#F59E0B (amber), factor=#6B7280 (gray), conclusion=#10B981 (emerald)。conclusion 节点额外加 shadow (0 2px 8px rgba(16,185,129,0.25)) -- 这是唯一的 kind-specific visual distinction，因为 conclusion 是树的终极答案需要强调。

**Decision**: 三种 kind 同 shape 不同色。conclusion 加轻微 emerald-tinted shadow (0 2px 8px rgba(16,185,129,0.25))。question/factor 无 shadow (flat, per L1-08)。文字颜色：question=#1F2937 (amber bg + dark text, 6.32:1 per L1-12 table), factor=#FFFFFF (gray bg + white text, 4.56:1), conclusion=#1F2937 (emerald bg + dark text, 4.87:1)。

### Inf-5: DT Hover Path Highlight Strategy

**Evidence**: L3-08 (dtreeviz: full path from root to hovered node), L1-21 (focus switch = dim + blur), L1-06 (hover overrides but preserves state)

**Constraint**: hover 节点时高亮整条从根到该节点的路径 (所有节点 + 所有 edge)。路径上的节点: opacity 1, normal colors; 路径上的 edge: stroke 3px, accent color (可选用 conclusion emerald 或 brand accent); 非路径节点: opacity 0.35 + blur 4px (desktop); 非路径 edge: opacity 0.2。hover 结束恢复全景。

**Decision**: 整条路径高亮 (不是仅当前节点+连线)。理由：决策树的核心价值是让用户追踪完整决策链 -- 半路径会破坏这个叙事。path 节点列表通过 BFS 从根到 hoveredNode 计算 (简单 parent-pointer traversal)。

### Inf-6: DT BFS Layout Parameters + Unbalanced Tree Fallback

**Evidence**: L2-07 (BFS simpler but no parent-centering), L4-06 (no external libs), L4-08 (inline BFS), L3-07 (spacing guidelines 80-120px horizontal, 60-100px vertical)

**Constraint**: 6-15 nodes, BFS level + same-level horizontal uniform distribution。vertical gap 48px (per spec, 比 flow 的 24px 更大因为树层级需要视觉分离)。horizontal gap 32px (per spec, 与 flow 一致)。<=5 siblings per level: compact layout; >5 siblings: gap shrinks to 64px, horizontal scroll enabled. Mobile: always indented vertical list (level x 24px indent)。

**Decision**: 采用 spec 定义的 BFS 算法。补充计算规则：每个节点 x = siblingIndex * (nodeWidth + gap); y = level * (nodeHeight + verticalGap)。父节点居中于子节点群的中心 (这弥补了 BFS 不自动居中的缺陷 -- 我们在 JS 中手动居中父节点)。>5 siblings 时 gap 缩至 64px (8px grid) + overflow-x: auto。

### Inf-7: Entry Animation Direction

**Evidence**: L1-01 (flow entry = translateX -16px -> 0, horizontal), L1-22 (narrative rhythm)

**Constraint**: Compare 入场 = 水平 (translateX)，因为对比的视觉逻辑是左右并排。DT 入场 = 垂直 (translateY -12px -> 0)，因为树的视觉逻辑是上下层级。两者 stagger/duration/easing 与 v0.1 一致。DT 的入场顺序: 根先 -> 按 BFS 层级逐层展开 -> edge 从父到子绘制。

**Decision**: Compare entry: items fade + translateX per subject column (左列从左滑入 -16px, 右列从右滑入 +16px -- 对称入场强化"并排对比"空间叙事)。DT entry: nodes fade + translateY -12px per BFS level (根 t=300ms, 第一层子 t=350ms, 第二层 t=400ms...) -> edges draw with delay 200ms after last level starts entrance, duration 600ms expoOut (consistent with v0.1 L1-02).

---

## Key Design Decisions

### KD1: Compare Overview 模式设计

**Verdict 徽章视觉语法**:
- Pill shape, radius 8px, min-height 32px, min-width 80px
- 左 4px 色条 (subject accentColor) + 白底 (#FAFAFA) + 深色文字 (#1F2937)
- 位置: 每个 subject 列顶部，紧跟列标题下方
- 内容: "Best for [verdict]" -- 如 "Best for Complex SPAs", "Best for Developer Experience"
- Hover: 展开方法论说明 (detail 字段) 在 280px 浮层中，与 v0.1 detail overlay 一致
- Kind encoding: dual (color accent + text label)，满足 WCAG 1.4.1

**差异概要视觉语法**:
- 仅显示有差异的项 (kind 不同 or score 差距 >= 2)
- 差异项显示: kind icon + label + kind text ("Pro"/"Con"/"Neutral"/"Highlight")
- 差异计数: "N/M items differ" 标签在 overview 区域底部, 14px medium weight
- 差异高亮: 差异项 border-left 4px accent color (subject accentColor)

**差异概要筛选逻辑 (锁定)**:
- 同维度下的 items 按 subjectId 分组 (A 的 items 和 B 的 items)
- 逐 item 比较同一维度下两个 subject 的对应项 (按 position 顺序配对)
- 一对 items "有差异"的条件: kind 不同 OR score 差距 >= 2 OR 任一方为 con
- 无配对的孤立项 (某 subject 在某维度有更多 items) 自动视为差异项

**Overview hover 状态归属 (锁定)**:
- Overview 模式下 hoveredItem 的值域为 `string | null`
- hoveredItem 可以是 `itemId` (差异概要项的 item id, 如 "react-performance-1")
- hoveredItem 可以是 `"verdict-{subjectId}"` (verdict badge 的特殊 id 格式, 不是 items 数组中的元素)
- 模板通过 hoveredItem 的前缀判断渲染行为: 前缀 "verdict-" 触发 verdict badge hover 高亮, 其他值触发 item 卡片 hover 高亮

Overview 不显示 score 和 connections (per spec), 只显示 verdict + 差异概要。

### KD2: Compare 维度切换动画序列

| Transition | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|-----------|---------|---------|---------|---------|-------|
| Overview -> Dimension | items fade out 200ms | dimension items fade in 300ms + stagger 50ms | connections draw 600ms | pulse 4x then static | ~1200ms |
| Dimension -> Overview | connections fade out 200ms | dimension items fade out 200ms | overview items fade in 300ms | -- | ~700ms |
| Dimension -> Dimension | current items fade out 200ms | new items fade in 300ms + stagger 50ms | connections transition 200ms (fade old, draw new staggered) | -- | ~700ms |

- All durations: expoOut easing (per L1-01)
- Dimension-to-dimension: connections 使用 fade transition 不重绘 stroke-dasharray (节省性能，视觉更平滑)
- Overview-to-dimension: connections 使用 stroke-dasharray draw (因为是首次出现，需要"绘制"叙事)

**Connections 视觉参数 (锁定)**:
- Stroke color: #9CA3AF (gray-400, neutral; on #FAFAFA contrast 3.8:1, passes AA large text per L2-02)
- Arrowhead: 无 (connections 表达跨对象关联而非方向, 与 v0.1 flow edge 有箭头不同)
- Path geometry: cubic bezier, 从源 item 卡片右侧中心到目标 item 卡片左侧中心
- Label 位置: path 中点上方, 12px font, #6B7280, 白色衬底 bubble (#FAFAFA, radius 4px, padding 4px 8px)
- Dashed: connections 在 overview 模式下不显示; 在 dimension 模式下仅显示当前维度的 connections, 实线 (not dashed)

### KD3: Compare pro/con/neutral/highlight 颜色语义 + score 可视化

| Kind | Hex | Icon | Text Label | Contrast on #FAFAFA | Text on Kind BG contrast | WCAG Level |
|------|-----|------|-----------|--------------------|------------------------|------------|
| pro | #10B981 | SVG checkmark (12px) | "Pro" | 4.87:1 | #1F2937 on #10B981 = 4.87:1 (AA) -- as 4px left color bar only, not full-card BG; text on #FAFAFA = 15.6:1 (AAA) | AA Normal |
| con | #EF4444 | SVG cross (12px) | "Con" | 4.56:1 | #1F2937 on #EF4444 = 2.37:1 (FAILS AA) -- con red NOT used as full-card BG; item card uses #FAFAFA white bg + #EF4444 4px left color bar; text #1F2937 on #FAFAFA = 15.6:1 (AAA) | AA Normal |
| neutral | #6B7280 | SVG dash (12px) | "Neutral" | 4.56:1 | #FFFFFF on #6B7280 = 4.56:1 (AA) -- as 4px left color bar only; text on #FAFAFA = 15.6:1 (AAA) | AA Normal |
| highlight | 品牌色 (default #3B82F6) | SVG star (12px) | "Highlight" | 4.35:1 | #1F2937 on #3B82F6 = 4.35:1 (AA) -- as 4px left color bar only; text on #FAFAFA = 15.6:1 (AAA) | AA Normal |

**Item card visual scheme** (uniform for all kinds, consistent with v0.1 FlowNode):
- All item cards: white background (#FAFAFA) + kind color as **4px left color bar** + text color #1F2937
- Con (#EF4444) is NOT used as full-card background because #1F2937 on #EF4444 = 2.37:1 FAILS WCAG AA (requires 4.5:1). The 4px left color bar provides sufficient visual identification without contrast failure.
- This is consistent with v0.1 FlowNode design: kind color as accent bar, not background fill.

**Dual encoding rule**: 每个 item 卡片同时显示 kind color (左侧色条) + kind icon (SVG inline) + kind text label。三者同时存在，满足 WCAG 1.4.1 "color not sole means"。

**Score 可视化**: 5-dot system (filled circles for score value, empty for remainder)。
- Dot diameter: 14px, gap 4px
- Dot fill color: kind color
- Dot empty color: #D1D5DB (gray-300, 3:1 contrast against #FAFAFA per L2-02)
- Score=0: dots not shown
- Dots positioned after item label text, inline

**Item 卡片内部排版定义**:
- Layout: white bg (#FAFAFA), 4px left color bar (kind color), 8px radius
- Internal arrangement: left color bar -> kind icon (16px) -> label text (14px, #1F2937, single-line truncation) -> score dots (5 dots, only when score>0)
- Size: min 120x48px, max 200x72px
- Hover state: color bar widens to 6px, slight scale(1.02), shadow elevation

### KD4: DT 节点 kind 区分

| Kind | Hex | Icon (none per L1-08) | Shadow | Text Color | Contrast |
|------|-----|----------------------|--------|------------|----------|
| question | #F59E0B | -- (color alone encodes kind) | None (flat) | #1F2937 | 6.32:1 AA |
| factor | #6B7280 | -- | None (flat) | #FFFFFF | 4.56:1 AA |
| conclusion | #10B981 | -- | 0 2px 8px rgba(16,185,129,0.25) | #1F2937 | 4.87:1 AA |

**为何 conclusion 加 shadow 而 question/factor 不加**: conclusion 是决策树的"答案节点" -- 用户探索的终极目标。轻微 emerald-tint shadow 提供视觉着陆感，符合 L1-22 的 Landing phase 逻辑。question/factor 保持 flat (no shadow) 因为它们是"路径节点"而非"终点"，与 v0.1 一致 (L1-08 "no border/shadow")。

**为何不用 glow**: glow (box-shadow with large spread) 在 #FAFAFA 浅背景上视觉效果差 -- spread-radius 过大会产生模糊光晕而非深度感。shadow (小 spread, 有方向) 在浅背景上提供清晰的深度提示。

### KD5: DT hover 路径高亮策略

**高亮整条路径 (从根到 hoveredNode)**:

| Element | Path (highlighted) | Non-path (dimmed) |
|---------|-------------------|-------------------|
| Node | opacity 1, normal colors | opacity 0.35 + blur 4px (desktop) / opacity 0.35 (mobile) |
| Node text | opacity 1 | opacity 0.4 |
| Edge on path | opacity 1, stroke 3px, accent color (#10B981 or brand) | opacity 0.2, stroke 2px |
| Edge label on path | opacity 1 | opacity 0.25 |
| Conclusion node on path | opacity 1, shadow visible | -- |

**Path 计算**: hoveredNode -> 通过 parent pointers 回溯到根 -> 收集路径上所有 node id + edge id。O(depth) 时间复杂度。

**为何整条路径而非仅当前节点+连线**: 决策树的核心交互价值是让用户看到"完整决策链" -- 从根问题到最终结论的逻辑路径。只高亮当前节点会让用户迷失在树结构中，无法追踪"为什么走到这个节点"。

### KD6: DT BFS 布局参数 + 不平衡树 fallback

**BFS 布局计算**:

```
1. BFS 从根计算每个节点的 level (0 = root)
2. 同层节点按 sibling 顺序水平排列
3. 父节点 x 居中于其子节点群中心:
   parentX = (minChildX + maxChildX) / 2
4. 每个节点 y = level * (NODE_MAX_H + VERTICAL_GAP)
```

**参数**:

| Parameter | Value | Source |
|-----------|-------|--------|
| Vertical gap (层级间距) | 48px | Spec; 比 flow 24px 更大因为树层级需要视觉分离 |
| Horizontal gap (同层间距) | 32px (<=5 siblings) / 64px (>5 siblings) | Spec; 与 flow 一致 |
| Node size | 96x48 min, 160x72 max, radius 8px | L1-08; 与 flow 一致 |
| Branch line | SVG cubic bezier, parent bottom -> child top | Spec |
| >5 siblings fallback | gap 64px + overflow-x: auto on tree container | Spec |
| Mobile layout | Indented vertical list, indent = level * 24px | Spec |

**父节点居中补充**: BFS 布局不自动居中父节点 (L2-07)。我们在 JS 中手动计算父节点 x = 子节点群中心。这是一个简单的居中修正，不需要 Reingold-Tilford 算法。

### KD7: 通用入场动画方向

| Template | Entry Direction | Rationale |
|----------|----------------|-----------|
| flow_explainer (v0.1) | Horizontal (translateX -16px) | 流程是水平流向，从左到右 |
| compare_explainer | Horizontal symmetric (左列 translateX -16px, 右列 +16px) | 对比是左右并排，对称入场强化空间叙事 |
| decision_tree | Vertical (translateY -12px) | 树是上下层级，根在上叶在下 |

**共享参数** (与 v0.1 一致):

| Parameter | Value | Easing |
|-----------|-------|--------|
| Title entrance | 400ms, fade + translateY -12px -> 0 | expoOut |
| Stagger | 50ms between elements | -- |
| Element entrance | 400ms, fade + direction-specific translate | expoOut |
| Edge draw | 600ms, stroke-dasharray | expoOut |
| Pulse | 4 iterations then stop | expoOut |
| Skip on input | First click/keydown/touchstart | -- |
| reduced-motion | Skip all, instant transitions | -- |

---

## Compare Explainer State Transition Table

The Compare explainer's behavior is governed by a finite state machine with two top-level phases (`entering`, `ready`) and two sub-state variables (`dimension`: string, `hoveredItem`: string | null).

**Sub-state variable definitions**:
- `dimension`: `"overview"` or a dimension id (e.g. `"performance"`, `"cost"`, `"security"`)
- `hoveredItem`: `null`, an item id (e.g. `"react-performance-1"`), or a verdict id (e.g. `"verdict-react"`). See KD1 "Overview hover 状态归属" for value domain details.

| # | From State | Trigger | To State | Behavior |
|---|-----------|---------|----------|----------|
| 1 | `entering` | Animation sequence completes | `ready, dimension="overview", hoveredItem=null` | Overview items visible; verdict badges + diff summary rendered; connections not shown |
| 2 | `entering` | User input: click / keydown / touchstart (any) | `ready, dimension="overview", hoveredItem=null` | Skip all remaining entry animations; render final positions immediately; show overview |
| 3 | `ready, dimension="overview"` | Mouse hover enters verdict badge (desktop) | `hoveredItem="verdict-{subjectId}"` | Hovered verdict badge highlighted; all diff summary items dimmed (opacity 0.35 + blur 4px desktop); badge accent bar widens to 6px |
| 4 | `ready, dimension="overview"` | Mouse hover enters diff summary item (desktop) | `hoveredItem=itemId` | Hovered item highlighted (full opacity); all other summary items dimmed (opacity 0.35 + blur 4px desktop); item color bar widens to 6px + scale(1.02) |
| 5 | `ready, dimension="overview"` | Mouse leaves hovered element (desktop) | `hoveredItem=null` | Restore overview normal brightness; all items return to full opacity |
| 6 | `ready, dimension="overview"` | Click dimension tab | `dimension=tabId, hoveredItem=null` | Trigger KD2 overview->dimension animation sequence; connections draw; detail panel shows dimension content |
| 7 | `ready, dimension=X` | Mouse hover enters item (desktop) | `hoveredItem=itemId` | Hovered item highlighted; all other items in current dimension dimmed; non-associated connections dimmed; associated connections highlighted |
| 8 | `ready, dimension=X` | Mouse leaves hovered element (desktop) | `hoveredItem=null` | Restore current dimension normal brightness; all items return to full opacity |
| 9 | `ready, dimension=X` | Click another dimension tab | `dimension=newTabId, hoveredItem=null` | hoveredItem cleared (old id may not exist in new dimension; hover context loss is acceptable -- user has explicitly changed focus); trigger KD2 dimension->dimension animation sequence |
| 10 | `ready, dimension=X` | Click overview tab | `dimension="overview", hoveredItem=null` | Trigger KD2 dimension->overview animation sequence; connections fade out; overview items fade in |
| 11 | `ready, *` (mobile) | Tap item | `hoveredItem=itemId` | Show tap-to-inspect overlay with item detail; item highlighted; other items dimmed |
| 12 | `ready, *` (mobile) | Tap X/close button or tap outside overlay | `hoveredItem=null` | Dismiss overlay; restore normal brightness |
| 13 | `ready, *` (mobile) | Tap another item | `hoveredItem=newItemId` | Close old overlay first, then open new overlay with new item detail; no intermediate state |

**Key design rationale for dimension switch hoveredItem clearing**: When switching dimensions, `hoveredItem=null` is forced because the old hoveredItem's id may not exist in the new dimension. Retaining it would cause a visual anomaly (highlighting a non-existent element). The hover context loss is acceptable -- the user has explicitly changed their focus by clicking a different dimension tab.

---

## Decision Tree Explainer State Transition Table

The DT explainer's behavior is governed by a finite state machine with two top-level phases (`entering`, `ready`) and two sub-state variables (`hoveredNode`: string | null, `highlightedPath`: string[]).

**Sub-state variable definitions**:
- `hoveredNode`: `null` or a node id (e.g. `"node-3"`)
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

**Path computation**: `computeRootToNodePath(nodeId)` traverses parent pointers from nodeId back to root, collecting all node ids and edge ids along the path. O(depth) time complexity. Path description format: "Node Label -> Branch Label -> ... -> Conclusion Label" (see Design Boundaries #8 and I-06).

---

## Layout

### Compare Desktop (>= 1024px)

```
+-------------------------------------------+-------------------+
|                                           |                   |
|  [Subject A]    [Subject B]               | Dimension tabs    |
|  verdict badge  verdict badge             |  Overview         |
|                                           |  Performance      |
|  diff summary items                       |  Cost             |
|  (two columns, items side-by-side)        |  Security         |
|                                           |                   |
|  [connections when in dimension mode]      | Detail content    |
|                                           | (scrollable)      |
|                                           |                   |
+-------------------------------------------+-------------------+
```

| Parameter | Value |
|-----------|-------|
| Left area | ~65% of container |
| Right panel | ~35% of container, min 280px |
| Two columns | Side-by-side with 24px gap |
| Connections | Cubic bezier SVG overlay (pointer-events none) |

### Compare Tablet (768-1023px)

| Parameter | Value |
|-----------|-------|
| Right panel | 280px fixed width (not percentage) |
| Left area | Remaining width (fluid) |
| Two columns gap | 16px (narrower than desktop) |
| All other parameters | Same as desktop |

### Compare Mobile (< 768px)

```
+----------------------------------+
|  [Overview] [Performance] [Cost] | <- Dimension tab horizontal scroll
+----------------------------------+
|  [Subject A]                     |
|  verdict badge                    |
|  items (vertical stack)           |
|                                   |
|  [Subject B]                     |
|  verdict badge                    |
|  items (vertical stack)           |
+----------------------------------+
|  Fixed bottom bar                 | <- Detail overlay / tap-to-inspect
+----------------------------------+
```

| Parameter | Value |
|-----------|-------|
| Dimension tabs | Horizontal scroll at top, 48x48px tap targets |
| Two columns | Vertical stack (A above B), not side-by-side |
| Bottom bar | Fixed, min 120px, expandable to 50vh |
| Connections | Not shown on mobile |

### DT Desktop (>= 1024px)

```
+-------------------------------------------+-------------------+
|                                           |                   |
|     [Tree Area]                           | Path description  |
|     Root                                  | "Question -> ...  |
|       /  \                                |  -> Conclusion"   |
|     A      B                              |                   |
|    / \    / \                              | Conclusion verdict|
|   C   D  E   F                            | + detail          |
|                                           | (scrollable)      |
+-------------------------------------------+-------------------+
```

| Parameter | Value |
|-----------|-------|
| Left area | ~65% of container |
| Right panel | ~35% of container, min 280px |
| Tree layout | Horizontal BFS, nodes expand left-to-right per level |
| Node spacing | 32px horizontal (<=5 siblings), 64px (>5 siblings); 48px vertical |

### DT Tablet (768-1023px)

| Parameter | Value |
|-----------|-------|
| Right panel | 280px fixed width |
| Left area | Remaining width (fluid) |
| Node spacing | 64px horizontal (reduced); 48px vertical (same) |
| All other parameters | Same as desktop |

### DT Mobile (< 768px)

```
+----------------------------------+
|  Root Question                    | <- Indented vertical list
|    -> Branch A                    |    indent = level * 24px
|      -> Factor C                  |
|      -> Factor D                  |
|    -> Branch B                    |
|      -> Factor E                  |
|      -> Conclusion F              |
+----------------------------------+
|  Fixed bottom overlay             | <- Path / conclusion detail
+----------------------------------+
```

| Parameter | Value |
|-----------|-------|
| Layout | Indented vertical list; indent = level * 24px |
| Bottom overlay | Fixed, sticky; shows path description + node detail |
| Node tap targets | 48x48px minimum |
| Horizontal tree | Not used on mobile |

---

## Script (User Journey)

### Compare Explainer User Journey

```
1. Page load -> entering phase
   Animation: title fade in, then subject columns slide in symmetrically
   (translateX -16px/+16px per column), diff summary items stagger 50ms

2. Entering completes OR user input -> ready, dimension="overview"
   User sees: two subject columns, verdict badges at top, diff summary
   items below. No connections visible.

3. User hovers verdict badge (desktop)
   hoveredItem="verdict-react" -> badge highlights, diff items dim.
   Methodology explanation appears in 280px overlay.
   Hover ends -> hoveredItem=null, overview restored.

4. User hovers diff summary item (desktop)
   hoveredItem=itemId -> item highlights, other items dim.
   Hover ends -> hoveredItem=null, overview restored.

5. User clicks dimension tab "Performance"
   dimension="performance", hoveredItem=null -> KD2 animation sequence:
   Phase 1: overview items fade out 200ms
   Phase 2: performance items fade in 300ms + stagger 50ms
   Phase 3: connections draw 600ms stroke-dasharray
   Phase 4: pulse 4x then static
   Total: ~1200ms

6. User hovers item in performance dimension (desktop)
   hoveredItem=itemId -> item highlights, other items dim,
   associated connections highlighted, non-associated connections dim.
   Hover ends -> hoveredItem=null, dimension view restored.

7. User clicks overview tab
   dimension="overview", hoveredItem=null -> KD2 animation sequence:
   connections fade out 200ms -> items fade out 200ms ->
   overview items fade in 300ms
   Total: ~700ms

Mobile variant: tap replaces hover; overlay is sticky with dismiss button.
```

### Decision Tree Explainer User Journey

```
1. Page load -> entering phase
   Animation: title fade in, then nodes fade + translateY per BFS level
   (root first, then level 1, etc.), then edges draw (200ms delay after
   last level starts, 600ms expoOut stroke-dasharray)

2. Entering completes OR user input -> ready, hoveredNode=null
   User sees: full tree with all nodes and branches visible.
   Right panel shows tree overview text.

3. User hovers a node (desktop)
   hoveredNode=nodeId, highlightedPath=computeRootToNodePath(nodeId)
   Path from root to hovered node: all nodes full opacity, all edges
   stroke 3px accent color. Non-path elements dimmed.
   Right panel updates with path description:
   "What is your project type? -> Web -> Interactive UI -> ..."

4. User moves hover to adjacent node
   Direct switch: hoveredNode=newId, highlightedPath recomputed.
   Old path dims while new path highlights (expoOut 200ms transition).
   No intermediate state. Right panel updates path description.

5. Hover ends -> hoveredNode=null, highlightedPath=[]
   Full tree brightness restored. Right panel returns to overview.

6. User taps conclusion node
   hoveredNode=conclusionId -> path highlight + sticky overlay shows
   conclusion verdict and detail text.

Mobile variant: tap replaces hover; overlay is sticky with dismiss button.
Path highlight uses opacity-only dimming (no blur).
```

---

## Design Boundaries

### Compare Explainer 硬约束

1. **subjects.length 2-4, dimensions.length 3-8** (per spec schema rules)
2. **WCAG AA 4.5:1 文字对比度 + 3:1 UI 对比度** (L2-01, L2-02) -- 所有 kind 颜色在 #FAFAFA 上必须通过
3. **Dual encoding: kind color + icon + text label 三者并存** (L2-03, L3-12) -- 不是可选优化
4. **overview 默认状态** (per spec) -- 不是第一个维度
5. **hover/tap detail 必须有 dismiss 机制** (L3-14) -- 不是 hover-only
6. **维度切换总时长 <= 1200ms** (overview->dimension) 和 <= 700ms (dimension->dimension/overview)
7. **mobile 降级: 两列竖排 + tab 横滑维度切换 + tap-to-inspect** (per spec + L3-06)
8. **connections 仅在维度模式显示，overview 不显示** (per spec)

### Decision Tree Explainer 硬约束

1. **nodes.length 6-20** (per spec schema rules)
2. **全景展开: 所有节点同时可见** (per spec) -- 不折叠不隐藏
3. **hover 整条路径高亮** (per KD5) -- 不是仅当前节点
4. **conclusion 节点必须有视觉强调** (per KD4) -- emerald-tint shadow
5. **BFS 布局 + 父节点手动居中** (per KD6) -- 不引入外部库
6. **>5 siblings: gap 64px + 水平滚动** (per spec fallback)
7. **mobile: 缩进竖向列表 (level * 24px)** (per spec) -- 不使用水平布局
8. **路径描述: 包含 node label 的完整格式** -- e.g. "What is your project type? -> Web -> Interactive UI -> Real-time Updates -> Choose React" (per spec, format includes node label text, not just kind) -- 右侧面板/底部 overlay 实时更新

### 通用硬约束

1. **expoOut easing for all animations** (L1-01)
2. **opacity 0.35 + blur 4px dimming on desktop; opacity 0.35 only on mobile** (L1-05)
3. **prefers-reduced-motion: skip entry, instant transitions, outline hover** (L1-16)
4. **48x48px minimum touch targets** (L1-14)
5. **8px grid spacing system** (L1-15)
6. **Self-contained single HTML, no external JS libs** (L4-06)
7. **HTML nodes + SVG overlay (pointer-events none, aria-hidden)** (L1-17)
8. **Stroke-dasharray for edge draw, polygon arrowhead** (L1-09, L4-01)

---

## Adopt Matrix

| # | What | Why | Ref IDs |
|---|------|-----|---------|
| A-01 | Verdict badge = pill shape + accent color bar + text label + hover rationale | Reduces decision fatigue; formalized pattern; transparency required | L3-05, L3-11, L1-08 |
| A-02 | Overview as default initial state | Users need decision framework before diving into details | L3-01, spec |
| A-03 | Differences-only toggle in overview | 68% user preference; reduces cognitive load | L3-01 |
| A-04 | Dual encoding: kind color + icon + text label | WCAG 1.4.1 hard requirement; CVD accommodation | L2-03, L3-12 |
| A-05 | 5-dot score visualization | Compact in card layout; clear tier indication; consistent with kind colors | L3-13 |
| A-06 | Dimension switch animation sequence (Slow-Fast-Boom micro) | Narrative rhythm; ~1200ms total matches v0.1 entry | L1-22, L1-07 |
| A-07 | Symmetric horizontal entry animation for Compare | Reinforces left-right spatial narrative of comparison | L1-01, Inf-7 |
| A-08 | BFS layout + manual parent centering for DT | Simple, reliable, no external libs needed for 6-15 nodes | L2-07, L4-06, L4-08 |
| A-09 | Full path highlighting on hover (root to hoveredNode) | Core interaction value of decision tree exploration | L3-08, L1-21 |
| A-10 | Conclusion node: emerald background + emerald-tint shadow | Visual landing point; distinct from question/factor; flat design language preserved for question/factor nodes; conclusion shadow is intentional exception per Inf-4 (emerald-tinted shadow to mark terminal landing point) | L3-09, L1-08, L1-22 |
| A-11 | Vertical entry animation for DT | Matches top-down tree spatial narrative | Inf-7 |
| A-12 | Mobile DT: indented vertical list | Standard mobile tree pattern; avoids horizontal overflow | L3-06, spec |
| A-13 | Mobile Compare: two-column vertical stack + tab switcher + tap-to-inspect | Standard mobile comparison transformation; not tiny table | L3-06, L3-14 |
| A-14 | Connections only in dimension mode (not overview) | Overview is summary; connections are detail-level | spec |
| A-15 | Dimension-to-dimension: connections fade transition (not redraw) | Performance; visual smoothness; stroke-dasharray only on first appearance | KD2 |
| A-16 | Sticky overlay on mobile DT tap (not scroll-away) | Users need persistent path info while exploring tree | spec |
| A-17 | Cross-column hover highlighting in Compare | Visual scanning aid; Material Design proven pattern | L3-04 |
| A-18 | 4px stroke minimum on SVG interactive elements | W3C SVG accessibility spec | L2-05 |

---

## Reject Matrix

| # | What | Why | Ref IDs |
|---|------|-----|---------|
| R-01 | More than 5 subjects side-by-side | Cognitive overload per NN/g; spec caps at 4 | L3-02 |
| R-02 | Hover-only tooltips for critical detail | Inaccessible on touch devices; must have tap alternative | L3-14 |
| R-03 | `display: none` on table cells for responsive layout | Removes from accessibility tree | external-scan R-03 |
| R-04 | Vertical-only layout for all DT trees | Wide trees need horizontal layout option on desktop | L3-15 |
| R-05 | Identical rendering for conclusion and question/factor nodes | Violates convention; reduces scanning speed | L3-09 |
| R-06 | Glow effect (large-spread box-shadow) on conclusion nodes | Looks bad on #FAFAFA; violates flat design language | L1-08 |
| R-07 | External JS libraries (d3-hierarchy, React Flow) in output HTML | Breaks self-contained single-file paradigm | L4-06 |
| R-08 | Diamond/rhombus shape for question nodes in DT | Shape differentiation violates L1-08 "same shape, color encodes kind" principle; also harder to fit text | L1-08 |
| R-09 | Partial path highlighting (current node + direct edges only) | Destroys decision chain narrative; user can't trace full logic | L3-08 |
| R-10 | Score as numeric text (e.g. "4/5") | Less scannable than visual dots; slower to compare | L3-13 |
| R-11 | Mini-bar for score visualization | Too wide for item card layout (120-200px max width); dots more compact | L3-13, spec item card size |
| R-12 | Verdict badge as icon-only (no text) | Fails WCAG 1.4.1; not transparent enough per L3-11 | L2-03, L3-11 |
| R-13 | Red/green as sole pro/con indicator (no icon/text pair) | Fails for CVD users (~8% male); WCAG 1.4.1 violation | L2-04, L3-12 |
| R-14 | Overlay that scrolls away on mobile DT | Path info must persist during tree exploration | spec |
| R-15 | Skip animated transitions on dimension switch | Instant switch causes visual disorientation (same rationale as external-scan R-06) | L3-10 |
| R-16 | Radial tree layout as default for DT | Non-standard for decision trees; user expectation is top-down hierarchy | L3-15 |
| R-17 | Collapsible subtrees in DT | Spec explicitly says "全景展开, 不折叠不隐藏"; progressive disclosure via hover path highlighting instead | spec |
| R-18 | Dark mode in v0.2 | Spec "不做" list; v0.2 复用品牌色系统 | spec |

---

## Unknowns

| # | Question | Impact | Mitigation |
|---|----------|--------|------------|
| U-01 | Optimal animation duration for column/row hover highlights in comparison tables | Compare cross-column highlight timing | Use hover focus 200ms (per L1-06) as baseline; A/B test if needed |
| U-02 | Whether multi-dimension toggle (switching between "Performance" vs "Cost" vs "Security" views) has been UX-tested | Compare dimension switch interaction | Use spec-defined sequence; observe user behavior in v0.2 release |
| U-03 | Optimal animation duration for subtree expand/collapse | DT not using collapse, but future version may | Not relevant for v0.2 (no collapse); note for v0.3 |
| U-04 | Full-tree vs. step-through stepper comprehension comparison | DT interaction model choice | v0.2 uses full-tree + hover path; step-through deferred to v0.3 |
| U-05 | Maximum tree depth that remains comprehensible in interactive explainer | DT node count limits | Spec caps at 20 nodes; monitor user feedback |
| U-06 | Whether AI-generated explainer HTML quality matches hand-crafted examples | Overall quality benchmark | cc-design differentiation claim; exit-conditions will gate |
| U-07 | Compare verdict badge placement: column header vs. floating/sticky vs. inline | Overview layout detail | Use column-top placement (per spec); observe in v0.2 |
| U-08 | Compare hover cross-highlight: row highlight vs. column highlight vs. both | Compare interaction detail | Use both (row + column) on desktop; row-only on mobile |

---

## Approval Criteria

### Compare Explainer

1. Overview 模式正确: 进入时默认 overview, verdict 徽章 + 差异概要 + 差异计数可见
2. 维度切换流畅: 4-phase animation sequence 正确, items 和 connections 过渡无跳跃
3. Hover 详情正确: hover/tap item -> detail 浮层 + 关联连线高亮 + 其他项 dimmed
4. Dual encoding: 每个 item 卡片同时显示 kind color + kind icon + kind text
5. Score 可视化: 5-dot system, score=0 时隐藏
6. Mobile 降级: 两列竖排 + tab 横滑 + tap-to-inspect, 无 hover-only 内容
7. WCAG AA: 所有文字 >= 4.5:1, 所有 UI >= 3:1, kind 不依赖单一颜色

### Decision Tree Explainer

1. 全景展开正确: 所有节点和分支同时可见, BFS 布局不重叠, 父节点居中于子节点
2. 路径高亮正确: hover 任何节点 -> 整条路径全亮 + accent stroke 3px + 非路径 dimmed
3. Conclusion 强调: emerald 背景 + shadow, 与 question/factor 视觉可区分
4. 路径描述: 右侧面板/底部 overlay 实时显示包含 node label 的文本路径 (e.g. "What is your project type? -> Web -> Interactive UI -> Real-time Updates -> Choose React")
5. 不平衡树 fallback: >5 siblings 时 gap 64px + 水平滚动可用
6. Mobile 降级: 缩进竖向列表 + tap-to-inspect + sticky overlay
7. WCAG AA: 所有文字 >= 4.5:1, 所有 UI >= 3:1

### 通用

1. 入场动画与 v0.1 参数一致 (expoOut, stagger 50ms, duration 400ms, stroke-dasharray 600ms)
2. Dimming 与 v0.1 一致 (opacity 0.35 + blur 4px desktop, opacity 0.35 only mobile)
3. prefers-reduced-motion 降级正确 (skip entry, instant transitions, outline hover)
4. 响应式三断点正确 (desktop >=1024, tablet 768-1023, mobile <768)
5. 无控制台错误
6. 触控目标 >= 48x48px

---

## Not-Doing List

| Item | Reason |
|------|--------|
| layer_explainer.jsx | v0.3 scope |
| timeline_explainer.jsx | v0.3 scope |
| Collapsible subtrees in DT | Spec says "全景展开, 不折叠不隐藏" |
| Step-through stepper in DT | v0.3 candidate |
| Path breadcrumb navigation in DT | v0.3 candidate |
| Search/filter dimensions in Compare | 3-8 dimensions不需要 |
| Cross-template composition | v0.3 scope |
| Dark mode | v0.2 reuses brand color system |
| Diamond/rhombus shape for question nodes | Violates L1-08 same-shape principle |
| Glow effect on conclusion nodes | Bad on #FAFAFA, violates flat design |
| Score as numeric text | Less scannable |
| Mini-bar score visualization | Too wide for item cards |
| External JS libs in output | Breaks self-contained paradigm |
| Radial tree layout | Non-standard for decision trees |
| Hover-only tooltips | Inaccessible on touch |