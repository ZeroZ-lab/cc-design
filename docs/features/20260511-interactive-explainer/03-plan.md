# Plan: Interactive Explainer — cc-design 扩展 (Final)

> Spec: `01-spec.md` (Final) | Design: `02-design.md` (Final) | Date: 2026-05-11

---

## Overview

在 cc-design 现有架构内新增 `interactive-explainer` taskType，包含 1 个 JSX 模板（flow_explainer.jsx）+ 2 份参考文档 + load-manifest/SKILL.md/README.md 路由更新。

## Task Breakdown

### T0: HTML+SVG 混合架构技术 Spike
**Priority:** P0 | **Complexity:** S | **Parallel:** No | **Depends:** None

**Description:**
在写完整模板前，先验证 HTML 节点 + SVG 叠加连线混合架构在 cc-design 的 React+Babel CDN 环境下的可行性。

**验证项：**
1. `getBoundingClientRect()` 在滚动容器中的坐标正确性（使用 `offsetTop/offsetLeft` 替代）
2. SVG overlay `pointer-events: none` 不阻挡 HTML 节点交互
3. `ResizeObserver` + debounce(50ms) 在 React CDN 环境中正常工作
4. `path.getTotalLength()` 动态计算 dasharray 在不同路径长度下的表现
5. 贝塞尔曲线控制点 `间距 × 40%` 偏移在不同节点间距下的视觉效果
6. 高 DPI 屏幕（devicePixelRatio ≠ 1）连线清晰度

**产出：** 一个最小 HTML 文件（3 节点 + 2 连线），验证上述 6 项。如果不可行，回退到纯 SVG 方案。

**Verification:**
- [ ] 浏览器打开无控制台错误
- [ ] 节点 hover/click 事件不被 SVG overlay 阻挡
- [ ] 连线端点与节点边缘对齐（视觉检查）
- [ ] 窗口 resize 后连线位置更新正确

---

### T1: 新增 explainer-interaction-patterns.md 参考文档
**Priority:** P0 | **Complexity:** S | **Parallel:** Safe | **Depends:** None

**Description:**
创建 `references/explainer-interaction-patterns.md`，内容基于 02-design.md KD2-KD4。

**Content outline:**
1. 交互优先级栈（entry < step < hover）
2. 完整状态转换表（11 行 from+trigger→to+behavior，来自 KD2）
3. Step-by-step 播放模式（导航控件位置/样式、高亮/暗化策略、过渡参数 expoOut 250ms）
4. Hover 聚焦 / Tap-to-inspect 模式（桌面端 hover 行为、移动端 tap 行为、与 step 状态冲突解决）
5. 入场动画模式
   - 节点 stagger 50ms + expoOut 400ms
   - 连线 stroke-dasharray + expoOut 600ms
   - 脉冲动态 dasharray + 4 次后停 + expoOut
   - **任意输入跳过入场动画**（click/keydown/touchstart → 直接 ready）
   - prefers-reduced-motion 降级（跳过动画 → 即时状态切换 → hover 用 outline）
6. Focus+Context 暗化策略（桌面端 opacity 0.35 + blur(4px)、移动端 opacity-only）
7. 响应式交互降级（三断点：≥1024 完整 / 768-1023 面板收窄 / <768 底部栏+tap）
8. 步骤面板布局参数（桌面 ~35% min 280px、平板固定 280px、移动 min-height 120px 可展开）

**Verification:**
- [ ] 覆盖 KD2/KD3/KD4 所有交互参数
- [ ] 包含完整 11 行状态转换表
- [ ] 包含"跳过入场动画"行为描述
- [ ] 与 L1.1 (animation-best-practices) 无矛盾

---

### T2: 新增 explainer-node-graph-visuals.md 参考文档
**Priority:** P0 | **Complexity:** S | **Parallel:** Safe | **Depends:** None

**Description:**
创建 `references/explainer-node-graph-visuals.md`，内容基于 02-design.md KD1/KD5。

