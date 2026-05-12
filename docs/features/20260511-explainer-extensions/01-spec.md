# Spec: Explainer Extensions -- compare, decision-tree (v0.2)

## artifact_type
`software` -- cc-design 现有架构内新增 2 个 JSX 模板 + 扩展参考文档，共享 `interactive-explainer` taskType

## 背景

cc-design v0.1 已交付 `flow_explainer.jsx`（交互式流程解释模板），验证了 HTML+SVG 混合架构、React+Babel CDN 单文件 JSX、交互优先级栈、状态机框架、响应式三断点等核心模式。v0.2 在此基础上扩展两种新模板形态，覆盖更多解释场景。

**价值定位：** 从"流程解释"单一能力扩展为"多形态解释"能力矩阵。两种新模板分别解决对比分析、决策路径两类高频解释需求，与 flow_explainer 共享状态机框架和 dimming/响应式策略（约 50-80 行共享工具函数如 expoOut、debounce、animateValue 在每个模板中 inline 复制，实际代码复用率约 60%），让用户用同一套 cc-design 插件产出更丰富的解释资产。layer 模板推至 v0.3 交付。

**痛点场景：**

1. 售前需要对比自家方案与竞品（React vs Vue、AWS vs GCP），静态表格看不出差异背后的原因，两栏并排截图信息密度太低
2. 技术选型时团队需要走一遍决策树（"什么场景选什么技术"），纯文字描述让人迷失在分支里，需要一棵可交互的树来探索路径

## 核心原则

1. **解释优先** -- 每个交互元素的存在是为了推进理解，不是装饰（继承 v0.1）
2. **JSX 模板** -- 与 cc-design 现有模板系统一致，使用 React+Babel CDN（继承 v0.1）
3. **模板内嵌 schema** -- 数据结构定义在模板注释内，模板包含完整示例数据（继承 v0.1）
4. **复用 cc-design 基础设施** -- 设计参考体系、导出链路、质量门控全部复用（继承 v0.1）
5. **共享框架，各自定义** -- 两个模板共享入场动画、dimming 策略、响应式断点、状态机顶层框架（entering/ready phase），但交互模型各自不同

## 目标用户

| 角色 | 场景 |
|------|------|
| AI/SaaS/Infra 产品团队 | 对比产品优势、展示技术选型决策树 |
| 售前/GTM 团队 | 竞品对比演示、方案路径推荐 |
| 技术作者/布道师 | 框架对比文章、技术选型指南可视化 |

## v0.2 范围

### 做

1. **2 个 JSX 模板** 到 `templates/`
   - `compare_explainer.jsx` -- 多维度对比（维度切换 + hover 详情 + overview 模式）
   - `decision_tree.jsx` -- 全景展开决策树（hover 路径高亮 + 终端结论）

2. **扩展参考文档** 到 `references/`
   - 更新 `explainer-interaction-patterns.md` -- 补充两种新模板的交互模式定义
   - 更新 `explainer-node-graph-visuals.md` -- 补充对比/树布局的视觉参数

3. **更新 `load-manifest.json`** -- `interactive-explainer` taskType 新增 2 个模板关联 + 检测关键词补充（英文新增：compare, comparison, versus, vs, decision tree, tech selection, choose between, architecture layers；中文新增：对比, 比较, vs, 决策树, 选型, 架构分层, 分层解释）

4. **更新 `SKILL.md` 路由表** -- 补充 compare/decision-tree 的路由说明和 route-shaping 判断逻辑

5. **更新 `references/exit-conditions.md`** -- 新增两种模板的验收条件

6. **更新 `VERSION`** -- 版本升级

### 不做

| 不做 | 原因 |
|------|------|
| layer_explainer.jsx | v0.3 候选，v0.2 优先交付 Compare + DT |
| timeline_explainer.jsx | v0.3 候选，优先级低于 compare/DT |
| 独立 JSON Schema 文件 | v0.1 验证模板内嵌 schema 遵循率达标，继续此模式 |
| PixiJS / Canvas / WebGL | SVG 在本规模完全够用，与 v0.1 一致 |
| 自由拖拽编辑器 | cc-design 的 AI 驱动模式不需要 |
| 叙事编排 pipeline | AI 直接处理 |
| 深色模式 | v0.2 复用品牌色系统 |
| 搜索/筛选维度 | Compare 模板维度数量建议 3-6，不需要搜索 |
| 决策树路径回溯导航（面包屑） | hover 高亮路径足够，面包屑 v0.3 |
| 跨模板组合（如 compare + flow） | v0.3 |

---

## 通用定义

### 交互优先级栈

两种模板共享同一优先级栈架构，但具体层内容各自定义：

```
入场动画 < 主交互模式 < hover 聚焦
```

