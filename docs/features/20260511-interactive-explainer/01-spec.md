# Spec: Interactive Explainer — cc-design 扩展 (Final)

## artifact_type
`software` — 在 cc-design 现有架构内新增 taskType + 模板 + 参考文档

## 背景

cc-design 目前能输出高保真设计页面（落地页、幻灯片、移动端原型等）。本 spec 新增"交互式解释页面"输出能力——面向产品沟通、技术解释的交互式网页，本质还是 HTML 页面，但有更多有目的性的交互（步骤播放、hover 聚焦、节点动画）。

**价值定位：** 现有用户增强。让已安装 cc-design 的用户多一种输出能力，用于解释产品流程、技术架构和方案对比。

**痛点场景：**
1. 售前需要在客户面前实时解释架构，静态 PPT 不够，手绘太粗糙
2. 技术博客作者需要 embed 一个可交互的流程图，Excalidraw 输出不够精美，手写 SVG 太费时间
3. PM 需要给非技术利益相关者解释 RAG pipeline，截图看不懂，录屏太长

## 核心原则

1. **解释优先** — 每个交互元素的存在是为了推进理解，不是装饰
2. **JSX 模板** — 与 cc-design 现有模板系统一致，使用 React+Babel CDN，AI 对这个模式熟悉
3. **模板内嵌 schema** — 数据结构定义在模板注释内，模板包含完整示例数据，AI 参考后替换数据部分
4. **复用 cc-design 基础设施** — 设计参考体系、导出链路、质量门控全部复用

## 目标用户

| 角色 | 场景 |
|------|------|
| AI/SaaS/Infra 产品团队 | 解释产品原理、架构优势、功能链路 |
| 售前/GTM 团队 | 方案演示、流程讲解、竞品对比 |
| 技术作者/布道师 | 技术机制可视化、Agent workflow、RAG 链路 |

## v0.1 范围

### 做

1. **新增 taskType `interactive-explainer`** 到 `load-manifest.json`
   - 仅关联 flow_explainer.jsx + 2 份参考文档
   - 检测关键词（精确化，避免与 interactive-prototype / data-visualization 路由冲突）：
     - 英文：interactive explainer, interactive flow diagram, explain how X works, product flow diagram, system flow explainer
     - 中文：交互式解释, 流程解释, 交互式流程图, 解释页面, 产品流程图
   - 不匹配的关键词：flow chart（→ data-visualization）、product demo（→ interactive-prototype）、architecture diagram（→ design-system-architecture）

2. **1 个 JSX 模板** 到 `templates/`
   - `flow_explainer.jsx` — 左到右流程（桌面端）/ 上到下（移动端），支持 step-by-step 播放 + hover 聚焦 + 入场动画

3. **2 份参考文档** 到 `references/`
   - `explainer-interaction-patterns.md` — 交互模式库（详见下文）
   - `explainer-node-graph-visuals.md` — 节点图视觉规范（详见下文）

4. **更新 SKILL.md 路由表**
   - Routing Table 新增 `interactive-explainer` 行
   - Route-Shaping Questions 补充 explainer 判断逻辑

5. **更新 exit-conditions.md**
   - 新增 `Interactive Explainer` 部分的验收条件

### 不做

| 不做 | 原因 |
|------|------|
| layer_explainer / compare_explainer | v0.2，v0.1 先验证 flow 链路 |
| 独立 JSON Schema 文件 | v0.1 用模板内嵌 + 完整示例数据 |
| PixiJS / Canvas / WebGL | SVG 在 8 节点规模完全够用 |
| 自由拖拽编辑器 | cc-design 的 AI 驱动模式不需要 |
| 叙事编排 pipeline | AI 直接处理 |
| 多版本变体生成 | v2 |
| 自动布局算法 | 模板定义布局位置规则，AI 只填充数据 |
| 深色模式 | v0.1 复用品牌色系统 |

## 交互优先级栈

三种交互模式在不同时间层运行，需要明确的优先级：

```
入场动画 < step-by-step 播放 < hover 聚焦
```

- **入场动画**：页面加载时运行一次，首次用户输入（点击/按键/触摸）后立即跳过
- **step-by-step**：主要会话状态，始终可见的导航控件
- **hover 聚焦**：瞬态覆盖层，激活时压制 step 高亮，鼠标移出后恢复当前步骤状态
- **移动端**：hover 不存在，用 tap-to-inspect 替代（点击节点显示详情面板，点击其他区域或返回箭头关闭）

