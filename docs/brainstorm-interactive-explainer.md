# 设计: Interactive Explainer — cc-design 扩展

## 背景

在 cc-design 内新增"解释型交互页面"输出能力。不新建独立项目，而是作为 cc-design 的一种新 taskType。

**核心目标：** 让 cc-design 能生成面向产品沟通、技术解释的交互式页面（flow/layer/compare），而非通用设计页面。

**约束：**
- 在 cc-design 现有架构内扩展
- 复用现有的设计参考、导出、质量门控
- 不做叙事编排、内容理解 pipeline
- 输出可以是纯 HTML 或 React 项目

---

## 假设

### 已验证
1. cc-design 的设计参考体系（58+ 文档）和导出基础设施（PDF/PNG/PPTX/MP4）可直接复用
2. load-manifest 路由系统可以自然扩展新的 taskType
3. 目标用户（AI/SaaS/Infra 产品团队）确实需要比 PPT 更好的解释资产

### 待验证
1. 解释型页面的视觉效果能否用纯 HTML/CSS/JS 达到，还是必须引入 PixiJS
2. Scene schema 的复杂度是否适合 AI 直接生成
3. flow/layer/compare 三种模板能否覆盖 80% 的解释场景

---

## 方案

### 方案 D: cc-design 内扩展（最终选择）

**核心思想：** 在 cc-design 内新增 `interactive-explainer` taskType，包含 scene schema + 模板 + 参考文档。不做独立项目，不做 pipeline。

**具体做法：**

1. **Scene Schema 设计**
   - 定义轻量 JSON schema（meta / nodes / edges / steps / cta）
   - 支持 flow / layer / compare 三种 sceneType
   - 作为 cc-design 的一种输入格式

2. **新增 taskType 到 load-manifest.json**
   - `interactive-explainer` taskType
   - 关联解释型设计参考（技术图表设计、节点图布局、step-by-step 模式）
   - 关联模板（flow-explainer / layer-explainer / compare-explainer）

3. **新增模板到 templates/**
   - `flow_explainer.html` — 左到右流程，step-by-step 播放
   - `layer_explainer.html` — 上到下分层架构
   - `compare_explainer.html` — 左右对比

4. **新增参考文档到 references/**
   - 技术图表设计原则
   - 节点图视觉规范
   - 解释型交互模式库

5. **更新 SKILL.md**
   - 新增 explainer 任务的识别和路由规则
   - 新增 schema 输入的处理逻辑

**优点：**
- 零新项目开销，利用 cc-design 现有的一切
- 设计质量、品牌克隆、导出全部现成
- 符合 cc-design 的"AI 输出高保真 HTML"的核心理念
- 最快可演示

**缺点：**
- 纯 HTML/CSS/JS 的图渲染能力有上限（复杂动画不如 PixiJS）
- cc-design 会变得更重

**风险：**
- 模板复杂度可能超出 cc-design 当前模板模式
- 缓解：先用 HTML 实现，如果复杂场景不够再引入轻量渲染库

---

## 不做清单

| 不做 | 原因 |
|------|------|
| 独立 Explainer OS 项目 | cc-design 已有基础设施，不必重复 |
| 5 层 pipeline（brief-parser 等全套） | 叙事编排层不需要，AI 直接处理 |
| PixiJS 渲染引擎 | 先用 HTML/CSS/SVG，验证不够再加 |
| React 项目输出（v0.1） | 先做纯 HTML，后续再加 React 模板 |
| 自由拖拽编辑器 | cc-design 的 AI 驱动模式不需要 |
| 多版本变体生成 | v2 功能 |
| objection-mapper / audience-lens | v2 功能 |
| Studio UI 应用 | 不需要 |

---

## 开放问题

1. **纯 HTML 能否达到足够的视觉效果** — 第一个 demo 会验证。节点图、路径动画、step 播放用 CSS + SVG 能做到什么程度？
2. **Scene schema 是否需要 JSON Schema validation** — 还是作为 AI 提示中的格式说明就够了？
3. **模板是内联模板还是外部文件** — cc-design 当前模板是 JSX 文件，explainer 模板用什么形式？

---

## 下一步

批准后 → `/refine` 细化 scene schema + 模板设计