| 优先级层 | Compare | Decision Tree |
|----------|---------|---------------|
| **Lowest -- entry** | entering phase：标题 + 维度标签 + overview 对比项依次淡入 | entering phase：标题 + 树节点从根到叶依次展开 |
| **Medium -- primary** | 维度切换：点击维度标签/overview 标签改变对比视角 | 全景展开：所有节点和路径同时可见 |
| **Highest -- hover** | hoveredItem：hover 对比项显示详情浮层 | hoveredNode + highlightedPath：hover 节点高亮整条路径 |

**分辨率规则：**

- hover 激活时压制 primary 模式的视觉表现（但不清除状态），hover 结束后恢复
- CTA / 终端结论不受 hover 压制
- entering phase 时所有用户交互被阻止，首次用户输入跳过入场动画
- `prefers-reduced-motion` 时跳过入场动画，hover 用 outline 替代 opacity/blur 变化

### Dimming 策略（共享）

| 元素 | Active 状态 | Dimmed 状态 | 来源 |
|------|-------------|-------------|------|
| 对比项 / 树节点 | opacity: 1, 正常颜色 | opacity: 0.35 | 继承 v0.1 |
| 节点/项内文字 | opacity: 1 | opacity: 0.4 | 继承 v0.1 |
| 关联连线/路径 | opacity: 1, 可选高亮色 | opacity: 0.2 | 继承 v0.1 |
| 非关联连线/路径 | -- | opacity: 0.2 | 继承 v0.1 |

**桌面端（>=1024px）dimming 加 blur(4px)，移动端（<768px）仅 opacity，平板（768-1023px）同桌面。**

### 响应式断点（共享）

| 断点 | 布局策略 | 交互降级 | Dimming |
|------|----------|----------|---------|
| >=1024px | 完整布局 | hover 交互 | opacity + blur |
| 768-1023px | 简化布局（面板固定宽度） | hover + tap-to-inspect | opacity + blur |
| <768px | 垂直/紧凑布局 | 仅 tap-to-inspect | 仅 opacity |

### 入场动画框架（共享）

| 参数 | 值 | 来源 |
|------|----|------|
| Easing | expoOut（cubic-bezier(0.16, 1, 0.3, 1)) | 继承 v0.1 |
| 标题入场 | 400ms, fade + translateY(-12px -> 0) | 继承 v0.1 |
| 主元素 stagger | 50ms 间隔 | 继承 v0.1 |
| 主元素入场时长 | 400ms, fade + 轻微位移 | 继承 v0.1 |
| 连线/路径绘制 | 600ms, stroke-dasharray | 继承 v0.1 |
| 脉冲动画 | 4 次后停止 | 继承 v0.1 |
| 跳过入场 | 首次 click/keydown/touchstart | 继承 v0.1 |
| reduced-motion | 跳过入场，所有过渡 instant | 继承 v0.1 |

### 状态机框架（共享）

```
顶层 phase: entering | ready

entering -> ready: 入场动画完成 or 首次用户输入

ready phase 内的 sub-states 由各模板自行定义
```

| 模板 | ready phase sub-states |
|------|----------------------|
| Compare | `{ dimension: string | "overview", hoveredItem: string | null }` |
| Decision Tree | `{ hoveredNode: string | null, highlightedPath: string[] }` |

### 颜色系统（共享）

继承 v0.1 的 kind 颜色编码：

| Kind | Hex | 说明 |
|------|-----|------|
| input | `#3B82F6` | 数据源/触发节点 |
| process | `#6B7280` | 处理/转换节点 |
| output | `#10B981` | 结果/输出节点 |
| decision | `#F59E0B` | 条件/路由节点 |

各模板可定义额外 kind（如 Compare 的 `pro`/`con`），但必须满足 WCAG AA 对比度。

### SVG 渲染约束（共享）

- HTML+SVG 混合架构：节点/项用 HTML + CSS flexbox/grid，连线用 SVG overlay
- SVG overlay: `pointer-events: none`, `aria-hidden: true`
- 位置计算: `getBoundingClientRect()` (桌面) 或 `offsetTop/offsetLeft` (移动端)
- ResizeObserver + 50ms debounce 重算连线位置
- 无 viewBox, 使用容器像素尺寸直接

---

## compare_explainer.jsx 详细定义

### 定位

多维度对比解释页面。两个或多个对象在多个维度上对比，用户点击维度标签切换对比视角，hover 各项看详情。

### 布局策略

**桌面端（>=1024px）：**

```
+----------------------------------+--------------+
|                                  |   Dimension  |
|     [Compare Diagram Area]       |   Switcher   |
|     (flexbox, ~65%)              |   ---------  |
|                                  |  Headline    |
|                                  |  Body text   |
|     Object A  |  Object B        |  (hovered    |
|     (items by current dim)       |   item detail)|
|                                  |              |
|                                  |  [CTA button]|
+----------------------------------+--------------+
```

