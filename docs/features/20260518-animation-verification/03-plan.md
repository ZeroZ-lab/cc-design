# Animation Verification Upgrade — Plan

## Plan Topology
- **Type:** serial with spike pre-step
- **Size:** S (8 files, 7 tasks)
- **Reason:** 文档变更依赖引擎实现，必须串行；flushSync spike 需在 Task 1 前独立验证

## Assumptions
- `flushSync` 在 inline React (Babel Standalone + `file://`) 中可用——需在 Task 0 spike 中验证
- `getComputedStyle` 在 `__seek` 后立即读取可返回正确值——需在 Task 2 中验证
- 现有动画 HTML 不受 `__seek` 和 `name` 影响（向后兼容）
- `render-video.js` 需在 `__seek(0)` 后恢复播放（Blocking #1 resolution）

---

### Task 0: flushSync Spike (Isolated Validation)

**Files:**
- Create: temporary test HTML (delete after validation)

**Depends On:** none

**Purpose:** Validate the key unknown from design — whether `ReactDOM.flushSync` works in inline React (Babel Standalone + `file://` protocol) before implementing `__seek`.

- [ ] **Step 1: Create minimal flushSync test HTML**
  - Use the standard cc-design HTML template with Babel Standalone
  - Include a simple component with `useState` and a `window.__test_flush` bridge:
    ```jsx
    function TestApp() {
      const [val, setVal] = useState(0);
      useEffect(() => {
        window.__test_flush = (v) => {
          ReactDOM.flushSync(() => setVal(v));
          // Immediately read DOM to verify synchronous update
          return document.getElementById('output').textContent;
        };
      }, []);
      return <div id="output">{val}</div>;
    }
    ```
  - Save as `docs/features/20260518-animation-verification/spike-flushsync.html`

- [ ] **Step 2: Run spike in Playwright**
  - Open test HTML via `file://` protocol
  - `page.evaluate(() => __test_flush(42))` → must return `"42"` (synchronous DOM update)
  - If flushSync works: proceed to Task 1 with flushSync path
  - If flushSync fails or throws: proceed to Task 1 with 2-rAF-wait fallback path

- [ ] **Step 3: Record spike outcome**
  - Write result to plan: flushSync available / degraded
  - Delete spike test HTML after recording
  - This determines the `__seek` implementation path in Task 1

---

### Task 1: Implement `window.__seek(t)` on Stage

**Files:**
- Modify: `templates/animations.jsx`

**Depends On:** Task 0 (flushSync spike result determines implementation path)

- [ ] **Step 1: Write failing verification**
  - Create a test HTML file that uses Stage+Sprite and calls `window.__seek(2.5)` after load
  - Open in Playwright, navigate, evaluate `window.__seek(2.5)`
  - Expect: `__seek` does not exist yet → `undefined`
  - Verify: `page.evaluate(() => typeof window.__seek)` returns `"undefined"`

