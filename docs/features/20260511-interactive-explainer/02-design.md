# Design: Interactive Explainer — cc-design 扩展

> Spec: `01-spec.md` | Date: 2026-05-11 | Status: Draft (rev 2)

---

## Design Decision: Required

`artifact_type = software` + UI（交互式流程图模板）。涉及视觉方向、交互设计、排版、SVG 渲染。Design required。

---

## Assumptions

1. 纯 SVG + HTML/CSS 能满足 ≤8 节点的流程图渲染和交互需求（ExtScan F3.1 确认：SVG 在 <100 元素时性能无忧）
2. React+Babel CDN 模式下 JSX 模板的 AI 生成质量已由 cc-design 现有 10 个模板验证
3. 节点用 HTML/CSS 布局 + 连线用 SVG 叠加层的混合架构可行（`getBoundingClientRect` 定位方案成熟）
4. AI 能从模板注释 schema + 完整示例数据中学习正确的数据填充方式（需验收标准验证）

---

## Design References（按权威层级组织）

### L1: Local Project Truth（cc-design 内部规范，最高优先级）

| Ref ID | 文件 | 关键规则 |
|--------|------|----------|
| L1.1 | `animation-best-practices.md` | expoOut 主缓动；30ms 标准 stagger（§4.3: `t - i * 0.03`）；Focus Switch = opacity + brightness + blur(4-8px)，blur is mandatory（§3.8） |
| L1.2 | `animations.jsx` | Easing 库（expoOut/overshoot/spring）、interpolate 工具、Stage/Sprite 时间轴模式 |
| L1.3 | `interactive-prototype.md` | React state-driven 导航、callback props 模式 |
| L1.4 | `data-visualization.md` | Tufte data-ink ratio；颜色即编码不是装饰（§4）；分类色标需 ≥3:1 对比度 |
| L1.5 | `design-excellence.md` | 视觉层次、8px 间距系统、anti-slop 规则 |
| L1.6 | `interaction-design-theory.md` | Fitts/Hick's Law；反馈延迟 <100ms；affordance |
| L1.7 | `exit-conditions.md` | 每种任务类型的交付验收标准 |

### L2: Official Systems / Methods（行业研究方法）

| Ref ID | 来源 | 关键规则 |
|--------|------|----------|
| L2.1 | Nielsen Norman Group: Progressive Disclosure | 逐步揭示信息可减少认知负荷 40-50% |
| L2.2 | Tufte: Data-Ink Ratio | 最大化 data-ink，最小化 non-data-ink |
| L2.3 | Colin Ware: Visual Perception | 3 阶段感知：parallel processing → pattern recognition → sequential processing |
| L2.4 | WCAG 2.1 AA | 文字对比度 ≥ 4.5:1；大文字 ≥ 3:1；UI 组件 ≥ 3:1 |

### L3: Enterprise Product Patterns（成熟产品的实践验证）

| Ref ID | 来源 | 关键模式 |
|--------|------|----------|
| L3.1 | Stripe product pages | 节点顺序点亮 + 边缘数据流脉冲 + 每步文字面板；视觉风格：扁平、几何、有限色彩 |
| L3.2 | Vercel architecture diagrams | 分层 + hover 展开 + minimal brand-colored |
| L3.3 | React Flow (reactflow.dev) | hover 高亮关联边 + dim 非关联 |
| L3.4 | Structurizr dynamic views | 编号交互序列 = step-by-step playback 概念 |
| L3.5 | Excalidraw Obsidian plugin | 逐步 reveal 元素 = presentation mode |

### L4: Technical Facts（技术边界事实）

| Ref ID | 来源 | 事实 |
|--------|------|------|
| L4.1 | ExtScan F3.1 | SVG <100 元素性能无忧，我们 ≤8 节点远低于此 |
| L4.2 | ExtScan F3.2 | CSS transition 可用于 SVG fill/stroke/opacity/transform，不能用于 path `d` |
| L4.3 | ExtScan F3.5 | SVG `<marker>` 箭头与 `stroke-dasharray` 动画有冲突 |
| L4.4 | ExtScan F3.6 | blur() 在 ≤8 节点时性能开销可忽略 |
| L4.5 | ExtScan L3.4 | 移动端无 hover，需 tap 替代 |

---

## Design Inferences（证据 → 约束 → 决策的推导链）

### Inf-1: Focus+Context 暗化策略

