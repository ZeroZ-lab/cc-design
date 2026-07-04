# Verification Protocol

> **Load when:** Reaching the Verify step (step 5) in the workflow, or preparing to deliver a final artifact
> **Skip when:** Still in the Build step iterating on intermediate changes
> **Why it matters:** Platform-native design tools run two-phase verification automatically. Without this protocol, defects slip through to delivery.
> **Typical failure it prevents:** Delivering artifacts with console errors, broken scaling, invisible text, or misaligned elements

---

## Relationship to 8-Layer Framework

This verification protocol implements **Layer 8 (Validation)** of the design thinking framework (`design-thinking-framework.md`).

**Mapping:**

| Verification Phase | 8-Layer Framework | What It Validates |
|--------------------|-------------------|-------------------|
| **Phase 1: Structural** | Layer 3 (Structure) + Layer 4 (Interaction) | Technical feasibility, layout structure, interaction functionality |
| **Phase 2: Visual** | Layer 5 (Visual) + Layer 6 (Brand) | Visual hierarchy, typography, spacing, brand consistency |
| **Phase 3: Design Excellence** | Layer 2 (Information) + Layer 7 (System) | Information clarity, system consistency, anti-slop compliance |

**Complete validation requires all 3 phases.** Phase 1-2 are defined here. Phase 3 uses `design-checklist.md` for objective quality checks.

---

## Phase 1: Structural Verification

Run these checks first. Any failure = stop and fix before proceeding to Phase 2.

| Check | Method | Pass criteria | Fix if fail |
|-------|--------|---------------|-------------|
| Console errors | `browser_console_messages` (level: error) | 0 errors | Read error message, fix source, re-verify |
| Console warnings | `browser_console_messages` (level: warning) | 0 warnings about missing resources | Fix asset paths or missing imports |
| Layout structure | `browser_snapshot` | All expected elements present in accessibility tree | Check rendering conditions (display:none, conditional logic) |
| Fixed-size scaling | `browser_evaluate` — check deck_stage or stage transform | Content fills intended viewport without overflow | Verify transform:scale calculation, check container dimensions |
| Asset loading | `browser_evaluate` — check `document.querySelectorAll('[src],[href]')` | No broken links (404) | Fix relative paths, ensure assets exist |

### Console check command

```
browser_console_messages → level: error
browser_console_messages → level: warning
```

If Phase 1 has any failure: fix the issue, re-navigate the page, re-run Phase 1. Do not proceed to Phase 2 until Phase 1 passes clean.

### Animation Numerical Check (Stage+Sprite only)

After structural checks pass, for animations using Stage+Sprite, additionally verify key timestamps numerically via `window.__seek(t)` + `getComputedStyle`.

**Steps:**
1. Seek to 3-5 key time points: t=0 (initial), first transition, midpoint, last transition, t=duration (end)
2. At each point: `page.evaluate(() => __seek(t))` then `page.evaluate(() => getComputedStyle(el))` for opacity/visibility
3. If `__seek_sync === false` (fallback path): add `page.waitForTimeout(100)` after each seek before reading
4. Compare against brief expectations using qualitative bounds (see `references/motion-contract.md`)

**Example:**
```js
// Seek to t=2, read title opacity
await page.evaluate(() => __seek(2));
const opacity = await page.evaluate(() => {
  const el = document.querySelector('[data-sprite="title"]');
  return el ? parseFloat(getComputedStyle(el.querySelector('div')).opacity) : null;
});
// Assertion: "Title visible at t=2" → opacity > 0.8
```

**Must use Sprite `name` prop + `data-sprite` selector** for targeting elements. All Sprites with meaningful content should have a `name` prop.

**For hand-written animations** (not Stage+Sprite): still use screenshot-only verification. Numerical seek-and-read is not applicable — hand-written animations cannot guarantee `render(t)` is a pure function.

## Phase 2: Visual Verification

Run these after Phase 1 passes. Requires human judgment via screenshot review.
This is a **maker self-check**. The person who made the change must inspect the screenshots after the final edit.