- [ ] **Step 2: Implement `__seek` with `flushSync` + `timeRef` sync + fallback**
  - Inside Stage's `useEffect`, add a `window.__seek` bridge after component mount:

    **Primary path (flushSync available — validated by Task 0 spike):**
    ```jsx
    // __seek bridge — seek to time t, pause playback, sync DOM
    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.__seek = (t) => {
          const clamped = Math.max(0, Math.min(duration, (typeof t === 'number' && !isNaN(t)) ? t : 0));
          ReactDOM.flushSync(() => {
            timeRef.current = clamped;
            setPlaying(false);
            setTime(clamped);
          });
        };
        // Caller detection: set __seek_sync so callers know if flushSync worked
        window.__seek_sync = true;
      }
      return () => {
        if (typeof window !== 'undefined') {
          delete window.__seek;
          delete window.__seek_sync;
        }
      };
    }, [duration]);
    ```

    **Fallback path (flushSync unavailable — if Task 0 spike fails):**
    ```jsx
    // __seek bridge — seek to time t, pause playback, fallback DOM sync
    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.__seek = (t) => {
          const clamped = Math.max(0, Math.min(duration, (typeof t === 'number' && !isNaN(t)) ? t : 0));
          timeRef.current = clamped;
          setPlaying(false);
          setTime(clamped);
          // No flushSync — callers must wait ~2 rAF for DOM to update
        };
        // Signal that flushSync is NOT available; callers must use rAF wait
        window.__seek_sync = false;
      }
      return () => {
        if (typeof window !== 'undefined') {
          delete window.__seek;
          delete window.__seek_sync;
        }
      };
    }, [duration]);
    ```

  - Key: `timeRef.current = clamped` is inside `flushSync` (primary path) or before state updates (fallback), so any code reading timeRef during the synchronous render gets the new value
  - `flushSync` import: Babel Standalone already includes ReactDOM; access via `ReactDOM.flushSync`
  - `window.__seek_sync` flag: `true` if flushSync worked, `false` if using fallback. Callers (render-video.js, AI agent) can check this to decide whether to add a rAF wait after seek

- [ ] **Step 3: Verify `__seek` works in browser**
  - Open test HTML in Playwright
  - `page.evaluate(() => __seek(2.5))` → should pause and show t=2.5
  - `page.evaluate(() => __seek_sync)` → should return `true` (flushSync path) or `false` (fallback path)
  - `page.evaluate(() => document.querySelector('[data-sprite="title"]'))` → should exist if Sprite covers t=2.5
  - Verify: `page.evaluate(() => typeof window.__seek)` returns `"function"`
  - If using fallback path: verify `page.evaluate(() => { __seek(2.5); })` followed by `page.waitForTimeout(100)` then read state → values correct

- [ ] **Step 4: Verify backward compatibility + render-video.js integration**
  - Open an existing animation HTML (from examples or previous cc-design output)
  - Verify: animation still plays normally without calling `__seek`
  - Verify: `window.__ready` signal is not modified by `__seek`
  - **CRITICAL: Verify `render-video.js` integration** — `__seek(0)` now calls `setPlaying(false)` which PAUSES the animation. This must not break video recording.

- [ ] **Step 5: Record verification evidence**
  - Test command, result, flushSync path used, any degradation notes

---

### Task 1b: Fix `render-video.js` __seek(0) playback regression

**Files:**
- Modify: `scripts/render-video.js`

**Depends On:** Task 1 (__seek implementation must exist)

**Purpose:** Resolve Blocking #1 — `__seek(0)` now pauses playback, which would freeze the animation during video recording. render-video.js expects the animation to play for `DURATION` seconds after the seek(0) reset.

- [ ] **Step 1: Add `setPlaying(true)` resume after `__seek(0)` in render-video.js**
  - Current code (lines 211-221):
    ```js
    const seekCorrected = await page.evaluate(() => {
      if (typeof window.__seek === 'function') {
        window.__seek(0);
        return true;
      }
      return false;
    });
    if (seekCorrected) {
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    }
    ```
  - Updated code:
    ```js
    const seekCorrected = await page.evaluate(() => {
      if (typeof window.__seek === 'function') {
        window.__seek(0);
        // __seek pauses playback; resume for recording
        // Access Stage's setPlaying via __resumeRecording bridge
        if (typeof window.__resumeRecording === 'function') {
          window.__resumeRecording();
        }
        return true;
      }
      return false;
    });
    if (seekCorrected) {
      // Wait for DOM to reflect t=0 frame before recording starts
      if (typeof window.__seek_sync === 'boolean' && !window.__seek_sync) {
        // Fallback path: need extra rAF wait for DOM sync
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r))));
      } else {
        // flushSync path: DOM already updated synchronously, just 1 rAF for paint
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      }
    }
    ```

