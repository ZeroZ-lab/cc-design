# Plan: Explainer Extensions -- Compare + Decision Tree (v0.2)

> Spec: `01-spec.md` (v0.2 Final) | Design: `02-design.md` (v0.2 Final) | Date: 2026-05-11

---

## artifact_type

`software` -- cc-design 现有架构内新增 2 个 JSX 模板 (`compare_explainer.jsx` + `decision_tree.jsx`) + 扩展 2 份参考文档 + 更新 load-manifest/SKILL.md/README.md/exit-conditions/VERSION 路由配置

---

## Overview

在 cc-design v0.1 `flow_explainer.jsx` 基础上扩展两种新模板形态：
- **Compare Explainer** -- 多维度对比（overview + 维度切换 + hover 详情）
- **Decision Tree Explainer** -- 全景展开决策树（hover 路径高亮 + 终端结论）

两种模板共享 v0.1 的状态机框架（entering/ready）、dimming 策略、响应式断点、入场动画参数（expoOut/stagger/duration/dasharray），但交互模型各自定义 sub-states。Layer 模板推 v0.3 交付。

---

## Wave Execution Plan

| Wave | Tasks | Parallel Safety | Gate Condition |
|------|-------|-----------------|----------------|
| **Wave 1** | T0 (Compare spike), T1 (DT spike), T2 (ref: interaction patterns update), T3 (ref: node-graph visuals update) | All parallel-safe | All 4 tasks pass verification |
| **Wave 2** | T4 (compare_explainer.jsx), T5 (decision_tree.jsx) | Unsafe -- two separate template files, but each is independent of the other. Can be developed by different agents in parallel, but each depends on its own spike + refs. | **Gate: T0+T1 spike 全部通过 + T2+T3 参考文档一致性检查（对比两个文档的参数：stroke width、node size、timing constants、颜色值是否一致，不一致时优先遵循 T3 visuals 参数）** |
| **Wave 3** | T6 (load-manifest + keywords), T7 (SKILL.md + README + workflow), T8 (exit-conditions) | T6 unsafe (depends on T4+T5), T7 unsafe (depends on T6), T8 parallel-safe with T7 | T6-T8 all pass verification |
| **Wave 4** | T9 (VERSION bump + behavior contract), T10 (browser acceptance test) | T9 unsafe (depends on T7+T8), T10 unsafe (depends on T4+T5+T9) | T9 passes script, T10 passes acceptance |

---

## Task List

### T0: Compare HTML+CSS+SVG Spike

**Priority:** P0 | **Complexity:** S (~100 lines HTML, ~1-2h) | **Parallel:** Safe | **Depends:** None

**Description:**
在写完整 compare_explainer.jsx 前，先验证核心布局和交互架构在 React+Babel CDN 环境下的可行性。

**验证项：**
1. 两列并排 flexbox 布局 + 左 4px kind 色条 + 卡片 min 120x48px 在不同屏幕宽度下的表现
2. 维度切换 tab 按钮组 + overview/dimension 状态切换的基本逻辑
3. SVG overlay pointer-events:none 不阻挡 HTML 项卡片的 hover/click 交互
4. 跨对象 cubic bezier 连线（从 A 列项右侧到 B 列项左侧）的坐标计算可行性
5. verdict badge pill shape (radius 8px, accentColor 色条) 的渲染效果
6. 5-dot score 可视化在不同 score 值（0-5）下的排版效果
7. Dual encoding: kind color 色条 + SVG inline icon (checkmark/cross/dash/star 12px) + kind text label 三者并存的卡片排版

**产出：** 一个最小 HTML 文件（2 subjects + 1 dimension + 3-4 items per subject + 1-2 connections + 1 verdict badge），验证上述 7 项。如果不可行，回退到纯 SVG 方案。

**Verification:**
- [ ] 浏览器打开无控制台错误
- [ ] 两列并排布局正确，间距 24px
- [ ] 维度 tab 切换状态正确
- [ ] SVG overlay 不阻挡 HTML 项 hover/click
- [ ] 跨对象连线端点与卡片边缘对齐（视觉检查）
- [ ] verdict badge 渲染正确（pill shape + accentColor 色条 + text label）
- [ ] 5-dot score 渲染正确（filled/empty dots, score=0 隐藏）
- [ ] Dual encoding 三元素并存在卡片内排版无溢出

---

### T1: Decision Tree HTML+CSS+SVG Spike

**Priority:** P0 | **Complexity:** S (~100 lines HTML, ~1-2h) | **Parallel:** Safe | **Depends:** None

**Description:**
在写完整 decision_tree.jsx 前，先验证树布局 + 路径高亮的基本可行性。

**验证项：**
1. BFS 层级布局计算：根在上，子节点水平均匀分布，父节点居中于子节点群中心
2. 不平衡树场景：某层 >5 子节点时 gap 64px + overflow-x:auto 的表现
3. hover 路径高亮：hover 任意节点 -> computeRootToNodePath() 回溯整条路径 -> path nodes opacity 1 / non-path dimmed (opacity 0.35 + blur 4px)
4. SVG cubic bezier 连线从父节点底部到子节点顶部的视觉效果
5. conclusion 节点 emerald 背景 + shadow (0 2px 8px rgba(16,185,129,0.25)) 与 question/factor 节点的视觉区分
6. 移动端缩进竖向列表 (indent = level * 24px) 的布局可行性
7. 路径描述文本格式："Root Label -> branch label -> ... -> node label"

