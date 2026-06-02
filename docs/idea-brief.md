# Idea Brief — cc-design 下一步发展方向

> 探索阶段的产出：方向地图 + 判断标准 + MVP 定义

## 版本信息

| 项目 | 值 |
|------|-----|
| 日期 | 2026-06-02 |
| 参与者 | GuanMu + Claude |
| 探索轮次 | 1 |

---

## 痛点

**一句话描述**：cc-design v0.9.1 功能丰富但质量地基不稳——核心特性零测试覆盖、主 prompt 膨胀 3 倍、旗舰功能缺乏文档示例，用户增长存在翻车风险。

**具体场景**：
1. 用户用 cc-design 生成交互式 Flow Explainer，输出质量偶尔不稳定，但因为没有测试用例，回归无法被发现
2. 新用户浏览 EXAMPLES.md 想了解 explainer/knowledge artifact 用法，发现一个示例都没有，只能自己摸索
3. 每次 cc-design 被调用，626 行的 SKILL.md 全量加载，token 成本高、加载慢

**谁受影响**：所有 cc-design 用户，尤其是依赖交互式 explainer 和 knowledge artifact 的用户

**影响程度**：高频率 × 高严重度（质量问题是增长的隐形天花板）

**当前方案 + 不足**：
- 有 9 个测试 prompt 但覆盖不到 explainer/knowledge artifact（占比最大的模板零覆盖）
- 有 check-behavior-contract.sh 但只检查 first-turn 行为 diff，不验证路由正确性
- 有 EXAMPLES.md 但 36% 篇幅在讲品牌克隆，核心差异化功能零示例

**根因分析**（5 Whys）：
1. 为什么质量不稳？→ 核心特性没有测试覆盖
2. 为什么没测试？→ 每个版本都在加新特性，测试没跟上
3. 为什么测试没跟上？→ 没有测试必须通过的发布门槛
4. 为什么没有发布门槛？→ 项目是单人维护，节奏快，质量关不严
5. 为什么质量关不严？→ 缺乏自动化的质量检查机制

---

## 方向地图

### 方向对比（第 1 轮）

| 方向 | 核心思路 | 适用场景 | 风险 | 验证难度 |
|------|---------|---------|------|---------|
| A: 质量加固 | 补测试、填文档、还技术债 | 增长前打地基 | 无新功能，可能感觉"没进展" | 低 |
| B: 特性完善 | Layer Explainer + 新模板 + 暗色主题 | 用户碰到"做不了"的场景 | 工作量大，可能引入新债 | 中 |
| C: 体验升级 | Demo Gallery + Prompt 模板库 + Onboarding | 新用户入门和留存 | 需要额外基础设施 | 高 |

### 方向详情

**方向 A: 质量加固**
- **做什么**：补测试覆盖、清理 SKILL.md 膨胀、补齐缺失文档和 case study
- **适用场景**：用户增长前先把地基打牢
- **优势**：降低回归风险、减少 token 成本、提升可信度
- **劣势**：用户不直接感知、维护感强
- **参考产品**：开源项目通常在 1.0 前做一轮质量清理
- **具体行动**：
  1. SKILL.md 拆分：626 行 → 200 行以内（routing table、workflow 等拆到 references/）
  2. 补 5+ 测试 prompt（explainer flow/compare/decision-tree、knowledge artifact、PPTX export）
  3. 补 6 个缺失 case study 文件
  4. 清理 3 处过时版本引用（v0.3 layer、v0.10 transform）
  5. EXAMPLES.md 增加 explainer、knowledge artifact、audio、review 示例
  6. 新增 references/accessibility.md

**方向 B: 特性完善**
- **做什么**：完成 Layer Explainer 模板 + 新增 Dashboard 模板 + 暗色/亮色主题参考
- **适用场景**：用户需要更多输出类型覆盖
- **优势**：直接扩大可用场景、完成 v0.3 就承诺的 layer explainer
- **劣势**：新模板也需要测试和文档，否则重复质量债
- **参考产品**：v0/bolt 不断扩展组件库
- **具体行动**：
  1. 实现 `templates/layer_explainer.jsx`（分层架构图）
  2. 实现 `templates/dashboard.jsx`（数据可视化布局）
  3. 新增 `references/theming.md`（暗色/亮色主题切换指南）
  4. 更新 load-manifest.json 路由表
  5. 更新 test-prompts.json 增加新模板测试

**方向 C: 体验升级**
- **做什么**：在线 Demo Gallery + Prompt 模板库 + Onboarding 向导
- **适用场景**：降低新用户门槛、提升留存率
- **优势**：用户直接感知、有利于传播和增长
- **劣势**：需要独立基础设施（部署、域名）、偏离核心 skill 开发
- **参考产品**：v0.dev 的 Gallery 页面、Lovable 的模板库
- **具体行动**：
  1. 搭建 cc-design-demo.vercel.app 的 Gallery 页面（展示各种输出类型）
  2. 创建 Prompt 模板库（常见设计任务的预制提示词）
  3. 新增 Onboarding 向导（引导新用户完成第一个设计任务）

