# Design Review Comments: Explainer Extensions v0.2

Reviewer: Design Review Agent
Date: 2026-05-11
Document: `docs/features/20260511-explainer-extensions/02-design.md`
Cross-referenced: `01-spec.md`, `explainer-interaction-patterns.md` (v0.1), `explainer-node-graph-visuals.md` (v0.1)

---

## Blocking

### B-01: Compare 缺少完整状态机描述

02-design.md 定义了 entering/ready 顶层框架 (spec Section 6 状态机)，但 Compare 的 ready phase sub-states `{ dimension: string | "overview", hoveredItem: string | null }` 只有变量声明，没有完整的状态转换表。

v0.1 flow_explainer 在 `explainer-interaction-patterns.md` Section 2 有 11 行完整状态转换表 (entering->ready, ready+step=N->step=N+1, ready+hover 等)，覆盖每个触发器、目标状态和行为。02-design.md 的 Compare 模板没有等价物。

具体缺口:
- overview 状态下 hover verdict badge 的转换是什么？(hoveredItem 设为 verdict id? 或 verdict badge 不是 item？)
- overview 状态下 hover 差异概要项的转换是什么？
- dimension 状态下 hover item -> hoveredItem=id, 但 hover 结束恢复的完整行为描述缺失
- dimension 状态下切换到另一个 dimension 且 hoveredItem 存在时，hoveredItem 是否清除？KD2 只描述了视觉序列，没有描述状态变量变更
- entering phase 中用户输入跳过入场后，dimension 是否强制设为 "overview"？(spec 说"默认 overview"，但状态转换表没有覆盖)
- mobile tap-to-inspect 的 dismiss 机制 (tap outside / X button) 触发什么状态转换？

**无法进入 /plan 的原因**: 实现者无法仅从 KD1-KD7 和 spec 推导出 Compare 的完整行为逻辑。状态机是交互设计的核心产出物，缺失等于交互设计未定稿。

### B-02: Decision Tree 缺少完整状态机描述

与 B-01 相同问题。DT 的 ready sub-states `{ hoveredNode: string | null, highlightedPath: string[] }` 只有变量声明。

具体缺口:
- hover 节点时 highlightedPath 的计算逻辑在 KD5 有描述 (parent-pointer traversal)，但这是一个实现细节，不是状态转换。状态转换表应描述: 从 ready+hoveredNode=null 到 ready+hoveredNode=id 的触发条件、到状态、视觉行为
- hover 节点时，如果用户同时切换到另一个节点（从一个节点移到相邻节点），是否有中间状态或平滑过渡？
- mobile tap 节点后，tap 另一个节点时，是先 dismiss 当前 overlay 再高亮新路径，还是路径直接切换？
- entering phase 中用户输入跳过后，hoveredNode 是否强制 null？
- tap-to-inspect overlay 的 sticky 行为 (spec Section DT mobile) 在状态机中如何表达？

**无法进入 /plan 的原因**: 与 B-01 相同。

### B-03: Compare Overview hover 的状态归属未定义

Overview 模式有三种可 hover 元素: verdict badge、差异概要项、(无 connections)。但 `hoveredItem` 的类型定义是 `string | null`，与 dimension 模式的 item hover 共用同一个变量。

问题: hoveredItem 在 overview 模式下 hover verdict badge 时应该设什么值？verdict badge 不是 items 数组中的元素 (items 的 id 格式是 `react-performance-1`)。如果 hoveredItem 只能引用 item id，则 verdict badge hover 无法被状态机表达。

如果 verdict badge hover 用另一个变量 (如 hoveredVerdict)，需要在状态机中定义。如果 hoveredItem 可以是 verdict id，需要在 schema 或状态定义中说明值域扩展。

### B-04: Compare 维度切换时 hoveredItem 状态处理未定义

KD2 描述了维度切换的动画序列，但没有说明切换时 hoveredItem 的状态变更:
- 如果用户在 dimension A hover 了 item X，然后点击 dimension B 标签，hoveredItem 是否清除？保留(指向一个在新维度中不存在的 id)？
- 如果清除，用户 hover 上下文是否丢失？
- 如果不清除，新维度中不存在该 id 时，视觉行为是什么？

这是一个交互逻辑决策，不是实现细节。

---

## Important

### I-01: Compare Overview 维度的差异概要筛选逻辑需要锁定