- 左侧对比区域：两列并排（或三列，取决于 subjects 数量），当前维度下的各项竖排
- 右侧面板：维度切换器 + 当前维度说明 + hover 详情
- 维度切换器：维度标签按钮组，点击切换当前 dimension

**平板端（768-1023px）：**

- 右侧面板固定 280px
- 对比区域缩减至两列

**移动端（<768px）：**

```
+----------------------------------+
|  [Dimension Switcher Tabs]       |
+----------------------------------+
|  Object A        |  Object B     |
|  (items stacked) | (items stacked|
+----------------------------------+
|  Detail overlay (on tap)         |
|  <- Prev          Next ->        | <- 固定底部
+----------------------------------+
```

- 维度切换器变为顶部 tab 横滑
- 对比区域两列竖排
- tap-to-inspect 替代 hover
- 固定底部栏显示当前维度说明 + 简要详情

### 模板内嵌 schema

```jsx
/*
Schema: compare_explainer
=========================
Required fields:
  title: string          -- 页面标题（如 "React vs Vue: Framework Comparison"）
  subtitle: string       -- 页面副标题（如 "Which frontend framework fits your project?"）
  subjects: Array<{
    id: string           -- 对比对象标识（如 "react"）
    label: string        -- 对比对象显示名（如 "React"）
    accentColor: string  -- 对象主题色 hex（如 "#61DAFB"），需满足 WCAG AA
  }>
  dimensions: Array<{
    id: string           -- 维度标识（如 "performance"）
    label: string        -- 维度显示名（如 "Performance"）
    headline: string     -- 维度概要标题（如 "Runtime Performance"）
    body: string         -- 维度概要说明（如 "Both frameworks use virtual DOM..."）
  }>
  （注：overview 是默认的"差异汇总"维度，不需要用户显式定义，模板自动从 items 中计算差异并生成 overview 内容。dimensions 数组中不需要包含 overview 维度条目。）
  items: Array<{
    id: string           -- 项目唯一标识（如 "react-performance-1"）
    subjectId: string    -- 所属对比对象 id
    dimensionId: string  -- 所属维度 id
    label: string        -- 项目显示文字（如 "Virtual DOM diffing"）
    kind: "pro" | "con" | "neutral" | "highlight"
    detail: string       -- hover/tap 时显示的详细说明
    score?: number       -- 可选评分（1-5），用于视觉量化展示
  }>
  connections: Array<{
    fromSubjectId: string  -- 源对象 id
    toSubjectId: string    -- 目标对象 id
    dimensionId: string    -- 所属维度 id
    fromItemId: string     -- 源项 id（引用 items 中的 id）
    toItemId: string       -- 目标项 id（引用 items 中的 id）
    label?: string         -- 连线标注
  }>
  cta?: {
    label: string        -- 按钮文字
    target: string       -- 链接地址
  }

Rules:
  - subjects.length 建议 2-3，最大 4
  - dimensions.length 建议 3-6，最大 8
  - 每个 dimension 下每个 subject 至少 1 个 item
  - kind 决定项颜色：pro=绿系, con=红系, neutral=灰系, highlight=品牌色
  - score 范围 1-5，0 表示不显示评分
  - connections 用于跨对象同维度连线（表示对比关系或数据流动）
*/
```

### 交互详细定义

**Overview 模式（Compare 初始状态）：**

- 进入 Compare 模板时默认显示 overview 维度（不是第一个维度）
- Overview 显示内容：
  - verdict 徽章：每个 subject 的"最擅长"标签（如 React = "Complex SPAs"，Vue = "Developer Experience"）
  - 差异概要：仅显示有差异的项（两个 subject 在同一维度下 kind 不同或 score 差距 >= 2 的项）
  - 差异总数统计（如 "8/16 项有差异"）
- Overview 不显示 score 和 connections，只显示 pro/con 徽章和差异高亮
- 点击任意维度标签切换到详细对比模式
- 从 overview 切换到具体维度时的动画序列：
  - overview 项 fade out 200ms -> 维度项 fade in 300ms -> connections draw 600ms（仅从 overview 切换到维度时绘制连线）
- 从维度切换回 overview 时：
  - connections fade out 200ms -> 维度项 fade out 200ms -> overview 项 fade in 300ms

**维度切换（primary 交互）：**

- 点击维度标签按钮 -> dimension 状态切换到新维度
- 切换过渡：当前维度的各项 fade out（200ms expoOut），新维度的各项 fade in（300ms expoOut）
- 切换时连线重新绘制（stroke-dasharray 动画 600ms）
- 维度切换器始终可见，当前维度按钮高亮
- 键盘支持：Tab 到维度按钮，Enter 切换维度

