# cc-design Skill 全面优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 通过核心约束前置 + 7 场景域 routing + verification 合并,全面提升 cc-design 输出质量并精简架构(0.9.3 → 0.10.0)。

**Architecture:** 新建 `core-constraints.md` 作为始终加载的高密度约束层(摘要+索引,非替换);SKILL.md 重写为约束前置的调度器;load-manifest.json 新增 `domains` 顶层键并对 15 个浅约束 taskType 补充 core-constraints.md;废弃过时的 verification.md,确立 verification-protocol.md 为唯一权威源。

**Tech Stack:** Markdown(references/SKILL/workflow)、JSON(load-manifest)、Node.js ESM(lint/catalog 脚本)、Bash(check-behavior-contract)。

## Global Constraints

- **VERSION 必须 bump**:本计划改动 SKILL.md/README.md/workflow.md(behavior-contract 文件),`check-behavior-contract.sh` 要求 VERSION 同步变更。最终版本 `0.10.0`。
- **不删除任何 taskType**:只在 load-manifest.json 新增 `domains` 键,现有 taskTypes 结构保持不变。
- **不合并 *-theory.md**:visual/layout/interaction/information/system/brand-emotion-theory 共 6 个文件保持独立(YAGNI)。
- **core-constraints.md 是摘要+索引**:不替换原文件,原文件作为展开层保留。
- **测试基础设施**:lint 通过 `node scripts/lint-load-manifest.mjs`,catalog 通过 `node scripts/generate-bundle-catalog.mjs`,行为契约通过 `./scripts/check-behavior-contract.sh <base-ref>`。
- **manifest 路径验证**:lint-load-manifest.mjs 会验证 manifest 引用的所有路径必须存在,且 references/ 下所有 .md 必须被 manifest 引用。删除 verification.md 后,manifest 中对其的引用必须同步清除。

---

## File Structure

| 文件 | 操作 | 职责 |
|---|---|---|
| `references/core-constraints.md` | **新建** | 始终加载的高密度核心约束层(Iron Law + Slop 速查 + 禁字体 + 交付清单 + STOP 信号 + Scale + 索引) |
| `references/verification.md` | **删除** | 过时文件,内容已被 protocol 取代,有价值部分迁入 protocol |
| `SKILL.md` | 修改 | 约束前置(⚡ Core Constraints 置顶)+ Routing 改 7 场景域 + 删除占位章节 |
| `load-manifest.json` | 修改 | 新增 domains 键 + all-design-tasks 加 core-constraints + 15 浅 taskType 补约束 + 清理 verification.md 引用 |
| `references/verification-protocol.md` | 修改 | 吸收 verification.md 的 Screenshot Best Practices + Troubleshooting + Phase 3 指针 |
| `references/design-checklist.md` | 修改 | 降级为 protocol 附录 + 删除 Category 4 Anti-AI Slop 改指针 |
| `references/workflow.md` | 修改 | 引用更新 + Stage 2 路由说明改为域→taskType 两步 |
| `README.md` | 修改 | 同步行为契约(VERSION 引用) |
| `VERSION` | 修改 | 0.9.3 → 0.10.0 |
| `scripts/generate-bundle-catalog.mjs` | 修改 | 输出 domains 分组信息 |
| `scripts/lint-load-manifest.mjs` | 修改 | 新增 lint 规则:taskType 必须归属 domain + all-design-tasks 必须含 core-constraints |

---

## Task 1: 新建核心约束层 core-constraints.md

**Files:**
- Create: `references/core-constraints.md`

**Interfaces:**
- Produces: `references/core-constraints.md`(被 Task 2 的 load-manifest 引用,被 Task 4 的 SKILL.md 指向,被 Task 6 的 workflow.md 指向)

- [ ] **Step 1: 创建 core-constraints.md(7 区块,~180 行)**

Create `references/core-constraints.md`:

````markdown
# Core Constraints — 始终加载的核心约束层

> **Load when:** Every design task(all-design-tasks 基础必载包第一位)。
> **Role:** 本文件是摘要+索引,不是替换。完整规则见各区块末尾的"详见"指针。

---

## §1 Iron Law(违反 = 硬停止)

1. **No unchecked fact = no design decision** — 陈述品牌/产品/价格/发布状态/规格前,必须先 WebSearch 验证。猜 = 返工。
   - ❌ 禁止:"I remember…"/"As far as I know…"/"It should be like this"(指可查事实时)
   - ✅ 无法验证时:"I cannot confirm this — please check."
2. **No AI slop patterns. Ever.** — 见 §2 速查表。违反则删除并替换为最简替代,不要争论哪个"没那么糟"。
3. **No screenshot after final edit = no delivery.** — 代码审查永远不够。每次最终编辑后必须渲染 + 截图 + 逐 section 检查。

详见 `references/design-iron-law.md`。

---

## §2 AI Slop 速查表(违反即删)

| 模式 | 一句话识别 | 替代方案 |
|---|---|---|
| 全屏紫粉蓝渐变 | rainbow/mesh/purple→pink→blue | 单色微妙渐变或纯色;必要用时仅作 hover 微 accent |
| 圆角卡 + 左边框色 | `border-radius + border-left: 4px solid` | 背景对比/字重对比/分隔线/不用卡 |
| emoji 装饰 | 🚀✨💡🎯 在标题/特性/CTA 前 | 真图标库(Lucide/Heroicons/Phosphor)或留空 |
| SVG 画人物/场景/物体 | AI 风插画,blob 角色 | 灰色占位框 + 文字标签"Illustration Placeholder WxH" |
| 假数据/假评价 | "10000+ users"/"99.9% uptime" 无来源 | 占位符"Your metric here"或向用户索取真实数据 |
| bento grid(非必要) | 所有 landing 都想做 bento | 按 信息结构选布局,非必要不用 |
| dark mode slop | `#0D1117` + neon + glowing border | 仅开发者工具类产品用,且需有意为之 |
| glassmorphism slop | 三层 frosted glass 叠加 + 全屏 blur | glass 仅作 accent,不作整体设计语言 |
| illustration slop | flat vector + pastel + 挥手角色 | 真实摄影,或不用 |
| stats section slop | 四个数字一排无来源无上下文 | 有真实数据才放,并给上下文;否则删 |
| feature slop | 3 列 icon+title+desc,三列听起来一样 | 真产品有价值差异才用;否则重构信息 |
| badge slop | "New/Popular/Beta/🔥" 贴满 | badge 仅用于真实例外,不用于装饰 |

详见 `references/content-guidelines.md`(完整规则)与 `references/anti-patterns/`(分场景反模式)。

---

## §3 禁用字体

❌ Inter / Roboto / Arial / Helvetica / Fraunces / Space Grotesk / 纯 system font stack

✅ 替代方向:
- Serif display + sans body(editorial 感)— 如 Instrument Serif + Geist Sans
- Mono display + sans body(technical 感)— 如 JetBrains Mono + Suisse Int'l
- Heavy display + light body(强对比)
- Google Fonts 小众好选择:Instrument Serif / Cormorant / Bricolage Grotesque / JetBrains Mono