**Content outline:**
1. 节点样式（统一圆角矩形 radius 8px、尺寸 96-160×48-72px）
2. 连线样式（SVG path 2px stroke、贝塞尔曲线控制点 = 间距×40%、手绘 `<polygon>` 箭头）
3. 调色板（input=#3B82F6, process=#6B7280, output=#10B981, decision=#F59E0B、文字 #1F2937、品牌色覆盖规则）
4. WCAG 对比度参考表（active/dimmed 各状态，Inf-3 数值）
5. 布局规则（水平 32px、zigzag 两行、移动端垂直 16-24px）
6. 背景色 #FAFAFA、字体参数（节点 14-15px semibold、面板 16-18px body）
7. SVG 渲染约束（pointer-events: none、ResizeObserver + debounce 50ms、container-relative 坐标）
8. 脉冲动画约束（dasharray 间隔 = path.getTotalLength() 动态计算、4 次后停、expoOut）
9. 无障碍（对比度、Tab+Enter、aria-label）

**Verification:**
- [ ] WCAG 数值与 Inf-3 一致
- [ ] 贝塞尔曲线参数明确（间距×40%）
- [ ] 脉冲 dasharray 动态计算有说明
- [ ] 调色板含品牌色覆盖指引

---

### T3: 创建 flow_explainer.jsx 模板
**Priority:** P0 | **Complexity:** L | **Parallel:** Unsafe | **Depends:** T0, T1, T2

**Description:**
创建 `templates/flow_explainer.jsx`，完整可交互的流程解释模板。

**Template structure:**
1. **Schema 注释块**（顶部，定义完整 schema + 示例数据）
2. **React 组件**：
   - FlowExplainer（主组件，管理 phase/currentStep/hoveredNode 状态）
   - FlowDiagram（HTML 节点容器 + SVG overlay 连线）
   - FlowNode（单个节点 div，kind 色编码，hover/tap 事件）
   - FlowEdge（SVG path + 箭头，位置从 getBoundingClientRect/offsetTop 计算）
   - StepPanel（桌面端右侧面板 / 移动端底部栏）
   - StepNav（prev/next 按钮 48×48px + 进度条）
   - DetailPopup（移动端 tap-to-inspect 浮层）
3. **完整 RAG pipeline 示例数据**（5 节点 + 5 步骤 + CTA）
4. **入场动画序列**（stagger 50ms + expoOut，任意输入跳过）
5. **Focus+Context 暗化**（桌面 opacity+blur, 移动 opacity-only）
6. **脉冲动画**（动态 dasharray via getTotalLength，4 次后停，expoOut）
7. **prefers-reduced-motion 降级**（CSS @media + JS matchMedia，跳过动画→即时切换→outline for hover）
8. **三断点响应式**（≥1024 / 768-1023 固定 280px / <768 底部栏）
9. **键盘导航**（← → 切换步骤、Tab 聚焦节点、Enter 显示 detail）
10. **Error boundary**（0 步骤→静态节点图无交互、单节点→无连线、schema 错误→控制台 warning 不崩溃）

**Technical constraints:**
- 使用 React+Babel CDN（同其他 cc-design 模板）
- 复用 animations.jsx 的 expoOut 函数（内联，不引入外部文件）
- 单文件 JSX，无外部依赖

**Verification:**
- [ ] 浏览器打开无控制台错误
- [ ] 入场动画：节点依次淡入 + 连线绘制 + 1.2s 内完成
- [ ] **入场动画跳过：点击/按键/触摸 → 立即显示所有节点 + step 0**
- [ ] Step-by-step：5 步骤全部可切换，高亮/暗化正确
- [ ] Hover 聚焦：桌面端节点 hover → detail 显示 + 关联连线高亮
- [ ] Tap-to-inspect：移动端点击节点 → 浮层显示
- [ ] prefers-reduced-motion：跳过动画，即时状态切换，hover 用 outline
- [ ] 响应式桌面 (≥1024px)：右侧面板 ~35%，图表 ~65%
- [ ] 响应式平板 (768-1023px)：右侧面板固定 280px
- [ ] 响应式移动 (<768px)：底部固定栏 + 垂直布局 + tap-to-inspect
- [ ] 键盘：← → Tab Enter 全部工作
- [ ] CTA 在最后步骤显示，hover 时不被压制
- [ ] 脉冲动画 4 次后停止
- [ ] Schema 注释 + RAG 示例数据完整
- [ ] Error boundary：0 步骤不崩溃