**维度切换动画时序定义（E3）：**

```
Phase 1: Current items fade out (200ms expoOut, opacity 1->0)
Phase 2: New items fade in (300ms expoOut, opacity 0->1, stagger 50ms per item)
Phase 3: New connections draw (600ms expoOut, stroke-dasharray)
Phase 4: Pulse animation (4 iterations, then static)
总时长: ~1200ms (与 v0.1 entry animation 一致)
```

**hover 详情（highest 交互）：**

- 桌面端：hover 对比项 -> hoveredItem 状态激活 -> 该项放大/高亮 + 显示 detail 浮层 + 关联连线高亮 -> 所有其他项 dimmed
- 移动端：tap 对比项 -> 显示 detail overlay + 关联连线高亮 -> overlay 关闭方式如下：
  - overlay 左上角有 X 关闭按钮（48x48px，与 v0.1 一致）
  - 点击 overlay 以外的任何区域关闭（overlay 有明确边界，半透明遮罩背景）
  - 点击另一个对比项 -> 先关闭当前 overlay -> 再打开新 overlay（不是同时显示两个）
- hover/tap 激活时维度切换器的当前状态不被清除
- hover 结束恢复当前维度视觉

**移动端维度切换：**

- 维度 tab 横滑，当前 tab 高亮
- 左右滑动切换维度（可选，与 tab 点击等效）

### 示例数据：React vs Vue

```jsx
const EXAMPLE_DATA = {
  title: 'React vs Vue: Framework Comparison',
  subtitle: 'Which frontend framework fits your project?',
  subjects: [
    { id: 'react', label: 'React', accentColor: '#61DAFB' },
    { id: 'vue',   label: 'Vue',   accentColor: '#42B883' },
  ],
  dimensions: [
    { id: 'performance', label: 'Performance', headline: 'Runtime Performance',
      body: 'Both frameworks use virtual DOM for efficient UI updates, but differ in optimization strategies.' },
    { id: 'ecosystem', label: 'Ecosystem', headline: 'Ecosystem & Tooling',
      body: 'React has a larger ecosystem with more third-party libraries; Vue has a more integrated official toolchain.' },
    { id: 'learning', label: 'Learning Curve', headline: 'Developer Experience',
      body: 'Vue is easier to learn for beginners; React requires understanding of hooks and functional patterns.' },
    { id: 'flexibility', label: 'Flexibility', headline: 'Architecture Freedom',
      body: 'React is unopinionated and flexible; Vue provides more built-in conventions and structure.' },
  ],
  items: [
    // Performance dimension
    { id: 'react-performance-1', subjectId: 'react', dimensionId: 'performance', label: 'Virtual DOM diffing', kind: 'pro',
      detail: 'React\'s Fiber scheduler enables incremental rendering, prioritizing high-impact updates.', score: 4 },
    { id: 'react-performance-2', subjectId: 'react', dimensionId: 'performance', label: 'Re-render optimization needed', kind: 'con',
      detail: 'Requires manual memoization (useMemo, useCallback) to avoid unnecessary re-renders in complex components.', score: 3 },
    { id: 'vue-performance-1', subjectId: 'vue',   dimensionId: 'performance', label: 'Reactive dependency tracking', kind: 'pro',
      detail: 'Vue automatically tracks dependencies and only re-renders affected components -- no manual memoization needed.', score: 5 },
    { id: 'vue-performance-2', subjectId: 'vue',   dimensionId: 'performance', label: 'Fine-grained reactivity (Vue 3)', kind: 'highlight',
      detail: 'Vue 3\'s Proxy-based reactivity system can update at the property level, not just the component level.', score: 5 },

    // Ecosystem dimension
    { id: 'react-ecosystem-1', subjectId: 'react', dimensionId: 'ecosystem', label: 'Massive third-party ecosystem', kind: 'pro',
      detail: 'Thousands of community packages: state management, routing, form handling, animation libraries.', score: 5 },
    { id: 'react-ecosystem-2', subjectId: 'react', dimensionId: 'ecosystem', label: 'No official router/state', kind: 'con',
      detail: 'React has no official router or state management. Teams must choose and integrate their own (React Router, Redux, Zustand, etc.).', score: 3 },
    { id: 'vue-ecosystem-1', subjectId: 'vue',   dimensionId: 'ecosystem', label: 'Integrated official toolchain', kind: 'pro',
      detail: 'Vue Router, Pinia, Vite all maintained by the core team. Consistent APIs, fewer integration surprises.', score: 4 },
    { id: 'vue-ecosystem-2', subjectId: 'vue',   dimensionId: 'ecosystem', label: 'Smaller ecosystem size', kind: 'neutral',
      detail: 'Fewer third-party packages than React, though growing rapidly. Most needs are covered by official or community solutions.', score: 3 },

    // Learning dimension
    { id: 'react-learning-1', subjectId: 'react', dimensionId: 'learning', label: 'Hooks mental model', kind: 'con',
      detail: 'Understanding useEffect closure rules, stale state, and hook ordering rules is a significant learning curve.', score: 2 },
    { id: 'react-learning-2', subjectId: 'react', dimensionId: 'learning', label: 'JSX flexibility', kind: 'pro',
      detail: 'JSX is just JavaScript -- full power of the language in templates. No template syntax limitations.', score: 4 },
    { id: 'vue-learning-1', subjectId: 'vue',   dimensionId: 'learning', label: 'Template-based, beginner-friendly', kind: 'pro',
      detail: 'Directive-based templates (v-if, v-for, v-model) feel natural for HTML developers. Lower barrier to entry.', score: 5 },
    { id: 'vue-learning-2', subjectId: 'vue',   dimensionId: 'learning', label: 'Options API simplicity', kind: 'highlight',
      detail: 'Vue\'s Options API provides a clear, organized structure for small-to-medium components. Composition API available for advanced use.', score: 5 },

    // Flexibility dimension
    { id: 'react-flexibility-1', subjectId: 'react', dimensionId: 'flexibility', label: 'Unopinionated by design', kind: 'pro',
      detail: 'React is a library, not a framework. Choose your own router, state, CSS approach. Maximum flexibility.', score: 5 },
    { id: 'react-flexibility-2', subjectId: 'react', dimensionId: 'flexibility', label: 'More boilerplate', kind: 'con',
      detail: 'Flexibility comes at a cost: more setup decisions, more boilerplate, more integration work for each project.', score: 3 },
    { id: 'vue-flexibility-1', subjectId: 'vue',   dimensionId: 'flexibility', label: 'Built-in conventions', kind: 'neutral',
      detail: 'Vue provides recommended patterns for routing, state, and styling. Easier to start, but less freedom to deviate.', score: 3 },
    { id: 'vue-flexibility-2', subjectId: 'vue',   dimensionId: 'flexibility', label: 'Single-file components', kind: 'pro',
      detail: 'Template, script, and style in one file. Clear component boundaries, easy to understand structure.', score: 4 },
  ],
  connections: [
    { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'performance',
      fromItemId: 'react-performance-1', toItemId: 'vue-performance-1',
      label: 'different reactivity model' },
    { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'ecosystem',
      fromItemId: 'react-ecosystem-2', toItemId: 'vue-ecosystem-1',
      label: 'official vs community' },
  ],
  cta: { label: 'Choose your framework', href: '#' },
};
```

