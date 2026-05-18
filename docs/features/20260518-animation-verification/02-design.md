# Animation Verification Upgrade — Design

## Design References

| 层级 | 来源 | 关键发现 |
|---|---|---|
| Enterprise Product Patterns | GSAP `timeline.seek(timeOrLabel, suppressEvents)` | seek 是成熟的测试 primitive |
| Enterprise Product Patterns | Remotion `<Thumbnail frameToDisplay={N}>` + `renderStill({frame})` | 帧级确定性测试是行业标准 |
| Official Systems / Platform Rules | Playwright `animations: "disabled"` + `getAnimations()` | Playwright 只支持"等动画完成" |
| Official Systems / Platform Rules | Material 3 / Apple HIG / Adobe Spectrum | 动画参数作为 design tokens |
| Methods / Theory | cc-design `animation-pitfalls.md` Rule 5 | `__seek` 应暴露（文档有，引擎无） |
| Methods / Theory | cc-design `animation-best-practices.md` | expoOut 为默认 easing，定性属性优先 |
| Local Project Truth | `templates/animations.jsx` | Stage 已有 setTime context, 无 `__seek` |
| Local Project Truth | `render-video.js` | 已调用 `window.__seek(0)` 但引擎未实现 |
| Local Project Truth | `verification-protocol.md` | 无动画数值验证 |
| Official Systems / Platform Rules | Browser `getComputedStyle` spec (MDN) | `transform` 返回 `matrix(...)` 字符串而非分解值；`opacity` 返回 float |

## Pattern Synthesis

1. **Seekable timeline** — GSAP/Remotion/cc-design pitfalls 三方确认：seek 是动画测试基础能力
2. **Factory + seek** — 构建动画后，seek 到关键时间点断言状态
3. **Retroactive verification** — 先构建再验证（Design Scout 确认比 proactive contract 更容易；Local Project Truth: 现有 workflow Step 7 已有验证步骤，seek-and-read 是对 Step 7 的增量扩展）
4. **定性属性 > 精确数值** — contract 断言 easing-family、duration-range，不是 exact target
5. **getComputedStyle 限制** — opacity 是 float（容易），transform 是矩阵字符串（回避）

## Design Inferences

- `__seek` 概念上直接——Stage 已有 `setTime`，bridge pattern 已知——但 `flushSync` 在 inline React 中的可用性是关键未知项，实现前需先验证
- Sprite `name` 是小改动高价值——让 `querySelector('[data-sprite="title"]')` 可用
- 验证流程简化为 2 个交互节点——seek-and-read + brief-comparison
- `flushSync` 在 inline React 中可能需要实际验证

## Adopt / Reject

**Adopt:**
- Remotion frame-level seek → `__seek(t)` API
- Playwright getComputedStyle → 数值验证路径
- Design token 模式 → 定性属性 + 数值范围
- Retroactive verification → 先建再验证
- 2-node 交互简化 → seek-and-read + brief-comparison

**Reject:**
- Proactive contract-first flow（认知负担）
- `__contract_snapshot` runtime（Eng Blocking）
- Formal JSON schema for MVP（先用参考文档）
- Transform matrix parsing in MVP（回避）
- Framer Motion `motion.mock()`（不 mock）

## Design Evidence Quality

高——所有关键决策有 Local Project Truth + External Pattern 双重证据。
唯一 Unknown：`flushSync` 在 inline React 中的可靠性（需实际测试）。

---

## Design Goals

1. **给 AI agent 一个数值感知通道**——让它能 seek 到任意时间点并读取动画状态
2. **保持向后兼容**——`__seek` 和 `name` 都是可选的，不影响现有动画 HTML
3. **最小改动原则**——Stage 加 ~10 行代码，Sprite 加 1 prop，不改引擎核心逻辑
4. **验证流程可循**——AI agent 有明确的 seek → read → compare 三步验证路径

## Key Design Decisions

### KD-1: `window.__seek(t)` API Interface

**决策：** 在 Stage 组件上暴露 `window.__seek(t)`，使用 `ReactDOM.flushSync` 包裹 `setTime(t)` + `setPlaying(false)` + `timeRef.current = t`。

**API 签名：**
```
window.__seek(t: number) → void
```