| Check | Method | Pass criteria |
|-------|--------|---------------|
| Screenshot taken | `browser_take_screenshot` | Screenshot captured successfully |
| Coverage | Full-page screenshot + targeted section screenshots for touched areas | Every changed region inspected, not just first screen |
| Viewport coverage | Additional screenshot at narrow/mobile viewport for responsive work | Layout and typography remain coherent across target widths |
| Typography | Visual check on screenshot | Headings distinct from body, no text < 12pt (print) or < 24px (1080p slides) |
| Alignment | Visual check on screenshot | Elements aligned to grid, no drift, consistent margins |
| Contrast | Visual check on screenshot | Text readable against background, no low-contrast pairs |
| Spacing | Visual check on screenshot | Consistent use of spacing tokens, no arbitrary gaps |
| Tweaks panel | Visual check (if applicable) | Tweaks toggle visible, panel functional, no UI artifacts when hidden |
| Content | Visual check on screenshot | No placeholder text left in, no filler content |

### Visual review flow

```
1. browser_take_screenshot → capture full page after the final edit
2. Capture targeted screenshots for every changed section / component / slide
3. For responsive work, capture at least one narrow/mobile viewport
4. Review all screenshots against criteria above
5. If any criterion fails → fix in Build step, re-verify from Phase 1
6. If all pass → proceed to Phase 4 (User Review)
```

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

## Task-Type-Specific Verification

In addition to the three-phase protocol, verify task-type-specific items:

| Task Type | Additional Verification |
|---|---|
| Landing Page | Responsive at desktop + mobile. CTA prominence checked. Body font >= 16px. |
| Slide Deck | Every slide has `[data-screen-label]`. Body font >= 24px. `deck_stage` used. |
| Animation | `__ready` signal present. Phase dwell times >= 3s. Easing correct (out/in). |
| Interactive Prototype | All paths tested. No dead ends. State transitions smooth. |
| Brand Clone | Colours from real assets. Fonts exact. Tone matches brand personality. |
| Design Critique | Each dimension scored. Severity labels on all findings. |
| Export | File opens correctly. Tool dependencies confirmed. |

Full details in `references/exit-conditions.md`.

## Phase 3: Design Excellence Checklist

Phase 1-2 是技术性与视觉性检查。Phase 3 是客观质量检查,使用独立清单文件:

→ **详见 `references/design-checklist.md`**(5 类客观检查:Accessibility / Cognitive Load / Consistency / Edge Cases;Anti-AI Slop 检查已迁至 `references/core-constraints.md` §2)。

deep-design-review checkpoint 会同时加载 protocol 与 checklist。

## Phase 3.5: Cognitive Verification (Knowledge/Interactive Output)

**When to apply:** Only when output includes interaction or animation components, or when routed through `knowledge-artifact` / `interactive-explainer` taskTypes.

1. **Primary module check:** Does a primary interaction/animation module exist that carries the core explanation task? (Not just decorative hover effects)
2. **Dynamic structure coverage:** Are all dynamic cognitive structures (process/change/causation/etc.) in the content matched to appropriate dynamic expressions?
3. **Understanding gain:** Remove animation/interaction → does understanding degrade? If not, consider downgrading.
4. **Cognitive loop:** Does information structure form: conclusion → structure → mechanism → interactive exploration → practical advice → boundaries → summary?
5. **Static-only ban:** If content falls under Static-only Ban categories, verify at least one dynamic explanation module is present.

Full cognitive checklist: `knowledge-artifact-spec.md` Section 7.

## Fix Loop

The verification loop is strict:

```
Phase 1 fail → fix → re-navigate → Phase 1 again
Phase 2 fail → fix → re-navigate → Phase 1 + Phase 2 again
```

Never skip Phase 1 to "just check visuals." Structural errors cause visual defects that are symptoms, not root causes.

If the fix loop repeats 3+ times on the same issue, or if fixing one thing breaks another, enter the structured recovery protocol: see `references/failure-mode-handling.md`.

## Phase 4: User Review (new)

**Purpose**: Get human approval before delivery. After all three phases pass, present results to the user.

Steps:
1. Present exit conditions checklist results (checked / failed items) from `references/exit-conditions.md`
2. Present Phase 2 screenshot(s)
3. Wait for user decision:
   - **Approve** → proceed to Deliver step
   - **Request changes** → re-enter fix loop (back to Phase 1), fix the specific item, re-run all phases
   - **Rethink direction** → trigger Iteration Gate in `references/workflow.md` (back to Step 1 — Understand)

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