### Compare 特有视觉参数

| 参数 | 值 | 说明 |
|------|----|------|
| 对比列宽度 | 等分剩余空间（各列宽度相同） | 桌面端 |
| 对比列间距 | 24px | 列间 gap |
| 维度标签按钮 | min 80x40px, 8px radius | 与 v0.1 节点风格一致 |
| 对比项卡片 | min 120x48px, max 200x72px, 8px radius | 比 flow 节点稍宽 |
| kind 颜色 | pro=#10B981, con=#EF4444, neutral=#6B7280, highlight=品牌色 | 新增 con 红 |
| score 可视化 | 小圆点/条形（1-5），仅当 score > 0 时显示 | 不用数字，用视觉量化 |
| 跨对象连线 | SVG cubic bezier, stroke 2px, dashed 当 neutral | 与 v0.1 edge 风格一致 |
| detail 浮层 | max-width 280px, 背景 card 色 + elevation shadow | 与 v0.1 tap overlay 一致 |

---

## decision_tree.jsx 详细定义

### 定位

全景展开的决策树解释页面。所有节点和路径同时可见，hover 节点高亮整条路径，终端节点显示结论。

### 布局策略

**桌面端（>=1024px）：**

```
+----------------------------------+--------------+
|                                  |   Path Info  |
|     [Decision Tree Area]         |   ---------  |
|     (SVG, ~65%)                  |  Root -> ... |
|                                  |  -> hovered  |
|     Root                         |              |
|      /  \                        |  Conclusion  |
|    A1    A2                      |  (if terminal|
|    / \    \                      |  node hovered|
|   B1 B2   B3                     |              |
|                                  |  [CTA button]|
+----------------------------------+--------------+
```

- 左侧树区域：根节点居上，分支向下展开，终端节点底部
- 右侧面板：hover 路径信息（从根到当前节点的完整路径）+ 终端结论 + CTA
- 所有节点同时可见（全景展开），不使用折叠/展开

**平板端（768-1023px）：**

- 右侧面板固定 280px
- 树区域水平压缩，节点间距减小