- [ ] **Step 2: Add `window.__resumeRecording` bridge in Stage**
  - In the same `useEffect` that defines `__seek`, add a resume bridge:
    ```jsx
    // Resume playback after __seek — used by render-video.js for recording
    // Only resumes when window.__recording is true (recording mode), so
    // regular browser __seek still pauses as designed (KD-1 behavior)
    window.__resumeRecording = () => {
      if (typeof window !== 'undefined' && window.__recording) {
        setPlaying(true);
      }
    };
    ```
  - This bridge only resumes when `window.__recording` is true (injected by render-video.js before navigation). Regular browser usage of `__seek` still pauses — no behavior change for the verification use case.

- [ ] **Step 3: Verify render-video.js recording still works**
  - Run `node scripts/render-video.js` on an existing animation HTML
  - Verify: video captures full animation duration, not a frozen frame
  - Verify: `__seek(0)` resets time to 0, then animation plays from start
  - Verify: `__seek_sync` flag correctly used for rAF wait timing

- [ ] **Step 4: Record verification evidence**

---

### Task 2: Add Sprite `name` prop

**Files:**
- Modify: `templates/animations.jsx`

**Depends On:** Task 1b (same file, sequential edit)

- [ ] **Step 1: Modify Sprite component to accept `name` prop**
  - Add `name` as optional prop to Sprite:
    ```jsx
    function Sprite({ start = 0, end, name, children, style }) {
    ```
  - Render `data-sprite` attribute when `name` is provided:
    ```jsx
    <SpriteContext.Provider value={spriteValue}>
      <div style={{ position: 'absolute', inset: 0, ...style }} data-sprite={name || undefined}>
        {children}
      </div>
    </SpriteContext.Provider>
    ```
  - If `name` is undefined, no `data-sprite` attribute → backward compatible

- [ ] **Step 2: Verify Sprite name works in Playwright**
  - Create test HTML with named Sprites: `<Sprite start={0} end={5} name="title">`, `<Sprite start={3} end={8} name="subtitle">`
  - `page.evaluate(() => __seek(2))` → seek to t=2
  - `page.evaluate(() => document.querySelector('[data-sprite="title"]').innerText)` → should return title text
  - `page.evaluate(() => document.querySelector('[data-sprite="subtitle"]'))` → should be null (subtitle not visible at t=2)

- [ ] **Step 3: Verify backward compatibility**
  - Existing animation HTML without `name` prop → Sprites render as `<div>` without `data-sprite`
  - No visual or functional change

- [ ] **Step 4: Record verification evidence**

---

### Task 3: Update `references/animations.md`

**Files:**
- Modify: `references/animations.md`

**Depends On:** Task 2 (engine API must exist before documenting it)

- [ ] **Step 1: Add `__seek` API documentation section**
  - After the "Easing Functions" section, add new section "## Seek API for Verification"
  - Content must include:
    - `window.__seek(t)` signature and behavior (pause, flushSync, clamp, __ready invariant)
    - `window.__seek_sync` flag: `true` = flushSync worked (DOM sync immediately), `false` = fallback (caller must wait ~2 rAF)
    - `window.__resumeRecording()` bridge: only for render-video.js, resumes playback in recording mode
    - Usage example: `page.evaluate(() => __seek(2.5))` then `getComputedStyle`
    - Degradation workflow: if `__seek_sync === false`, add `page.waitForTimeout(100)` or 2-rAF-wait after seek
    - Boundary behavior: clamp to [0, duration], NaN → 0
  - Add `name` prop documentation in "## Common Animation Patterns" or Sprite section
  - `data-sprite` attribute explanation with Playwright selector example

- [ ] **Step 2: Verify documentation accuracy**
  - Cross-check API description against actual `animations.jsx` implementation
  - Ensure no discrepancy between documented and actual behavior

- [ ] **Step 3: Record verification evidence**

---

### Task 4: Update `references/animation-pitfalls.md` + Create `references/motion-contract.md`

**Files:**
- Modify: `references/animation-pitfalls.md`
- Create: `references/motion-contract.md`

