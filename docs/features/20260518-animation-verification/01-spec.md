# Animation Verification Upgrade (Seek-First)

## 问题陈述

HMW: How might we 让 cc-design AI agent 在不依赖视觉感受的前提下，可靠地验证动画质量？

当前 AI agent 使用 Playwright 截图验证动画，但截图无法感知时间节奏、动画流畅度、enter/exit 行为。导致 AI 反复声称"动画做好了"却不成立。根本原因：AI 缺乏时间感知通道，只能看静态画面。

## 方案及理由

**Seek-First Verification**：给 AI agent 一个数值感知通道——通过 `window.__seek(t)` 定点跳转到关键时间戳，再通过 Playwright `page.evaluate(() => getComputedStyle(el))` 读取数值状态，与 brief 预期比较。

这个方案优先解决验证范式的基础设施缺失（`__seek` 在 pitfalls 文档中已定义但未在引擎中实现），而不是引入一个新的 contract runtime。`__seek` 是所有后续验证能力（contract schema、自动断言）的 prerequisite。

参考：Remotion 的 `<Thumbnail frameToDisplay={N}>` 模式、GSAP 的 `timeline.seek()` 模式、Playwright 社区的 `getAnimations()` + `getComputedTiming()` 模式。cc-design 的 `__seek`/`__ready` 协议比 Playwright 内置动画支持更强大，因为它支持确定性时间跳转，而 Playwright 只支持"等待动画完成"。

## Artifact Type
artifact_type: software

## Goal Alignment
- Source Goal: conversation (brainstorm → refine)
- Goal Status: accepted
- Goal Review Score: 11/12

### One-line Goal

让 cc-design AI agent 通过 `__seek(t)` + 数值读取验证动画，而非依赖截图猜测。

### Done When
- [ ] Functional: `window.__seek(t)` 在 Stage 中实现，能跳转到任意时间点并同步渲染
- [ ] Functional: Sprite 支持 `name` prop，Playwright 能通过 name 定位元素
- [ ] Functional: AI agent 能在 Playwright 中 seek 到 3-5 个关键时间点，读取 computed style，与 brief 预期比较
- [ ] Technical: `__seek` 使用 `ReactDOM.flushSync` 保证同步渲染
- [ ] Technical: `__seek` 同时更新 `timeRef.current`（不只有 useState）
- [ ] Technical: 所有改动向后兼容，现有动画 HTML 不受影响
- [ ] Regression: `render-video.js` 的 `__seek(0)` 防御性调用仍然有效
- [ ] Output: `references/motion-contract.md` 新增
- [ ] Output: `references/verification-protocol.md` 动画段落更新
- [ ] Output: `references/exit-conditions.md` 动画行更新
- [ ] Output: `SKILL.md` workflow 和 before-animation checkpoint 更新

### Stop Conditions
- [ ] `__seek` 实现导致现有动画播放行为异常（如循环、暂停、时间偏移）
- [ ] `flushSync` 在 inline React 环境中不可用或导致渲染崩溃
- [ ] 实际范围明显大于当前 Goal（如发现需要引入 Motion 库）

## External References
- Search status: completed
- Scan date: 2026-05-18
- Sources:
  - GSAP official docs — `timeline.seek()` API signature and testing patterns
  - Remotion official docs — `<Thumbnail frameToDisplay>` and `useCurrentFrame()` pure-function testing model
  - Playwright official docs — `animations: "disabled"` context option, community `getAnimations()` + `getComputedTiming()` pattern
  - Framer Motion official docs — `motion.mock()` only official testing utility; no assertion API exists
  - Material 3 / Apple HIG / Adobe Spectrum — animation as design tokens with numerical constraints

- Fact:
  - GSAP `timeline.seek(timeOrLabel, suppressEvents)` 是成熟的测试 primitive
  - Remotion `<Thumbnail frameToDisplay={N}>` 支持 SSR 级别的帧级测试
  - Playwright 只有 `animations: "disabled"` 选项，不支持 seek 到特定时间点
  - Framer Motion 没有 animation assertion API
  - `getComputedStyle` 对 transform 返回矩阵字符串（如 `matrix(1,0,0,1,120,0)`）

- Pattern:
  - 多个框架（Remotion/GSAP/cc-design）都用"时间→纯函数→可 seek"模型
  - 设计系统（Material/Apple/Spectrum）将动画参数定义为 first-class design tokens
  - 社区测试模式：seek → getComputedStyle → assert within tolerance

- Inference:
  - cc-design 的 `__seek`/`__ready` 协议比 Playwright 内置动画支持更强大
  - 最简验证路径不需要 contract runtime——seek + getComputedStyle 足够

- Unknown:
  - 无正式的 "Motion Contract" 规范存在于业界

