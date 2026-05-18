# Ship: Animation Verification Upgrade (Seek-First)

**Feature:** 20260518-animation-verification
**Version:** 0.9.0 (bumped from 0.8.1)
**Date:** 2026-05-18

---

## Pre-Release Checklist

| Item | Status | Notes |
|------|--------|-------|
| VERSION bumped | ✅ | 0.8.1 → 0.9.0 |
| Install/upgrade flow unchanged | ✅ | No changes to update mechanism |
| Behavior-contract files aligned | ✅ | SKILL.md + README.md + references/workflow.md all updated together |
| check-behavior-contract.sh passes | ✅ | Clean exit (no errors) |
| All Blocking issues resolved | ✅ | Critical bug fixed (render-video.js __seek_sync context) |
| Backward compatibility verified | ✅ | Sprite name optional, __seek cleanup on unmount, __resumeRecording gated |

## Ship Audit

**Risk assessment:** Low — infrastructure change (animation engine internals + dev tooling), no user-facing security/performance/accessibility exposure.

**Specialist auditors:** Skipped (low risk). Justification:
- **Security:** No user input handling, no auth changes, no data exposure. __seek clamps input, __resumeRecording gated by __recording.
- **Performance:** flushSync only in verification mode (not playback). rAF waits only in video export.
- **Accessibility:** No UI changes to user-facing content. __seek is dev tool.
- **Docs:** Verified in main session — all reference docs created/updated, routing table aligned, exit conditions updated.

## Change Summary

**What changed:**
- `templates/animations.jsx` — Stage exposes `window.__seek(t)` via flushSync, `__seek_sync` flag, `__resumeRecording()` bridge; Sprite accepts `name` prop → `data-sprite` attribute
- `scripts/render-video.js` — __seek(0) + __resumeRecording + __seek_sync-aware rAF wait (bug fix: __seek_sync read via page.evaluate instead of Node.js window)
- `references/motion-contract.md` — New reference doc defining numerical verification concepts
- `references/animations.md` — Seek API documentation section
- `references/animation-pitfalls.md` — Section 5 rewritten (fact, not aspiration) + recording defense update
- `references/verification-protocol.md` — Animation Numerical Check subsection
- `references/exit-conditions.md` — 3 new Animation/Motion conditions
- `SKILL.md` — Routing table + before-animation checkpoint + Step 7 verification
- `README.md` — Animation feature description updated
- `references/workflow.md` — Step 7 description updated
- `load-manifest.json` — motion-contract.md in animation-motion + before-animation bundles
- `VERSION` — 0.9.0

**Why it matters:**
AI agents using browser-use (screenshot-based) cannot reliably verify animation quality. Seek-First Verification gives them a numerical perception channel: `__seek(t)` + `getComputedStyle` + qualitative bounds comparison. This replaces "looks good" screenshots with deterministic, repeatable numerical checks.

**Scope:** Stage+Sprite animations only. Hand-written CSS/JS animations still use screenshot verification (unchanged).

## Files Modified (12)

```
.codex-plugin/plugin.json           |  2 +-
README.md                           |  2 +-
SKILL.md                            |  6 ++--
VERSION                             |  2 +-
load-manifest.json                  |  6 ++--
references/animation-pitfalls.md    | 36 ++++++++++---------
references/animations.md            | 72 +++++++++++++++++++++++++
references/exit-conditions.md       |  3 ++
references/verification-protocol.md | 25 +++++++++++++
references/workflow.md              |  2 +-
scripts/render-video.js             | 29 +++++++++++----
templates/animations.jsx            | 43 ++++++++++++++++++++--
```

194 insertions, 34 deletions across 12 files.

## Bug Fixed During Review

**Critical: render-video.js __seek_sync context TypeError**
- `typeof window.__seek_sync` was checked in Node.js context (outside `page.evaluate()`), where `window` is undefined
- Would crash render-video.js whenever exporting a Stage+Sprite animation to video
- Fixed by reading `__seek_sync` via `page.evaluate()` and returning `{ sought: boolean, seekSync: boolean|null }` object
- Also updated the log line to use `seekCorrected.sought` instead of truthy object check

## Delivery

**Status:** Ready for commit and merge.

**Caveats:**
- Transform matrix verification deferred to v0.10 (getComputedStyle returns `matrix(...)` strings, needs parsing)
- `__seek` always pauses playback after seek — future scrubbing-during-playback use case may need `__seek(t, { pause: false })`

**Next step:** Commit these changes to master so `ccdesign-update-check` can see the new version 0.9.0.