不要凭空捏造字体名。

详见 `references/content-guidelines.md` Typography Traps。

---

## §4 交付前必查清单(Mandatory Pre-Delivery)

**结构检查:**
- [ ] console 无 error(`browser_console_messages` level: error → 0)
- [ ] 所有目标 viewport 已测试(至少 desktop + 1 个窄屏)
- [ ] 每个 touched section 已独立截图(不止首屏)

**视觉检查:**
- [ ] 字号符合 scale(slides ≥24px / web ≥14px / mobile ≥16px)
- [ ] 间距为 8px 倍数
- [ ] 对比度 ≥ 4.5:1(WCAG AA)

**slop 检查:** 逐项过 §2 的 12 项,任何一项命中 = 删除并替换。

详见 `references/verification-protocol.md`(完整三阶段协议)。

---

## §5 STOP Signals(命中即停并重评)

| 信号 | 含义 | 动作 |
|---|---|---|
| 颜色靠记忆,非从品牌资产提取 | 设计上下文失败 | STOP. 提取真实品牌色 |
| 间距无一致 scale | 缺设计系统 | STOP. 先建立 8px scale |
| Hero 精致,其余崩 | 选择性验证 | STOP. 逐 section 独立验证 |
| 编造数据/评价 | P0 违反,不可修复 | STOP. 删除,用占位符或真实来源 |
| 字体无角色理由就选定 | 装饰优于系统 | STOP. 按角色分配,至多 2 核心 + 1 mono |
| 所有 section 用同一布局 | 模式懒惰 | STOP. 按内容类型变化布局密度 |
| 元素用于填空白 | 怕留白 | STOP. 留白是设计元素,不填 |
| 交互元素无状态覆盖 | 交互设计不完整 | STOP. 每个 interactive 元素需 default/hover/active/(disabled)/(error) |

详见 `references/design-red-flags.md`(完整自省信号表)。

---

## §6 Scale Specs(最小字号)

| 场景 | 最小字号 |
|---|---|
| Slides (1920×1080) | body ≥ **24px**(理想 28-36px),title 60-120px |
| Web | body ≥ **14px**,hit target ≥ **44×44px** |
| Mobile | body ≥ **16px**(避免 iOS auto-zoom) |
| Print | body ≥ **10pt**(~13.3px),caption 8-9pt |
| 对比度 | body vs bg ≥ **4.5:1**,large text ≥ **3:1** |
| 行高 | 1.5-1.7(CKJ 1.7-1.8) |

详见 `references/content-guidelines.md` Scale Specifications。

---

## §7 Deep-Dive Index(展开层)

本文件是摘要。需要深入时,按主题查阅:

| 主题 | 展开文件 |
|---|---|
| 完整 slop 规则与 CSS 示例 | `references/content-guidelines.md` |
| 分场景反模式(color/layout/typography/interaction) | `references/anti-patterns/{color,layout,typography,interaction}.md` |
| 完整自省信号 + 人类伙伴信号 | `references/design-red-flags.md` |
| 常见说辞 debunk | `references/design-common-sayings.md` |
| 验证协议全流程(三阶段 + fix loop) | `references/verification-protocol.md` |
| Iron Law 完整定义 | `references/design-iron-law.md` |
````

- [ ] **Step 2: 验证文件创建且格式正确**

Run: `test -f references/core-constraints.md && wc -l references/core-constraints.md`
Expected: 文件存在,行数约 180 行(±20)

- [ ] **Step 3: 验证 markdown 无语法错误**

Run: `grep -c "^## §" references/core-constraints.md`
Expected: `7`(7 个区块)

- [ ] **Step 4: Commit**

```bash
git add references/core-constraints.md
git commit -m "feat: add core-constraints.md high-density constraint layer (v0.10.0 stage 1)

Always-loaded single source of truth condensing anti-slop rules, Iron Law,
delivery checklist, STOP signals, and scale specs from 6 scattered files
into one indexed summary layer."
```

---

## Task 2: load-manifest.json — 基础层改动(无破坏性)

**Files:**
- Modify: `load-manifest.json`

**Interfaces:**
- Consumes: Task 1 的 `references/core-constraints.md`
- Produces: all-design-tasks 包含 core-constraints.md;domains 顶层键;15 浅 taskType 补约束

- [ ] **Step 1: all-design-tasks.references 首位加 core-constraints.md**

在 `load-manifest.json` 的 `defaults.all-design-tasks.references` 数组中,在 `references/design-excellence.md` **之前**插入 `references/core-constraints.md`。

修改 `load-manifest.json` 第 5-23 行,将:
```json
      "references": [
        "references/design-excellence.md",
```
改为:
```json
      "references": [
        "references/core-constraints.md",
        "references/design-excellence.md",
```

- [ ] **Step 2: 新增 domains 顶层键**

在 `load-manifest.json` 的 `"defaults": { ... },` 之后、`"taskTypes": {` 之前,插入 `domains` 键:

```json
  "domains": {
    "output": {
      "description": "产出物:决定 HTML 的形态与结构",
      "taskTypes": ["landing-page", "slide-deck", "interactive-prototype", "interactive-explainer", "knowledge-artifact", "animation-motion", "wireframe-low-fi", "design-system-creation", "data-visualization", "scene-output-specs"]
    },
    "device": {
      "description": "设备框架:决定渲染容器与交互范式",
      "taskTypes": ["mobile-mockup", "desktop-mockup", "react-prototype"]
    },
    "brand": {
      "description": "品牌/风格:决定视觉调性与设计语言",
      "taskTypes": ["brand-style-clone", "brand-asset-acquisition", "brand-tone", "choose-design-style", "no-design-system"]
    },
    "export": {
      "description": "导出:决定交付格式与后处理",
      "taskTypes": ["editable-pptx-export", "pdf-export", "video-export", "audio-design"]
    },
    "domain": {
      "description": "垂直领域:决定领域专属约束",
      "taskTypes": ["form-design", "ux-writing", "complex-multi-screen-flow", "design-handoff", "usability-testing"]
    },
    "repair": {
      "description": "修复:针对具体缺陷的反模式修复",
      "taskTypes": ["layout-problems", "color-problems", "typography-problems", "interaction-problems"]
    },
    "enhance": {
      "description": "系统提升:无具体缺陷的系统性深度建设",
      "taskTypes": ["design-system-architecture", "typography-system-design", "information-architecture", "interaction-design", "visual-composition"]
    },
    "strategy": {
      "description": "策略:方向性决策与方案探索",
      "taskTypes": ["high-quality-output", "design-philosophy", "variant-exploration"]
    }
  },
```

- [ ] **Step 3: 15 个浅约束 taskType 补加 core-constraints.md**

对以下 15 个 taskType,在其 `references` 数组中追加 `"references/core-constraints.md"`:

`information-architecture`, `interaction-design`, `visual-composition`, `typography-problems`, `typography-system-design`, `interaction-problems`, `choose-design-style`, `react-prototype`, `variant-exploration`, `wireframe-low-fi`, `design-system-creation`, `no-design-system`, `video-export`, `pdf-export`, `scene-output-specs`