- Adopt:
  - Remotion 的 frame-level seek 模式 → `__seek(t)` API
  - Playwright 社区的 getComputedStyle 状态读取模式 → 数值验证
  - 设计 token 模式 → contract 定义参考（定性属性 + 数值范围）

- Reject:
  - Framer Motion `motion.mock()` 模式——cc-design 不做 mock，做真实 seek
  - GSAP GSDevTools 可视化调试——cc-design Stage 已有 scrubber
  - motion-report npm package——不存在于 npm registry
  - 手写动画的 contract 验证——scope 不在 MVP 内

## Scout Review Summary
- CEO: 问题真实，高杠杆，contract 应断言定性属性而非精确数值，MVP 只覆盖 Stage+Sprite
- Eng: `__contract_snapshot` 没有"期望状态"来源（Blocking），`__seek` 应独立先加，最简路径不需要 contract schema
- Design: 回溯验证优于 proactive contract，Sprite 需要 name prop，contract 应是 JS object
- Blocking resolved: 放弃 `__contract_snapshot` API，改用 Playwright `page.evaluate(() => getComputedStyle(el))` 直接读取
- Important adopted: `__seek(t)` with `flushSync` + `timeRef` sync; Sprite `name` prop; 回溯验证流程
- Suggestions deferred: `window.__getState()` API、visual timeline debugger mode、formal JSON contract schema（推迟到 v0.10）

## 核心假设（待验证）
- [ ] 假设 1: AI agent 能正确使用 `page.evaluate(() => __seek(t))` + `getComputedStyle` 读取数值并做出判断 — 验证方式：用现有动画 HTML 测试 seek + evaluate 流程
- [ ] 假设 2: `flushSync` 在 inline React 环境（Babel Standalone + file:// 协议）中正常工作 — 验证方式：实际测试
- [ ] 假设 3: Stage+Sprite 动画覆盖了大多数交付场景 — 验证方式：检查 EXAMPLES.md 和路由表
- [ ] 假设 4: `getComputedStyle` 返回的 opacity 值足够精确用于判断（transform 矩阵可能需要解析或回避） — 验证方式：实际测试

## MVP 范围

**包含：**
1. `templates/animations.jsx` — Stage 添加 `window.__seek(t)` (with `flushSync` + `timeRef` sync)；Sprite 添加 `name` prop
2. `references/motion-contract.md` — 新增参考文档，定义 contract 概念、格式、验证规则
3. `references/verification-protocol.md` — Phase 1 新增 Animation Numerical Check 段落
4. `references/exit-conditions.md` — Animation 行增加 `__seek` 可用和数值验证条件
5. `SKILL.md` — before-animation checkpoint 增加 motion-contract.md 加载；workflow 验证步骤增加动画定点验证
6. `references/animation-pitfalls.md` — 更新 Section 5，反映 `__seek` 现已在引擎中实现
7. `references/animations.md` — 新增 `__seek` API 文档段落

**不包含：**
- `window.__motion_contract` runtime API（推迟到 v0.10）
- `window.__getState()` / `window.__contract_snapshot(t)` runtime API（推迟到 v0.10）
- 正式 Motion Contract JSON schema（推迟到 v0.10）
- Playwright 自动断言脚本（推迟到 v0.10）
- 手写动画（非 Stage+Sprite）的数值验证（明确排除）
- 引入 Motion/GSAP 等外部动画库（明确排除）

## 不做清单（及理由）
- 引入 Motion (Framer Motion) — 单 HTML 交付限制，Motion inline 体积过大；Stage+Sprite 已足够
- 引入 GSAP — 同上体积问题；Stage+Sprite 已有 seek/scrubber
- 引入 React Spring — 弹簧模型依赖"手感"，AI 无法精确验收
- `window.__contract_snapshot(t)` runtime API — 引擎没有"期望状态"来源，设计缺口（Eng Blocking）
- 验证手写动画 — Stage+Sprite 是可 seek 的确定性系统，手写动画无法保证这一点（CEO 建议）
- formal JSON contract schema — 先用参考文档定义概念，验证 seek+getComputedStyle 路径有效后再正式化（Eng + CEO 建议）
- TypeScript 类型定义 — 单 HTML 交付不含 TypeScript
- `motion.mock()` 模式 — cc-design 不 mock，做真实渲染验证

## 待解决问题
- `flushSync` vs 2-rAF-wait：Eng scout 建议 `flushSync`（同步渲染，更适合验证）；render-video.js 当前用 2-rAF-wait。MVP 使用 `flushSync`，如果 inline React 环境不支持则回退到 2-rAF-wait。
- `getComputedStyle` transform 矩阵解析：opacity 直接返回 float，容易判断；transform 返回矩阵字符串。MVP 策略：优先检查 opacity 和 visibility，transform 检查推迟到 v0.10（需要矩阵解析库或改用 `__getState()` 逻辑状态）。