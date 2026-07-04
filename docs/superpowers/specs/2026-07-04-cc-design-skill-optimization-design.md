# cc-design Skill 全面优化设计

- **日期**:2026-07-04
- **目标版本**:v0.9.3 → v0.10.0
- **优化方向**:提升输出质量/设计水准 + 精简架构/降低维护成本
- **约束力度**:中度(重组 references 层级,不重构为场景化包)

---

## 1. 问题诊断

### 1.1 三个质量痛点及根因

通过精读核心文件,确认三个质量痛点的精确根因:

| 痛点 | 根因(精确) | 证据 |
|---|---|---|
| **视觉细节有 AI 味** | 反 AI slop 规则分散在 6 处(`content-guidelines.md` 278 行 + `anti-patterns/{4 文件}` 620 行 + `design-red-flags.md` + `design-common-sayings.md` + `design-iron-law.md` Article 2),互相引用但无单一权威入口 | 模型加载时只会命中其中 1-2 处,其余成为"死文本" |
| **各 task type 质量不均** | 39 个 taskType 扁平排列,无分组;约束深度从 1 个 reference(如 `typography-problems`)到 3 个(如 `landing-page`)不等 | `load-manifest.json` 中 landing/page 相关 taskType 引用 3-5 个 reference,而 data-viz/ux-writing 仅 1 个 |
| **原则多但不被遵循** | 核心约束(Iron Law 3 条 + P0-P4)藏在 SKILL.md 中段,被 63 个理论文件稀释;信号密度不足 | SKILL.md 152 行中,Iron Law 仅占 6 行,反 slop 仅占 8 行 |

### 1.2 冗余证据(支撑"中度精简"决策)

- `verification.md`(旧)+ `verification-protocol.md`(新)+ `design-checklist.md` 三份验证文档职责重叠。`verification.md` 引用的 `scripts/verify.py` 根本不存在(已确认),内容已被 protocol 完全取代。
- `anti-patterns/` 4 文件(620 行)与 `content-guidelines.md`(278 行)的 "AI Slop Blacklist" 内容高度重叠。

### 1.3 不做的事(YAGNI 边界)

- 不合并 `*-theory.md` 文件(visual/layout/interaction/information/system/brand-emotion 共 6 个)——虽内容重叠,但各自被不同 taskType 引用,合并会破坏 routing,留作未来迭代
- 不删除任何 taskType——只加 domains 分组层,保持向后兼容
- 不新增 lint 自动化检测脚本——选择"核心原则前置+高密度"机制而非自动化检测
- 不重构 templates/ 和 scripts/——本次聚焦 skill 层(references + SKILL.md + manifest),不涉及产出层
- 不改变 workflow 的 8 步结构(Understand→...→Deliver)——只强化各步的约束加载

---

## 2. 设计方案

采用**方案 A:核心约束前置 + 分层 reference**。整体由 4 个相互配合的改动组成。

### 2.1 核心约束层 `core-constraints.md`(第一节)

这是整个优化的心脏——把分散在 6 处的核心约束,压缩成一份"始终加载、不可遗忘、高密度"的单一权威源。

**定位**:
- `all-design-tasks` 基础必载包的第一加载项
- 核心层是**摘要与索引**,原文件(`content-guidelines.md`、`anti-patterns/*`、`*-red-flags.md`)保留为展开层,核心层在需要深入时指向它们
- 目标行数:~180 行(纯约束,无理论展开)

**内容结构(7 个紧凑区块)**:

1. **Iron Law**(3 条硬门禁,从 `design-iron-law.md` 原样迁入)
   - No unchecked fact = no design decision
   - No AI slop patterns. Ever.
   - No screenshot after final edit = no delivery

2. **AI Slop Instant Detection**(从 `content-guidelines.md` + `anti-patterns/` 压缩)
   - 一张表:模式 → 一句话识别 → 替代方案
   - 涵盖 12 项:渐变/圆角卡左边框/emoji/SVG 人物/假数据/bento/dark mode slop/glass slop/illustration slop/stats slop/feature slop/badge slop
   - 每项一行,不展开(展开指向 `content-guidelines.md`)