---

### T4: 更新 load-manifest.json
**Priority:** P0 | **Complexity:** S | **Parallel:** Safe | **Depends:** T3

**Description:**
在 `load-manifest.json` 的 `taskTypes` 中新增 `interactive-explainer` 条目。

**Changes:**
```json
"interactive-explainer": {
  "description": "Interactive explainer pages, flow diagrams, product process explainers, architecture walkthroughs, 交互式解释页面, 流程解释, 交互式流程图",
  "detect": {
    "anyKeywords": [
      "interactive explainer", "interactive flow diagram", "explain how",
      "product flow diagram", "system flow explainer", "interactive process",
      "交互式解释", "流程解释", "交互式流程图", "解释页面", "产品流程图", "技术解释"
    ]
  },
  "references": [
    "references/explainer-interaction-patterns.md",
    "references/explainer-node-graph-visuals.md",
    "references/react-setup.md"
  ],
  "templates": [
    "templates/flow_explainer.jsx"
  ]
}
```

注意：`references` 包含 `react-setup.md`（与其他 React 模板 taskType 一致）。关键词避免 "interactive flow"（与 interactive-prototype 冲突）。

**Verification:**
- [ ] JSON 语法正确
- [ ] detect 关键词不与 interactive-prototype / data-visualization / design-system-architecture 重叠
- [ ] references 包含 react-setup.md
- [ ] references 和 templates 路径指向已存在的文件

---

### T5: 更新 SKILL.md + README.md + references/workflow.md
**Priority:** P0 | **Complexity:** M | **Parallel:** Unsafe | **Depends:** T4

**Description:**
同步更新 SKILL.md、README.md、references/workflow.md 三个行为契约文件（check-behavior-contract.sh 要求）。

**SKILL.md changes:**
1. Routing Table 新增行：

| Task type | Load reference | Copy template | Verify focus |
|-----------|---------------|---------------|-------------|
| **Interactive explainer** | `references/explainer-interaction-patterns.md` + `references/explainer-node-graph-visuals.md` + `references/react-setup.md` | `templates/flow_explainer.jsx` | Step-by-step playback + hover/tap interaction + responsive |

2. Route-Shaping Questions 补充 explainer 判断：
   - "解释流程/机制/架构" + "交互" → interactive-explainer
   - "可点击原型" + "产品演示" → interactive-prototype（不是 explainer）
   - "图表/数据展示" → data-visualization（不是 explainer）

**README.md changes:**
- 在支持的任务类型列表中新增 "Interactive Explainer" + 简短描述

**references/workflow.md changes:**
- 如果 workflow.md 包含 taskType 路由逻辑，补充 explainer 的路由说明

**Verification:**
- [ ] Routing Table 行格式与现有行一致
- [ ] 路由判断逻辑与 load-manifest.json 对齐
- [ ] README.md 已更新
- [ ] references/workflow.md 已更新（如适用）

---

### T6: 更新 exit-conditions.md
**Priority:** P1 | **Complexity:** S | **Parallel:** Safe | **Depends:** None

**Description:**
在 `references/exit-conditions.md` 新增 `Interactive Explainer` 验收条件。

**Content:**
- 所有步骤可导航（键盘 ← → + 点击 prev/next）
- Hover 聚焦正确显示 detail 并高亮关联连线（桌面端）
- Tap-to-inspect 在移动端正常工作
- 入场动画遵守 prefers-reduced-motion（跳过 + 即时切换 + outline）
- 任意输入可跳过入场动画
- 响应式三断点：桌面 ≥1024px、平板 768-1023px、移动 <768px
- 脉冲动画播放有限次数后停止
- 节点颜色 WCAG AA 合规
- Schema 注释 + 完整示例数据存在