KD1 定义 overview "仅显示有差异的项 (kind 不同 or score 差距 >= 2)"。但这个筛选逻辑在设计中只出现一次，且:
- "kind 不同"的比较方式未定义：两个 subject 在同一 dimension 下可能有多个 items，是逐 item 比较 (逐行比较同 dimension 下 A 的 item 和 B 的 item)，还是按 kind 统计比较 (A 在这个 dimension 有 2 pro 1 con，B 有 1 pro 2 con)?
- spec Section Compare Overview 说 "仅显示有差异的项"，但没有定义"差异"的判定规则。02-design.md 补充了 "kind 不同 or score 差距 >= 2"，但缺少逐 item 匹配逻辑 (items 按 subjectId + dimensionId 分组后，如何判断 A 的 item 和 B 的 item 是否"对应"？)
- 02-design.md 是设计阶段，应锁定这个逻辑的规则定义，留给 /plan 的只是实现细节

### I-02: Compare pro/con 颜色在 item 卡片背景上的对比度验证不完整

KD3 和 `explainer-node-graph-visuals.md` Section 4 给出了 kind 颜色在 #FAFAFA 背景上的对比度。但 item 卡片的文字颜色规则是:
- pro/con/highlight items: #1F2937 (dark text on colored bg)
- neutral items: #FFFFFF (white text on gray bg)

这些对比度计算的是 text-on-kind-color-background，不是 text-on-#FAFAFA。KD3 的表格只列出了 "Contrast on #FAFAFA"，没有列出:
- #1F2937 on #10B981 (pro item: dark text on emerald bg) 的对比度
- #1F2937 on #EF4444 (con item: dark text on red bg) 的对比度
- #1F2937 on #3B82F6 (highlight item: dark text on blue bg) 的对比度
- #FFFFFF on #6B7280 (neutral item: white text on gray bg) 的对比度