3. **Forbidden Fonts**(从 `content-guidelines.md` 提取)
   - Inter/Roboto/Arial/Fraunces/Space Grotesk
   - 替代方向:serif+sans / mono+sans / heavy+light

4. **Mandatory Pre-Delivery Checklist**(从 `verification-protocol.md` 提取精华)
   - 结构检查:console 无 error、所有 viewport 测试、每个 touched section 已截图
   - 视觉检查:字号符合 scale、间距为 8px 倍数、对比度 ≥4.5:1
   - slop 检查:逐项过 #2 的 12 项

5. **STOP Signals**(从 `design-red-flags.md` 压缩为 8 条最高频)
   - 颜色靠记忆非提取 / 间距无 scale / hero 精致其余崩 / 假数据 / 等

6. **Scale Specs**(最小字号,从 `content-guidelines.md` 提取)
   - Slides ≥24px / Web ≥14px / Mobile ≥16px / 命中区 ≥44px

7. **Deep-Dive Index**(指向展开层)
   - 完整 slop 规则 → `content-guidelines.md`
   - 分场景反模式 → `anti-patterns/{color,layout,typography,interaction}.md`
   - 自省信号全集 → `design-red-flags.md`
   - 验证协议全流程 → `verification-protocol.md`

**关键设计决策**:
- 不删原文件:核心层是"索引+摘要",原文件作为"展开层"保留,避免破坏现有 load-manifest 引用链
- 表格化、一行一规则:最大化信号密度,模型即使只扫一眼也能命中
- 始终加载:`all-design-tasks` 的 references 数组中排第一位

### 2.2 SKILL.md 重写(第二节)

**当前问题**:
1. Iron Law 藏在 §2(第 44 行)——核心硬门禁却排在 Entry/Exit 之后,信号位置不够前置
2. Core Principles(P0-P4)占 33 行——其中 P2 反 slop 仅 8 行,但却是整个 skill 最高频触发的约束,密度严重不足
3. Content Guidelines(§7)、Typography(§8)——只有 4-5 行占位,实际内容全在 references,属于"既不够详细又占位"的尴尬状态
4. 缺少"核心约束快速参考"——模型读 SKILL.md 时,无法在顶部一次性看到最高优先级的约束

**重写原则**:
1. 约束前置:Iron Law + 反 slop 即时检测表放到 SKILL.md 最顶部(紧跟 frontmatter)
2. SKILL.md 只放"路由决策 + 流程编排":它是调度器,不是约束仓库。所有约束细节移到 `core-constraints.md`
3. 目标行数:控制在 ~140 行(比现在略精简,但信号密度翻倍)
4. 不破坏行为契约:`scripts/check-behavior-contract.sh` 监控的 first-turn 行为保持一致

**新结构(对比)**:

```
当前结构(152 行)                  新结构(~140 行)
─────────────────────────         ─────────────────────────
frontmatter                       frontmatter(不变)
## Entry / Exit                   ## Entry / Exit(不变)
## Iron Law            ← 移走      ## ⚡ Core Constraints(NEW)
## Core Principles     ← 精简      ├─ Iron Law(3 条,前置)
## Routing                         ├─ AI Slop 速查表(12 项,一行一规则)
## Workflow                        ├─ 禁用字体清单
## Output Contracts                └─ 指向 core-constraints.md(详情)
## Content Guidelines  ← 删除      ## Core Principles(P0-P4 精简为行为指针)
## Typography...       ← 删除      ## Routing(重组为 7 场景域)
## Slide and Screen Labels         ## Workflow(不变)
## Reading Documents               ## Output Contracts(不变)
                                   ## Slide and Screen Labels(保留)
                                   ## Reading Documents(保留)
```

**关键改动**:

1. **新增 `## ⚡ Core Constraints` 区块(置顶,~40 行)**——SKILL.md 唯一的"约束内容"区,放最高频、最高优先级规则的速查版:Iron Law(3 条)+ AI Slop 速查表(12 项)+ 禁用字体清单。每区块末尾标注"完整规则 → references/core-constraints.md"。