**产出：** 一个最小 HTML 文件（1 root + 2 level-1 + 4 level-2 + 2 level-3 conclusion nodes + 1 unbalanced branch with >5 children test），验证上述 7 项。如果不可行，回退到纯 SVG 方案。

**Verification:**
- [ ] 浏览器打开无控制台错误
- [ ] BFS 布局节点不重叠，父节点居中于子节点
- [ ] hover 路径高亮完整路径（从根到 hoveredNode）
- [ ] non-path dimming 正确 (opacity + blur desktop)
- [ ] conclusion shadow 与 question/factor flat 的视觉区分明显
- [ ] >5 siblings 场景有水平滚动且布局不崩溃
- [ ] 移动端缩进竖向列表渲染正确
- [ ] 路径描述文本格式正确

---

### T2: Update explainer-interaction-patterns.md

**Priority:** P0 | **Complexity:** S (~150 lines incremental, ~1h) | **Parallel:** Safe | **Depends:** None

**Description:**
更新 `references/explainer-interaction-patterns.md`，补充 Compare + DT 的交互模式定义。基于 02-design.md KD1-KD7 + 状态转换表。

**Content outline (增量):**
1. 交互优先级栈扩展（新增 Compare/DT 的 entry/primary/hover 层内容）
2. Compare Explainer 状态转换表（13 行 from+trigger->to+behavior，来自 02-design.md Compare State Transition Table）
3. Compare Overview 模式定义（verdict badge hover 状态归属、差异概要筛选逻辑、差异计数）
4. Compare 维度切换动画序列（KD2: 4-phase sequence, overview->dimension / dimension->overview / dimension->dimension）
5. Compare hover/tap 详情交互（hoveredItem 状态、connections 高亮策略、移动端 tap-to-inspect overlay dismiss 机制）
6. Decision Tree Explainer 状态转换表（8 行 from+trigger->to+behavior，来自 02-design.md DT State Transition Table）
7. DT hover 路径高亮策略（KD5: 整条路径高亮 + accent stroke 3px + dimming 策略）
8. DT path computation（computeRootToNodePath via parent-pointer traversal, O(depth)）
9. DT 路径描述格式（"Node Label -> Branch Label -> ... -> Conclusion Label"）
10. Compare + DT 入场动画方向差异化（Inf-7: Compare 水平对称 translateX, DT 垂直 translateY）
11. Compare connections 视觉参数（stroke #9CA3AF, no arrowhead, cubic bezier, label bubble）
12. Compare item 卡片 visual scheme（white bg + 4px left kind color bar + dual encoding + 5-dot score）
13. DT conclusion shadow specification（emerald-tint shadow, flat for question/factor）

**Verification:**
- [ ] 覆盖 KD1-KD7 所有交互参数
- [ ] 包含完整 Compare 13 行状态转换表
- [ ] 包含完整 DT 8 行状态转换表
- [ ] Compare overview hoveredItem 值域定义 ("verdict-{subjectId}" / itemId / null)
- [ ] Compare 维度切换动画时序（4-phase, ~1200ms / ~700ms）
- [ ] DT path computation 算法说明 (parent-pointer traversal)
- [ ] 入场动画方向差异化说明 (Compare 水平对称, DT 垂直)
- [ ] 与现有 flow_explainer 交互定义无矛盾
- [ ] 与 L1.1 (animation-best-practices) 无矛盾

---

### T3: Update explainer-node-graph-visuals.md

**Priority:** P0 | **Complexity:** S (~100 lines incremental, ~1h) | **Parallel:** Safe | **Depends:** None

**Description:**
更新 `references/explainer-node-graph-visuals.md`，补充 Compare + DT 布局的视觉参数。基于 02-design.md KD3-KD6 + Inf-1 through Inf-6。

**Content outline (增量):**
1. Compare 项卡片样式（min 120x48 max 200x72px, radius 8px, white bg + 4px left kind color bar）
2. Compare kind 颜色扩展（pro=#10B981, con=#EF4444, neutral=#6B7280, highlight=品牌色 #3B82F6）
3. Compare kind dual encoding 视觉参数（SVG inline icon 12px: checkmark/cross/dash/star + kind text label）
4. Compare score 5-dot system（dot diameter 14px, gap 4px, filled=kind color, empty=#D1D5DB, score=0 隐藏）
5. Compare verdict badge 视觉参数（pill shape radius 8px, min-height 32px, min-width 80px, 4px accentColor 色条）
6. Compare connections 视觉参数（stroke 2px #9CA3AF, no arrowhead, cubic bezier, label 12px #6B7280 + white bubble radius 4px padding 4px 8px）
7. Compare 布局参数（desktop 两列 ~65% + panel ~35% min 280px, 两列间距 24px, tablet panel 280px fixed 两列间距 16px, mobile 两列竖排 + tap-to-inspect）
8. DT kind 颜色扩展（question=#F59E0B, factor=#6B7280, conclusion=#10B981）
9. DT conclusion shadow (0 2px 8px rgba(16,185,129,0.25)), question/factor flat (no shadow)
10. DT BFS 布局参数（vertical gap 48px, horizontal gap 32px / 64px >5-siblings, node size same as flow, mobile indent level*24px）
11. DT 路径高亮 stroke 参数（path edge stroke 3px accent color, non-path opacity 0.2 stroke 2px）
12. WCAG 对比度参考表扩展（新增 Compare kind 颜色对比度 + DT kind 颜色对比度）