## flow_explainer.jsx 详细定义

### 布局策略

**关键决策：节点 = HTML/CSS，连线 = SVG 叠加层**

- 节点用 HTML 元素 + CSS flexbox/grid 布局（不靠 AI 算坐标）
- 连线用 SVG 叠加层绘制，位置通过 `getBoundingClientRect()` 读取节点位置
- 桌面端（≥1024px）：左到右水平布局
- 移动端（≤768px）：上到下垂直布局 + 固定底部步骤导航栏

### 节点数量与溢出

- 推荐：≤ 6 节点（单行水平布局）
- 最大：≤ 8 节点（超过 6 个时允许两行 zigzag 布局）
- 硬上限：12 节点（超过时模板内显示警告）
- 移动端：超过 5 个节点时垂直滚动 + sticky 步骤面板

### 模板内嵌 schema

模板顶部注释定义 schema，模板内包含一个完整填充的 RAG pipeline 示例数据：

```jsx
/*
Schema: flow_explainer
======================
Required fields:
  title: string          — 页面标题（如 "RAG Answer Pipeline"）
  subtitle: string       — 页面副标题（如 "How the system retrieves, filters, and answers"）
  nodes: Array<{
    id: string           — 节点唯一标识（如 "user"）
    label: string        — 节点显示文字（如 "User Query"）
    kind: "input" | "process" | "output" | "decision"
    detail: string       — hover/tap 时显示的详细说明
  }>
  edges: Array<{
    from: string         — 源节点 id
    to: string           — 目标节点 id
    label?: string       — 连线上的标注文字
  }>
  steps: Array<{
    id: string           — 步骤标识
    focus: string[]      — 当前步骤高亮的节点 id 列表
    headline: string     — 步骤标题
    body: string         — 步骤详细说明
  }>
  cta?: {
    label: string        — 按钮文字
    target: string       — 链接地址
  }

Rules:
  - nodes.length 建议 3-8，最大 12
  - 每个 step.focus 必须引用存在的 node id
  - 每个 edge.from/to 必须引用存在的 node id
  - kind 决定节点颜色：input=蓝系, process=灰/品牌色, output=绿系, decision=橙系菱形
*/
```

### 步骤导航面板

- 桌面端：右侧面板（与流程图并列），显示当前步骤的 headline + body
- 移动端：固定底部栏，prev/next 按钮尺寸 ≥ 44px + 步骤进度指示
- 支持：点击按钮、键盘左右箭头、移动端滑动（可选）

### CTA 策略

- CTA 在最后一个步骤时显示在步骤面板底部
- 未到最后步骤时不显示，避免过早干扰

## 交互模式详细定义

### Step-by-step 播放
- 切换步骤时：focus 节点高亮（边框/背景色增强），非 focus 节点变暗（opacity 降低 + 轻微 blur）
- 连线高亮：与 focus 节点关联的连线变亮/变色，非关联连线进一步变暗
- 过渡动画：CSS transition，300ms ease

### Hover 聚焦（桌面端）/ Tap-to-inspect（移动端）
- 桌面端：鼠标悬停节点 → 节点放大/高亮 + 显示 detail 浮层 + 关联连线高亮 → 鼠标移出恢复
- 移动端：点击节点 → 显示 detail 面板 + 关联连线高亮 → 点击其他区域或返回箭头关闭
- hover/tap 激活时压制当前步骤高亮

### 入场动画
- 页面加载时节点依次淡入 + 轻微位移（stagger 100ms）
- 连线在两端节点出现后绘制（stroke-dasharray + stroke-dashoffset CSS 动画）
- 数据流方向用脉冲动画表示（stroke-dasharray 渐进动画）
- 首次用户输入后跳过入场动画
- 遵守 `prefers-reduced-motion`（CSS @media + JS `window.matchMedia` 双重检查）

### 节点颜色编码与无障碍
- 节点 kind 颜色需满足 WCAG AA 对比度（active 状态 ≥ 4.5:1，dimmed 状态 ≥ 3:1）
- 颜色编码：input=蓝系、process=灰/品牌色、output=绿系、decision=橙系
- dimmed 状态：opacity 0.4，不使用额外 blur（移动端性能考虑）

## 参考文档内容大纲

### explainer-interaction-patterns.md