示例(以 typography-problems 为例):
```json
    "typography-problems": {
      "description": "...(不变)",
      "detect": { ...(不变) },
      "references": [
        "references/anti-patterns/typography.md",
        "references/core-constraints.md"
      ]
    },
```

对只有一个 reference 的 taskType,在原 reference 后加逗号并新增一行。对每个 taskType 都执行同样的追加。

- [ ] **Step 4: 验证 JSON 合法**

Run: `node -e "JSON.parse(require('fs').readFileSync('load-manifest.json','utf8')); console.log('JSON OK')"`
Expected: `JSON OK`

- [ ] **Step 5: 验证 lint 通过(core-constraints.md 已被 manifest 引用)**

Run: `node scripts/lint-load-manifest.mjs`
Expected: `load-manifest OK`

注意:此时 lint 应通过,因为 core-constraints.md 已被 all-design-tasks 引用。domains 键尚未被 lint 校验(校验逻辑在 Task 10 添加)。

- [ ] **Step 6: Commit**

```bash
git add load-manifest.json
git commit -m "feat: load core-constraints in all-design-tasks + add domains grouping (v0.10.0 stage 2)

- all-design-tasks now loads core-constraints.md first
- New domains top-level key groups 39 taskTypes into 7 scene domains
- 15 shallow taskTypes (<=1 ref) now also load core-constraints.md to
  equalize constraint depth and address quality variance"
```

---

## Task 3: load-manifest.json — verification 引用清理

**Files:**
- Modify: `load-manifest.json:520-538`(checkpoints.before-delivery 与 checkpoints.deep-design-review)

**Interfaces:**
- Consumes: Task 1 的 core-constraints.md
- Produces: manifest 中无 verification.md 引用(为 Task 8 的删除做准备)

- [ ] **Step 1: before-delivery checkpoint 更新**

将 `load-manifest.json` 中 `checkpoints.before-delivery`(约第 520-525 行)从:
```json
    "before-delivery": {
      "description": "Final delivery verification, 最终交付前验证",
      "references": [
        "references/verification-protocol.md"
      ]
    },
```
改为:
```json
    "before-delivery": {
      "description": "Final delivery verification, 最终交付前验证",
      "references": [
        "references/core-constraints.md",
        "references/verification-protocol.md",
        "references/exit-conditions.md"
      ]
    },
```

- [ ] **Step 2: deep-design-review checkpoint 更新**

将 `checkpoints.deep-design-review`(约第 526-538 行)从:
```json
    "deep-design-review": {
      "description": "Deep design review, critique, audit, scoring, 深度设计评审, 设计批评, 评分",
      "detect": {
        "anyKeywords": ["design review", "critique", "audit", "score", "scorecard", "review this design"]
      },
      "references": [
        "references/critique-guide.md",
        "references/design-checklist.md",
        "references/principle-review.md",
        "references/verification.md",
        "references/typography-spacing-quick-ref.md"
      ]
    }
```
改为:
```json
    "deep-design-review": {
      "description": "Deep design review, critique, audit, scoring, 深度设计评审, 设计批评, 评分",
      "detect": {
        "anyKeywords": ["design review", "critique", "audit", "score", "scorecard", "review this design"]
      },
      "references": [
        "references/core-constraints.md",
        "references/critique-guide.md",
        "references/design-checklist.md",
        "references/principle-review.md",
        "references/verification-protocol.md",
        "references/typography-spacing-quick-ref.md"
      ]
    }
```

(删除 `references/verification.md`,替换为 `references/verification-protocol.md`,并新增 `references/core-constraints.md`)

- [ ] **Step 3: 验证 JSON 合法**

Run: `node -e "JSON.parse(require('fs').readFileSync('load-manifest.json','utf8')); console.log('JSON OK')"`
Expected: `JSON OK`

- [ ] **Step 4: 确认 manifest 中已无 verification.md 引用**

Run: `grep -c "references/verification\.md" load-manifest.json || echo "0 references (expected)"`
Expected: `0 references (expected)`(grep 无匹配时退出码 1,`|| echo` 兜底)

- [ ] **Step 5: Commit**

```bash
git add load-manifest.json
git commit -m "refactor: replace verification.md with protocol in checkpoints (v0.10.0 stage 4)

- before-delivery: add core-constraints + exit-conditions alongside protocol
- deep-design-review: replace deprecated verification.md with
  verification-protocol.md, add core-constraints
- Prepares for verification.md deletion in later task"
```

---

## Task 4: SKILL.md 重写

**Files:**
- Modify: `SKILL.md`(全文重写,152 → ~140 行)

**Interfaces:**
- Consumes: Task 1 的 core-constraints.md;Task 2 的 domains 结构
- Produces: 约束前置的 SKILL.md(触发 behavior-contract,需 Task 9 的 VERSION bump)

**注意:** 本 task 改动 behavior-contract 文件,执行后 `check-behavior-contract.sh` 会要求 VERSION bump。VERSION 在 Task 9 统一更新,故本 task commit 时 VERSION 尚未更新——这是预期行为,行为契约检查在 Task 9 完成后才运行。

- [ ] **Step 1: 重写 SKILL.md 全文**

将整个 `SKILL.md` 替换为以下内容(保留 frontmatter 的 allowed-tools 不变):

````markdown
---
name: cc-design
description: >
  High-fidelity HTML design and prototype creation. Use this skill whenever the user asks to
  design, prototype, mock up, or build visual artifacts in HTML — including slide decks,
  interactive prototypes, landing pages, UI mockups, animations, or any visual design work.
  Also use when the user mentions Figma, design systems, UI kits, wireframes, presentations,
  or wants to explore visual design directions. Even if they just say "make it look good" or
  "design a screen for X", this skill applies.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - Skill
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_take_screenshot
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_evaluate
  - mcp__playwright__browser_console_messages
  - mcp__playwright__browser_run_code
  - mcp__playwright__browser_tabs
  - mcp__playwright__browser_click
  - mcp__playwright__browser_type
  - mcp__playwright__browser_press_key
  - mcp__playwright__browser_wait_for
---

You are an expert designer working with the user as your manager. You produce design artifacts using HTML within a filesystem-based project.

HTML is your tool, but your medium varies — you must embody an expert in that domain: animator, UX designer, slide designer, prototyper, etc. Avoid web design tropes unless you are making a web page.

---

## Entry / Exit

- **Entry**: User asks to design, prototype, mock up, build, or render HTML visual artifacts — including slide decks, interactive prototypes, landing pages, UI mockups, animations, brand style clones, design systems, visual critiques, or export renders. Also triggered when the user says "make it look good" or "design a screen for X."
- **Exit**: A deliverable matching the task type, with console errors cleared, screenshot verified after final edit, and every touched section inspected individually. See `references/exit-conditions.md` for per-task-type exit criteria.
- **Do Not Use**: Pure backend work with no user-visible surface, data analysis without visualization, text-only documents with no layout requirements, or pure software development with no visual component.

---

## ⚡ Core Constraints