**行为：**
- 调用 `flushSync(() => { timeRef.current = t; setPlaying(false); setTime(t); })`（timeRef 在 flushSync 内先更新，保证同步 render 期间任何读取都拿到正确值）
- 暂停播放（seek 后不自动继续）
- DOM 同步更新（flushSync 保证）
- 不修改 `window.__ready`（__ready 只在 tick 首帧设为 true，seek 不重置——保证 render-video.js 的 `waitForFunction(() => __ready)` 不受影响）
- 边界行为：`t` 被 clamp 到 `[0, duration]`，与现有 scrubber 的 `Math.max(0, Math.min(duration, ...))` 模式一致（animations.jsx line 244）。NaN 或 undefined 输入视为 t=0

**为什么 seek+pause 组合（与 GSAP 分离式不同）：**
- GSAP 的 `timeline.seek()` 不默认暂停，测试模式通常是 `timeline.pause()` 然后 `timeline.seek()`
- cc-design 的 `__seek` 合并了 seek + pause，这是验证场景的便利 API：AI agent 必须 read state at a fixed time point，暂停保证读取不被播放推进干扰
- 与 Remotion `<Thumbnail>` 的静态渲染模型对齐（Thumbnail 本身无 playback 概念）

**为什么用 flushSync：**
- Eng Scout 确认：React 18 异步渲染下，`setTime` 不立即反映到 DOM
- `flushSync` 保证 `page.evaluate(() => __seek(t))` 后 DOM 立即更新
- 验证流程需要 seek → 立即 read → 断言，不能等 2 rAF

**降级策略：**
- 如果 `flushSync` 在 inline React（Babel Standalone + `file://`）中不可用
- 回退到 `setTime(t)` + 2-rAF-wait（与 render-video.js 当前模式一致）
- 降级时 AI agent 验证流程改为：seek → `page.waitForTimeout(100)` → read

**为什么不用 `__contract_snapshot`：**
- Eng Blocking：引擎没有"期望状态"注册表
- 更简路径：Playwright `page.evaluate(() => getComputedStyle(el))` 直接读取
- 不引入新 runtime API，只暴露已有的时间控制能力

### KD-2: Sprite `name` prop

**决策：** 给 Sprite 添加可选 `name` string prop，渲染为 `data-sprite="{name}"` HTML attribute。

**为什么：**
- Local Project Truth: Sprite 渲染为匿名 `<div style={{position:'absolute', inset:0}}>`（animations.jsx line 327），无 identification attribute，使 `querySelector('[data-sprite="..."]')` 不可能
- `data-sprite` attribute 让 `page.$('[data-sprite="title"]')` 成为可能

**向后兼容：**
- `name` 是可选的（默认 undefined → 不渲染 `data-sprite`）
- 现有动画 HTML 不受影响

### KD-3: Verification Flow (2-node Interaction)

**决策：** 动画验证流程简化为 2 个关键交互节点，不是 7 步。

**Node 1: Seek-and-Read**
```
page.evaluate(() => __seek(t))  // seek to key timestamp
page.evaluate(() => {
  const el = document.querySelector('[data-sprite="title"]');
  return {
    opacity: parseFloat(getComputedStyle(el).opacity),
    visibility: getComputedStyle(el).visibility,
  };
})
```

**Node 2: Brief-Comparison**
AI agent 将读取的数值与 brief 预期比较：
- "Title should be visible at t=2" → opacity > 0.8 ✓
- "Title should fade out by t=5" → opacity < 0.1 ✓
- "Entry easing should feel expoOut-family" → opacity rising curve matches expoOut pattern ✓

**为什么不是 7 步：**
- Local Project Truth: 现有 workflow Step 6 是 build，Step 8 是 deliver——只有 Step 7 (Verify) 需要增量扩展
- 7 步中步骤 1-2 是已有的 build，步骤 7 是已有的 delivery
- 只有 seek-and-read 和 brief-comparison 是新增（2 个交互节点而非 7 步流程）

**关键时间点选择：**
- 默认检查 3-5 个时间点：t=0（初始）、第一次 transition、midpoint、最后一次 transition、t=duration（结束）
- AI agent 从 Sprite schedule 推断关键时间点（start/end 值）

### KD-4: Motion Contract Reference Format

**决策：** Contract 作为参考文档概念（`references/motion-contract.md`），不是 runtime API 或 JSON schema。

**Contract 定义原则（写入参考文档）：**