1. 交互优先级栈（entry < step < hover）
2. Step-by-step 播放模式
   - 导航控件位置与样式
   - 节点高亮/变暗策略
   - 连线高亮策略
   - 过渡动画参数
3. Hover 聚焦 / Tap-to-inspect 模式
   - 桌面端 hover 行为
   - 移动端 tap 行为
   - 与 step 状态的冲突解决
4. 入场动画模式
   - 节点 stagger 淡入
   - 连线 stroke-dasharray 绘制
   - 数据流脉冲
   - prefers-reduced-motion 降级
5. 响应式交互降级策略
   - 桌面端（≥1024px）：完整交互
   - 平板（768-1023px）：简化布局 + 保留 step 和 tap
   - 手机（≤767px）：垂直布局 + 固定底部导航 + tap-to-inspect

### explainer-node-graph-visuals.md

1. 节点样式
   - 尺寸：最小 80×48px，最大 160×80px
   - 形状：圆角矩形（radius 8px），decision 为菱形
   - 颜色：按 kind 编码 + 品牌色覆盖规则
   - 文字：节点内 label，14-16px，单行截断
2. 连线样式
   - SVG path，stroke 2px，带箭头（手绘箭头元素，不用 SVG marker 以避免动画冲突）
   - 标签：连线中点上方，12-13px，灰色背景衬底
   - 动画：stroke-dasharray 渐进绘制 + 脉冲效果
3. 布局规则
   - 水平布局：节点间距 24-32px，居中对齐
   - zigzag 布局：第二行节点右移半个间距，连线用贝塞尔曲线
   - 移动端垂直布局：节点间距 16-24px，左对齐
4. 无障碍
   - 对比度要求（active ≥ 4.5:1，dimmed ≥ 3:1）
   - 键盘可导航（Tab 到节点，Enter 显示 detail）
   - aria-label 用于节点和连线

## 验收标准

1. **路由识别**：用户说"做一个 RAG pipeline 交互式解释页面" → cc-design 识别为 explainer 任务 → 加载对应参考和模板 → 生成完整可交互的页面
2. **功能完整**：step-by-step 播放流畅，hover 聚焦正确，入场动画无闪烁
3. **无控制台错误**：生成的页面在浏览器中打开即运行
4. **响应式**：桌面端完整布局，移动端垂直布局 + 触摸步骤切换 + tap-to-inspect
5. **Schema 遵循率**：用 5 个不同 prompt 测试生成结果，schema 遵循率 ≥ 4/5
6. **质量**：遵守 cc-design Iron Law、anti-slop 规则、节点图视觉规范
7. **无障碍**：prefers-reduced-motion 降级、键盘可导航、对比度合规
8. **品牌兼容**：颜色系统可被品牌克隆覆盖

## 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 修改 | `load-manifest.json` | 新增 `interactive-explainer` taskType |
| 修改 | `SKILL.md` | 路由表新增 explainer 行 |
| 修改 | `references/exit-conditions.md` | 新增 Interactive Explainer 条目 |
| 新增 | `templates/flow_explainer.jsx` | 流程解释模板（含完整 RAG 示例数据） |
| 新增 | `references/explainer-interaction-patterns.md` | 交互模式库 |
| 新增 | `references/explainer-node-graph-visuals.md` | 节点图视觉规范 |
| 修改 | `VERSION` | 版本升级 |
| 运行 | `scripts/check-behavior-contract.sh` | 验证行为变更合规 |

## 5W1H 验证

- **Who:** AI/SaaS/Infra 产品团队、售前/GTM、技术布道者 ✓
- **What:** cc-design 新增 interactive-explainer taskType + flow_explainer.jsx 模板 + 2 参考文档 ✓
- **When:** v0.1 范围明确（仅 flow），layer/compare 推 v0.2 ✓
- **Where:** cc-design 现有架构内扩展 ✓
- **Why:** 现有用户需要比静态 PPT 更好的解释资产，市场无同类工具 ✓
- **How:** 新 taskType → 加载参考+模板 → AI 基于 schema 和示例数据生成可交互 JSX ✓

## v0.2 候选

- `layer_explainer.jsx` — 上到下分层架构
- `compare_explainer.jsx` — 左右/上下对比
- `timeline_explainer.jsx` — 时间线（如果 step 基础设施复用度高）
- 独立 JSON Schema 文件（如果模板内嵌 schema 遵循率不达标）