**Verification:**
- [ ] WCAG 对比度数值与 02-design.md Inf-3 一致
- [ ] 贝塞尔曲线参数明确（Compare 跨对象: from item 右侧到 to item 左侧; DT: 从父底部到子顶部）
- [ ] verdict badge 视觉参数完整（shape + color bar + min size）
- [ ] 5-dot score 参数完整（diameter + gap + fill/empty colors）
- [ ] DT BFS 布局参数完整（gap + node size + parent centering rule）
- [ ] conclusion shadow 参数明确
- [ ] Compare kind 颜色含品牌色覆盖指引 (highlight=品牌色, WCAG AA required)
- [ ] 与现有 flow 节点视觉定义无矛盾

---

### T4: Create compare_explainer.jsx

**Priority:** P0 | **Complexity:** L (1400-1700 lines, ~4-5h) | **Parallel:** Unsafe w/ T5 (different file, can be done by different agents) | **Depends:** T0 spike pass + T2/T3 ref docs

**Description:**
创建 `templates/compare_explainer.jsx`，完整可交互的对比解释模板。遵循 v0.1 flow_explainer.jsx 的工程模式（IIFE + React+Babel CDN + inline expoOut/debounce/animateValue + schema comment block + EXAMPLE_DATA）。

**Template structure:**
1. **Schema 注释块**（顶部，定义完整 schema + React vs Vue 示例数据，per spec section "模板内嵌 schema"。注意：cta 字段统一使用 `href` (不是 `target`), 与 v0.1 flow_explainer 一致。spec 中的 `target` 字段名已在 build 阶段被覆盖为 `href`。）
2. **React 组件:**
   - CompareExplainer（主组件，管理 phase/dimension/hoveredItem 状态，per 02-design Compare State Transition Table 13 行）
   - SubjectColumn（左侧对比区域，两列并排 flexbox，per spec layout）
   - ItemCard（单个项卡片，white bg + 4px left kind color bar + dual encoding + 5-dot score, per KD3 + Inf-3）
   - VerdictBadge（pill shape + accentColor 色条 + "Best for X" label, per KD1 + Inf-1）
   - DiffSummary（overview 模式差异概要，差异筛选逻辑 per KD1）
   - DimensionSwitcher（维度标签按钮组，点击切换 dimension 状态）
   - DetailPanel（右侧面板，dimension 说明 + hover 详情，desktop ~35%/tablet 280px）
   - CompareConnection（SVG overlay cubic bezier 跨对象连线, stroke #9CA3AF, no arrowhead）
   - TapOverlay（移动端 tap-to-inspect 浮层, per spec mobile interaction）
3. **入场动画序列**（Compare 特有: 水平对称 translateX, 左列 -16px 右列 +16px, per Inf-7）
4. **维度切换动画序列**（4-phase per KD2: overview->dimension ~1200ms / dimension->overview ~700ms / dimension->dimension ~700ms）
5. **Focus+Context 暗化**（桌面 opacity 0.35 + blur 4px, 移动 opacity-only, per v0.1 shared dimming）
6. **Overview 模式**（默认进入, verdict badge + diff summary + diff count, per KD1）
7. **hoveredItem 状态域**（null / itemId / "verdict-{subjectId}", per KD1 "Overview hover 状态归属"）
8. **prefers-reduced-motion 降级**（CSS @media + JS matchMedia, skip entry/instant transitions/outline hover）
9. **三断点响应式**（desktop >=1024 / tablet 768-1023 / mobile <768, per spec layout strategy）
10. **键盘导航**（Tab 维度按钮, Enter 切换维度, Tab 项卡片, Esc 关闭 overlay）
11. **Error boundary**（0 dimensions -> 静态列表无切换, 0 connections -> 无 SVG overlay, schema error -> console warning 不崩溃）
12. **URL sanitization**（模板必须包含 sanitizeUrl 函数，只允许 http/https 协议，拒绝 javascript:/data:/vbscript: 等危险协议。CTA href 和所有链接必须通过此函数过滤后才渲染到 `<a href>`。）

**Technical constraints:**
- 使用 React+Babel CDN（同 v0.1 flow_explainer.jsx IIFE pattern）
- 复用 expoOut/debounce/animateValue/prefersReducedMotion（inline copy, per v0.1）
- 单文件 JSX, 无外部依赖
- Compare connections: SVG overlay pointer-events:none aria-hidden:true, per L1-17