> 完整规则与展开 → `references/core-constraints.md`(all-design-tasks 始终加载,第一位)

### Iron Law(违反 = 硬停止)
1. **No unchecked fact** — 陈述品牌/价格/事实前必须先 WebSearch 验证
2. **No AI slop** — 见下表,违反则删除并替换
3. **No screenshot = no delivery** — 每次最终编辑后必须渲染 + 截图 + 逐 section 检查

### AI Slop 速查(违反即删)
| 模式 | 替代 |
|---|---|
| 紫粉蓝全屏渐变 | 单色微妙渐变或纯色 |
| 圆角卡 + 左边框色 | 背景对比 / 字重对比 / 分隔线 |
| emoji 装饰(🚀✨) | 真图标库(Lucide/Heroicons)或留空 |
| SVG 画人物/场景 | 灰色占位框 + 标签 |
| 假数据/假评价 | 占位符或向用户索取真实数据 |
| bento grid(非必要) | 按 信息结构选布局 |
| dark mode slop(#0D1117+neon) | 仅开发者工具类,且需有意为之 |
| glassmorphism 滥用 | glass 仅作 accent |
| illustration slop(flat vector 角色) | 真实摄影或不用 |
| stats section(四数字无来源) | 有真实数据才放 |
| feature slop(3 列同质) | 真价值差异才用 |
| badge slop(New/Popular 贴满) | badge 仅用于真实例外 |

完整 12 项 + CSS 示例 → `references/core-constraints.md` §2

### 禁用字体
Inter / Roboto / Arial / Fraunces / Space Grotesk → 用 serif+sans / mono+sans 等组合

---

## Core Principles

- **P0 事实优先** — 验证后才陈述。详见 core-constraints.md §1
- **P1 先聚上下文** — 未锁定 audience/scope/constraint 不动工
- **P1.5 可见计划** — 动工前呈现 Goal/Facts/Assumptions/Plan,等批准。Confirmation order: Design Context → Direction → Variations → Fidelity & Scope → Plan Approval
- **P2 反 slop** — 见上方 ⚡ Core Constraints 速查表
- **P3 加载可闻** — 每次 load 输出 `Load: because=<reason> loaded=<paths>`;已加载则 `already_loaded=`。从不静默加载或静默去重
- **P4 知识内容强交互** — 解释/架构/对比类默认加动画交互(见 `references/knowledge-artifact-spec.md`)。不适用于 brand/marketing 输出

All questions on Claude Code **MUST** use `AskUserQuestion` with structured options. See `references/question-first-delivery-examples.md`.

---

## Routing

Use a two-stage route. Stage 1: always load `all-design-tasks`(`基础必载`,含 `core-constraints.md`)。新任务或欠定义任务:另载 `question-first-delivery` 并问下方 route-shaping questions。**Brief 已足够明确时跳过 question-first-delivery**。Stage 2: 7 场景域分组(`load-manifest.json` 的 `domains` 键),先选域再选域内 taskType。

### 7 Scene Domains

| 域 | 含义 | taskType 数 |
|---|---|---|
| **Output** | 产出物:landing/deck/prototype/explainer/animation/wireframe/design-system/data-viz/scene | 10 |
| **Device** | 设备框架:mobile/desktop/react-prototype | 3 |
| **Brand** | 品牌/风格:brand-clone/asset/tone/style/no-system | 5 |
| **Export** | 导出:pptx/pdf/video/audio | 4 |
| **Domain** | 垂直领域:form/ux-writing/multi-screen/handoff/testing | 5 |
| **Repair** | 修复:layout/color/typography/interaction-problems | 4 |
| **Enhance** | 系统提升:design-system-arch/typography-system/info-arch/interaction-design/visual-composition | 5 |
| **Strategy** | 策略:high-quality-output/design-philosophy/variant-exploration | 3 |

完整 taskType → reference/template 映射见 `load-manifest.json`。answer → taskType 映射见 `references/workflow.md` Route-Shaping Questions。

### Route-Shaping Questions

Ask only until routing is locked:

1. **Output type** — page / deck / clickable prototype / animation / design system / critique / export / knowledge artifact
2. **Task state** — new / localized edit / approved follow-up
3. **Available context** — design system / codebase / screenshots / brand reference / none
4. **Interaction or delivery constraints** — interactive / iOS / Android / PDF / PPTX / video / none
5. **Primary design risk** — layout / typography / color / hierarchy / interaction / brand tone(→ Repair);整体系统专业度(→ Enhance);方向不明(→ Strategy)
6. **Content type**(仅 knowledge artifact)— concept / architecture / comparison / teaching

### Checkpoints

Set checkpoints explicitly based on task context:
- Question-first path → `question-first-delivery`
- Critique/review/audit/score → `deep-design-review`
- Animation/motion → `before-animation`
- iOS mockup → `before-ios-mockup`(MUST use `templates/ios_frame.jsx`)
- Before final delivery → `before-delivery`
- Before any export → `before-export`

See `references/workflow.md` Checkpoint Details.

---

## Workflow

0. **Junior Designer Mode** — Write execution-plan comment, show, wait for approval. See `references/junior-designer-mode.md`.
1. **Understand** — Load `all-design-tasks`。新任务:另载 `question-first-delivery` 并问 route-shaping questions。Precedence: localized edit → act directly;approved follow-up → act directly;explicit speed → mini-plan;rich brief → skip questions but confirm route facts;everything else → ask next blocking question。Detect brand mentions → route to `brand-style-clone`。
2. **Route** — Two-stage:Stage 1 base-required load → Stage 2 identify domain(s) → taskType(s)。Announce every load: `Load: because=<reason> loaded=<paths>`。Fall back to `scripts/resolve-load-bundles.mjs` if Agent unavailable.
3. **Acquire Context** — Priority: user design system > codebase > published product > brand guidelines > competitor refs > known fallbacks. Vocalize the system before planning.
4. **Plan** — Present visible execution plan (Goal/Facts/Assumptions/First artifact/Variation axes/Verification). Full checklist in `references/design-excellence.md`.
5. **Approval** — Stop and wait for user approval. Do not treat silence as approval on new tasks.
6. **Build** — Per-section preview pattern: finish one section → render → screenshot → show → approve → next. First section is the minimum viable preview. Use tweaks for variants. Rejection 3× → Iteration Gate (`references/workflow.md`).
7. **Verify** — Announce `before-delivery`. Load `references/core-constraints.md` + `references/verification-protocol.md` + `references/exit-conditions.md`. Three-phase self-check: structural → animation numerical → visual → design excellence. **Never deliver based on "it should be fine". Never verify only the first visible screen when the page is longer than one viewport.** Fix loop 3× → `references/failure-mode-handling.md`. Then present to user for review (see `references/workflow.md` Step 7a).
8. **Deliver** — Minimal summary: done + caveat + next step. No self-praise.

---

## Output Contracts

Every delivered artifact must satisfy: no console errors, screenshot verified after final edit, maker self-check completed (not code review alone), all touched sections inspected (not just hero), viewport coverage (desktop + mobile), descriptive filename, fixed-size content scales (deck_stage for decks), tweaks panel for variants, clear design quality (hierarchy + spacing + color + tone), and all `references/core-constraints.md` §4 delivery checklist items passed.

## Slide and Screen Labels

Put `[data-screen-label]` attributes on slide/screen elements. Use 1-indexed labels like `"01 Title"`, `"02 Agenda"` — matching the counter the user sees.

## Reading Documents

- Natively read Markdown, HTML, plaintext, images, and PDFs via the `Read` tool
- For PPTX/DOCX, extract with `Bash` (unzip + parse XML)
````

- [ ] **Step 2: 验证 SKILL.md 行数与结构**

Run: `wc -l SKILL.md && grep -c "^## " SKILL.md`
Expected: 行数约 140(±10);`## ` 标题数约 8(Entry-Exit / Core Constraints / Core Principles / Routing / Workflow / Output Contracts / Slide Labels / Reading Documents)

- [ ] **Step 3: 验证 SKILL.md 无悬空文件引用**

Run: `node scripts/lint-load-manifest.mjs`
Expected: `load-manifest OK`(lint 会校验 SKILL.md 中反引号引用的文件路径是否存在)

- [ ] **Step 4: 验证所有 checkpoint 名仍出现在 SKILL.md**

Run: `for cp in question-first-delivery before-animation before-export before-ios-mockup before-delivery deep-design-review; do grep -q "$cp" SKILL.md && echo "$cp: ✓" || echo "$cp: ✗ MISSING"; done`
Expected: 全部 `✓`(lint-load-manifest.mjs 会检查 checkpoints 出现在 SKILL.md)

- [ ] **Step 5: Commit(暂不 bump VERSION,Task 9 统一处理)**

```bash
git add SKILL.md
git commit -m "refactor: front-load constraints + 7-domain routing in SKILL.md (v0.10.0 stage 3)

- New ⚡ Core Constraints section at top: Iron Law + slop quick-ref + banned fonts
- Core Principles compressed to one-line behavior pointers
- Routing restructured into 7 scene domains table (Output/Device/Brand/Export/Domain/Repair/Enhance/Strategy)
- Removed placeholder Content Guidelines & Typography sections (covered by core-constraints.md)
- SKILL.md is now a dispatcher, not a constraint storehouse

Note: behavior-contract VERSION bump deferred to final task."
```

---

## Task 5: verification-protocol.md 增补

**Files:**
- Modify: `references/verification-protocol.md`(152 → ~220 行)

**Interfaces:**
- Consumes: `references/verification.md` 中待迁移的内容(此 task 不删 verification.md,删除在 Task 8)
- Produces: protocol 作为唯一权威源,含 Screenshot Best Practices + Troubleshooting + Phase 3 指针

- [ ] **Step 1: Phase 2 末尾追加 Screenshot Best Practices**

在 `references/verification-protocol.md` 的 `## Phase 2: Visual Verification` 章节末尾(约第 98 行,`### Visual review flow` 代码块之后、`## Task-Type-Specific Verification` 之前),插入新子章节:

```markdown
### Screenshot Best Practices

**Full page vs viewport vs element:**

| 类型 | 用途 | 命令(MCP) |
|---|---|---|
| Full page | 长页面整体结构 | `browser_take_screenshot` with `fullPage: true` |
| Viewport | 当前可见区(默认) | `browser_take_screenshot`(默认行为) |
| Element | 特定 touched section | `browser_take_screenshot` with `element` ref |
| High-DPI | retina 渲染验证 | `browser_resize` 后截图,或 `scale: "device"` |

**Wait for animation to settle:** 截图前 `browser_wait_for` time 2s,确保 CSS/JS 动画完成。

**Changed-region verification:** 对长页面的迭代编辑,touched sections 必须单独截图。若编辑了 `#pricing`、`#prompts`、footer,逐个 capture,而非假设 full-page 截图足够。
```

- [ ] **Step 2: Phase 3 区域新增指针(在 Task-Type-Specific 之后)**

在 `## Task-Type-Specific Verification` 章节(约第 100-114 行)之后、`## Phase 3.5: Cognitive Verification` 之前,插入:

```markdown
## Phase 3: Design Excellence Checklist

Phase 1-2 是技术性与视觉性检查。Phase 3 是客观质量检查,使用独立清单文件:

→ **详见 `references/design-checklist.md`**(5 类客观检查:Accessibility / Cognitive Load / Consistency / Edge Cases;Anti-AI Slop 检查已迁至 `references/core-constraints.md` §2)。

deep-design-review checkpoint 会同时加载 protocol 与 checklist。
```

- [ ] **Step 3: 文件末尾新增 Troubleshooting 章节**

在 `references/verification-protocol.md` 最末尾(`## Phase 4: User Review` 章节之后)追加:

```markdown

## Troubleshooting Verification Errors

### White Screen

Console 必有 error。按序检查:
1. React+Babel script tag integrity hash 是否正确?(见 `references/react-setup.md`)
2. 是否有 `const styles = {...}` 命名冲突?
3. 跨文件组件是否 export 到 `window`?
4. JSX 语法错误(babel.min.js 不报错——用非压缩版 babel.js)

### Animation Stuttering

- 用 Chrome DevTools Performance tab 录制
- 排查 layout thrashing(频繁 reflow)
- 优先 animate `transform` 和 `opacity`(GPU 加速)

### Wrong Fonts

- 检查 `@font-face` URL 可达性
- 检查 fallback fonts
- CJK 字体加载慢:先显示 fallback,加载后切换

### Layout Misalignment

- 确认全局 `box-sizing: border-box`
- 确认 `* { margin: 0; padding: 0 }` reset
- Chrome DevTools 开 gridlines 查看实际布局
```

- [ ] **Step 4: 验证文件结构**

Run: `grep -c "^## " references/verification-protocol.md`
Expected: `8`(Relationship / Phase 1 / Phase 2 / Phase 3 / Task-Type-Specific / Phase 3.5 / Fix Loop / Phase 4 / Troubleshooting — 含新增 2 个)

- [ ] **Step 5: Commit**

```bash
git add references/verification-protocol.mjs
git commit -m "feat: absorb Screenshot Best Practices + Troubleshooting into protocol (v0.10.0 stage 4)

Content migrated from soon-to-be-deleted verification.md.
Establishes verification-protocol.md as the single authoritative source
for all verification guidance."
```

---

## Task 6: design-checklist.md 降级为附录 + 去重

**Files:**
- Modify: `references/design-checklist.md`(540 → ~460 行)

**Interfaces:**
- Consumes: Task 1 的 core-constraints.md
- Produces: checklist 定位为 protocol Phase 3 附录,Category 4 改为指针

- [ ] **Step 1: 顶部 frontmatter 改为附录定位**

将 `references/design-checklist.md` 第 1-10 行(标题 + Load when 块)从:
```markdown
# Design Quality Checklist

> **Load when:** Every design review (auto-run), final delivery, quality audit
> **Skip when:** Never (always check)
> **Why it matters:** Catches objective quality issues that subjective reviews miss
> **Typical failure it prevents:** Accessibility violations, inconsistency, cognitive overload, AI slop
```
改为:
```markdown
# Design Quality Checklist

> **Appendix to:** `references/verification-protocol.md` Phase 3 (Design Excellence)
> **Load when:** Deep design review, final delivery quality audit, critique/scoring
> **Why it matters:** Catches objective quality issues that subjective reviews miss
> **Typical failure it prevents:** Accessibility violations, inconsistency, cognitive overload
> **Note:** Anti-AI Slop checks have moved to `references/core-constraints.md` §2 (always loaded)
```

- [ ] **Step 2: 删除 Category 4 Anti-AI Slop,改为指针**

定位 `## Category 4: Anti-AI Slop`(约第 319 行)至该 Category 结束(即 `## Category 5: Edge Cases` 之前,约第 398 行)。

将整个 Category 4 区块(约 80 行)替换为:
```markdown
## Category 4: Anti-AI Slop

**Moved to** `references/core-constraints.md` §2 — AI Slop 速查表(12 项,始终加载)。

完整规则与 CSS 示例:`references/content-guidelines.md`。
分场景反模式:`references/anti-patterns/{color,layout,typography,interaction}.md`。
```

- [ ] **Step 3: 验证 Category 4 已精简**

Run: `awk '/^## Category 4/,/^## Category 5/' references/design-checklist.md | wc -l`
Expected: 约 6 行(原 80 行已精简为指针块)

- [ ] **Step 4: 验证其他 Category 完整**

Run: `grep "^## Category" references/design-checklist.md`
Expected:
```
## Category 1: Accessibility (WCAG AA Compliance)
## Category 2: Cognitive Load (Miller's Law)
## Category 3: Consistency
## Category 4: Anti-AI Slop
## Category 5: Edge Cases
```
(5 个 Category 标题都在,只是 Category 4 内容变为指针)

- [ ] **Step 5: Commit**

```bash
git add references/design-checklist.md
git commit -m "refactor: demote checklist to protocol appendix, dedupe anti-slop (v0.10.0 stage 4)

- Repositioned as appendix to verification-protocol.md Phase 3
- Category 4 Anti-AI Slop replaced with pointer to core-constraints.md §2
  (eliminates 4-way duplication of slop checks)
- Reduced from 540 to ~460 lines"
```

---

## Task 7: workflow.md 引用更新 + 路由说明

**Files:**
- Modify: `references/workflow.md:380`、`:488`、Stage 2 路由说明

**Interfaces:**
- Consumes: Task 1 的 core-constraints.md;Task 5 的 protocol
- Produces: workflow.md 无 verification.md 引用;Stage 2 路由为域→taskType 两步

- [ ] **Step 1: 第 380 行 verification.md → verification-protocol.md**

将 `references/workflow.md` 第 380 行:
```markdown
- Use Playwright to screenshot (see `references/verification.md`)
```
改为:
```markdown
- Use Playwright to screenshot (see `references/verification-protocol.md`)
```

- [ ] **Step 2: 第 488 行 deep-design-review 加载列表更新**

将 `references/workflow.md` 第 488 行:
```markdown
If the user asked for a critique, review, audit, or score, announce `because=deep-design-review`, then load `references/design-checklist.md`, `references/principle-review.md`, `references/verification.md`, and `references/typography-spacing-quick-ref.md` before judging the work.
```
改为:
```markdown
If the user asked for a critique, review, audit, or score, announce `because=deep-design-review`, then load `references/core-constraints.md`, `references/design-checklist.md`, `references/principle-review.md`, `references/verification-protocol.md`, and `references/typography-spacing-quick-ref.md` before judging the work.
```

- [ ] **Step 3: Two-Stage Routing 说明更新为域→taskType 两步**

定位 `references/workflow.md` 的 `## Two-Stage Routing` 章节(约第 89-102 行)。将:

```markdown
## Two-Stage Routing

Use a two-stage route instead of loading every plausible reference up front.

**Stage 1: Base-required load**
- always load `all-design-tasks`
- if the task is new or underspecified, also load `question-first-delivery`

**Stage 2: Route-shaping questions**
- ask the fixed question batch below
- map those answers directly to `taskTypes` and `checkpoints`
- only after explicit mapping, use semantic matching to supplement unresolved `taskTypes` or `optionalInspirations`

This keeps typography, layout, and visual/color theory in the default context while preserving conditional loading for brand, interaction, export, animation, device mockups, and review work.
```

改为:

```markdown
## Two-Stage Routing

Use a two-stage route instead of loading every plausible reference up front.

**Stage 1: Base-required load**
- always load `all-design-tasks`(含 `core-constraints.md`,第一位)
- if the task is new or underspecified, also load `question-first-delivery`

**Stage 2: Domain → taskType 两步匹配**
- Step 2a: 从 7 场景域(`load-manifest.json` 的 `domains` 键)识别主域(Output / Device / Brand / Export / Domain / Repair / Enhance / Strategy)
- Step 2b: 域内 taskType 精确匹配
- map those answers directly to `taskTypes` and `checkpoints`
- only after explicit mapping, use semantic matching to supplement unresolved `taskTypes` or `optionalInspirations`

**约束深度均衡化:** 所有约束深度 ≤1 的 taskType 已在 manifest 中补加 `references/core-constraints.md`,确保核心约束始终加载,消除 task type 质量不均。

This keeps typography, layout, and visual/color theory in the default context while preserving conditional loading for brand, interaction, export, animation, device mockups, and review work.
```

- [ ] **Step 4: 验证 workflow.md 无 verification.md 引用**

Run: `grep -n "verification\.md" references/workflow.md || echo "0 references (expected)"`
Expected: `0 references (expected)`(若仍有,需处理)

- [ ] **Step 5: Commit**

```bash
git add references/workflow.md
git commit -m "refactor: workflow.md routing to domain→taskType + fix verification refs (v0.10.0)

- Stage 2 routing updated to domain→taskType two-step matching
- Documented constraint-depth equalization via core-constraints.md
- Replaced all verification.md references with verification-protocol.md
- deep-design-review load list updated to include core-constraints.md"
```

---

## Task 8: 删除 verification.md

**Files:**
- Delete: `references/verification.md`

**Interfaces:**
- Consumes: Task 3(manifest 已清除引用)、Task 7(workflow.md 已清除引用)
- Produces: 无悬空引用的 references 目录

**前置条件确认:** 本 task 前必须已完成 Task 3(manifest 清理)和 Task 7(workflow.md 清理)。

- [ ] **Step 1: 最终确认全仓库无 verification.md 引用(除自身)**

Run: `grep -rn "verification\.md" --include="*.md" --include="*.json" --include="*.mjs" . | grep -v "references/verification\.md:" | grep -v "verification-protocol\.md"`
Expected: 空输出(无引用)。若有输出,需先处理再删除。

- [ ] **Step 2: 删除文件**

Run: `git rm references/verification.md`
Expected: `rm 'references/verification.md'`

- [ ] **Step 3: 验证 lint 仍通过(references/ 下所有 .md 必须被 manifest 引用)**

Run: `node scripts/lint-load-manifest.mjs`
Expected: `load-manifest OK`

注意:lint 会检查 references/ 下所有 .md 是否被 manifest 引用。删除 verification.md 后,它不再存在于 references/,故不会触发"untracked"错误;同时 manifest 已无对它的引用,故不会触发"missing path"错误。

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: delete deprecated verification.md (v0.10.0 stage 4)

Content fully superseded by verification-protocol.md (which now contains
the migrated Screenshot Best Practices and Troubleshooting sections).
The file referenced a non-existent scripts/verify.py and used outdated
~/.claude/skills/ paths."
```

---

## Task 9: VERSION bump + README 同步 + 行为契约验证

**Files:**
- Modify: `VERSION`、`README.md`
- Sync: `.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`plugins/cc-design/.claude-plugin/plugin.json`、`plugins/cc-design/.codex-plugin/plugin.json`

**Interfaces:**
- Consumes: 所有前置 task(SKILL.md/workflow.md 已改)
- Produces: v0.10.0 发布就绪;行为契约通过

**注意:** CLAUDE.md release rules 要求 VERSION bump 时同步 4 个 plugin.json。

- [ ] **Step 1: 更新 VERSION**

将 `VERSION` 文件内容从 `0.9.3` 改为 `0.10.0`。

- [ ] **Step 2: 同步 4 个 plugin.json 的 version 字段**

检查并更新以下文件的 `version` 字段为 `0.10.0`:
- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `plugins/cc-design/.claude-plugin/plugin.json`
- `plugins/cc-design/.codex-plugin/plugin.json`

Run(查看当前值):
```bash
for f in .claude-plugin/plugin.json .codex-plugin/plugin.json plugins/cc-design/.claude-plugin/plugin.json plugins/cc-design/.codex-plugin/plugin.json; do echo "=== $f ==="; grep '"version"' "$f"; done
```

对每个文件,将 `"version": "0.9.x"` 改为 `"version": "0.10.0"`。

- [ ] **Step 3: README.md 同步**

检查 `README.md` 是否有硬编码版本号需更新:
Run: `grep -n "0\.9\." README.md`
若有命中,更新为 `0.10.0`。若无命中(README 无硬编码版本),跳过。

README 的 "Contributing" 第 2 条"Keep SKILL.md under 200 lines"保持不变(新 SKILL.md ~140 行仍符合)。

- [ ] **Step 4: 运行行为契约检查**

Run: `./scripts/check-behavior-contract.sh HEAD~9`
(HEAD~9 指向本计划第一个 commit 之前的 state;若 commit 数不同,调整偏移量使 base ref 指向优化前的 master)

Expected: 退出码 0(VERSION 已 bump,契约满足)。

若失败,错误信息会指出哪个 behavior-contract 文件变更了但 VERSION 未同步——此时确认 VERSION 文件已改为 0.10.0 即可。

- [ ] **Step 5: Commit**

```bash
git add VERSION .claude-plugin/plugin.json .codex-plugin/plugin.json plugins/cc-design/.claude-plugin/plugin.json plugins/cc-design/.codex-plugin/plugin.json README.md
git commit -m "chore: bump version to 0.10.0 + sync plugin manifests (v0.10.0 release)

Behavior-contract gate: SKILL.md + README.md + workflow.md changed,
VERSION bumped from 0.9.3 to 0.10.0. All 4 plugin.json files synced."
```

---

## Task 10: 脚本更新 — catalog 输出 domains + lint 新规则

**Files:**
- Modify: `scripts/generate-bundle-catalog.mjs`、`scripts/lint-load-manifest.mjs`

**Interfaces:**
- Consumes: Task 2 的 domains 键
- Produces: catalog 含 domains 分组;lint 校验 taskType 归属 domain + all-design-tasks 含 core-constraints

- [ ] **Step 1: generate-bundle-catalog.mjs 输出 domains**

在 `scripts/generate-bundle-catalog.mjs` 的 `printGroup("defaults", ...)` 调用之后、`printGroup("taskTypes", ...)` 之前,新增 domains 输出。

将第 27-30 行:
```javascript
printGroup("defaults", manifest.defaults);
printGroup("taskTypes", manifest.taskTypes);
printGroup("checkpoints", manifest.checkpoints);
printGroup("optionalInspirations", manifest.optionalInspirations);
```

改为:
```javascript
printGroup("defaults", manifest.defaults);
printDomains(manifest.domains);
printGroup("taskTypes", manifest.taskTypes);
printGroup("checkpoints", manifest.checkpoints);
printGroup("optionalInspirations", manifest.optionalInspirations);
```

并在 `printGroup` 函数定义(第 12-25 行)之后,新增 `printDomains` 函数:

```javascript
function printDomains(domains) {
  if (!domains || Object.keys(domains).length === 0) {
    return;
  }

  console.log("# domains");

  for (const [name, config] of Object.entries(domains)) {
    const description = config.description ?? "(no description)";
    const taskTypes = (config.taskTypes ?? []).join(", ");
    console.log(`${name} | ${description} | taskTypes: ${taskTypes}`);
  }

  console.log("");
}
```

- [ ] **Step 2: lint-load-manifest.mjs 新增规则 — taskType 必须归属 domain**

在 `scripts/lint-load-manifest.mjs` 的 `missingDescriptions` 校验逻辑(约第 129-136 行)之后、`uncoveredReferences` 之前,新增 domain 归属校验。

在第 136 行 `}` 之后插入:

```javascript
const undomainTaskTypes = [];
const domainMembers = new Set();
for (const [domainName, domainConfig] of Object.entries(manifest.domains ?? {})) {
  for (const taskType of domainConfig.taskTypes ?? []) {
    domainMembers.add(taskType);
  }
}
for (const taskTypeName of Object.keys(manifest.taskTypes ?? {})) {
  if (!domainMembers.has(taskTypeName)) {
    undomainTaskTypes.push(taskTypeName);
  }
}
```

然后在失败条件判断(约第 145-152 行)中加入新检查。将:
```javascript
if (
  missingPaths.length === 0 &&
  uncoveredReferences.length === 0 &&
  uncoveredTemplates.length === 0 &&
  invalidSkillReferences.length === 0 &&
  undocumentedCheckpoints.length === 0 &&
  missingDescriptions.length === 0
) {
```
改为:
```javascript
if (
  missingPaths.length === 0 &&
  uncoveredReferences.length === 0 &&
  uncoveredTemplates.length === 0 &&
  invalidSkillReferences.length === 0 &&
  undocumentedCheckpoints.length === 0 &&
  missingDescriptions.length === 0 &&
  undomainTaskTypes.length === 0
) {
```

并在错误输出区(约第 192-198 行 `missingDescriptions` 输出之后、`process.exit(1)` 之前)新增:

```javascript
if (undomainTaskTypes.length > 0) {
  console.error("TaskTypes not assigned to any domain:");
  for (const taskType of undomainTaskTypes) {
    console.error(`- ${taskType}`);
  }
}
```

- [ ] **Step 3: lint-load-manifest.mjs 新增规则 — all-design-tasks 含 core-constraints**

在 Step 2 新增的 undomainTaskTypes 逻辑之后,继续新增:

```javascript
const allDesignReferences = manifest.defaults?.["all-design-tasks"]?.references ?? [];
const hasCoreConstraints = allDesignReferences.includes("references/core-constraints.md");
```

将失败条件中再加入 `&& hasCoreConstraints`:

```javascript
if (
  missingPaths.length === 0 &&
  uncoveredReferences.length === 0 &&
  uncoveredTemplates.length === 0 &&
  invalidSkillReferences.length === 0 &&
  undocumentedCheckpoints.length === 0 &&
  missingDescriptions.length === 0 &&
  undomainTaskTypes.length === 0 &&
  hasCoreConstraints
) {
```

并在错误输出区新增:

```javascript
if (!hasCoreConstraints) {
  console.error("defaults.all-design-tasks.references must include references/core-constraints.md");
}
```

- [ ] **Step 4: 验证 catalog 脚本输出 domains**

Run: `node scripts/generate-bundle-catalog.mjs | head -20`
Expected: 输出包含 `# domains` 标题,及 8 行域名(output/device/brand/export/domain/repair/enhance/strategy),每行含 description 和 taskTypes 列表。

- [ ] **Step 5: 验证 lint 脚本通过(含新规则)**

Run: `node scripts/lint-load-manifest.mjs`
Expected: `load-manifest OK`

(此时 domains 已存在且 39 taskType 全部归属、all-design-tasks 已含 core-constraints.md,故新规则应通过)

- [ ] **Step 6: 验证新规则能捕获错误(回归测试)**

临时验证 lint 能检测未归属 domain 的 taskType:
Run: `node -e "
const m = JSON.parse(require('fs').readFileSync('load-manifest.json','utf8'));
// 模拟:假设有一个 taskType 不在任何 domain
const domainMembers = new Set();
for (const d of Object.values(m.domains||{})) for (const t of (d.taskTypes||[])) domainMembers.add(t);
const undomain = Object.keys(m.taskTypes).filter(t => !domainMembers.has(t));
console.log('undomain taskTypes:', undomain.length === 0 ? 'none (expected)' : undomain);
"`
Expected: `undomain taskTypes: none (expected)`

- [ ] **Step 7: Commit**

```bash
git add scripts/generate-bundle-catalog.mjs scripts/lint-load-manifest.mjs
git commit -m "feat: catalog outputs domains + lint enforces domain coverage (v0.10.0 stage 2)

- generate-bundle-catalog.mjs now prints domains section with taskType membership
- lint-load-manifest.mjs adds two rules:
  1. Every taskType must belong to at least one domain
  2. all-design-tasks must include references/core-constraints.md"
```

---

## Task 11: 最终验证 — 全量集成检查

**Files:**
- 无文件改动,仅验证

- [ ] **Step 1: 全量 lint**

Run: `node scripts/lint-load-manifest.mjs`
Expected: `load-manifest OK`

- [ ] **Step 2: catalog 生成正常**

Run: `node scripts/generate-bundle-catalog.mjs > /dev/null && echo "catalog OK"`
Expected: `catalog OK`

- [ ] **Step 3: 行为契约通过**

Run: `./scripts/check-behavior-contract.sh HEAD~11`
(偏移量根据实际 commit 数调整,base 应指向优化前 master)
Expected: 退出码 0

- [ ] **Step 4: 无悬空引用最终确认**

Run: `grep -rn "verification\.md" --include="*.md" --include="*.json" --include="*.mjs" . | grep -v "verification-protocol\.md" | grep -v "^Binary" || echo "No dangling references (expected)"`
Expected: `No dangling references (expected)`

- [ ] **Step 5: VERSION 一致性确认**

Run: `echo "VERSION: $(cat VERSION)" && for f in .claude-plugin/plugin.json .codex-plugin/plugin.json plugins/cc-design/.claude-plugin/plugin.json plugins/cc-design/.codex-plugin/plugin.json; do printf "%s: " "$f"; grep -o '"version": "[^"]*"' "$f"; done`
Expected: 所有版本均为 `0.10.0`

- [ ] **Step 6: 成功标准核对**

逐项核对 spec 的成功标准:
- ✅ 质量不均缓解——所有 taskType 约束深度 ≥ 2(含 core-constraints.md)
  Run: `node -e "const m=JSON.parse(require('fs').readFileSync('load-manifest.json','utf8')); const shallow=Object.entries(m.taskTypes).filter(([n,c])=>c.references.length<2).map(([n])=>n); console.log(shallow.length===0?'all taskTypes >=2 refs ✓':'shallow: '+shallow)"`
  Expected: `all taskTypes >=2 refs ✓`
- ✅ 原则遵循提升——SKILL.md 顶部即含 Iron Law + Slop 速查表
  Run: `grep -q "⚡ Core Constraints" SKILL.md && grep -q "Iron Law" SKILL.md && echo "constraints front-loaded ✓"`
  Expected: `constraints front-loaded ✓`
- ✅ 架构精简——验证文件 4→3;39 taskType 有 7 域归属
  Run: `ls references/verification*.md | wc -l`(应 2:protocol + design-checklist 中无 verification 前缀;实际为 protocol + design-checklist 不计)——更准确:`test ! -f references/verification.md && echo "verification.md deleted ✓"`
  Expected: `verification.md deleted ✓`
- ✅ 无悬空引用——Step 4 已确认
- ✅ 契约通过——Step 3 已确认

- [ ] **Step 7: 无需 commit(本 task 仅验证)**

若所有检查通过,优化完成。最终 git log 应显示 10 个 commit(stage 1-4 分布)。

---

## Self-Review Notes

**Spec coverage check:**
- §2.1 core-constraints.md → Task 1 ✓
- §2.2 SKILL.md 重写 → Task 4 ✓
- §2.3 7 场景域 routing → Task 2(domains)+ Task 4(SKILL.md 表)+ Task 7(workflow.md Stage 2)✓
- §2.4 verification 合并 → Task 3(manifest)+ Task 5(protocol 增补)+ Task 6(checklist 降级)+ Task 7(workflow 引用)+ Task 8(删除)✓
- §3 改动清单 11 项 → A1=Task1, B1=Task8, C1=Task4, C2=Task2+3, C3=Task5, C4=Task6, C5=Task7, C6=Task9, C7=Task9, D1=Task10, D2=Task10 ✓
- §4 迁移路径 4 阶段 → 阶段1=Task1+2, 阶段2=Task2+4+7+10, 阶段3=Task4+9, 阶段4=Task3+5+6+7+8+9 ✓

**Type/identifier consistency:**
- `references/core-constraints.md` — 全 plan 统一拼写 ✓
- `domains` 顶层键 — Task 2 创建,Task 10 lint ✓
- 7 域名(output/device/brand/export/domain/repair/enhance/strategy)— Task 2 与 Task 4 一致 ✓
- 15 浅约束 taskType 清单 — Task 2 与诊断一致 ✓

**Placeholder scan:** 无 TBD/TODO,所有 code block 含完整内容 ✓
