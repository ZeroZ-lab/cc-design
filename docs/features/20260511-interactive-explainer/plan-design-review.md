# Plan-Design Review: Interactive Explainer

> Reviewer: Design Plan Reviewer | Date: 2026-05-11
> Plan: `03-plan.md` | Design: `02-design.md`

---

## 审查维度 1: T1 是否覆盖 KD2/KD3/KD4 的所有交互参数

### Blocking

**无。**

### Important

**I-1: T1 遗漏了 KD2 完整状态转换表中的多个状态转换路径。**

KD2 定义了一张完整的状态转换表，包含 11 行转换规则。T1 的 content outline 第 2-5 项只概括性地列出了 "导航控件、高亮/暗化策略、过渡参数 expoOut 250ms" 等主题，但没有明确要求文档包含完整的状态转换表。

具体遗漏的转换路径：
- `entering` 阶段用户 click/keydown/touchstart 跳过动画进入 `ready, step=0`
- `ready, step=0` 时 prev 按钮 disabled 行为
- `ready, step=last` 时 CTA 显示逻辑
- `ready, hoveredNode, step=last` 时 hover 激活但 CTA 保持显示不被压制
- touch on prev/next button 时的 step change（48x48px 目标，不与 tap-to-inspect 冲突）

这些状态转换规则属于交互模式的核心定义，如果 T1 参考文档不包含它们，build 阶段将不得不回到 design 文档自行推导，这构成了错误下沉。

**建议修复：** 在 T1 content outline 第 2 项中增加 "完整状态转换表（含 entering/ready/hovered 三 phase 的所有 trigger-to-behavior 映射）"。

**I-2: T1 缺少 KD3 步骤面板布局的桌面端/平板端/移动端具体布局参数。**

KD3 定义了三断点的精确布局：
- 桌面端：图表区 ~65%，步骤面板 ~35%（min 280px），面板内部 overflow: auto
- 平板端：步骤面板固定 280px
- 移动端：底部固定栏 min-height 120px，可展开，prev/next 48x48px

T1 第 5 项仅提到 "三断点策略"，但没有要求文档记录这些具体的布局参数。这些参数是交互设计的一部分（面板如何显示、滚动、展开），不是纯视觉问题。如果 T1 不记录，T2 的 node-graph-visuals 也没有覆盖步骤面板布局，这些参数会丢失。

**建议修复：** 在 T1 content outline 增加第 7 项："步骤面板三断点布局参数（桌面端 ~35% min 280px + overflow:auto、平板固定 280px、移动端底部 min-height 120px 可展开）"。

### Suggestion

**S-1: T1 verification 可补充对 KD2 prefers-reduced-motion 降级行为的覆盖检查。**

KD2 定义了 prefers-reduced-motion 下的完整降级行为（入场动画跳过、步骤切换无过渡、hover 用 outline 而非 opacity/blur、脉冲禁用），T1 content outline 第 4 项提到了 "prefers-reduced-motion 降级" 但 verification 清单未包含对此的具体检查项。

---

## 审查维度 2: T2 是否覆盖 KD1/KD5 的所有视觉和渲染约束

### Blocking

**无。**

### Important

**I-3: T2 连线样式遗漏了 KD5 中贝塞尔曲线控制点的具体参数（水平偏移 = 间距的 40%）。**

KD5 明确定义了 "三次贝塞尔曲线（C 命令），控制点水平偏移 = 间距的 40%"。T2 第 2 项只说 "贝塞尔曲线" 没有提及控制点计算规则。这是渲染约束，build 阶段需要精确参数来实现连线绘制。

**建议修复：** T2 第 2 项补充 "贝塞尔曲线控制点水平偏移 = 间距的 40%"。

**I-4: T2 缺少 KD5 脉冲动画的具体实现参数。**

KD5 定义了脉冲动画的关键技术细节：
- stroke-dasharray 间隔值基于 `path.getTotalLength()` 动态计算
- 脉冲播放 4 次后停止
- 使用 expoOut

T2 第 2 项提到连线但未提及脉冲动画参数。脉冲动画既属于视觉渲染（KD5 连线渲染策略的一部分），也属于交互（T1 第 4 项），但两侧的 content outline 都没有明确要求记录 `getTotalLength()` 动态计算这一技术约束。T3 模板中确实包含 "脉冲动画（动态 dasharray，4 次后停）"，但参考文档作为 build 阶段的权威指导，应该也记录这一参数。

**建议修复：** 在 T2 增加关于连线动画的技术参数（`path.getTotalLength()` 动态间隔计算、4 次停止、expoOut）。