**移动端（<768px）：**

```
+----------------------------------+
|  [Decision Tree Area]            |
|  (indented vertical list)        |
|  Root                            |
|    A1 (indent 24px)              |
|      B1 (indent 48px, terminal)  |
+----------------------------------+
|  Path info / conclusion overlay  |
|  (sticky bottom, X close btn)    |
+----------------------------------+
```

- 移动端树使用缩进竖向列表（而非水平展开），每个节点左缩进按层级递增（level x 24px），不使用水平布局
- tap-to-inspect 替代 hover
- tap 路径高亮后底部 overlay sticky（不随滚动消失），用户可自由滚动查看完整路径
- overlay 有明确的 X 关闭按钮

### 模板内嵌 schema

```jsx
/*
Schema: decision_tree
=====================
Required fields:
  title: string          -- 页面标题（如 "Technology Selection Decision Tree"）
  subtitle: string       -- 页面副标题（如 "Choose the right stack for your project"）
  nodes: Array<{
    id: string           -- 节点唯一标识（如 "root"）
    label: string        -- 节点显示文字（如 "What is your project type?"）
    kind: "question" | "factor" | "conclusion"
    detail: string       -- hover/tap 时显示的详细说明
    conclusion?: string  -- 终端节点的结论文字（仅 conclusion kind 有）
  }>
  edges: Array<{
    from: string         -- 源节点 id
    to: string           -- 目标节点 id
    label: string        -- 分支条件/标注（如 "Real-time"）
  }>
  cta?: {
    label: string        -- 按钮文字
    target: string       -- 链接地址
  }

Rules:
  - 必须有 1 个根节点（无 incoming edge 的节点）
  - conclusion 节点无 outgoing edge（叶节点）
  - question 节点有 >= 2 outgoing edge（决策点）
  - factor 节点可有 1 或 2 outgoing edge
  - nodes.length 建议 6-15，最大 20
  - kind 颜色：question=amber系, factor=gray系, conclusion=emerald系
  - 每个节点 level 由 BFS 从根计算，决定垂直位置
*/
```

### 交互详细定义

**全景展开（primary 交互）：**

- 所有节点同时可见，不折叠不隐藏
- 树结构通过 BFS 层级 + 水平分叉位置计算布局
- 树区域可滚动（当节点数 > 10 或移动端）

**hover 路径高亮（highest 交互）：**

- 桌面端：hover 任何节点 -> 从根到该节点的完整路径（所有节点 + 所有 edge）高亮 -> 该节点放大/详情浮层 -> 所有不在路径上的节点和 edge dimmed
- hover 终端节点(conclusion) -> 路径高亮 + 右侧面板显示完整路径描述 + 结论文字
- hover 非终端节点 -> 路径高亮 + 右侧面板显示从根到该节点的路径描述 + 该节点的 detail
- 移动端：tap 节点 -> 路径高亮 + 底部 overlay 显示路径信息/结论 -> tap 其他区域关闭
- hover/tap 结束恢复全景展示

**路径回溯（辅助）：**

- 右侧面板（桌面）/ 底部 overlay（移动）显示高亮路径的文本描述
- 格式：Root question -> branch label -> next node -> ... -> conclusion
- 路径描述随 hoveredNode 实时更新

### 示例数据：技术选型决策树