---

## 推荐方向 + 评估（第 1 轮）

**选择**：方向 A（质量加固）作为第一阶段，方向 B 作为第二阶段，方向 C 作为第三阶段

**理由**：
1. 核心焦虑是"质量不够稳"→ 必须先加固地基
2. 方向 B 和 C 都会引入新代码，如果测试和文档机制不先建好，新特性只会增加质量债
3. 方向 A 的工作量最可控（主要是补写内容，不涉及新架构），可以在 1-2 周内完成
4. 方向 A 完成后，方向 B 的新模板可以直接用新的测试/文档标准来交付

**被拒方向及理由**：
- 方向 D（平台扩展）→ 跳过了质量地基，扩大覆盖面只会放大质量问题
- 方向 E（知识内容深耕）→ 好方向但优先级低于质量加固，可作为 v1.1 目标

**评估矩阵**：

| 标准 | 权重 | 方向 A | 方向 B | 方向 C |
|------|------|--------|--------|--------|
| 痛点解决度 | 高 | ★★★★★ | ★★★ | ★★ |
| 验证难度 | 高 | ★★★★★（极易验证） | ★★★ | ★★ |
| 用户感知度 | 中 | ★★ | ★★★★ | ★★★★★ |
| 实施成本 | 中 | ★★★★（低） | ★★ | ★ |
| 风险 | 中 | ★★★★★（低） | ★★★ | ★★ |

---

## MVP 定义（方向 A：质量加固）

**核心功能**（去掉任何一个就不成立）：
1. SKILL.md 拆分至 200 行以内（直接影响每次调用的 token 成本）
2. 补充至少 5 个测试 prompt 覆盖 explainer 和 knowledge artifact（覆盖最大盲区）
3. EXAMPLES.md 补充交互式 explainer 和 knowledge artifact 示例（用户最容易碰到的困惑点）

**边界声明**（明确不做）：
- 不做自动化测试运行器（手动验证 prompt 即可，运行器是后续优化）
- 不重构 hook 系统或 plugin 架构（与质量加固无关）
- 不新增输出类型模板（方向 B 的内容）
- 不搭建 Demo Gallery 或在线基础设施（方向 C 的内容）

**验证标准**（怎么算 MVP 成功）：
- SKILL.md 行数 < 200
- test-prompts.json 覆盖 ≥ 14 个任务类型（从 9 增至 14+）
- EXAMPLES.md 包含至少 3 个新示例（explainer、knowledge artifact、review）
- 所有过时版本引用已清理
- 6 个缺失 case study 至少补齐 3 个

---

## 假设清单

| # | 假设 | 验证方法 | 成功标准 | 负责人 | 时间 |
|---|------|---------|---------|--------|------|
| H1 | SKILL.md 拆分后不影响路由行为 | 拆分后运行 check-behavior-contract.sh | 无 first-turn 行为变化 | GuanMu | 1 周 |
| H2 | 新增测试 prompt 能发现实际 bug | 用新 prompt 实际调用 cc-design | 至少发现 1 个路由或输出问题 | GuanMu | 1 周 |
| H3 | 补齐文档能降低新用户困惑 | 观察用户反馈/GitHub Issues | "怎么用 explainer"类问题减少 | GuanMu | 2 周 |
| H4 | 质量加固后用户增长不会被质量问题拖累 | 追踪发布后 30 天内 bug 报告数 | 无重大质量回归 | GuanMu | 30 天 |

---

## 下一步行动

| 行动 | 负责人 | 截止时间 | 完成标准 |
|------|--------|---------|---------|
| SKILL.md 拆分：routing table → references/routing-table.md，workflow → references/workflow-quick-ref.md | GuanMu | 2026-06-09 | SKILL.md < 200 行，check-behavior-contract.sh 通过 |
| 补充 5 个测试 prompt（explainer×3 + knowledge artifact + PPTX export） | GuanMu | 2026-06-09 | test-prompts.json ≥ 14 条 |
| 清理过时版本引用（v0.3 layer、v0.10 transform） | GuanMu | 2026-06-05 | SKILL.md 和 references/ 中无过时版本承诺 |
| EXAMPLES.md 补充 explainer + knowledge artifact + review 示例 | GuanMu | 2026-06-12 | 至少 3 个新示例段落 |
| 补齐 3 个缺失 case study（android-dashboard、data-story、portfolio-site） | GuanMu | 2026-06-16 | references/case-studies/ 下文件存在且内容完整 |

**决策标准**：
- 继续：当方向 A 的 MVP 全部验证通过后，进入方向 B（特性完善）
- 调整：当 SKILL.md 拆分导致路由行为变化时，暂停并重新评估拆分方案
- 停止：当质量加固工作量远超预期（>4 周），重新 brainstorm 是否需要调整范围