**I-5: T2 缺少 KD1 中背景色的具体决策（#FAFAFA / 品牌浅色）和字体参数（节点内 14-15px semibold、步骤面板 16-18px body）。**

KD1 明确定义了背景色和字体参数。T2 content outline 第 1 项覆盖了节点尺寸、第 3 项覆盖了调色板，但没有记录背景色和字体系统。这些属于视觉规范。

**建议修复：** T2 增加 "背景色 (#FAFAFA / 品牌浅色)" 和 "字体参数（节点内 14-15px semibold、步骤面板 16-18px body）"。

### Suggestion

**S-2: T2 第 4 项 WCAG 对比度参考表可注明只覆盖 active 状态，dimmed 状态不要求合规（对应 Inf-3 的设计决策）。**

KD1 Inf-3 明确标注了 "dimmed 节点 opacity 0.35 下的文字不要求 WCAG 合规"，但 T2 第 4 项 verification 要求 "WCAG 对比度数值与 02-design.md Inf-3 一致"，这应该包含 dimmed 行但不标注为合规。建议 verification 条目更精确。

---

## 审查维度 3: T3 的验收标准是否覆盖 KD1-KD5 的所有设计决策

### Blocking

**B-1: T3 验收标准缺少对 KD2 中 entering phase 行为的验证。**

KD2 定义了 `phase: 'entering'` 作为首个阶段，包含两个关键行为：
1. 动画序列完成后进入 ready, step=0
2. 用户任意输入（click/keydown/touchstart）跳过动画，立即进入 ready

T3 的 verification 清单中有 "入场动画：节点依次淡入 + 连线绘制 + 1.2s 内完成"（覆盖了动画本身），也有 "prefers-reduced-motion：动画跳过"（覆盖了 media query 降级），但缺少对 "用户主动跳过入场动画" 这一行为的验证。这是 KD2 状态机的核心交互之一。

**建议修复：** 在 T3 verification 增加一项："入场动画期间用户点击/按键/触摸 → 立即跳过动画，显示 step 0"。

### Important

**I-6: T3 验收标准缺少对 KD3 平板端（768-1023px）布局的验证。**

T3 verification 第 7 项只说 "响应式：三断点布局正确"，是一个笼统检查。但 KD3 对三断点有非常不同的布局规则：
- 桌面端：~65% 图表 + ~35% 面板
- 平板端：面板固定 280px
- 移动端：底部固定栏 + 可展开

三断点的差异是 design 阶段明确锁定的决策，不应该合并为一个笼统检查项。

**建议修复：** 将 T3 verification 第 7 项拆分为三行：
- "桌面端 ≥1024px：图表 ~65% + 右侧面板 ~35%（min 280px）"
- "平板端 768-1023px：步骤面板固定 280px"
- "移动端 <768px：垂直布局 + 底部固定栏 + tap-to-inspect 浮层"

**I-7: T3 验收标准缺少对 KD2 中 step=last 时 CTA 显示逻辑的独立验证。**

T3 verification 第 10 项有 "CTA 在最后步骤显示"，但缺少负向验证：CTA 在非最后步骤时不显示。KD2 明确设计 CTA 只在 `step=last` 时出现，过早显示会干扰叙事流程。这是一个容易在 build 中遗漏的边界条件。

**建议修复：** 将 T3 verification 第 10 项改为 "CTA 仅在最后步骤显示，非最后步骤不显示"。

**I-8: T3 模板结构缺少 KD3 中移动端底部步骤面板的 "可展开" 行为实现。**

KD3 移动端布局明确设计："min-height 120px，可展开（点击展开完整 body）"。T3 模板结构第 5 项 StepPanel 只说 "移动端底部栏"，没有提到展开/收起交互。这属于交互行为，不应推迟到 build 阶段才发现。

**建议修复：** T3 模板结构第 5 项 StepPanel 补充 "（移动端可展开完整 body，min-height 120px）"。

### Suggestion

**S-3: T3 验收标准可增加对 error boundary 具体场景的验证。**

T3 模板结构第 10 项列出了 error boundary 的三个场景（schema 验证失败、0 步骤、单节点降级），但 verification 清单没有对应的检查项。建议增加 "Error boundary：schema 缺失 / 0 步骤 / 单节点时不报错，有降级显示"。

---

## 审查维度 4: 有没有设计决策在 plan 中被遗漏

### Blocking

**B-2: Adopt 矩阵中的 A8（任意输入跳过入场动画）在 T1 和 T3 中都没有明确的验证覆盖。**