```jsx
const EXAMPLE_DATA = {
  title: 'Technology Selection Decision Tree',
  subtitle: 'Choose the right stack for your project',
  nodes: [
    { id: 'root', label: 'What is your project type?', kind: 'question',
      detail: 'Start by identifying the primary purpose of your project. This determines which technology path to explore.' },
    { id: 'web-app', label: 'Web Application', kind: 'factor',
      detail: 'Browser-based applications with rich UI and frequent user interaction.' },
    { id: 'data-pipeline', label: 'Data Pipeline / ML', kind: 'factor',
      detail: 'Backend data processing, ETL, or machine learning workflows with minimal UI.' },
    { id: 'mobile', label: 'Mobile App', kind: 'factor',
      detail: 'Native mobile experience on iOS and/or Android.' },
    { id: 'spa', label: 'SPA / Interactive UI', kind: 'question',
      detail: 'Single-page application with complex state management and real-time updates.' },
    { id: 'static-site', label: 'Static / Content Site', kind: 'question',
      detail: 'Content-focused site with minimal interactivity, SEO is critical.' },
    { id: 'real-time', label: 'Real-time Updates', kind: 'factor',
      detail: 'Application requires WebSocket, SSE, or frequent data refresh.' },
    { id: 'conventional', label: 'Conventional CRUD', kind: 'factor',
      detail: 'Standard form-based application with server-rendered or slowly updating pages.' },
    { id: 'react-spa', label: 'Choose React', kind: 'conclusion',
      detail: 'React excels at complex SPA with frequent state changes. Large ecosystem, flexible architecture.',
      conclusion: 'React + TypeScript is optimal for interactive SPAs with real-time data. Pair with Next.js for SSR when needed.' },
    { id: 'vue-spa', label: 'Choose Vue', kind: 'conclusion',
      detail: 'Vue provides a gentler learning curve with built-in reactivity. Great for teams new to frontend frameworks.',
      conclusion: 'Vue 3 + Vite is optimal for SPAs where developer experience and built-in conventions matter. Easier onboarding for new team members.' },
    { id: 'astro-site', label: 'Choose Astro', kind: 'conclusion',
      detail: 'Astro delivers fast static sites with island architecture. Zero JS by default, hydrate only interactive islands.',
      conclusion: 'Astro is optimal for content-heavy sites where performance and SEO are critical. Pair with Vue/React islands for interactive sections.' },
    { id: 'python-pipe', label: 'Choose Python', kind: 'conclusion',
      detail: 'Python dominates data/ML: NumPy, Pandas, PyTorch, FastAPI for serving models.',
      conclusion: 'Python + FastAPI is optimal for data pipelines and ML serving. Use Celery/Dask for distributed processing.' },
    { id: 'rust-pipe', label: 'Choose Rust', kind: 'conclusion',
      detail: 'Rust for high-throughput, low-latency pipelines where performance is critical.',
      conclusion: 'Rust is optimal when throughput and latency are hard constraints. Higher development cost, but unmatched runtime performance.' },
    { id: 'flutter-app', label: 'Choose Flutter', kind: 'conclusion',
      detail: 'Flutter for cross-platform mobile with a single codebase. Growing ecosystem, good performance.',
      conclusion: 'Flutter is optimal for cross-platform mobile apps where a single team maintains both platforms. Use Dart for consistency.' },
  ],
  edges: [
    { from: 'root', to: 'web-app', label: 'Web' },
    { from: 'root', to: 'data-pipeline', label: 'Data/ML' },
    { from: 'root', to: 'mobile', label: 'Mobile' },
    { from: 'web-app', to: 'spa', label: 'Interactive' },
    { from: 'web-app', to: 'static-site', label: 'Content' },
    { from: 'spa', to: 'real-time', label: 'Real-time needed' },
    { from: 'spa', to: 'conventional', label: 'Standard CRUD' },
    { from: 'real-time', to: 'react-spa', label: 'Complex state' },
    { from: 'real-time', to: 'vue-spa', label: 'Simpler DX' },
    { from: 'conventional', to: 'react-spa', label: 'Large team' },
    { from: 'conventional', to: 'vue-spa', label: 'Small team' },
    { from: 'static-site', to: 'astro-site', label: 'SEO critical' },
    { from: 'data-pipeline', to: 'python-pipe', label: 'Standard ML' },
    { from: 'data-pipeline', to: 'rust-pipe', label: 'Ultra-low latency' },
    { from: 'mobile', to: 'flutter-app', label: 'Cross-platform' },
  ],
  cta: { label: 'Start your selection', href: '#' },
};
```

### Decision Tree 特有视觉参数

| 参数 | 值 | 说明 |
|------|----|------|
| 树布局算法 | BFS 层级 + 同层水平均匀分布（适用 6-15 节点，同层 <=5 个子节点时布局紧凑；>5 个子节点时节点间距缩小至 64px，超出容器宽度时启用水平滚动） | 简单可靠，不需要自动布局库 |
| 树布局局限性 | 不平衡树（某层 >5 子节点）在桌面端可能需要水平滚动；移动端始终使用缩进竖向布局避免溢出。Reingold-Tilford 算法更优但不引入外部依赖 (R-11 external scan)。 | 设计约束说明 |
| 层级间距 | 48px vertical gap | 比 flow 的 24px 更大，因为树层级需要视觉分离 |
| 同层节点间距 | 32px horizontal gap | 与 flow 一致 |
| 节点样式 | 圆角矩形 96x48-160x72px, radius 8px | 与 flow 一致 |
| conclusion 节点 | 绿系背景 + 轻微 glow/shadow | 强调终端结论 |
| 分支连线 | SVG cubic bezier, 从父节点底部到子节点顶部 | 自上而下 |
| 分支标签 | 连线中点上方, 12-13px, 灰色衬底 | 与 flow edge label 一致 |
| 路径高亮 | 路径上的节点全亮 + 连线加粗(stroke 3px) + accent color | 高亮整条决策路径 |
| kind 颜色 | question=#F59E0B, factor=#6B7280, conclusion=#10B981 | question=amber, factor=gray, conclusion=emerald |

---

## 验收标准