| 约束类型 | 格式 | 示例 |
|---|---|---|
| Duration range | `{ min_ms, max_ms }` | `{ min_ms: 5000, max_ms: 60000 }` |
| Easing family | enum whitelist | `["expoOut", "easeIn", "overshoot", "spring", "linear"]` |
| Opacity bound | `{ min, max }` | `{ min: 0, max: 1 }` |
| Cross-fade gap | max seconds | `0.3` |
| Final frame rule | boolean | `fadeOut: false on last Sprite` |

**为什么不在 HTML 中写 contract object：**
- CEO Scout：contract 先用注释格式原型
- Eng Scout：最简路径不需要 contract runtime
- MVP 专注 seek + getComputedStyle，contract 是思维框架不是代码

**AI agent 如何使用：**
- 读取 `references/motion-contract.md` 了解约束规则
- 在验证时用这些规则作为断言标准（而非对照 JSON object）

### KD-5: Reference Documentation Structure

**决策：** 新增 1 个参考文档，更新 4 个现有参考文档，更新 2 个核心配置文件。

| 文件 | 变更类型 | 内容 |
|---|---|---|
| `references/motion-contract.md` | 新增 | Contract 概念、约束类型、格式定义、验证规则、反例 |
| `references/verification-protocol.md` | 更新 | Phase 1 新增 Animation Numerical Check 段落 |
| `references/exit-conditions.md` | 更新 | Animation 行增加 `__seek` + 数值验证条件 |
| `references/animation-pitfalls.md` | 更新 | Section 5 从推荐变为事实："`__seek(t)` 已在 Stage component 中实现。Stage+Sprite 动画直接调用 `window.__seek(t)`。手写动画仍使用 starter template。" 移除手写 template 推荐段落中与 Stage 重复的部分 |
| `references/animations.md` | 更新 | 新增 `__seek` API 文档段落 |
| `SKILL.md` | 更新 | before-animation checkpoint + workflow 验证步骤 |
| `templates/animations.jsx` | 代码 | Stage `__seek` + Sprite `name` |

### KD-6: Scope Boundary

**MVP 只覆盖 Stage+Sprite 动画。**

| 场景 | 验证方式 |
|---|---|
| Stage+Sprite 动画 | seek + getComputedStyle（新增） |
| 手写 CSS/JS 动画 | 截图验证（不变） |
| CSS transition (hover/tap) | 截图验证（不变） |
| View Transitions API | 截图验证（不变，scope 排除） |

**为什么：**
- CEO Scout：Stage+Sprite 是确定性系统，可 seek
- 手写动画不保证 `render(t)` 是纯函数，seek 可能不可靠
- 诚实声明比虚假承诺更好

---

## Design Boundaries

- **不做** contract runtime（`window.__motion_contract`、`window.__getState`）
- **不做** formal JSON schema validation
- **不做** transform matrix parsing
- **不做** Playwright 自动断言脚本
- **不做** 手写动画数值验证
- **不做** 引入外部动画库
- **不做** visual mockup 或交互式视觉对比（非 UI 设计任务）

## Approval Criteria

- [ ] `__seek(t)` API 签名、行为（pause+flushSync+timeRef sync）、边界行为（clamp [0,duration]）、`__ready` 交互约束（不修改）和降级策略已指定
- [ ] Sprite `name` prop 渲染为 `data-sprite` attribute、向后兼容（可选）已指定
- [ ] 验证流程 2-node 交互设计有 Node 1（seek-and-read 代码示例）和 Node 2（brief-comparison 逻辑）及简化理由
- [ ] Contract 参考文档内容范围（约束类型表 + 验证规则 + 反例）已指定
- [ ] Scope boundary 明确（只 Stage+Sprite，手写/CSS transition 排除且有理由）
- [ ] 向后兼容性保证：`__seek` 和 `name` 可选，现有 HTML 不受影响，render-video.js `__seek(0)` 调用仍有效
- [ ] 不做清单完整，含理由

## Implementation Preconditions

- `flushSync` 在 inline React (Babel Standalone + `file://`) 中可用性需实际验证
- `getComputedStyle` 在 seek 后立即读取的准确性需实际验证
- `timeRef.current` 同步更新不引入竞态条件需实际验证
- 所有改动不影响 `render-video.js` 的 `__seek(0)` 调用