2. **Core Principles 精简为"行为指针"**——当前 P0-P4 每条都带详细说明。重写后每条压缩为一句话 + 指针:
   - P0 事实优先 — 验证后才陈述。详见 core-constraints.md §1
   - P1 先聚上下文 — 未锁定 audience/scope/constraint 不动工
   - P1.5 可见计划 — 动工前呈现 Goal/Facts/Assumptions/Plan,等批准
   - P2 反 slop — 见上方 ⚡ Core Constraints 速查表
   - P3 加载可闻 — 每次 load 输出 `Load: because=<reason> loaded=<paths>`
   - P4 知识内容强交互 — 解释/架构/对比类默认加动画交互

3. **删除 §7 Content Guidelines、§8 Typography 占位区块**——内容已被 core-constraints.md + 现有 references 完整覆盖,避免"既不详细又占位"。

4. **Routing 重组为 7 场景域分组表**(详见 2.3)

### 2.3 Routing 重构为 7 场景域(第三节)

**当前问题**:39 个 taskType 扁平堆叠,routing 决策黑箱,约束深度不均。

**解决方案**:将 39 个 taskType 归入 7 个语义场景域。不删除任何 taskType(保持向后兼容),而是增加一层"域"的结构,让 routing 决策从"39 选 N"变成"先选 1-2 个域,再选域内 taskType"。

**最终 7 场景域**:

```
Output   产出物        10 个  landing/deck/prototype/explainer/animation/...
Device   设备框架       3 个  mobile/desktop/react-prototype
Brand    品牌/风格      5 个  brand-clone/asset-acquisition/tone/style/...
Export   导出           4 个  pptx/pdf/video/audio
Domain   垂直领域       5 个  form/ux-writing/multi-screen/handoff/testing
Repair   修复           4 个  layout/color/typography/interaction-problems
Enhance  系统提升       5 个  design-system-arch/typography-system/info-arch/interaction-design/visual-composition
Strategy 策略           3 个  high-quality-output/design-philosophy/variant-exploration
```

**Problem 域拆分理由**:原 Problem 域(12 个)过大,实际包含三种不同性质:
- **修复(Repair)**:针对具体缺陷的反模式修复。每个都绑定一个 `anti-patterns/{x}.md`,是"已有问题→对照修复"。
- **提升(Enhance)**:针对系统性深度建设。每个绑定一个 `*-theory.md`,是"无具体缺陷→系统性提升"。
- **策略(Strategy)**:针对方向性决策。与质量/风格/变体探索相关,是"方向性选择"。

拆分收益:routing 决策更精准;"某个元素看起来不对"→ 直接命中 Repair;约束深度均衡化更聚焦(Repair 统一绑定 anti-patterns,Enhance 统一绑定 theory,Strategy 统一绑定 case-studies/patterns)。

**load-manifest.json 新增 `domains` 顶层键**(不破坏现有 `taskTypes` 结构):

```json
{
  "defaults": { ... },
  "domains": {
    "output":   { "description": "产出物:决定 HTML 的形态与结构",
                  "taskTypes": ["landing-page", "slide-deck", "interactive-prototype", "interactive-explainer", "knowledge-artifact", "animation-motion", "wireframe-low-fi", "design-system-creation", "data-visualization", "scene-output-specs"] },
    "device":   { "description": "设备框架:决定渲染容器与交互范式",
                  "taskTypes": ["mobile-mockup", "desktop-mockup", "react-prototype"] },
    "brand":    { "description": "品牌/风格:决定视觉调性与设计语言",
                  "taskTypes": ["brand-style-clone", "brand-asset-acquisition", "brand-tone", "choose-design-style", "no-design-system"] },
    "export":   { "description": "导出:决定交付格式与后处理",
                  "taskTypes": ["editable-pptx-export", "pdf-export", "video-export", "audio-design"] },
    "domain":   { "description": "垂直领域:决定领域专属约束",
                  "taskTypes": ["form-design", "ux-writing", "complex-multi-screen-flow", "design-handoff", "usability-testing"] },
    "repair":   { "description": "修复:针对具体缺陷的反模式修复",
                  "taskTypes": ["layout-problems", "color-problems", "typography-problems", "interaction-problems"] },
    "enhance":  { "description": "系统提升:无具体缺陷的系统性深度建设",
                  "taskTypes": ["design-system-architecture", "typography-system-design", "information-architecture", "interaction-design", "visual-composition"] },
    "strategy": { "description": "策略:方向性决策与方案探索",
                  "taskTypes": ["high-quality-output", "design-philosophy", "variant-exploration"] }
  },
  "taskTypes": { ... 保持不变 ... }
}
```