**Verification:**
- [ ] 格式与现有 exit-conditions 条目一致

---

### T7: 版本升级 + 行为契约验证
**Priority:** P0 | **Complexity:** S | **Parallel:** Unsafe | **Depends:** T5

**Description:**
1. 更新 `VERSION` 文件（0.5.1 → 0.6.0）
2. 运行 `scripts/check-behavior-contract.sh` 验证行为变更合规（现在应通过，因为 SKILL.md + README.md + workflow.md 已在 T5 同步更新）
3. 按 CLAUDE.md 发布规则检查

**Verification:**
- [ ] VERSION 已更新
- [ ] check-behavior-contract.sh 通过
- [ ] CLAUDE.md 发布清单全部完成

---

### T8: 端到端验收测试
**Priority:** P0 | **Complexity:** L | **Parallel:** Unsafe | **Depends:** T3, T4, T5, T6, T7

**Description:**
用 5 个不同 prompt 测试完整链路，验证 schema 遵循率 ≥ 4/5。由 AI 执行测试，截图验证。

**Test prompts:**
1. "做一个 RAG pipeline 交互式解释页面"（核心场景）
2. "Create an interactive flow diagram showing how an AI agent processes user requests"（英文）
3. "解释一个微服务架构的请求处理流程"（复杂场景）
4. "Make an interactive explainer for a CI/CD deployment pipeline"（英文，非 AI 场景）
5. "展示 OAuth 2.0 授权码流程"（安全相关）

**对每个测试验证：**
- 路由是否正确识别为 interactive-explainer（不是 interactive-prototype / data-visualization）
- 参考文档和模板是否正确加载
- 生成的 HTML 是否无控制台错误
- Step-by-step 播放是否正常
- 响应式布局是否正确
- Schema 是否被正确遵循（nodes/steps/edges 字段完整，引用关系正确）

**Schema 遵循率计算：** 每个测试检查 5 项（nodes 正确、steps.focus 引用正确、edges.from/to 正确、step narrative 格式正确、CTA 正确），全部通过 = 遵循。≥4/5 通过。

**Verification:**
- [ ] 5/5 测试通过，或 ≥4/5 通过 + 失败的有明确修复路径

---

## Dependency Graph

```
T0 (spike) ──────────────────┐
                              │
T1 (ref: interaction) ───────┤
                              ├──► T3 (template) ──► T4 (manifest) ──► T5 (SKILL+README+workflow) ──► T7 (version)
T2 (ref: node visuals) ──────┘
                                                                        │
T6 (exit-conditions) ──────────────────────────────────────────────► T8 (e2e test)
```

## Parallel Execution

**Wave 1（并行）：** T0 + T1 + T2 + T6
**Wave 2（串行）：** T3（依赖 T0+T1+T2）
**Wave 3（串行）：** T4（依赖 T3）
**Wave 4（串行）：** T5（依赖 T4）
**Wave 5（串行）：** T7（依赖 T5）
**Wave 6（串行）：** T8（依赖全部）

## Complexity Summary

| Task | Complexity | Est. Tokens | Risk |
|------|-----------|-------------|------|
| T0 | S | ~2K | Medium — 架构验证，可能需要回退 |
| T1 | S | ~2K | Low — 纯文档 |
| T2 | S | ~2K | Low — 纯文档 |
| T3 | L | ~8K | High — 首个交互模板 |
| T4 | S | ~0.5K | Low — JSON 配置 |
| T5 | M | ~2K | Medium — 三个文件同步 |
| T6 | S | ~0.5K | Low — 文档更新 |
| T7 | S | ~0.2K | Low — 版本号+脚本 |
| T8 | L | ~6K | High — 5 个 e2e 测试场景 |

**Total: ~23K tokens estimated**