**Depends On:** Task 3 (engine API documented before updating pitfalls rule)

- [ ] **Step 1: Update animation-pitfalls.md Section 5**
  - Change Rule 5 title from recommendation to fact: "Rule 5: Pure Render Principle — __seek is Implemented"
  - Rewrite first paragraph: "`window.__seek(t)` is now implemented in the Stage component. For Stage+Sprite animations, call `window.__seek(t)` directly — it handles flushSync/fallback, timeRef sync, and playback pause."
  - Keep hand-written animation starter template as fallback note: "For hand-written HTML animations not using Stage, still use the starter tick template and manually add `window.__seek`."
  - Remove duplicate recommendation of `__seek` (it's now a fact, not a SHOULD-HAVE)

- [ ] **Step 2: Create motion-contract.md**
  - Define Motion Contract concept: numerical constraints for animation verification
  - Include constraint type table (from KD-4):
    | Constraint | Format | Example |
    | Duration range | `{ min_ms, max_ms }` | `{ min_ms: 5000, max_ms: 60000 }` |
    | Easing family | enum whitelist | `["expoOut", "easeIn", "overshoot", "spring", "linear"]` |
    | Opacity bound | `{ min, max }` | `{ min: 0, max: 1 }` |
    | Cross-fade gap | max seconds | `0.3` |
    | Final frame rule | boolean | `fadeOut: false` |
  - Include verification flow (2-node): seek-and-read + brief-comparison
  - Include anti-patterns: banned "smooth", "easeInOut" as contract easing values; banned exact numerical targets; banned proactive contract-first flow
  - Include scope: only Stage+Sprite animations, not hand-written
  - Include Playwright code examples for seek + getComputedStyle

- [ ] **Step 3: Verify documentation completeness**
  - Check all constraint types from KD-4 are present
  - Check anti-patterns list is complete
  - Check scope boundary is stated

- [ ] **Step 4: Record verification evidence**

---

### Task 5: Update verification-protocol.md + exit-conditions.md

**Files:**
- Modify: `references/verification-protocol.md`
- Modify: `references/exit-conditions.md`

**Depends On:** Task 4 (motion-contract.md must exist before referencing it)

- [ ] **Step 1: Add Animation Numerical Check to verification-protocol.md Phase 1**
  - Add subsection "### Animation Numerical Check" under Phase 1 (Structural)
  - Content:
    - For Stage+Sprite animations: after structural checks, use `window.__seek(t)` to verify key timestamps
    - Seek to 3-5 key time points: t=0, first transition, midpoint, last transition, t=duration
    - At each point: `page.evaluate(() => getComputedStyle(el))` for opacity/visibility
    - If `__seek_sync === false`: add `page.waitForTimeout(100)` after each seek before reading
    - Compare against brief expectations (qualitative: "visible at t=2", "faded out by t=5")
    - Must use Sprite `name` prop + `data-sprite` selector for targeting
    - For hand-written animations: still use screenshot-only verification
  - Reference `references/motion-contract.md` for contract rules

- [ ] **Step 2: Update exit-conditions.md Animation row**
  - Current Animation row has 4 items: `__ready`, dwell times, easing, no stacking
  - Add new items:
    - `__seek(t)` is available and functional (for Stage+Sprite animations)
    - Key timestamps verified numerically (opacity/visibility at entry/exit/midpoint)
    - All Sprites with meaningful content have `name` prop
  - Keep existing 4 items unchanged

- [ ] **Step 3: Verify cross-reference consistency**
  - verification-protocol references motion-contract.md ✓
  - exit-conditions animation row matches verification-protocol animation check ✓

- [ ] **Step 4: Record verification evidence**

---

### Task 6: Update SKILL.md checkpoints and workflow

**Files:**
- Modify: `SKILL.md`

**Depends On:** Task 5 (verification-protocol must be updated before SKILL.md references it)

- [ ] **Step 1: Update before-animation checkpoint**
  - Current: loads `animation-best-practices.md` AND `animation-pitfalls.md`
  - Add: also load `references/motion-contract.md`
  - Format: `Load: because=before-animation loaded=references/animation-best-practices.md,references/animation-pitfalls.md,references/motion-contract.md`

- [ ] **Step 2: Update workflow Step 7 (Verify)**
  - Current Step 7 says: "Run three-phase verification yourself"
  - Add after Phase 1 (Structural): "For animations using Stage+Sprite: additionally run Animation Numerical Check — seek to 3-5 key timestamps, read computed styles, compare against brief expectations. See `references/verification-protocol.md` Animation Numerical Check."
  - This is an additive change, not a replacement of existing verification

- [ ] **Step 3: Update routing table Animation row**
  - Current: `Animation / motion | references/animation-best-practices.md + references/animations.md | templates/animations.jsx`
  - Add motion-contract.md to verify focus column: `Timeline playback + __ready signal + motion-contract numerical verification`

- [ ] **Step 4: Update load-manifest.json**
  - Add motion-contract.md to `before-animation` bundle
  - Run: `node scripts/lint-load-manifest.mjs` → verify JSON valid
  - Run: `node scripts/generate-bundle-catalog.mjs` → catalog updated

- [ ] **Step 5: Verify SKILL.md consistency**
  - All new references are in routing table ✓
  - before-animation checkpoint includes motion-contract.md ✓
  - Workflow Step 7 mentions Animation Numerical Check ✓
  - load-manifest.json lint passes ✓

- [ ] **Step 6: Record verification evidence**

---

### Task 7: VERSION bump + behavior contract check

**Files:**
- Modify: `VERSION`
- Run: `./scripts/check-behavior-contract.sh`

**Depends On:** Task 6 (all behavior changes complete before bump)

- [ ] **Step 1: Bump VERSION from 0.8.1 to 0.9.0**
  - This release adds new engine API (`__seek`) + new bridge (`__resumeRecording`) + new prop (`name`) + new reference doc (`motion-contract.md`) — minor version bump warranted

- [ ] **Step 2: Run behavior contract check**
  - `./scripts/check-behavior-contract.sh master`
  - Must pass: VERSION bumped, behavior-contract files changed appropriately

- [ ] **Step 3: Verify VERSION and contract check pass**

---

## Checkpoints

| After Task | Checkpoint | Must Pass |
|---|---|---|
| Task 0 | flushSync validated | Spike outcome recorded; flushSync available or fallback path determined |
| Task 1b | Engine complete | `__seek` works in Playwright; `__resumeRecording` works; Sprite name works; backward compatible; render-video.js recording works end-to-end |
| Task 4 | Documentation core | pitfalls Section 5 updated; motion-contract.md created with all constraint types |
| Task 7 | All complete | VERSION bumped; behavior contract check passes; SKILL.md routing + checkpoint + workflow updated |

## Spec Coverage Check

| Spec Done When item | Plan Task |
|---|---|
| Functional: `__seek(t)` works | Task 1 + Task 0 (spike validates flushSync) |
| Functional: Sprite `name` prop | Task 2 |
| Functional: AI can seek + read + compare | Task 3, 4, 5 (documentation enables this) |
| Technical: `flushSync` synchronous render | Task 0 (spike) → Task 1 (primary or fallback path) |
| Technical: `timeRef` sync | Task 1 (inside flushSync or before state updates) |
| Technical: backward compatible | Task 1 Step 4, Task 2 Step 3, Task 1b (render-video.js regression) |
| Regression: render-video.js __seek(0) | Task 1b (resume bridge + integration test) |
| Output: motion-contract.md | Task 4 |
| Output: verification-protocol.md updated | Task 5 |
| Output: exit-conditions.md updated | Task 5 |
| Output: SKILL.md updated | Task 6 |

All spec items covered ✓