`explainer-node-graph-visuals.md` Section 4.1 有 v0.1 的同类对比度数据 (input=#3B82F6 + #1F2937 = 4.35:1, process=#6B7280 + #FFFFFF = 4.56:1, output=#10B981 + #1F2937 = 4.87:1, decision=#F59E0B + #1F2937 = 6.32:1)。但 #1F2937 on #EF4444 (新增 con 颜色) 和 #1F2937 on #10B981 (pro 颜色与 v0.1 output 颜色相同) 的对比度需要明确计算和列出。

L4-09 只给出了 #EF4444 on #FAFAFA = 4.56:1 和 #10B981 on #FAFAFA = 4.87:1，这是 kind 颜色对背景的对比度，不是 item 卡片内文字对背景的对比度。

**Impact**: item 卡片内文字对比度是 WCAG AA 的硬约束 (Design Boundaries #2)。如果不计算和锁定，/build 可能产出不合规的实现。

### I-03: Compare item 卡片的视觉设计不完整

KD3 定义了 kind 颜色、icon、text label、score dots，但没有定义:
- item 卡片的整体布局: icon + label + score dots 在卡片内的排列方式 (水平？垂直？icon 左上角 label 居中 score 底部？)
- 卡片背景色: 是 kind 颜色作为整卡背景，还是 #FAFAFA 白底 + kind 颜色作为左边色条 (与 verdict badge 类似)？
- 卡片尺寸: spec 说 "min 120x48px, max 200x72px"，但这些是尺寸范围，不是排版参数
- score dots 和 detail text 在卡片内的空间分配

Compare 的核心视觉元素是 item 卡片，它的内部排版应在设计阶段锁定。

### I-04: DT entry animation 的 edge 绘制时机描述模糊

KD7 定义 DT entry: "nodes fade + translateY per BFS level -> edges draw 600ms after last level starts"。但:
- "last level" 是最深的一层还是最后开始入场的一层？(BFS 从根到叶，最后一层是叶子层)
- 600ms delay 是从 "last level starts entrance" 还是 "last level completes entrance"？
- v0.1 flow_explainer 的定义是 "200ms delay after last node begins its entrance" (L1-02)，不是 600ms。02-design.md 说 "600ms after last level starts"，这个数字与 v0.1 的 200ms delay + 600ms duration 不同

需要澄清: edge draw 的 delay = 200ms after last level starts (与 v0.1 一致) 还是 600ms after last level starts？duration 应为 600ms (与 v0.1 一致)。

### I-05: Compare 连线 (connections) 在维度模式的视觉参数不完整

KD2 和 spec 定义了 connections 的动画序列，但缺少:
- connections 的 stroke 颜色: 是 neutral gray (#6B7280)？是两个 subject 的 accentColor 渐变？是 kind 颜色？
- connections 的 arrowhead: Compare 的 connections 是否需要 arrowhead？(spec 说 "跨对象连线"，方向性取决于 fromSubjectId/toSubjectId)
- connections 的 path geometry: 是直线？cubic bezier (与 v0.1 edge 一致)？
- connections 的 label 位置: spec schema 有 label 字段，但位置未定义
- connections 的 dashed line for neutral: spec Section Compare 视觉参数说 "dashed 当 neutral"，但 02-design.md 没有定义什么情况下 connection 的 kind 是 neutral

### I-06: DT 路径描述文本格式未在设计阶段锁定

spec Section DT 交互定义说 "格式：Root question -> branch label -> next node -> ... -> conclusion"。02-design.md 的 Design Boundaries #8 说 "路径描述: Root -> branch -> ... -> node 格式"。

两个格式不一致:
- spec 格式包含 node label (如 "Root question")
- 02-design.md 格式只包含 node kind (如 "Root")

路径描述是右侧面板/底部 overlay 的核心内容元素，应在设计阶段锁定具体格式。

### I-07: 02-design.md 缺少 Compare 和 DT 的排版 (Layout) 详细设计

02-design.md 有 Evidence Layers、Pattern Synthesis、Design Inferences、KD1-KD7、Design Boundaries、Adopt/Reject Matrix，但没有排版设计的独立章节。

审查维度 4 (排版) 要求 "响应式三断点的布局变化是否有完整描述"。当前 02-design.md 的布局信息分散在:
- KD1 (verdict badge 位置)
- KD6 (BFS 布局参数)
- spec (ASCII layout diagrams)
- v0.1 references (断点定义)

但缺少:
- Compare 三个断点的完整 layout 变化描述 (spec 有 ASCII 图但 02-design.md 没有引用或补充)
- DT 三个断点的完整 layout 变化描述 (同上)
- Compare item 卡片在三个断点下的排列方式变化 (desktop: 两列并排竖排; tablet: 两列更窄; mobile: 两列竖排)
- DT 节点在 tablet 断点下的具体间距调整 (spec 说 "树区域水平压缩，节点间距减小"，但减小到多少？)

排版是设计阶段的核心产出物之一，不应完全依赖 spec 的 ASCII 图。

### I-08: 02-design.md 缺少剧本 (Script) 设计

审查维度 5 要求 "用户交互序列是否有完整描述 (entering->ready->primary->hover)"。

02-design.md 的 Inf-7 描述了入场动画方向，但缺少完整的用户交互序列剧本:
- Compare 用户旅程: page load -> entering animation (or skip) -> ready+overview -> click dimension tab -> ready+dimension -> hover item -> detail overlay -> hover end -> restore dimension view
- DT 用户旅程: page load -> entering animation (or skip) -> ready+full-tree -> hover node -> path highlight + panel update -> hover end -> restore full-tree

v0.1 的 `explainer-interaction-patterns.md` 用完整状态转换表隐含地描述了这个旅程。02-design.md 的 KD 和 Inf 是设计决策，不是交互序列剧本。

### I-09: DT conclusion shadow 与 v0.1 flat 原则的冲突需要更明确的设计判断

KD4 说 conclusion 加 shadow "0 2px 8px rgba(16,185,129,0.25)"，而 L1-08 明确说 "no border/shadow (flat)"。Inf-4 解释了原因 (conclusion 是终点需要强调)，但这个设计判断实际上是对 L1-08 原则的例外。

02-design.md 应更明确地标注这是一个有意识的例外 (override)，而不是隐含地假设读者会从 Inf-4 推导出这一点。在 Adopt Matrix 中，A-10 说 "flat design language preserved" -- 这与 conclusion 加 shadow 是矛盾的。A-10 的 "preserved" 应改为 "preserved for question/factor; conclusion is intentional exception"。

---

## Suggestion

### S-01: Evidence Layers 的 Ref ID 编号可以更系统化

L1 层的 Ref ID 从 L1-01 到 L1-23，L2 从 L2-01 到 L2-07，L3 从 L3-01 到 L3-17，L4 从 L4-01 到 L4-09。编号连续且唯一，可追溯性良好。

但 L3 层的来源描述混合了 "Baymard Institute comparison UX research" (L3-01) 和 "Versus.com, G2.com pattern analysis" (L3-03)。前者是研究机构数据，后者是产品模式分析。如果按 Enterprise Product Patterns / Official Systems / Methods / Anti-patterns / Local Project Truth 的分层要求，L3 应进一步细分 (pattern analysis vs research data vs product examples)。

当前 L3 层全部标注为 "Enterprise Patterns -- 外部扫描 + 补充搜索"，没有区分产品模式 (L3-03, L3-05)、研究数据 (L3-01, L3-02)、交互方法 (L3-14, L3-17)。建议在 L3 内部添加子分类标签。

### S-02: Pattern Synthesis 的冲突模式提炼可以更显式

PS-1 到 PS-7 都是正面综合 (从多个来源推导出设计方向)。缺少冲突模式的显式提炼:
- L2-06 (Reingold-Tilford 最优) vs L4-06 (无外部库) 的冲突 -> PS-5 解决了 (选择 BFS)，但冲突本身没有被显式标注
- L3-09 (decision vs leaf visual distinction) vs L1-08 (same shape, color encodes kind) 的冲突 -> Inf-4 解决了 (shadow 而不是 shape)，但冲突本身没有被标注
- L3-12 (green/red CVD 问题) vs L4-09 (对比度通过 AA) 的冲突 -> PS-3 解决了 (dual encoding)，但 green/red 是否仍然作为默认颜色？如果用户不覆盖品牌色，CVD 用户看到的 pro/con 是绿色/红色 + icon + text，这是否足够？

建议在 Pattern Synthesis 中添加 "Conflict Patterns" 子章节，显式标注每个冲突及其解决方向。

### S-03: Unknowns 表的 U-07 和 U-08 可以部分在设计阶段解决

U-07 (verdict badge 位置: column header vs floating/sticky vs inline) -- KD1 已经决定了 "每个 subject 列顶部，紧跟列标题下方"。这个 unknown 可以从表中移除或标注为 "已由 KD1 解决，观察 v0.2 反馈"。

U-08 (hover cross-highlight: row vs column vs both) -- KD1 和 A-17 定义了 "both (row + column) on desktop; row-only on mobile"。这个 unknown 同样可以标注为已解决。

### S-04: Approval Criteria 可以增加动画序列的具体验收点

Compare Approval Criteria #2 说 "维度切换流畅: 4-phase animation sequence 正确"。建议补充:
- Phase 1 时长 <= 200ms
- Phase 2 时长 <= 300ms + stagger 50ms
- Phase 3 时长 <= 600ms
- 总时长 overview->dimension <= 1200ms, dimension->overview <= 700ms

DT Approval Criteria 缺少入场动画验收点:
- 入场方向: translateY (不是 translateX)
- 入场序列: BFS level 顺序 (根先)
- Edge draw delay: (需要先解决 I-04)

### S-05: Not-Doing List 与 spec "不做" 清单的对齐检查

02-design.md 的 Not-Doing List 与 spec Section "不做" 基本对齐，但有两处差异:
- spec "不做" 包含 "PixiJS / Canvas / WebGL"，02-design Not-Doing 没有列出
- spec "不做" 包含 "自由拖拽编辑器" 和 "叙事编排 pipeline"，02-design Not-Doing 没有列出
- spec "不做" 包含 "独立 JSON Schema 文件"，02-design Not-Doing 没有列出

这些是 spec 已声明的不做项，02-design 应明确列出或标注 "spec 不做项继承，不重复列出"。当前 Not-Doing List 只列出了设计阶段新增的不做项 (如 diamond shape, glow)，没有覆盖 spec 的不做项。

### S-06: DT BFS 布局的 "父节点居中" 补充描述可以更精确

Inf-6 和 KD6 说 "父节点 x 居中于其子节点群中心: parentX = (minChildX + maxChildX) / 2"。这个公式对于叶子节点 (无子节点) 不适用 -- 叶子节点没有子节点群来居中。

需要补充: 叶子节点的 x 位置由其在同层 sibling 中的顺序决定 (与 BFS 同层均匀分布一致)。只有有子节点的非叶子节点才使用居中公式。

另外，如果一个父节点只有一个子节点，parentX = childX，这时父节点和子节点在同一 x 位置，视觉上是否需要偏移？

---

## Summary

| Level | Count | Key Theme |
|-------|-------|-----------|
| Blocking | 4 | Compare 和 DT 都缺少完整状态机描述; overview hover 和维度切换时 hover 状态处理未定义 |
| Important | 9 | 对比度验证不完整; item 卡片排版缺失; 连线视觉参数缺失; 排版和剧本章节缺失; shadow 例外标注不清 |
| Suggestion | 6 | 证据子分类; 冲突模式显式; unknowns 更新; 验收点细化; not-doing 对齐; BFS 居中补充 |

**Conclusion**: 02-design.md 的证据体系 (L1-L4)、Pattern Synthesis (PS-1-PS-7)、Design Inferences (Inf-1-Inf-7)、Adopt/Reject Matrix 结构完整且来源可追溯。但 Compare 和 DT 的交互设计尚未定稿 -- 缺少完整状态转换表是 Blocking 级别问题，直接阻碍 /plan 的实施。排版设计和剧本设计作为设计阶段的核心产出物也应补充至 Important 级别。