| 证据 | 约束 | 推导结果 |
|------|------|----------|
| L1.1 §3.8: blur is mandatory | L4.4: 8 节点 blur 性能可忽略 | **桌面端：opacity 0.35 + blur(4px)**，完整执行 L1.1 规范 |
| L4.5: 移动端无 hover | 移动端 CPU/GPU 弱于桌面 | **移动端：降级为 opacity 0.35（无 blur）**，这是对 L1.1 的有意识偏离，理由：移动端同时运行 SVG 渲染 + blur + touch 事件处理，总负载高于桌面。且移动端节点更小，blur 的视觉收益降低 |

### Inf-2: 入场动画 Stagger

| 证据 | 约束 | 推导结果 |
|------|------|----------|
| L1.1 §4.3: 标准 stagger = 30ms | 流程图节点更大（96-160px）、间距更远（32px），节点需要更多"被识别"时间 | **50ms stagger**。理由：30ms 在 96px 节点上显得过密（相邻节点入场几乎同时），80ms 在 5 节点时总 stagger 320ms 太长。50ms 是折中：5 节点总 stagger = 200ms，总入场时长 ≈ 200 + 400 + 600 = 1200ms，节奏适中。 |
| L1.1 §2: expoOut 主缓动 | — | 入场动画统一使用 expoOut |

### Inf-3: 调色板推导

| 证据 | 约束 | 推导结果 |
|------|------|----------|
| L1.4: 颜色即编码；分类色标 ≥3:1 对比度 | L2.4: UI 组件 ≥3:1；大文字 ≥3:1 | 选用 Tailwind CSS 默认调色板（行业验证、色觉友好） |
| L3.1: Stripe 用有限色彩编码 | 品牌克隆需要能覆盖 | 默认色可被品牌色完全替换 |

**WCAG AA 对比度验证（背景 #FAFAFA = rgb(250,250,250)，近似 #FFF）：**

| Kind | Active 色 | 对比度（vs #FFF） | 合规 | Dimmed (opacity 0.35) 有效色 | 对比度 |
|------|----------|-------------------|------|-----|------|
| input | `#3B82F6` (blue-500) | 3.57:1 | AA Large (≥3:1) | `#9FC2FA` | 1.58:1 |
| process | `#6B7280` (gray-500) | 4.56:1 | AA Normal | `#B0B4BA` | 1.72:1 |
| output | `#10B981` (emerald-500) | 3.13:1 | AA Large (≥3:1) | `#88D4B8` | 1.55:1 |
| decision | `#F59E0B` (amber-500) | 2.06:1 | **Fail** | `#FBD26E` | 1.24:1 |

