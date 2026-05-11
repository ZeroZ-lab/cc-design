# Design Review: Interactive Explainer

> Reviewer: Design Reviewer | Date: 2026-05-11 | Target: `02-design.md` vDraft
> Spec: `01-spec.md` (Final) | External Scan: `external-scan-results.md`
> Scout Feedback: `scout-design-feedback.md`, `scout-ceo-feedback.md`

---

## Blocking Issues

### B1. Design References 未按要求的分层结构组织

`02-design.md` 的 Design References 分为 "cc-design 内部参考" 和 "External Sources" 两层，但审查维度要求的分层标准是：

- Enterprise Product Patterns
- Official Systems / Methods
- Anti-patterns
- Local Project Truth

当前分层无法区分来源的权威层级。例如，Stripe 产品页（企业产品模式）和 Nielsen Norman Group（研究方法）被放在同一个 "External Sources" 表格中，没有标明各自的证据权重。React Flow 是一个第三方库，其交互模式应归类为 "Enterprise Product Patterns" 还是 "Official Systems" 并不清晰，但设计稿未做区分。

**证据**: Stripe、Vercel、React Flow、Structurizr、Excalidraw、NN/g 这六个来源全部平铺在同一个表格里，没有任何层级标注。

**修复**: 按 Local Project Truth (cc-design references) > Official Systems/Methods (NN/g, Tufte) > Enterprise Product Patterns (Stripe, Vercel, React Flow) > Anti-patterns 重新组织 Design References 表格，并在每个 Adopt/Reject 条目中注明来源层级。

---

### B2. Focus+Context 策略与 cc-design animation-best-practices 3.8 直接矛盾

`animation-best-practices.md` Section 3.8 明确要求 Focus Switch = opacity + brightness + **blur(4-8px)**，并强调 "blur is mandatory -- without blur, non-focus elements are still sharp, visually they haven't moved to the background"。

但 `02-design.md` 的 Pattern Synthesis 第 3 条明确写道 "不使用 blur（移动端性能问题，Design Scout 反馈采纳）。纯 opacity 降级足够清晰。"

这不是一个无所谓的取舍。这是对 cc-design 已有设计铁律的直接违反，且设计稿中的理由 ("移动端性能问题") 没有给出任何量化证据：

- 移动端 8 个节点中最多 7 个需要 dimming，blur(4px) 在现代移动浏览器上对 7 个 HTML div 的性能影响是什么？没有 benchmark。
- External Scan F3.6 明确记载 "CSS filter: blur() on SVG -- works in modern browsers, can be performance-expensive on large SVGs with many filtered elements" 但同时注明 "with max 8 nodes, applying blur to 6-7 elements is negligible performance cost"。

**证据**: `animation-best-practices.md` 第 243-247 行与 `02-design.md` 第 85 行矛盾。External Scan F3.6 第 78 行支持使用 blur。

**修复**: 二选一：(a) 采纳 blur，至少在桌面端使用 blur(4px) + opacity 的完整方案，移动端可降级为纯 opacity（并说明理由）；(b) 如果确实要全程放弃 blur，需要在 Reject 矩阵中明确列为 R-项，给出性能测试数据，并说明这是对 animation-best-practices 3.8 的有意识偏离。

---

### B3. Design Inferences 缺失 -- 关键设计决策无法回溯到证据推导

审查标准要求 "Design Inferences 是否说明了从模式和本地约束到设计判断的推导"。

`02-design.md` 没有独立的 "Design Inferences" 章节。Pattern Synthesis 提炼了 4 个模式，但这些模式到 Key Design Decisions (KD1-KD5) 之间的推导链缺失。例如：

- **KD1 调色板**: input=#3B82F6, process=#6B7280, output=#10B981, decision=#F59E0B。这四个颜色从何推导而来？没有引用 color theory、没有引用 WCAG 对比度测试结果、没有引用 data-visualization.md 的 categorical color scales 规范。这是凭感觉选色，不是证据驱动。
- **KD1 节点尺寸 "最小 96x48px"**: Spec 说 "最小 80x48px"，Design 说 "最小 96x48px"。为什么放大了 16px？没有推导。
- **KD4 入场序列 stagger 80ms**: animation-best-practices Section 4.3 定义的标准是 30ms stagger。Design 改为 80ms 的理由没有给出。

**修复**: 新增 Design Inferences 章节，为每个 KD 的关键参数标注推导链：来源证据 -> 本地约束 -> 最终参数。

---

### B4. Adopt/Reject 矩阵来源未分层，且缺少关键 Reject 条目