Design 的 Adopt 矩阵明确采纳了 A8："任意输入跳过入场动画（L1.1 0.4 audience respect）"。T1 content outline 没有列出这一条，T3 verification 也没有对应检查。这与 B-1 是同一个问题，但这里强调的是 Adopt/Reject 矩阵的覆盖率——plan 应该确保每一个 Adopt 项至少有一个任务覆盖。

### Important

**I-9: Design 中 Inf-1 关于移动端 blur 降级的设计决策理由（移动端 CPU/GPU 弱 + 节点更小 blur 视觉收益低）未要求记录到任何参考文档。**

Inf-1 的降级理由是有意识的设计决策偏离，推导链清晰（L1.1 + L4.4 + L4.5）。T1 第 5 项提到了 "移动端 opacity-only"，T3 模板结构第 5 项也包含了移动端降级，但 plan 没有要求任何参考文档记录这个偏离的理由。当未来维护者看到移动端没有 blur 时，需要知道这是设计决策而非实现疏漏。

**建议修复：** 在 T1 或 T2 的 content outline 中增加 "设计决策记录：移动端 blur 降级的理由（CPU/GPU + 视觉收益降低）"。

**I-10: Plan 未覆盖 spec 中节点溢出策略的实现。**

Spec 定义了节点溢出规则：推荐 3-6 节点，最大 8 节点（zigzag），硬上限 12 节点（模板内显示警告）。KD1 提到 zigzag 布局。但 T3 模板结构中没有关于节点数量上限处理或 zigzag 布局切换的组件或逻辑。T2 第 5 项提到了 "zigzag 布局" 但只是视觉规范层面的描述。

这是一个灰色地带：design 明确不做自动布局算法（R2 Reject），但模板需要处理不同节点数量时的布局差异。build 阶段需要知道：模板是否包含 zigzag 布局能力？超过 8 节点时如何处理？

**建议修复：** T3 模板结构增加关于节点数量布局策略的说明（zigzag 切换逻辑、12 节点硬上限警告）。

### Suggestion

**S-4: Plan 的并行执行 Wave 3 存在逻辑问题——T6 被同时放在了 Wave 1 和 Wave 3。**

Dependency Graph 显示 T6 依赖 None，Wave 1 是 T1+T2+T6，但 Wave 3 又写了 T4+T6（T4 依赖 T3）。如果 T6 在 Wave 1 已完成，Wave 3 不需要再包含 T6。这可能是笔误，但会导致执行困惑。

---

## 汇总

| 级别 | 编号 | 摘要 | 影响范围 |
|------|------|------|----------|
| Blocking | B-1 | T3 缺少 entering phase 用户跳过动画的验证 | T3 |
| Blocking | B-2 | Adopt A8（任意输入跳过入场动画）无任务覆盖 | T1, T3 |
| Important | I-1 | T1 缺少 KD2 完整状态转换表的记录要求 | T1 |
| Important | I-2 | T1 缺少 KD3 步骤面板三断点布局参数 | T1 |
| Important | I-3 | T2 缺少贝塞尔曲线控制点计算参数 | T2 |
| Important | I-4 | T2 缺少脉冲动画 getTotalLength() 技术约束 | T2 |
| Important | I-5 | T2 缺少背景色和字体参数 | T2 |
| Important | I-6 | T3 响应式验证过于笼统，缺少平板端独立检查 | T3 |
| Important | I-7 | T3 缺少 CTA 负向验证（非最后步骤不显示） | T3 |
| Important | I-8 | T3 StepPanel 缺少移动端可展开行为 | T3 |
| Important | I-9 | 移动端 blur 降级理由未记录到参考文档 | T1/T2 |
| Important | I-10 | 节点溢出/zigzag 布局策略未在 T3 中说明 | T3 |
| Suggestion | S-1 | T1 verification 可补充 prefers-reduced-motion 检查 | T1 |
| Suggestion | S-2 | T2 WCAG 表可注明 dimmed 不要求合规 | T2 |
| Suggestion | S-3 | T3 可增加 error boundary 场景验证 | T3 |
| Suggestion | S-4 | Wave 3 T6 重复列入，可能笔误 | Plan |

**结论：** Plan 整体结构与 Design 对齐良好，任务分解合理。主要风险集中在两个方面：(1) 参考文档（T1/T2）的 content outline 对 Design 决策参数的记录不够完整，可能导致 build 阶段需要回溯 design 文档自行推导；(2) T3 verification 对三断点布局和状态机边界条件的覆盖粒度不足。建议在执行 T1/T2 前补充上述 Important 项。