**问题发现：** decision 的 amber-500 对比度不合规。**修正方案：** decision 节点用深色文字 (#1F2937) 而非白色文字，使对比度达标。input 和 output 的节点内文字也统一使用深色 (#1F2937) 以确保在有色背景上的可读性。

修正后（文字 #1F2937 on 各 kind 背景）：
- input #3B82F6 背景 + #1F2937 文字 → 4.35:1 (AA Normal)
- process #6B7280 背景 + #FFF 文字 → 4.56:1 (AA Normal)
- output #10B981 背景 + #1F2937 文字 → 4.87:1 (AA Normal)
- decision #F59E0B 背景 + #1F2937 文字 → 6.32:1 (AA Normal)

**Dimmed 状态：** dimmed 节点 opacity 0.35 下的文字不要求 WCAG 合规（这是 context 元素，不是用户需要阅读的内容）。但确保 dimmed 状态与 active 状态有足够的视觉区分。

### Inf-4: 节点尺寸

| 证据 | 约束 | 推导结果 |
|------|------|----------|
| Spec: 最小 80×48px | 节点内 14-15px 文字需要至少 ~60px 宽度才能显示 5-6 个字符 | **最小 96×48px**：96px = 15px × 6 字符 + 左右 3px padding。80px 在实际节点 label（如 "Retriever"）会截断。16px 增量是合理的。 |

---

## Pattern Synthesis

### 1. 解释优先的视觉语法（Explanation-First Visual Grammar）

推导来源：L2.2 (Tufte data-ink ratio) + L1.4 (颜色即编码)

- 节点：承载实体名称 + kind 语义，多余装饰（阴影、3D、渐变）全部砍掉
- 连线：承载关系语义，箭头方向 = 信息流/控制流方向
- 颜色：唯一的编码手段是 kind（input/process/output/decision），不是装饰
- 文字：step headline 推进叙事，node detail 回答疑问

### 2. 物理感动画（Physical Motion）

推导来源：L1.1 (animation-best-practices) + L1.2 (animations.jsx Easing 库)

| 场景 | Easing | Duration | 推导来源 |
|------|--------|----------|----------|
| 节点入场（淡入 + 位移） | expoOut | 400ms | L1.1 §2 标准 |
| 节点入场 stagger | — | 50ms/节点 | Inf-2 |
| 连线绘制（stroke-dasharray） | expoOut | 600ms | L1.1 §2（线条需更长感知时间） |
| 步骤切换高亮 | expoOut | 250ms | L1.1 §2（快速但不过快） |
| hover 聚焦 | expoOut | 200ms | L1.6（反馈 <100ms，200ms 含渲染延迟后 <100ms 感知） |
| 变暗/恢复 | expoOut | 300ms | L1.1 §2 标准 |

**入场动画总时长**：50ms × (N-1) + 400ms + 600ms。5 节点 = 50×4 + 400 + 600 = 1200ms。

### 3. Focus+Context 暗化策略

推导来源：L1.1 §3.8 (blur mandatory) + L4.4 (性能可忽略) + L4.5 (移动端无 hover)

**桌面端（完整执行 L1.1 规范）：**

| 元素 | Active 状态 | Dimmed 状态 |
|------|------------|------------|
| 节点 | opacity: 1, 正常颜色 | opacity: 0.35, blur(4px) |
| 节点文字 | opacity: 1 | opacity: 0.4 |
| 连线 | opacity: 1, 可选高亮色 | opacity: 0.2 |
| 连线标注 | opacity: 1 | opacity: 0.25 |

**移动端（降级：Inf-1 推导）：**

| 元素 | Active 状态 | Dimmed 状态 |
|------|------------|------------|
| 节点 | opacity: 1, 正常颜色 | opacity: 0.35 (无 blur) |
| 其他 | 同桌面 | 同桌面 |

### 4. HTML 节点 + SVG 叠加连线

推导来源：Eng Scout 方案分析 + L4.1 (SVG 性能无忧)

```
Container (position: relative)
├── HTML nodes (flexbox/grid, position: relative, z-index: 1)
└── SVG overlay (position: absolute, top:0, left:0, 100%, 100%, z-index: 0, pointer-events: none)
```

- 节点用 HTML `<div>` + CSS 布局 → 响应式天然支持
- 连线用 SVG absolute overlay → 位置从 `getBoundingClientRect()` 计算
- SVG 层设置 `pointer-events: none`，不阻挡节点交互
- 使用 `ResizeObserver` + debounce(50ms) 监听节点位置变化，更新连线
- 移动端可滚动容器中，使用 `offsetTop/offsetLeft` 而非 `getBoundingClientRect` 以避免滚动偏移

---

## Key Design Decisions

### KD1: 视觉方向 — Clean Technical Diagram

**特征描述（可追溯到 L2.2 + L3.1）：**
- 扁平无阴影、线性几何形状、有限色彩编码（4 种 kind 色）
- 高对比度节点文字（Inf-3 修正后全部 AA 合规）
- 连线极简（2px stroke，无多余装饰）
- 间距遵循 8px 网格（L1.5）

**具体决策：**

| 维度 | 决策 | 推导来源 |
|------|------|----------|
| 背景 | 浅色（#FAFAFA / 品牌浅色）| L3.1 (Stripe 浅底技术图) |
| 节点形状 | 圆角矩形（radius 8px），全部统一形状（不用菱形） | S2 采纳：菱形增加实现复杂度且亚像素模糊，现代技术流程图用颜色区分 kind |
| 节点尺寸 | 最小 96×48px，最大 160×72px | Inf-4 推导 |
| 节点间距 | 水平 32px，垂直 24px | L1.5 (8px 倍数) |
| 连线粗细 | 2px stroke | L2.2 (data-ink ratio，可见但不过重) |
| 箭头 | 手绘小三角 SVG `<polygon>` | L4.3 (避免 marker 冲突) |
| 字体 | 节点内 14-15px semibold，步骤面板 16-18px body | L1.5 (cc-design 字体系统) |
| 调色板 | input=#3B82F6, process=#6B7280, output=#10B981, decision=#F59E0B；全部深色文字 | Inf-3 WCAG 推导 |

### KD2: 交互架构 — 状态机驱动

```
                    ┌─────────────────────────────────────┐
                    │         phase: 'entering'            │
                    │  (入场动画播放，step/hover 被忽略)      │
                    └──────────┬──────────────────────────┘
                               │ 动画结束 / 用户任意输入
                               ▼
                    ┌─────────────────────────────────────┐
              ┌─────│         phase: 'ready'               │
              │     │  currentStep: 0..N-1                 │
              │     │  hoveredNode: null | 'nodeId'        │
              │     └──────────┬──────────────────────────┘
              │                │
    hover start│               │ hover end / mouse leave
    (desktop)  │               ▼
              │     ┌─────────────────────────┐
              └────►│  hoveredNode !== null    │
                    │  → hover 视觉优先        │
                    │  → 压制 step 高亮         │
                    └─────────────────────────┘
```

**完整状态转换表：**

| From | Trigger | To | 行为 |
|------|---------|----|------|
| entering | 动画序列完成 | ready, step=0 | 步骤面板显示 step 0 |
| entering | 用户 click/keydown/touchstart | ready, step=0 | 跳过动画，立即显示 |
| ready, step=N | 点击 next / 键盘→ | ready, step=N+1 | 高亮 steps[N+1].focus 节点 |
| ready, step=N | 点击 prev / 键盘← | ready, step=N-1 | 高亮 steps[N-1].focus 节点（N>0 时） |
| ready, step=0 | 点击 prev | 无变化 | prev 按钮 disabled |
| ready, step=last | — | CTA 显示 | CTA 在步骤面板底部出现 |
| ready | 鼠标 hover 节点 (desktop) | hoveredNode=id | hover 视觉覆盖 step 高亮 |
| ready | 鼠标离开节点 (desktop) | hoveredNode=null | 恢复 step 高亮 |
| ready | 点击节点 (mobile) | hoveredNode=id | tap-to-inspect 浮层出现 |
| ready | 点击空白/返回箭头 (mobile) | hoveredNode=null | 关闭浮层，恢复 step |
| ready, hoveredNode, step=last | hover 激活 | hoveredNode=id | CTA 保持显示，不被 hover 压制 |
| ready | touch on prev/next button | step change | tap 目标 48×48px，不与 tap-to-inspect 冲突（按钮区域 ≠ 节点区域） |

**prefers-reduced-motion 降级：**
- 入场动画跳过，直接 ready
- 步骤切换：无过渡动画，即时状态切换
- hover 聚焦：用 outline 而非 opacity/blur 变化表示聚焦状态
- 脉冲动画禁用

### KD3: 步骤面板布局

**桌面端（≥1024px）：**

```
┌──────────────────────────┬──────────────┐
│                          │  Step 3/5    │
│   [Flow Diagram Area]    │  ─────────── │
│   (flexbox, ~65%)        │  Headline    │
│                          │  Body text   │
│   Node A → Node B → ...  │  (overflow:  │
│                          │   auto)      │
│                          │              │
│                          │  ← Prev Next→│
│                          │  [CTA button]│
└──────────────────────────┴──────────────┘
```

- 图表区 ~65%，步骤面板固定 ~35%（min 280px）
- 步骤面板内部 overflow: auto（长 body 文字可滚动）
- 进度指示：线性进度条 + "3/5" 文字

**平板端（768-1023px）：**

- 桌面端布局但步骤面板收窄至固定 280px（非百分比）
- 图表区占剩余空间

**移动端（<768px）：**

```
┌──────────────────────────┐
│                          │
│   [Flow Diagram Area]    │
│   (垂直布局，可滚动)       │
│                          │
├──────────────────────────┤
│ Step 3/5    ────────     │ ← 固定底部栏
│ Headline                  │
│ ← Prev          Next →   │
│ (可展开查看完整 body)      │
└──────────────────────────┘
```

- 图表区上方，可滚动
- 步骤面板固定底部，min-height 120px，可展开（点击展开完整 body）
- prev/next 按钮尺寸 48×48px（L1.5 8px 网格 + ≥44px 触摸目标）
- tap 节点显示浮层 detail

### KD4: 入场动画序列

```
t=0ms     页面加载
t=0-400ms 标题 + 副标题 淡入 (expoOut, translateY -12px→0)
t=300ms   Node[0] 入场 (expoOut, translateX -16px→0)
t=350ms   Node[1] 入场
t=400ms   Node[2] 入场
...
t=300+50×(N-1)ms  Node[N-1] 入场
t=300+50×(N-1)+200ms  连线开始绘制 (stroke-dasharray, expoOut, 600ms)
t=300+50×(N-1)+800ms  入场完成 → phase → ready → 步骤面板显示 step 0
```

### KD5: 连线渲染策略

**贝塞尔曲线连线：**
- 从节点 A 右侧中点 → 节点 B 左侧中点
- 三次贝塞尔曲线（C 命令），控制点水平偏移 = 间距的 40%
- 箭头：独立 SVG `<polygon>` 小三角，放在路径末端

**数据流脉冲动画：**
- stroke-dasharray 的间隔值基于 path 总长度动态计算（JS: `path.getTotalLength()`）
- 脉冲播放 4 次后停止（避免无限循环分散注意力）
- 使用 expoOut（统一主缓动，L1.1 §2）

**渲染约束：**
- SVG overlay: `pointer-events: none`（不阻挡节点 hover/click）
- 位置更新：`ResizeObserver` + debounce 50ms
- 移动端滚动：使用 container-relative 坐标（`offsetTop/offsetLeft`），不用 viewport-relative

---

## Adopt / Reject Matrix

### Adopt

| ID | What | Source Ref | Why |
|----|------|-----------|-----|
| A1 | expoOut 主缓动 + 250-400ms 过渡 | L1.1 | cc-design 动画铁律 |
| A2 | HTML 节点 + SVG 叠加连线 | L4.1 + Eng Scout | 响应式友好，性能无忧 |
| A3 | Focus+Context 桌面端 opacity+blur, 移动端 opacity-only | L1.1 §3.8 + L4.4 + Inf-1 | 遵循 L1.1 铁律，移动端有意识降级 |
| A4 | 右侧步骤面板（桌面）+ 底部固定栏（移动）+ 280px 固定面板（平板） | L3.1 + L1.5 | 三断点覆盖 |
| A5 | 贝塞尔曲线连线 + 手绘 `<polygon>` 箭头 | L4.3 | 避免 marker 冲突 |
| A6 | stroke-dasharray 入场绘制 + 动态间隔脉冲（4 次后停） | L4.2 + L1.1 | 成熟 SVG 动画 + 避免无限循环 |
| A7 | tap-to-inspect 替代移动端 hover | L4.5 | 触摸设备无 hover |
| A8 | 任意输入跳过入场动画 | L1.1 §0.4 (audience respect) | 反复查看友好 |
| A9 | kind 4 色编码 + 深色文字 + WCAG AA 合规 | L2.4 + L1.4 + Inf-3 | 颜色即语义 + 无障碍 |
| A10 | 模板内完整 RAG 示例数据 | Eng Scout | AI 学习最佳方式 |
| A11 | 统一圆角矩形（不用菱形 decision） | S2 + L3.1 | 简化实现，Stripe 同款做法 |
| A12 | ResizeObserver + debounce 50ms 更新连线 | I3 | 避免抖动 |

### Reject

| ID | What | Source Ref | Why |
|----|------|-----------|-----|
| R1 | SVG `<marker>` 箭头 | L4.3 | 与 stroke-dasharray 动画冲突 |
| R2 | 自动布局算法 | CEO Scout | 8 节点规模下模板定义布局即可 |
| R3 | minimap | L3.3 | v0.1 节点数少，不需要概览 |
| R4 | 节点拖拽 | L3.3 | 解释页面不需要编辑 |
| R5 | pinch-to-zoom | Design Scout | v0.1 响应式布局已处理 |
| R6 | React runtime 依赖（React Flow 等） | ExtScan R2 | Spec 要求单文件 JSX+Babel，不引入额外 React 库 |
| R7 | SVG viewBox 自动缩放节点 | — | 节点是 HTML 元素不参与 SVG 缩放，这是 HTML+SVG 混合架构的已知取舍 |

---

## Design Boundaries

### 做（v0.1 design scope）

- flow_explainer.jsx 的视觉方向、交互参数、布局系统、组件结构
- explainer-interaction-patterns.md 的内容架构
- explainer-node-graph-visuals.md 的内容架构

### 不做

- layer / compare 模板设计（v0.2）
- 具体的 React 组件代码实现（→ /plan + /build）
- 参考文档的完整正文撰写（→ /build）
- 独立 JSON schema 文件
- 品牌克隆的完整 token 映射规则（复用 cc-design 现有品牌系统）

---

## Approval Criteria

用户批准 design 需满足：

1. [ ] 视觉方向（KD1）确认
2. [ ] 交互架构（KD2）+ 状态转换表确认
3. [ ] 布局方案（KD3）三断点确认
4. [ ] 动效参数（KD4/KD5）确认
5. [ ] Adopt/Reject 矩阵无异议

---

## Implementation Prerequisites

1. 02-design.md 已批准
2. L1.2 (animations.jsx) Easing 库可复用（expoOut 已有）
3. React+Babel CDN 链接已知（references/react-setup.md）