**Routing 流程升级**:

- Stage 1(不变):加载 `all-design-tasks` + `core-constraints.md`(新增)
- Stage 2a(新):识别主场景域(从 7 个域中选 1-2 个)
- Stage 2b(新):域内 taskType 精确匹配
- Stage 3(新):约束深度均衡化——所有约束深度 ≤1 的 taskType(约 15 个)统一追加 `references/core-constraints.md`,确保核心约束始终加载

**Route-Shaping Questions 对齐场景域**:

| 问题 | 对应场景域 |
|---|---|
| Q1 输出类型(page/deck/prototype/animation/...) | Output |
| Q2 任务状态(new/edit/follow-up) | (路由决策,非域) |
| Q3 可用上下文(design system/codebase/brand) | Brand |
| Q4 交互或交付约束(iOS/Android/PDF/PPTX/video) | Device + Export |
| Q5 主要设计风险(layout/typography/color/...) | Repair / Enhance / Strategy(三选一) |
| Q6 内容类型(知识类) | Output → knowledge-artifact |

### 2.4 Verification 三件套合并(第四节)

**当前问题**:verification 相关共四个文件,职责严重重叠且互相引用混乱。

| 文件 | 行数 | 职责 | 问题 |
|---|---|---|---|
| `verification.md` | 198 | 验证流程 + Playwright 操作手册 | 内容陈旧:引用不存在的 `scripts/verify.py`(已确认),路径 `~/.claude/skills/cc-design/` 也已过时 |
| `verification-protocol.md` | 152 | 三阶段验证协议 + Phase 4 用户评审 | 当前权威源,被 SKILL.md 直接引用 |
| `design-checklist.md` | 540 | 客观质量检查清单(5 类) | Category 4 Anti-AI Slop 与 core-constraints.md、protocol Phase 3 三处重叠 |
| `exit-conditions.md` | 131 | 按 task type 的退出条件 | 独立,无重叠 |

**合并方案**:确立 `verification-protocol.md` 为唯一权威源,废弃旧文件,`design-checklist.md` 降级为 protocol 的附录。

**改动 1:废弃 `verification.md`(删除)**

- 理由:内容已被 `verification-protocol.md` 完全取代;引用的 `scripts/verify.py` 不存在
- 迁移:将 `verification.md` 中仍有价值但 protocol 未覆盖的内容迁入 protocol:
  - "Screenshot Best Practices"(全页/视口/元素/高DPI/动画等待)→ 迁入 protocol Phase 2
  - "Troubleshooting Verification Errors"(白屏/动画卡顿/字体错/布局错位)→ 迁入 protocol 新增 "Troubleshooting" 章节
  - Playwright 操作示例 → 迁入 protocol(用 MCP 命令重写,而非过时的 Python 脚本)
- 引用更新:`workflow.md:380` `verification.md` → `verification-protocol.md`;`load-manifest.json:535` `verification.md` → 删除

**改动 2:`design-checklist.md` 降级为 protocol 附录**

- 理由:checklist(540 行)的 Phase 3 "Design Excellence" 检查与 protocol 是同一验证流程的不同切面,分开存放导致 deep-design-review 时要同时加载两文件
- 方式:物理上保持独立文件(540 行太长,合并会让 protocol 膨胀),但逻辑上重新定位:
  - `verification-protocol.md` 新增指针:"Phase 3 Design Excellence 的客观检查项 → `design-checklist.md`"
  - `design-checklist.md` 顶部 frontmatter 改为:"Appendix to `verification-protocol.md` Phase 3"
  - 去重:删除 checklist 的 "Category 4: Anti-AI Slop"(4.1-4.4,~80 行),改为指针指向 `core-constraints.md`