当前 Adopt/Reject 矩阵的 "Source" 列使用模糊标签如 "Design Scout"、"Eng Scout"、"External Scan F3.5"，但这些标签不对应 Design References 中的任何条目编号。

问题：
1. "Eng Scout 选项3" 和 "Design Scout" 在 Design References 表格中不存在，无法追溯。
2. "CEO Scout" 在 Reject R3 中出现但不在 References 中。
3. R1 (reject blur) 与 cc-design animation-best-practices 铁律矛盾，但 R1 的 Why 只说 "移动端性能差，opacity 够用"，没有提及这个矛盾。

此外，以下应有但缺失的 Reject 条目：
- **Reject React dependency**: Spec 要求 "纯 HTML/CSS/SVG/JS"，但 External Scan 中的 React Flow 被大量参考。应明确拒绝 React runtime。
- **Reject SVG viewBox auto-scaling for nodes**: KD4 的 HTML 节点 + SVG 叠加架构意味着节点不参与 SVG 缩放，但这一取舍未在 Reject 中记录。
- **Reject zoom/pan**: scout-design-feedback #10 建议的 pinch-to-zoom 被否决但未出现在 Reject 矩阵。

**修复**: (a) 让 Adopt/Reject 的 Source 列与 Design References 条目一一对应；(b) 补齐缺失的 Reject 条目；(c) R1 需要显式说明与 animation-best-practices 3.8 的矛盾并给出取舍理由。

---

## Important Issues

### I1. KD1 调色板缺少 WCAG AA 对比度验证

Design 声称 "WCAG AA 对比度" 但没有给出任何对比度计算：