**Verification (from spec acceptance criteria #1-#11c + general #1-#8):**
- [ ] 浏览器打开无控制台错误 (spec #3)
- [ ] 入场动画: 水平对称 translateX, 左列从左滑入, 右列从右滑入, 400ms expoOut + stagger 50ms (spec #2, general #1)
- [ ] 入场动画跳过: click/keydown/touchstart -> 立即显示 overview (general #1)
- [ ] Overview 模式正确: 默认 overview, verdict badge + diff summary + diff count 可见 (spec #9, #11b)
- [ ] verdict badge hover: hoveredItem="verdict-{subjectId}" -> badge highlight + diff items dimmed (02-design Compare State Table row 3)
- [ ] 维度切换流畅: 4-phase animation sequence 正确, items 和 connections 过渡无跳跃 (spec #9, KD2)
- [ ] 从 overview 切换到维度: fade out 200ms -> fade in 300ms -> connections draw 600ms (spec #11c, KD2)
- [ ] 从维度切换回 overview: connections fade out 200ms -> items fade out 200ms -> overview fade in 300ms (KD2)
- [ ] 维度间切换: current fade out 200ms -> new fade in 300ms -> connections fade transition 200ms (KD2)
- [ ] Hover 详情正确: hover item -> detail 浮层 + 关联连线高亮 + 其他 dimmed (spec #10, KD3)
- [ ] 跨对象连线: 维度切换时正确显示/隐藏 (spec #11)
- [ ] Dual encoding: 每个 item 卡片同时显示 kind color bar + kind icon + kind text (spec #4, KD3)
- [ ] Score 5-dot: score>0 显示 dots, score=0 隐藏 (spec #5)
- [ ] 移动端降级: 两列竖排 + tab 横滑 + tap-to-inspect, 无 hover-only 内容 (spec #6)
- [ ] prefers-reduced-motion: 跳过入场, 即时切换, outline hover (general #7)
- [ ] 响应式三断点: desktop >=1024, tablet 768-1023, mobile <768 (general #4)
- [ ] WCAG AA: 所有文字 >=4.5:1, 所有 UI >=3:1 (spec #7)
- [ ] Schema 注释 + React vs Vue 示例数据完整 (spec #5, #8)
- [ ] Error boundary: 0 dimensions 不崩溃 (general #3)
- [ ] Overview 模式下 hover diff item: hoveredItem=itemId, dimmed 其他概要项, 无 connections 高亮 (Row 4)
- [ ] Mobile tap item 关闭 overlay: tap X 按钮 -> hoveredItem=null, overlay dismiss (Row 12)
- [ ] Mobile tap 另一个 item: 先关闭旧 overlay 再打开新, hoveredItem=newItemId, 无中间态 (Row 13)
- [ ] Cross-column hover highlighting: hover 对比行时整行/列背景微妙高亮辅助视觉扫描 (A-17 Material Design pattern)
- [ ] Desktop row+column hover highlighting; mobile row-only highlighting (U-08 resolution)
- [ ] URL sanitization: cta.href 渲染前通过 sanitizeUrl 过滤, javascript: URI 被阻止
- [ ] Schema cta 字段名使用 `href` (not `target`), 与 flow_explainer.jsx 一致

---

### T5: Create decision_tree.jsx

**Priority:** P0 | **Complexity:** L (1300-1600 lines, ~4-5h) | **Parallel:** Unsafe w/ T4 (different file, can be done by different agents) | **Depends:** T1 spike pass + T2/T3 ref docs

**Description:**
创建 `templates/decision_tree.jsx`，完整可交互的决策树解释模板。遵循 v0.1 flow_explainer.jsx 的工程模式。

**Template structure:**
1. **Schema 注释块**（顶部，定义完整 schema + 技术选型决策树示例数据，per spec section "decision_tree 模板内嵌 schema"。注意：cta 字段统一使用 `href` (不是 `target`), 与 v0.1 flow_explainer 一致。spec 中的 `target` 字段名已在 build 阶段被覆盖为 `href`。）
2. **React 组件:**
   - DecisionTreeExplainer（主组件，管理 phase/hoveredNode/highlightedPath 状态，per 02-design DT State Transition Table 8 行）
   - TreeDiagram（HTML 节点容器 + SVG overlay 连线，desktop BFS layout / mobile indented list）
   - TreeNode（单个节点 div, kind 色编码, conclusion 加 shadow, per KD4 + Inf-4）
   - TreeEdge（SVG cubic bezier path + label, parent bottom -> child top, per KD6）
   - PathInfoPanel（右侧面板, path description "Node Label -> Branch Label -> ... -> Conclusion Label", per spec #15）
   - TapOverlay（移动端 tap-to-inspect sticky overlay, per spec #15c）
3. **BFS 布局计算**（从根 BFS 计算每个节点 level, 同层水平均匀分布, 父节点 x 居中于子节点群中心, per KD6 + Inf-6）
4. **不平衡树 fallback**（>5 siblings: gap 64px + overflow-x:auto, per KD6）
5. **hover 路径高亮**（hover 任何节点 -> computeRootToNodePath 回溯整条路径 -> path nodes opacity 1 + path edges stroke 3px accent color -> non-path dimmed, per KD5 + Inf-5）
6. **Conclusion 强调**（emerald bg + shadow 0 2px 8px rgba(16,185,129,0.25), per KD4 + Inf-4）
7. **入场动画**（DT 特有: 垂直 translateY -12px, root 先 -> 按 BFS 层级逐层, per Inf-7）
8. **移动端布局**（缩进竖向列表 indent=level*24px, per spec mobile layout）
9. **移动端 sticky overlay**（tap 路径高亮 overlay sticky 不随滚动消失, per spec #15c）
10. **prefers-reduced-motion 降级**（CSS @media + JS matchMedia）
11. **三断点响应式**（desktop >=1024 / tablet 768-1023 / mobile <768）
12. **键盘导航**（Tab 聚焦节点, Enter 显示 detail, Esc 关闭 overlay）
13. **Error boundary**（0 edges -> 静态列表无连线, single root -> 无 tree layout, schema error -> console warning 不崩溃）
14. **URL sanitization**（模板必须包含 sanitizeUrl 函数，只允许 http/https 协议，拒绝 javascript:/data:/vbscript: 等危险协议。CTA href 和所有链接必须通过此函数过滤后才渲染到 `<a href>`。）

**Technical constraints:**
- 使用 React+Babel CDN（同 v0.1）
- 复用 expoOut/debounce/animateValue/prefersReducedMotion（inline copy）
- 单文件 JSX, 无外部依赖
- Tree edges: SVG overlay pointer-events:none aria-hidden:true, per L1-17
- No external layout libs (d3-hierarchy), per L4-06 / R-11

**Verification (from spec acceptance criteria #1-#8 + #12-#15c):**
- [ ] 浏览器打开无控制台错误 (spec #3)
- [ ] 入场动画: 垂直 translateY -12px, root 先 -> BFS 层级逐层, 400ms expoOut + stagger 50ms (general #1)
- [ ] 入场动画跳过: click/keydown/touchstart -> 立即显示全景 (general #1)
- [ ] 全景展开正确: 所有节点和分支同时可见, BFS 布局不重叠, 父节点居中于子节点 (spec #12)
- [ ] 路径高亮正确: hover 任何节点 -> 整条路径全亮 + accent stroke 3px + 非路径 dimmed (spec #13, KD5)
- [ ] hover 切换平滑: hover 从 X 移到 Y -> 直接切换, expoOut 200ms transition, 无中间态 (02-design DT State Table row 5)
- [ ] Conclusion 强调: emerald 背景 + shadow, 与 question/factor 视觉可区分 (spec #14, KD4)
- [ ] 路径描述: 右侧面板实时显示 "Node Label -> Branch Label -> ... -> Conclusion Label" (spec #15)
- [ ] 不平衡树 fallback: >5 siblings 时 gap 64px + 水平滚动可用 (spec #15b)
- [ ] 移动端缩进竖向列表: indent = level * 24px (spec #15b)
- [ ] 移动端 overlay sticky: tap 路径高亮 overlay 不随滚动消失 (spec #15c)
- [ ] prefers-reduced-motion: 跳过入场, 即时切换, outline hover (general #7)
- [ ] 响应式三断点: desktop >=1024, tablet 768-1023, mobile <768 (general #4)
- [ ] WCAG AA: 所有文字 >=4.5:1, 所有 UI >=3:1 (spec #7)
- [ ] Schema 注释 + 技术选型树示例数据完整 (spec #5, #8)
- [ ] Error boundary: 0 edges 不崩溃 (general #3)
- [ ] Mobile tap node 关闭 overlay: tap X 按钮 -> hoveredNode=null, overlay dismiss (Row 7)
- [ ] Mobile tap 另一个 node: 先关闭旧 overlay 再高亮新路径, hoveredNode=newNodeId, 无中间态 (Row 8)
- [ ] URL sanitization: cta.href 渲染前通过 sanitizeUrl 过滤, javascript: URI 被阻止
- [ ] Schema cta 字段名使用 `href` (not `target`), 与 flow_explainer.jsx 一致

---

### T6: Update load-manifest.json + Detection Keywords

**Priority:** P0 | **Complexity:** S (~0.5h) | **Parallel:** Unsafe (depends on T4+T5 file paths) | **Depends:** T4 + T5

**Description:**
在 `load-manifest.json` 的 `interactive-explainer` taskType 中新增 2 个模板关联 + 检测关键词补充。

**Changes to `interactive-explainer` taskType:**

```json
"interactive-explainer": {
  "description": "Interactive explainer pages, flow diagrams, product process explainers, comparison explainers, decision trees, 交互式解释页面, 流程解释, 交互式流程图, 解释页面, 产品流程图, 技术解释, 对比解释, 决策树",
  "detect": {
    "anyKeywords": [
      "interactive explainer", "interactive flow diagram", "explain how",
      "product flow diagram", "system flow explainer", "interactive process",
      "compare", "comparison", "versus", "decision tree", "tech selection", "choose between",
      "交互式解释", "流程解释", "交互式流程图", "解释页面", "产品流程图", "技术解释",
      "对比", "比较", "versus", "决策树", "选型"
    ]
  },
  "references": [
    "references/explainer-interaction-patterns.md",
    "references/explainer-node-graph-visuals.md",
    "references/react-setup.md"
  ],
  "templates": [
    "templates/flow_explainer.jsx",
    "templates/compare_explainer.jsx",
    "templates/decision_tree.jsx"
  ]
}
```

**Keyword conflict avoidance:**
- "interactive flow" 不加入 (与 interactive-prototype taskType 冲突)
- "vs" 不加入英文关键词 (假阳性风险高: "React vs Vue" 可匹配但 "best practice vs alternative" 会误触发; 改用 "versus"/"comparison"/"compare" 更安全)
- "vs" 不加入中文关键词 (同理; 改用 "对比"/"比较" 更安全)
- Layer 相关关键词已移除 (layer_explainer 已推到 v0.3, 不在本版本关键词范围)
- Compare/DT 关键词不与 data-visualization / design-system-architecture 重叠

**Verification:**
- [ ] JSON 语法正确
- [ ] detect 关键词不与 interactive-prototype / data-visualization / design-system-architecture 重叠
- [ ] references 包含 react-setup.md (与其他 React 模板 taskType 一致)
- [ ] references 和 templates 路径指向已存在的文件 (T4/T5 完成后)
- [ ] description 中英双语覆盖 compare/DT 语义
- [ ] templates 数组新增 2 个条目

---

### T7: Update SKILL.md + README.md + references/workflow.md

**Priority:** P0 | **Complexity:** M (~1.5h) | **Parallel:** Unsafe | **Depends:** T6

**Description:**
同步更新 SKILL.md、README.md、references/workflow.md 三个行为契约文件（check-behavior-contract.sh 要求三文件必须在同一 change 中同步更新）。

**SKILL.md changes:**

1. Routing Table 新增行（interactive-explainer 扩展）:

| Task type | Load reference | Copy template | Verify focus |
|-----------|---------------|---------------|-------------|
| **Interactive explainer -- Flow** | `explainer-interaction-patterns.md` + `explainer-node-graph-visuals.md` + `react-setup.md` | `flow_explainer.jsx` | Step-by-step playback + hover/tap interaction + responsive |
| **Interactive explainer -- Compare** | `explainer-interaction-patterns.md` + `explainer-node-graph-visuals.md` + `react-setup.md` | `compare_explainer.jsx` | Overview + dimension switching + hover/tap detail + dual encoding + responsive |
| **Interactive explainer -- Decision Tree** | `explainer-interaction-patterns.md` + `explainer-node-graph-visuals.md` + `react-setup.md` | `decision_tree.jsx` | Full-tree + hover path highlighting + conclusion emphasis + responsive |

2. Route-Shaping Questions 补充 explainer 判断:
   - "对比/比较/versus 两个方案" + "交互" -> interactive-explainer (compare)
   - "决策树/选型/技术选型" + "交互" -> interactive-explainer (decision_tree)
   - "解释流程/机制/架构" + "交互" -> interactive-explainer (flow)
   - "可点击原型" + "产品演示" -> interactive-prototype (不是 explainer)
   - "图表/数据展示" -> data-visualization (不是 explainer)
   - "分层架构/层次" + "交互" -> interactive-explainer (目前走 flow, v0.3 后走 layer) -- 注意: 本版本 (v0.2) 不包含 layer_explainer 关键词

**README.md changes:**
- 在支持的任务类型列表中新增 "Compare Explainer" + "Decision Tree Explainer" + 简短描述

**references/workflow.md changes:**
- 补充 interactive-explainer 的子模板路由逻辑（flow vs compare vs decision_tree 判断规则）

**Verification:**
- [ ] Routing Table 行格式与现有行一致
- [ ] 路由判断逻辑与 load-manifest.json 对齐
- [ ] README.md 已更新
- [ ] references/workflow.md 已更新
- [ ] SKILL.md + README.md + workflow.md 在同一 change 中同步更新 (CLAUDE.md release rule #3)

---

### T8: Update exit-conditions.md

**Priority:** P1 | **Complexity:** S (~0.5h) | **Parallel:** Safe with T7 | **Depends:** None (但建议在 T7 同一 change 中提交以保持一致性)

**Description:**
在 `references/exit-conditions.md` 新增 `Interactive Explainer -- Compare` 和 `Interactive Explainer -- Decision Tree` 验收条件。

**Content:**

**Interactive Explainer -- Compare:**
- [ ] Overview 模式正确: 进入时默认 overview, verdict badge + diff summary + diff count 可见
- [ ] 维度切换流畅: 4-phase animation sequence 正确, items 和 connections 过渡无跳跃
- [ ] Hover 详情正确: hover/tap item -> detail 浮层 + 关联连线高亮 + 其他项 dimmed
- [ ] Dual encoding: 每个 item 卡片同时显示 kind color + kind icon + kind text
- [ ] Score 可视化: 5-dot system, score=0 隐藏
- [ ] Mobile 降级: 两列竖排 + tab 横滑 + tap-to-inspect, 无 hover-only 内容
- [ ] WCAG AA: 所有文字 >= 4.5:1, 所有 UI >= 3:1, kind 不依赖单一颜色

**Interactive Explainer -- Decision Tree:**
- [ ] 全景展开正确: 所有节点和分支同时可见, BFS 布局不重叠, 父节点居中于子节点
- [ ] 路径高亮正确: hover 任何节点 -> 整条路径全亮 + accent stroke 3px + 非路径 dimmed
- [ ] Conclusion 强调: emerald 背景 + shadow, 与 question/factor 视觉可区分
- [ ] 路径描述: 右侧面板/底部 overlay 实时显示 node label 路径描述
- [ ] 不平衡树 fallback: >5 siblings 时 gap 64px + 水平滚动可用
- [ ] Mobile 降级: 缩进竖向列表 + tap-to-inspect + sticky overlay
- [ ] WCAG AA: 所有文字 >= 4.5:1, 所有 UI >= 3:1

**Verification:**
- [ ] 格式与现有 exit-conditions 条目一致
- [ ] Compare 验收条件覆盖 spec #9-#11c
- [ ] DT 验收条件覆盖 spec #12-#15c

---

### T9: VERSION Bump + Behavior Contract Verification

**Priority:** P0 | **Complexity:** S (~0.5h) | **Parallel:** Unsafe | **Depends:** T7 + T8

**Description:**
1. 更新 `VERSION` 文件（当前 0.6.0 -> 0.7.0，因为 v0.2 是功能扩展版本）
2. 运行 `scripts/check-behavior-contract.sh` 验证行为变更合规（脚本通过因为 VERSION 已提升 (0.6.0->0.7.0)。注意：脚本通过不意味着变更不是行为性的——它只验证 VERSION 与行为契约文件变更匹配。路由条目增加是行为变更（改变了 first-turn 加载路径），所以 VERSION bump 是正确且必要的。）
3. 按 CLAUDE.md 发布规则检查:
   - VERSION 已更新
   - 用户文档（install/upgrade flow）已更新（如适用）
   - SKILL.md + README.md + workflow.md 在同一 change 中对齐
   - exit-conditions 已更新

**Verification:**
- [ ] VERSION 已更新 (0.6.0 -> 0.7.0)
- [ ] check-behavior-contract.sh 通过
- [ ] CLAUDE.md 发布清单全部完成

---

### T10: Browser Acceptance Test

**Priority:** P0 | **Complexity:** L (~2h) | **Parallel:** Unsafe | **Depends:** T4 + T5 + T9

**Description:**
用 5 个不同 prompt 测试完整链路，验证 schema 遵循率 >= 4/5。由 AI 执行测试，浏览器截图验证。

**Test prompts:**
1. "做一个 React vs Vue 对比解释页面"（Compare 核心场景，中文）
2. "Create an interactive comparison of AWS vs GCP cloud services"（Compare 英文）
3. "做一个技术选型决策树"（DT 核心场景，中文）
4. "Make a decision tree for choosing between Node.js, Python, and Go for backend development"（DT 英文）
5. "对比 Docker vs Kubernetes 的部署策略"（Compare + DT 混合倾向，中文）

**对每个测试验证:**
- 路由是否正确识别为 interactive-explainer（不是 interactive-prototype / data-visualization）
- 子模板路由是否正确（compare vs decision_tree）
- 参考文档和模板是否正确加载
- 生成的 HTML 是否无控制台错误
- 主交互是否正常（Compare: 维度切换 + hover; DT: 全景展开 + 路径高亮）
- 响应式布局是否正确
- Schema 是否被正确遵循（subjects/dimensions/items/connections 或 nodes/edges 字段完整，引用关系正确）

**Schema 遵循率计算:** 每个测试检查 5 项（数据结构完整、字段引用正确、交互模型匹配、响应式布局正确、无控制台错误），全部通过 = 遵循。>=4/5 通过。

**Verification:**
- [ ] 5/5 测试通过，或 >=4/5 通过 + 失败的有明确修复路径

---

## Dependency Graph

```
T0 (Compare spike) ───────────┐
                               │
T1 (DT spike) ────────────────┤
                               ├──► T4 (compare_explainer.jsx) ──┐
T2 (ref: interaction patterns) ├──► T4 + T5                      ├──► T6 (manifest) ──► T7 (SKILL+README+workflow) ──► T9 (VERSION)
                               │                                  │
T3 (ref: node-graph visuals)  ├──► T4 + T5                      │
                               │                                  │        T8 (exit-conditions) ──► T9
T1 (DT spike) ────────────────┤                                  │
                               ├──► T5 (decision_tree.jsx) ──────┘
T2 (ref: interaction patterns) ┤
                               │                                  T9 ──► T10 (acceptance test)
T3 (ref: node-graph visuals)  ┘                                  T4+T5 ──► T10
```

**Simplified wave view:**

```
Wave 1:  T0 ──► T4  (spike gate)
         T1 ──► T5  (spike gate)
         T2 ──► T4+T5 (ref gate)
         T3 ──► T4+T5 (ref gate)

Wave 2:  T4 ──► T6   [GATE: T0+T1 pass + T2/T3 ref consistency check]
         T5 ──► T6

Wave 3:  T6 ──► T7
         T8 (parallel with T7)

Wave 4:  T7+T8 ──► T9
         T9 ──► T10
```

---

## Parallel Execution

**Wave 1 (all parallel-safe):** T0 + T1 + T2 + T3
- T0/T1 是独立的 spike，不同模板方向
- T2/T3 是独立的 ref 文档更新，不同内容方向
- 4 个任务可同时执行

**Wave 2 (T4/T5 can parallel, each gated by own spike + refs):**
- **Wave 2 前置条件**: T0+T1 spike 全部通过 + T2+T3 参考文档一致性检查（对比两个文档的参数：stroke width、node size、timing constants、颜色值是否一致，不一致时优先遵循 T3 visuals 参数）
- T4 依赖 T0 spike 通过 + T2/T3 完成
- T5 依赖 T1 spike 通过 + T2/T3 完成
- T4 和 T5 是不同文件，可以由不同 agent 并行开发
- 但每个模板内部是串行工作（组件逐步构建）

**Wave 3 (T6 serial, T7 serial, T8 parallel with T7):**
- T6 依赖 T4+T5 完成（需要模板文件路径存在）
- T7 依赖 T6 完成（需要 manifest 关键词与 SKILL 路由对齐）
- T8 与 T7 无依赖关系，可并行执行
- 但建议 T7+T8 在同一 git change 中提交（行为契约同步）

**Wave 4 (serial):**
- T9 依赖 T7+T8 完成
- T10 依赖 T4+T5+T9 完成

---

## Complexity Summary

| Task | Complexity | Est. Lines | Est. Time | Risk |
|------|-----------|------------|-----------|------|
| T0 | S | ~100 lines HTML | 1-2h | Medium -- 布局+连线验证，可能需要回退 |
| T1 | S | ~100 lines HTML | 1-2h | Medium -- BFS 布局+路径高亮验证，可能需要回退 |
| T2 | S | ~150 lines incremental | 1h | Low -- 纯文档增量 |
| T3 | S | ~100 lines incremental | 1h | Low -- 纯文档增量 |
| T4 | L | 1400-1700 lines JSX | 4-5h | High -- Compare 首个交互模板，维度切换+overview+connections 复杂 |
| T5 | L | 1300-1600 lines JSX | 4-5h | High -- DT 首个交互模板，BFS 布局+路径高亮+conclusion shadow 复杂 |
| T6 | S | ~30 lines JSON | 0.5h | Low -- JSON 配置 |
| T7 | M | ~100 lines total (3 files) | 1.5h | Medium -- 三个文件同步，路由判断逻辑需精确 |
| T8 | S | ~50 lines incremental | 0.5h | Low -- 文档增量 |
| T9 | S | 1 line VERSION + script | 0.5h | Low -- 版本号+脚本 |
| T10 | L | -- (5 test scenarios) | 2h | High -- 5 个 e2e 测试场景，schema 遵循率门控 |

**Total estimated time: ~14-16h**

---

## Acceptance Criteria Source Mapping

| Verification Item | Spec Criterion | Design Source |
|-------------------|---------------|---------------|
| 路由识别 compare/DT | Spec #1 | -- |
| 功能完整（维度切换/全景展开） | Spec #2 | KD2 (Compare), KD5-KD6 (DT) |
| 无控制台错误 | Spec #3 | -- |
| 响应式三断点 | Spec #4 / General #4 | 02-design Layout sections |
| Schema 遵循率 >= 4/5 | Spec #5 | -- |
| 品牌/质量/anti-slop | Spec #6 / #8 | -- |
| 无障碍 (WCAG AA, reduced-motion, keyboard) | Spec #7 / General #7 | L2-01 through L2-05, L1-16, Inf-3 |
| 维度切换流畅 | Spec #9 | KD2 animation sequence |
| Hover 详情正确 | Spec #10 | KD3 (Compare), KD5 (DT) |
| 跨对象连线 | Spec #11 | KD2 connections, Inf-3 |
| Overview 模式 | Spec #11b | KD1 verdict badge + diff summary |
| Overview->dimension 动画 | Spec #11c | KD2 4-phase sequence |
| 全景展开正确 | Spec #12 | KD6 BFS layout, Inf-6 |
| 路径高亮正确 | Spec #13 | KD5 full path highlight, Inf-5 |
| Conclusion 显示 | Spec #14 | KD4, Inf-4 |
| 路径描述 | Spec #15 | 02-design DT State Table row 3 |
| 不平衡树 | Spec #15b | KD6 >5 siblings fallback |
| 移动端 sticky overlay | Spec #15c | 02-design DT mobile layout |
| 入场动画参数一致 | General #1 | L1-01, Inf-7 |
| Dimming 参数一致 | General #2 | L1-05, L1-21 |
| prefers-reduced-motion | General #7 | L1-16 |
| 触控目标 >= 48x48px | General #6 | L1-14 |

---

## Risk Notes

1. **T0/T1 spike 失败回退**: 如果 HTML+SVG 混合架构验证不通过，回退到纯 SVG 方案。纯 SVG 方案的节点交互性较弱，但连线渲染更可控。回退方案需要重新评估模板架构。

2. **T4 Compare connections 复杂度**: 跨对象连线（从 A 列项到 B 列项）的坐标计算比 flow 的单向连线更复杂，因为需要处理两列的不同滚动/位移状态。T0 spike 验证此项。

3. **T5 DT BFS 布局父节点居中**: BFS 布局不自动居中父节点 (L2-07)。手动居中计算需要在 JS 中实现 parentX = (minChildX + maxChildX) / 2，这是 T1 spike 的关键验证项。

4. **T6-T7 关键词冲突**: compare/comparison/versus 关键词需要仔细检查不与 interactive-prototype / data-visualization 重叠。T6 verification 明确检查此项。注意 "vs" 已排除 (假阳性风险)，改用 "versus"/"comparison"/"compare"。

5. **T9 VERSION bump**: 当前 VERSION=0.6.0，v0.2 是功能扩展版本，应 bump 到 0.7.0。如果 v0.1 的 VERSION 已经是 0.6.0（即 v0.1 release 时从 0.5.1 -> 0.6.0），则 v0.2 -> 0.7.0。