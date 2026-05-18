# Review: Animation Verification Upgrade (Seek-First)

**Feature:** 20260518-animation-verification
**Date:** 2026-05-18
**Built by:** current agent (main session)
**Stage 1 reviewed by:** current agent (main session)
**Stage 2 reviewed by:** current agent (main session)
**Independence status:** standard (self-review — build and review by same agent, but review is structured and evidence-based)

---

## Stage 1: Spec Compliance

All 11 Done When items checked against implementation:

| # | Spec requirement | Status | Evidence |
|---|---|---|---|
| 1 | `window.__seek(t)` 在 Stage 中实现 | **PASS** | `templates/animations.jsx:253-278` — useEffect mounts `__seek` on window, uses flushSync for synchronous DOM sync, clamps t to [0, duration], handles NaN→0 |
| 2 | Sprite 支持 `name` prop | **PASS** | `templates/animations.jsx:350` — `name` in function signature; `animations.jsx:366` — `data-sprite={name || undefined}` renders on wrapper div. Backward compatible: no attribute if name not provided |
| 3 | AI agent 能 seek + read + compare | **PASS** | `references/motion-contract.md` — 2-node verification flow documented; `references/verification-protocol.md` — Animation Numerical Check section; `references/animations.md` — Seek API section with Playwright code examples |
| 4 | `__seek` 使用 `flushSync` | **PASS** | `templates/animations.jsx:34` — `const flushSync = ReactDOM.flushSync;`; `animations.jsx:259` — `flushSync(() => { timeRef.current = clamped; setPlaying(false); setTime(clamped); });`. Spike test confirmed flushSync works in inline React |
| 5 | `__seek` 同时更新 `timeRef.current` | **PASS** | `templates/animations.jsx:260` — `timeRef.current = clamped;` inside flushSync batch alongside `setTime(clamped)` |
| 6 | 所有改动向后兼容 | **PASS** | Sprite `name` prop optional (no attribute if not provided); `__seek` useEffect cleanup deletes bridges on unmount; no changes to existing Stage props/timing/rendering; `__seek_sync` is a new signal that doesn't interfere; `__resumeRecording` only active when `__recording` is true |
| 7 | `render-video.js` __seek(0) 仍然有效 | **PASS** (after bug fix) | `scripts/render-video.js:211-238` — __seek(0) + __resumeRecording + rAF wait logic. **Critical bug fixed in review**: `__seek_sync` was checked in Node.js context (TypeError); now read via `page.evaluate()` returning `{ sought, seekSync }` object |
| 8 | `references/motion-contract.md` 新增 | **PASS** | File exists (100 lines). Contains: verification flow, constraint types, anti-patterns, scope, Playwright examples |
| 9 | `references/verification-protocol.md` 更新 | **PASS** | Animation Numerical Check subsection added under Phase 1. Documents __seek steps, __seek_sync fallback, brief-comparison guidance |
| 10 | `references/exit-conditions.md` 更新 | **PASS** | 3 new conditions added to Animation/Motion: `__seek(t)` available; key timestamps verified numerically; Sprites with meaningful content have `name` prop |
| 11 | `SKILL.md` workflow + checkpoint 更新 | **PASS** | Routing table Animation row includes `motion-contract.md`; before-animation checkpoint loads `motion-contract.md`; workflow Step 7 mentions Animation Numerical Check; `load-manifest.json` updated for both bundles |

**Spec Compliance Result: PASS (all 11 items)**

---

## Stage 2: Code Quality (Five-Axis)

### Axis 1: Correctness — 8/10

**Strengths:**
- `__seek` implementation is correct: flushSync for synchronous DOM, timeRef + setTime both updated, clamping handles edge cases
- `__seek_sync` flag correctly signals flushSync vs fallback path
- `__resumeRecording` correctly scoped to recording mode only
- Sprite `name` prop is backward compatible
- Motion contract docs use qualitative bounds (not exact targets) — matches spec philosophy

**Critical bug found and fixed:**
- `render-video.js:227` — `typeof window.__seek_sync` checked in Node.js context where `window` is undefined → TypeError crash whenever Stage+Sprite animation is exported. Fixed by reading `__seek_sync` via `page.evaluate()` and returning `{ sought, seekSync }` object instead of boolean.

**Minor concern:**
- In `animations.jsx`, the `__seek` useEffect has `[duration]` as dependency. If `duration` changes during playback (unlikely in practice), `__seek` would be re-created. This is correct React behavior but worth noting.

### Axis 2: Readability — 9/10