**改动 3:`verification-protocol.md` 增补内容(吸收迁移)**

protocol 从 152 行增长到约 220 行,吸收以下内容:

```
当前结构                          新增/修改
─────────────────────            ────────────────────────
## Relationship to 8-Layer       (不变)
## Phase 1: Structural           (不变)
## Phase 2: Visual               + Screenshot Best Practices(从 verification.md 迁入)
## Task-Type-Specific            (不变)
## Phase 3.5: Cognitive          (不变)
## Fix Loop                      (不变)
## Phase 4: User Review          (不变)
                                  + ## Troubleshooting(NEW,从 verification.md 迁入)
                                  + ## Phase 3 指针:design-checklist.md(NEW)
```

**最终引用关系(清理后)**:

```
SKILL.md Step 7 Verify
  └─→ verification-protocol.md(唯一权威源)
        ├─→ Phase 1 Structural(自含)
        ├─→ Phase 2 Visual + Screenshot Best Practices(自含,吸收自 verification.md)
        ├─→ Phase 3 Design Excellence ──→ design-checklist.md(附录,客观检查)
        ├─→ Phase 3.5 Cognitive(自含)
        ├─→ Phase 4 User Review(自含)
        └─→ Troubleshooting(自含,吸收自 verification.md)

[verification.md 已删除]
```

**load-manifest.json 改动**:

```json
"before-delivery": {
  "references": [
    "references/core-constraints.md",       ← 新增
    "references/verification-protocol.md",   ← 保留(权威源)
    "references/exit-conditions.md"          ← 保留
  ]
  // 删除:不再单独列 design-checklist.md(protocol 内部已指向)
},
"deep-design-review": {
  "references": [
    "references/core-constraints.md",        ← 新增
    "references/design-checklist.md",         ← 保留
    "references/principle-review.md",         ← 保留
    "references/verification-protocol.md"     ← 替换原 verification.md
    // 删除:references/verification.md
  ]
}
```

---

## 3. 完整改动清单

按执行顺序排列,共 4 类、11 项改动。

### 3.1 新建文件(1 项)

| # | 文件 | 行数 | 说明 |
|---|---|---|---|
| A1 | `references/core-constraints.md` | ~180 | 核心约束层,7 区块(Iron Law / Slop 速查 / 禁用字体 / 交付清单 / STOP 信号 / Scale Specs / 索引) |

### 3.2 删除文件(1 项)

| # | 文件 | 说明 |
|---|---|---|
| B1 | `references/verification.md` | 内容已被 protocol 取代,引用的 `verify.py` 不存在。有价值内容迁入 protocol |

### 3.3 修改现有文件(7 项)

| # | 文件 | 改动 | 风险 |
|---|---|---|---|
| C1 | `SKILL.md` | 新增 `⚡ Core Constraints` 置顶区块;删除 §7 Content Guidelines、§8 Typography 占位;Routing 改为 7 场景域分组表。152 → ~140 行 | **高**(触发 behavior-contract,需 VERSION bump) |
| C2 | `load-manifest.json` | 新增 `domains` 顶层键(7 域);`all-design-tasks.references` 首位加 `core-constraints.md`;15 个浅约束 taskType 补加 `core-constraints.md`;删除 `verification.md` 引用;`before-delivery`/`deep-design-review` checkpoint 更新 | **中** |
| C3 | `references/verification-protocol.md` | 吸收 verification.md 的 Screenshot Best Practices + Troubleshooting;新增 Phase 3 → design-checklist 指针。152 → ~220 行 | **低** |
| C4 | `references/design-checklist.md` | 顶部定位改为 "Appendix to protocol Phase 3";删除 Category 4 Anti-AI Slop(~80 行),改为指针指向 core-constraints.md。540 → ~460 行 | **低** |
| C5 | `references/workflow.md` | 第 380 行 `verification.md` → `verification-protocol.md`;第 488 行 deep-design-review 加载列表移除 `verification.md`、加 `core-constraints.md`;Stage 2 路由说明改为"域→taskType"两步 | **中**(behavior-contract 文件) |
| C6 | `README.md` | Capabilities 表保持不变;Contributing 第 2 条"SKILL.md under 200 lines"保持;更新版本号引用 | **低**(behavior-contract 文件) |
| C7 | `VERSION` | `0.9.3` → `0.10.0` | **必须**(behavior-contract 要求) |