### 通用（所有 2 个模板）

1. **路由识别**：用户说"做一个 React vs Vue 对比解释页面" / "做一个技术选型决策树" -> cc-design 识别为 explainer -> 加载对应模板 -> 生成完整可交互页面
2. **功能完整**：各模板的主交互（维度切换/全景展开）流畅，hover/tap 聚焦正确，入场动画无闪烁
3. **无控制台错误**：生成的页面在浏览器中打开即运行
4. **响应式**：桌面端完整布局，移动端降级布局 + tap-to-inspect
5. **Schema 遵循率**：每个模板用 3 个不同 prompt 测试生成结果，schema 遵循率 >= 2/3
6. **质量**：遵守 cc-design Iron Law、anti-slop 规则、节点图视觉规范
7. **无障碍**：prefers-reduced-motion 降级、键盘可导航、对比度合规（WCAG AA）
8. **品牌兼容**：颜色系统可被品牌克隆覆盖

### Compare 特有

9. **维度切换流畅**：点击维度标签 -> 对比项和连线正确切换，过渡动画无跳跃
10. **hover 详情正确**：hover 对比项 -> detail 浮层显示 -> 关联连线高亮 -> 其他项 dimmed
11. **跨对象连线**：跨对象连线在维度切换时正确显示/隐藏
11b. **Overview 模式显示正确**：进入时默认 overview，verdict 徽章 + 差异概要可见
11c. **从 overview 切换到维度时动画序列正确**：fade out -> fade in -> connections draw

### Decision Tree 特有

12. **全景展开正确**：所有节点和分支同时可见，布局不重叠
13. **路径高亮正确**：hover 任何节点 -> 从根到该节点的完整路径高亮，不在路径上的元素 dimmed
14. **终端结论显示**：hover conclusion 节点 -> 右侧面板显示结论文字
15. **路径描述**：右侧面板/底部 overlay 显示文本路径描述（Root -> branch -> ... -> node）
15b. **不平衡树滚动**：不平衡树（>5 子节点）在桌面端可水平滚动，移动端使用缩进竖向布局
15c. **移动端 overlay sticky**：移动端 tap 路径高亮 overlay sticky 不随滚动消失

---

## 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 修改 | `VERSION` | 版本升级 |
| 修改 | `load-manifest.json` | interactive-explainer taskType 新增 2 个模板 + 检测关键词补充（compare/comparison/versus/vs/decision tree/tech selection/choose between/architecture layers + 对比/比较/vs/决策树/选型/架构分层/分层解释） |
| 修改 | `SKILL.md` | 路由表补充 compare/DT 说明 + route-shaping 判断逻辑 |
| 修改 | `references/exit-conditions.md` | 新增两种模板的验收条件 |
| 修改 | `references/explainer-interaction-patterns.md` | 补充两种新模板的交互模式定义 |
| 修改 | `references/explainer-node-graph-visuals.md` | 补充对比/树布局的视觉参数 |
| 新增 | `templates/compare_explainer.jsx` | 对比解释模板（含完整 React vs Vue 示例数据，估算 1400-1700 行） |
| 新增 | `templates/decision_tree.jsx` | 决策树模板（含完整技术选型树示例数据，估算 1300-1600 行） |
| 运行 | `scripts/check-behavior-contract.sh` | 验证行为变更合规 |

---

## 5W1H 验证

- **Who:** AI/SaaS/Infra 产品团队、售前/GTM、技术布道者 -- 两种模板覆盖对比/决策两类高频解释场景
- **What:** cc-design 新增 2 个 explainer 模板（compare + decision_tree）+ 扩展参考文档 + 更新路由/验收配置 -- 共享 interactive-explainer taskType
- **When:** v0.2 做两个模板（compare + decision_tree），layer 推 v0.3
- **Where:** cc-design 现有架构内扩展，不改变 v0.1 已交付的 flow_explainer
- **Why:** v0.1 验证了基础架构，用户需要更多解释形态（对比、决策）覆盖更多沟通场景
- **How:** 共享框架（入场动画、dimming、响应式、状态机 entering/ready）+ 各模板自定义 sub-states + 模板内嵌 schema + 完整示例数据 -> AI 参考后替换数据部分

---

## v0.3 候选

- `layer_explainer.jsx` -- 分层架构解释（点击展开层 + 层间连线动画）
- `timeline_explainer.jsx` -- 时间线解释（如果 step 基础设施复用度高）
- 决策树路径回溯面包屑导航（从 conclusion 回溯到 root 的面包屑 UI）
- Compare 搜索/筛选维度（当维度数量 > 6 时）
- 跨模板组合（如 compare + flow 在同一页面）
- 独立 JSON Schema 文件（如果模板内嵌 schema 遵循率不达标）
- 深色模式支持