- #3B82F6 (blue input) on #FAFAFA (background) -- contrast ratio 是多少？
- #10B981 (green output) on #FAFAFA -- contrast ratio 是多少？
- dimmed 状态 opacity: 0.35 时，#3B82F6 的有效颜色变为约 #A5C3FA level，对比度是多少？
- decision 节点 (#F59E0B 橙色) 在 CSS rotate 45deg 菱形内，文字是否仍可读？

`data-visualization.md` Section 4 明确要求 "Maintain contrast ratio of 3:1 for data points" 且 "Test with color blindness simulators"。设计稿引用了 data-visualization.md 但没有执行它的要求。

**建议**: 在 KD1 中补充每个 kind 色在 active 和 dimmed 状态下的对比度数值，或在 Design Inferences 中标注 "需在 /build 阶段用 contrast checker 验证"。但既然调色板是 design 阶段的定稿决策，至少应该给出计算结果。

---

### I2. KD2 状态机缺少关键状态转换和边界情况

状态机图只展示了三个状态的线性转换：

```
[Entry Animation] -> [Step Mode] -> [Hover Mode] -> [Step Mode]
```

缺失的状态转换：
1. **Entry -> Step**: 入场动画期间用户点击 next 按钮怎么办？Design 说 "任意用户输入跳过入场动画"，但 "next 按钮" 本身是在 step 面板中，入场动画期间 step 面板是否可见？如果不可见，用户无法点击 next，只能点击空白区域跳过。这个交互流程不清楚。
2. **Entry -> Hover**: 入场动画期间鼠标悬停节点怎么办？优先级说 "入场动画期间忽略 step/hover"，但如果用户在动画进行中就 hover 了，视觉上应该有反馈还是完全忽略？
3. **Hover 在最后一步时**: 如果 currentStep = lastStep 且用户 hover 某节点，CTA 是否仍显示？Hover 是否压制 CTA？
4. **步骤 0 的 prev**: prev 按钮在 step 0 时是否 disabled？视觉状态是什么？
5. **触摸屏长按**: tap-to-inspect 是否与 step navigation 的 prev/next tap 冲突？如果用户 tap 在节点上，触发 inspect 还是 step-next？

Design Scout 的第 1 条反馈明确要求 "定义明确的交互优先级栈"，设计稿虽然定义了优先级栈但没有覆盖这些边界情况。

**建议**: 补充状态转换表，列出所有 from-state + trigger -> to-state 的组合，特别是涉及触摸交互和边界步骤的情况。

---

### I3. HTML 节点 + SVG 叠加架构有未处理的渲染风险

KD5 和 Pattern Synthesis 第 4 条选择了 HTML div 节点 + SVG overlay 连线，依赖 `getBoundingClientRect()` 定位。以下边界情况未讨论：

1. **resize 时的连线抖动**: 窗口 resize 期间 `getBoundingClientRect` 连续触发，SVG path 需要频繁重绘。是否需要 debounce？还是用 ResizeObserver？设计稿只说 "窗口 resize 时重新计算连线位置" 但没说用什么机制。
2. **节点内有动态内容导致尺寸变化**: 如果节点 label 过长（比如 "Document Retrieval + Re-ranking"），节点宽度会超出 160px max，导致后续节点位置偏移，所有连线路径需要重新计算。
3. **移动端滚动时**: 垂直布局 + 可滚动容器，`getBoundingClientRect` 返回的是 viewport 相对坐标，滚动时节点位置变化，SVG overlay 是否需要 position: sticky 或随滚动更新？
4. **SVG overlay 的 pointer-events**: SVG 层覆盖在 HTML 节点上方，会阻挡节点的 hover/click 事件。需要 `pointer-events: none` 在 SVG 层 + `pointer-events: auto` 在连线上（如果连线可交互）。这个 CSS 设置在设计稿中未提及。
5. **zoom / DPR 差异**: 不同设备的 devicePixelRatio 不同，`getBoundingClientRect` 返回的是 CSS 像素，SVG 的坐标系统需要匹配。高 DPI 屏幕上连线是否模糊？

**建议**: 在 KD5 或新增的 "Rendering Constraints" 小节中明确：(a) 使用 ResizeObserver + debounce 更新连线；(b) SVG overlay 设置 pointer-events: none；(c) 移动端滚动场景下的坐标系处理方案。

---

### I4. 入场动画 stagger 参数与 cc-design 动画体系不一致

`animation-best-practices.md` Section 4.3 定义的标准 stagger 是 **30ms**（`t - i * 0.03`）。

`02-design.md` 的 KD4 使用 **80ms** stagger，Pattern Synthesis 表格也写 80ms/节点。

80ms vs 30ms 差距巨大（对于 5 节点，总 stagger 从 120ms 变为 320ms），直接改变入场节奏感。设计稿没有解释为什么 explainer 场景需要比 cc-design 标准更慢的 stagger。

可能的合理理由（但需要说明）：流程图节点更大、间距更远，30ms stagger 可能感觉太密集，80ms 给每个节点更多 "被看见" 的时间。但这是推测，设计稿没有给出这个推理。

**建议**: 要么对齐 cc-design 标准的 30ms stagger 并解释为什么 explainer 可以偏离，要么在 Design Inferences 中说明 explainer 场景下 80ms 的推导理由。

---

### I5. 步骤面板的平板布局 (768-1023px) 未定义

Spec 和 Design 都定义了桌面端 (>=1024px) 和移动端 (<768px) 的布局，但 768-1023px（平板/小笔记本）这个区间没有任何布局方案。

`responsive-design.md` 明确定义了三个断点：768px、1024px、1280px。在这个区间内：
- 桌面端的 65/35 分割可能导致流程图区域只有 ~500px 宽，5-6 个节点会非常拥挤
- 移动端的垂直布局在 1023px 的横屏 iPad 上显得浪费空间

**建议**: 明确 768-1023px 的布局方案：可以考虑桌面端布局但步骤面板收窄到 280px（而非 35%），或者采用 overlay 步骤面板。

---

### I6. KD3 步骤面板的内容高度和溢出策略未定义

桌面端步骤面板固定右侧、不随图表滚动。但如果某一步骤的 body 文字很长（比如 RAG pipeline 的 retrieval 步骤详细说明），面板内部需要滚动吗？

移动端固定底部栏 height ~120px -- 如果 headline + body + prev/next 按钮总高度超过 120px（非常可能，因为 body 可以有多行文字），内容会溢出。

Spec 的 step schema 中 body 是 `string` 类型，没有长度限制。

**建议**: 明确步骤面板的内容溢出策略：面板内部可滚动（桌面端），或移动端底部栏使用 expandable 设计（点击展开完整步骤内容）。

---

### I7. 连线脉冲动画参数可能造成视觉问题

KD5 定义的脉冲 CSS：

```css
stroke-dasharray: 8 200;
animation: flowPulse 2s easeOut infinite;
```

问题：
1. **200px gap 的假设**: 如果连线路径总长度不到 200px（短连线），则 "脉冲点" 会在动画的绝大部分时间不可见。应使用 JS 计算 path 总长度后设置 dasharray。
2. **infinite 循环**: 当前步骤的连线会永远脉冲，在演示场景中可能导致注意力分散。是否需要 3 次脉冲后停止？
3. **easeOut easing**: animation-best-practices 的标准是 expoOut，这里用了 easeOut，与设计稿自己定义的 expoOut 主缓动不一致。

**建议**: (a) 脉冲 dasharray 的间隔值应基于 path 总长度动态计算，不应硬编码 200px；(b) 考虑脉冲播放 3-5 次后停止；(c) 统一使用 expoOut。

---

## Suggestions

### S1. 视觉方向 "Clean Technical Diagram" 可以更具体

KD1 说 "看起来像 Stripe/Vercel 级别的技术架构图"，这是一个品牌模仿描述而非设计原则。design-philosophy.md 明确警告 "Form serves content, not the other way around" 和 "Use this font because it's trendy" 是 Decorative Thinking。

建议改为描述具体的视觉特征：扁平无阴影、线性几何、有限色彩编码、等宽字体用于技术标签、高对比度文字。这些特征是可以追溯到 data-visualization.md 的 Tufte 原则和 design-excellence.md 的视觉层次原则的。

### S2. 节点 kind=decision 的菱形实现值得重新考虑

CSS rotate(45deg) + 内部反旋转文字 的实现会导致：
- 节点占据更大的 CSS bounding box（约 1.41x），影响间距计算
- 文字在反旋转后可能在某些字号下看起来略模糊（亚像素渲染问题）
- 连线连接点不再是矩形边缘，而是菱形顶点，贝塞尔控制点需要特殊处理

在 <=8 节点的流程图中，菱形决策节点是否真的必要？很多现代技术流程图（包括 Stripe）对所有节点使用圆角矩形，用颜色和图标区分 kind。这可以简化实现且不影响语义。

### S3. 缺少错误状态和空状态的设计

没有讨论以下场景的视觉处理：
- Schema 验证失败（AI 生成的 steps.focus 引用了不存在的 node id）
- 0 个步骤（只有节点没有步骤叙事）
- 单节点流程图
- 连线 from/to 相同（自环）

虽然这些是边缘情况，但模板需要处理它们以避免白屏或布局崩溃。

### S4. prefers-reduced-motion 的降级方案可以更细致

设计稿说 "跳过所有入场动画，直接 ready"，但 reduced-motion 用户仍然需要：
- 步骤切换的视觉反馈（不能用动画但需要状态变化的视觉指示）
- hover 聚焦的高亮（不能用过渡但需要即时状态切换）

建议明确：reduced-motion 下，入场动画跳过，步骤切换用无过渡的即时状态切换，hover 用 outline 而非 opacity 变化。

### S5. 与 cc-design 间距系统的一致性需要逐项确认

设计稿声明 "8px 倍数，cc-design 间距系统" 但以下参数不是 8 的倍数：
- 节点间距 "32px" -- 是 8 的倍数，OK
- 节点间距 "24px" -- 是 8 的倍数，OK
- 移动端节点间距 "16-24px" -- 是 8 的倍数，OK
- 节点 radius "8px" -- OK
- 步骤面板移动端 height "~120px" -- 是 8 的倍数，OK
- prev/next 按钮尺寸 "44x44px" -- 不是 8 的倍数。虽然 44px 来自 Apple HIG 的触摸目标建议，但与 cc-design 的 8px 网格不对齐。可以考虑 48px（下一个 8 的倍数），同时满足触摸目标要求。

这只是一个小问题，但 cc-design 的间距系统要求 "All vertical spacing = multiples of 8px"。

### S6. Design Boundaries 的 "不做" 清单可以更明确地排除实现细节

当前 "不做" 清单是干净的，但 KD5 中的代码片段（贝塞尔曲线 path 计算、脉冲 CSS）已经接近实现级别。建议将代码片段替换为伪代码或约束描述，避免在 design 阶段绑定具体实现。

---

## Summary

| Level | Count | Key Themes |
|-------|-------|------------|
| Blocking | 4 | 证据分层缺失、与 animation-best-practices 铁律矛盾、Design Inferences 缺失、Adopt/Reject 追溯性不足 |
| Important | 7 | WCAG 验证缺失、状态机边界情况、SVG 渲染风险、stagger 参数偏离、平板断点缺失、面板溢出、脉冲动画问题 |
| Suggestion | 6 | 视觉方向表述、菱形节点取舍、错误状态设计、reduced-motion 细节、间距一致性、代码片段边界 |

**总体判断**: 设计方向正确，Pattern Synthesis 的 4 个模式提炼有深度，HTML+SVG 混合架构和状态机驱动的交互设计是合理的方案选择。但证据链的完整性和与 cc-design 已有规范的一致性是主要短板。Blocking issues 全部指向 "设计决策的追溯性"，不解决这些问题会直接影响 /plan 阶段的理解和执行质量。

**建议**: 修复 4 个 Blocking issues 后可进入批准流程。Important issues 可在批准前与用户确认取舍，或在 /build 阶段解决。