### 3.4 配套脚本(2 项)

| # | 文件 | 改动 |
|---|---|---|
| D1 | `scripts/generate-bundle-catalog.mjs` | 读取新 `domains` 结构,catalog 输出域信息 |
| D2 | `scripts/lint-load-manifest.mjs` | 新增 lint 规则:① 每个 taskType 必须归属某 domain;② `all-design-tasks` 必须含 `core-constraints.md` |

---

## 4. 迁移路径(4 阶段)

分 4 个阶段,每阶段可独立验证、可独立提交。

### 阶段 1:基础层(无破坏性,可先合入)
- A1 新建 `core-constraints.md`
- C2(load-manifest 部分)`all-design-tasks` 加载 `core-constraints.md`
- 验证:现有任务无变化,仅多加载一个文件

### 阶段 2:架构层(routing 重组)
- C2(load-manifest 完整)新增 domains + 浅 taskType 补约束
- C1(SKILL.md 部分)Routing 改 7 场景域
- C5(workflow.md 部分)Stage 2 改两步路由
- D1 + D2 脚本更新
- 验证:`node scripts/lint-load-manifest.mjs` + `node scripts/generate-bundle-catalog.mjs`

### 阶段 3:约束前置(SKILL.md 重写)
- C1(SKILL.md 完整)⚡ Core Constraints 置顶 + 删除占位区块
- C6 README 同步
- 验证:`./scripts/check-behavior-contract.sh <base-ref>`

### 阶段 4:验证层清理
- B1 删除 `verification.md`
- C3 protocol 吸收迁移内容
- C4 checklist 去重 + 降级为附录
- C5(workflow.md 完整)引用更新
- C7 VERSION → 0.10.0
- 验证:全量 `grep -rn "verification\.md"` 无悬空引用(仅 git history 出现)

---

## 5. 风险评估与缓解

| 风险 | 等级 | 影响 | 缓解 |
|---|---|---|---|
| SKILL.md 重写改变 first-turn 行为 | 高 | check-behavior-contract.sh 失败 | 强制 VERSION bump(已纳入 C7);核心约束是"强化"非"改变"语义 |
| 删除 verification.md 导致悬空引用 | 中 | 运行时报错 | 阶段 4 最后执行;全量 `grep -rn "verification\.md"` 清理 |
| domains 新增键破坏旧版 resolve-load-bundles.mjs | 低 | keyword fallback 失效 | domains 是新增键,旧逻辑只读 taskTypes,不读 domains → 向后兼容 |
| core-constraints.md 与原文件内容重复造成混淆 | 低 | 模型不确定信哪个 | 核心层定位明确为"摘要+索引",每区块末尾标注"详见 X.md" |
| checklist 删除 Category 4 后 deep-design-review 遗漏 slop 检查 | 低 | 质量回退 | `core-constraints.md` 已始终加载(all-design-tasks),覆盖原 Category 4 职责 |

---

## 6. 成功标准

优化完成后,可通过以下标准验证:

1. **质量不均缓解**——所有 taskType 约束深度 ≥ 2(含 core-constraints.md)
2. **原则遵循提升**——SKILL.md 顶部即含完整 Iron Law + Slop 速查表,信号密度翻倍
3. **架构精简**——验证相关文件 4→3;anti-slop 检查重复处 4→2;39 taskType 有 7 域归属
4. **无悬空引用**——`grep -rn "verification\.md"` 仅在 git history 出现
5. **契约通过**——`check-behavior-contract.sh` + `lint-load-manifest.mjs` 全绿