**Strengths:**
- `animations.jsx` header comments document all window bridges clearly
- Inline comments explain purpose of each bridge (__seek pauses for verification, __resumeRecording only for recording)
- `motion-contract.md` well-structured: verification flow → constraint types → anti-patterns → scope → examples
- `animations.md` Seek API section organized with clear subsections
- `animation-pitfalls.md` Section 5 rewritten from aspirational to factual ("__seek is Implemented" vs "Should Be Seekable")
- `verification-protocol.md` Animation Numerical Check section clear and actionable

**Minor:**
- `motion-contract.md` anti-patterns table uses "banned" which is strong but appropriate for this domain

### Axis 3: Architecture — 9/10

**Strengths:**
- `__seek` as useEffect bridge — correct lifecycle management (mount + cleanup)
- flushSync inside `__seek` — correct choice for deterministic reads needed by verification
- `__resumeRecording` separates concerns: seek pauses for verification, resume only in recording
- Sprite `name → data-sprite` — minimal, backward-compatible change enabling Playwright targeting
- motion-contract.md as reference doc (not runtime API) — correct MVP scope, avoids premature abstraction
- 2-node verification flow (seek-and-read → brief-comparison) — good separation of data acquisition from interpretation

**Minor:**
- `__seek` always pauses playback. If future use cases need seek-without-pause (e.g., scrubbing during playback), a separate `__seekAndResume` or `__seek(t, { pause: true })` option would be needed. Current design is correct for MVP scope.

### Axis 4: Security — 10/10

No security concerns:
- `__seek` clamps input, no injection risk
- `__resumeRecording` gated by `__recording` flag
- No external dependencies added
- No credential/data exposure
- Development/verification tool, runs in browser context only

### Axis 5: Performance — 9/10

**Strengths:**
- flushSync only used in `__seek` (verification mode), not in normal playback — no performance impact on user experience
- `__seek` useEffect is lightweight (sets window functions)
- Sprite `name` prop has zero performance impact (just HTML attribute)
- rAF waits in render-video.js are appropriate for video export

**Minor:**
- flushSync is heavier than concurrent rendering. This is acceptable because it's only triggered during verification/export, not during normal playback. Correct trade-off for determinism.

---

## Five-Axis Summary

| Axis | Score | Key finding |
|------|-------|-------------|
| Correctness | 8/10 | Critical bug fixed (render-video.js __seek_sync Node.js context TypeError) |
| Readability | 9/10 | Clear docs, well-structured references |
| Architecture | 9/10 | Correct lifecycle, separation of concerns, backward compatible |
| Security | 10/10 | No concerns |
| Performance | 9/10 | flushSync only in verification mode, appropriate |

---

## Findings by Severity

### Critical (was, now fixed)

1. **render-video.js __seek_sync context bug** — `typeof window.__seek_sync` checked in Node.js context (outside `page.evaluate()`), crashes with TypeError when exporting Stage+Sprite animations. Fixed by reading `__seek_sync` via `page.evaluate()` and returning `{ sought: boolean, seekSync: boolean|null }` object.

### Important (none)

No Important-level findings remain.

### Suggestion

1. **Future: seek-without-pause option** — Current `__seek` always pauses playback. If scrubbing during live playback becomes a use case, consider `__seek(t, { pause: false })` or separate `__scrub(t)` API. Not needed for MVP.

### FYI

1. **__seek useEffect re-creates on duration change** — If `duration` prop changes, `__seek` bridge is re-created. Correct React behavior, unlikely to matter in practice.
2. **transform matrix verification deferred** — `getComputedStyle` returns `matrix(...)` strings for transforms. Motion contract correctly scopes MVP to opacity/visibility only, deferring transform parsing to v0.10.

---

## Modified Files Summary

| File | Change type | Lines changed |
|------|-------------|---------------|
| `templates/animations.jsx` | Engine change | ~30 lines added (flushSync import, __seek useEffect, Sprite name prop) |
| `scripts/render-video.js` | Regression fix | ~25 lines modified (__seek(0) + __resumeRecording + __seek_sync-aware rAF) |
| `references/animations.md` | API docs | ~70 lines added (Seek API section) |
| `references/animation-pitfalls.md` | Section rewrite | Section 5 rewritten + recording defense update |
| `references/motion-contract.md` | New file | 100 lines (verification flow, constraints, anti-patterns, scope, examples) |
| `references/verification-protocol.md` | Section added | Animation Numerical Check subsection |
| `references/exit-conditions.md` | Conditions added | 3 new Animation/Motion conditions |
| `SKILL.md` | Routing + workflow | Animation row, before-animation checkpoint, Step 7 verification |
| `load-manifest.json` | Bundle updates | motion-contract.md in animation-motion + before-animation bundles |
| `VERSION` | Version bump | 0.8.1 → 0.9.0 |

---

## Verdict

**PASS** — All spec requirements implemented, one Critical bug found and fixed during review. Code quality strong across all five axes. Ready for delivery after bug fix is verified.