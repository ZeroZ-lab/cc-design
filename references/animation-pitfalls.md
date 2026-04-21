# Animation Pitfalls: HTML Animation Bugs and Rules

The most common bugs when building animations and how to avoid them. Every rule comes from a real failure case.

Read this before writing animation code. It saves an entire iteration.

## 1. Stacking Context -- `position: relative` is a Default Obligation

**The bug**: A sentence-wrap element contained 3 bracket-layer children (`position: absolute`). sentence-wrap didn't have `position: relative`, so the absolute brackets used `.canvas` as their coordinate system, floating 200px below the screen.

**Rule**:
- Any container with `position: absolute` children **must** explicitly set `position: relative`
- Even if you don't need visual offset, set `position: relative` as the coordinate anchor
- If you're writing `.parent { ... }` and a child has `.child { position: absolute }`, instinctively add relative to parent

**Quick check**: For every `position: absolute`, trace up the ancestor chain and ensure the nearest positioned ancestor is the coordinate system you *intend*.

## 2. Character Trap -- Don't Depend on Rare Unicode

**The bug**: Tried using `␣` (U+2423 OPEN BOX) to visualize "space token". Noto Serif SC / Cormorant Garamond don't have this glyph, rendered as blank/tofu, audience couldn't see it at all.

**Rule**:
- **Every character that appears in animation must exist in your chosen fonts**
- Common rare character blacklist: `␣ ␀ ␐ ␋ ␨ ↩ ⏎ ⌘ ⌥ ⌃ ⇧ ␦ ␖ ␛`
- To represent meta-characters like "space / enter / tab", use **CSS-constructed semantic boxes**:
  ```html
  <span class="space-key">Space</span>
  ```
  ```css
  .space-key {
    display: inline-flex;
    padding: 4px 14px;
    border: 1.5px solid var(--accent);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  ```
- Emoji also needs verification: some emoji fall back to gray boxes outside Noto Emoji, use `emoji` font-family or SVG

## 3. Data-Driven Grid/Flex Templates

**The bug**: Code had `const N = 6` tokens, but CSS hardcoded `grid-template-columns: 80px repeat(5, 1fr)`. The 6th token had no column, entire matrix misaligned.

**Rule**:
- When count comes from a JS array (`TOKENS.length`), CSS template should also be data-driven
- Option A: Inject via CSS variable from JS
  ```js
  el.style.setProperty('--cols', N);
  ```
  ```css
  .grid { grid-template-columns: 80px repeat(var(--cols), 1fr); }
  ```
- Option B: Use `grid-auto-flow: column` for browser auto-expansion
- **Banned: "Fixed number + JS constant" combination**, N changes but CSS doesn't sync

## 4. Transition Gaps -- Scene Switches Must Be Continuous

**The bug**: Between zoom1 (13-19s) and zoom2 (19.2-23s), the main sentence was already hidden. zoom1 fade out (0.6s) + zoom2 fade in (0.6s) + stagger delay (0.2s+) = ~1 second of pure blank. Audience thought the animation froze.

**Rule**:
- When switching scenes continuously, fade out and fade in must **cross-fade**, not "previous fully disappears before next starts"
  ```js
  // Bad:
  if (t >= 19) hideZoom('zoom1');      // 19.0s out
  if (t >= 19.4) showZoom('zoom2');    // 19.4s in -> 0.4s blank in between

  // Good:
  if (t >= 18.6) hideZoom('zoom1');    // Start fade out 0.4s early
  if (t >= 18.6) showZoom('zoom2');    // Simultaneous fade in (cross-fade)
  ```
- Or use an "anchor element" (like the main sentence) as visual continuity between scenes, briefly reappearing during zoom transitions
- Calculate CSS transition durations carefully, avoid triggering the next transition before the previous one finishes

## 5. Pure Render Principle -- Animation State Should Be Seekable

**The bug**: Used `setTimeout` + `fireOnce(key, fn)` chains to trigger animation state. Normal playback was fine, but when doing frame-by-frame recording or seeking to an arbitrary time point, the setTimeouts had already fired and couldn't "go back in time".

**Rule**:
- `render(t)` function should ideally be a **pure function**: given t, output unique DOM state
- If side effects are necessary (e.g., class toggle), use a `fired` set with explicit reset:
  ```js
  const fired = new Set();
  function fireOnce(key, fn) { if (!fired.has(key)) { fired.add(key); fn(); } }
  function reset() { fired.clear(); /* clear all .show classes */ }
  ```
- Expose `window.__seek(t)` for Playwright / debugging:
  ```js
  window.__seek = (t) => { reset(); render(t); };
  ```
- Animation-related setTimeout shouldn't span >1 second, otherwise seek-back will break things

## 6. Pre-Font-Load Measurement = Wrong Measurement

**The bug**: Called `charRect(idx)` to measure bracket positions right at DOMContentLoaded, before fonts loaded. Every character width was the fallback font's width, positions all wrong. Once fonts loaded (~500ms later), bracket `left: Xpx` still had the old values, permanently offset.

**Rule**:
- Any layout code depending on DOM measurement (`getBoundingClientRect`, `offsetWidth`) **must** be wrapped in `document.fonts.ready.then()`
  ```js
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      buildBrackets(...);  // Fonts ready, measurement accurate
      tick();              // Animation starts
    });
  });
  ```
- Extra `requestAnimationFrame` gives the browser a frame to commit layout
- If using Google Fonts CDN, `<link rel="preconnect">` speeds up initial load

## 7. Recording Prep -- Leave Handshake Points for Video Export

**The bug**: Playwright `recordVideo` defaults to 25fps, starts recording from context creation. Page load, font load -- the first 2 seconds all get recorded. Delivered video has 2 seconds of blank/white flash at the start.

**Rule**:
- `render-video.js` handles this: warmup navigate -> reload to restart animation -> wait duration -> ffmpeg trim head + convert to H.264 MP4
- Animation's **frame 0** should be the final layout's complete initial state (not blank or loading)
- Want 60fps? Use ffmpeg `minterpolate` post-processing, don't expect browser source framerate
- Want GIF? Two-stage palette (`palettegen` + `paletteuse`), can compress a 30s 1080p animation to 3MB

See `video-export.md` for complete script usage.

## 8. Batch Export -- tmp Directory Must Include PID to Prevent Concurrent Conflicts

**The bug**: Used `render-video.js` to record 3 HTMLs in parallel. TMP_DIR only used `Date.now()` for naming, 3 processes starting the same millisecond shared the same tmp directory. The first process to finish cleaned up tmp, the other two got `ENOENT` when reading the directory, all crashed.

**Rule**:
- Any temporary directory that multiple processes might share must include **PID or random suffix** in its name:
  ```js
  const TMP_DIR = path.join(DIR, '.video-tmp-' + Date.now() + '-' + process.pid);
  ```
- If you genuinely want multi-file parallelism, use shell `&` + `wait` rather than forking in one node script
- For batch recording multiple HTMLs, conservative approach: **serial** execution (2 or fewer can be parallel, 3+ just queue)

## 9. Progress Bar / Replay Button in Recording -- Chrome Elements Pollute Video

**The bug**: Animation HTML had `.progress` progress bar, `.replay` replay button, `.counter` timestamp for human debugging convenience. When recorded to MP4 these elements appeared in the video bottom, like DevTools got screenshotted into the delivery.

**Rule**:
- Human-facing "chrome elements" (progress bar / replay button / footer / masthead / counter / phase labels) and video content must be managed separately
- **Convention class name** `.no-record`: any element with this class is automatically hidden by the recording script
- Script side (`render-video.js`) injects CSS by default to hide common chrome class names:
  ```
  .progress .counter .phases .replay .masthead .footer .no-record [data-role="chrome"]
  ```
- Injected via Playwright's `addInitScript` (fires before each navigate, stable across reloads)
- To see the original HTML (with chrome), add `--keep-chrome` flag

## 10. First Few Seconds of Recording Show Animation Repeating -- Warmup Frame Leak

**The bug**: Old `render-video.js` flow was `goto -> wait fonts 1.5s -> reload -> wait duration`. Recording starts at context creation, warmup phase already played part of the animation, reload restarts from 0. Result: first few seconds show "animation mid-point + cut + animation starts from 0", strong repetition feel.

**Rule**:
- **Warmup and Record must use independent contexts**:
  - Warmup context (no `recordVideo` option): Only loads URL, waits for fonts, then closes
  - Record context (with `recordVideo`): Fresh state, animation starts from t=0
- ffmpeg `-ss trim` can only cut Playwright's tiny startup latency (~0.3s), **cannot** be used to mask warmup frames; source must be clean
- Recording context close = webm file written to disk, this is Playwright's constraint
- Relevant code pattern:
  ```js
  // Phase 1: warmup (throwaway)
  const warmupCtx = await browser.newContext({ viewport });
  const warmupPage = await warmupCtx.newPage();
  await warmupPage.goto(url, { waitUntil: 'networkidle' });
  await warmupPage.waitForTimeout(1200);
  await warmupCtx.close();

  // Phase 2: record (fresh)
  const recordCtx = await browser.newContext({ viewport, recordVideo });
  const page = await recordCtx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(DURATION * 1000);
  await page.close();
  await recordCtx.close();
  ```

## 11. Don't Draw "Fake Chrome" Inside the Canvas -- Decorative Player UI Clashes with Real Chrome

**The bug**: Animation used the `Stage` component, which already has a built-in scrubber + timecode + pause button (these are `.no-record` chrome, auto-hidden on export). Then a decorative progress bar `00:60 --- CC-DESIGN / ANATOMY` was drawn at the bottom for "magazine page-number feel". **Result**: User sees two progress bars -- one from Stage controls, one decorative. Complete visual collision, identified as a bug. "Why is there another progress bar in the video?"

**Rule**:

- Stage already provides: scrubber + timecode + pause/replay button. **Do not draw** additional progress indicators, current timecodes, copyright strips, chapter counters inside the canvas -- they either clash with chrome or are filler slop (violating the "earn its place" principle).
- "Page-number feel" / "magazine feel" / "bottom attribution strip" are **decorative urges** that AI auto-adds frequently. Be alert for each one -- does it convey irreplaceable information, or just fill empty space?
- If you firmly believe a bottom strip must exist (e.g., the animation's theme IS about player UI), it must be **narratively necessary** and **visually distinct from Stage scrubber** (different position, different form, different color tone).

**Element Attribution Test** (every element drawn into the canvas must answer):

| What it belongs to | Treatment |
|------------|------|
| A specific scene's narrative content | OK, keep it |
| Global chrome (control/debug use) | Add `.no-record` class, hidden on export |
| **Neither belongs to any scene, nor is chrome** | **Delete**. This is orphaned filler slop |

**Self-check (3 seconds before delivery)**: Take a static screenshot and ask yourself:

- Is there anything that "looks like video player UI" (horizontal progress bar, timecode, control-button appearance)?
- If yes, does removing it harm the narrative? If not, delete it.
- Is the same type of information (progress/time/attribution) appearing twice? Merge into chrome at one location.

**Anti-pattern**: Drawing `00:42 --- PROJECT NAME` at the bottom, `CH 03 / 06` chapter counter at bottom-right, version number `v0.3.1` at screen edge -- all are fake chrome filler.

## 12. Recording Lead Blank + Recording Start Offset -- `__ready` x tick x lastTick Triple Trap

**Bug A (Lead blank)**: 60-second animation exported to MP4, first 2-3 seconds are blank page. `ffmpeg --trim=0.3` can't cut it.

**Bug B (Start offset, real incident)**: Exported 24-second video, user perception: "video doesn't start playing until 19 seconds in". Actually the animation recorded from t=5, recorded to t=24 then looped back to t=0, recorded 5 more seconds -- so the last 5 seconds of the video are the animation's actual beginning.

**Root cause** (both bugs share one root cause):

Playwright `recordVideo` starts writing WebM from `newContext()` moment. Babel/React/font loading takes L seconds (2-6s). The recording script waits for `window.__ready = true` as the "animation starts here" anchor -- it must be strictly paired with animation `time = 0`. Two common mistakes:

| Mistake | Symptom |
|------|------|
| `__ready` set in `useEffect` or synchronous setup phase (before tick's first frame) | Recording script thinks animation started, but WebM is still recording blank page -> **lead blank** |
| tick's `lastTick = performance.now()` initialized at **script top level** | Font loading L seconds get counted into first frame's `dt`, `time` instantly jumps to L -> recording is offset L seconds throughout -> **start offset** |

**Correct complete starter tick template** (hand-written animations must use this skeleton):

```js
// --- state ---
let time = 0;
let playing = false;   // Default off, wait for fonts ready to start
let lastTick = null;   // Sentinel -- tick's first frame forces dt to 0 (don't use performance.now())
const fired = new Set();

// --- tick ---
function tick(now) {
  if (lastTick === null) {
    lastTick = now;
    window.__ready = true;   // Pair: "recording start point" and "animation t=0" same frame
    render(0);               // Render once more to ensure DOM is ready (fonts are ready at this point)
    requestAnimationFrame(tick);
    return;
  }
  const dt = (now - lastTick) / 1000;   // dt only starts advancing after first frame
  lastTick = now;

  if (playing) {
    let t = time + dt;
    if (t >= DURATION) {
      t = window.__recording ? DURATION - 0.001 : 0;  // Don't loop when recording, keep 0.001s to preserve last frame
      if (!window.__recording) fired.clear();
    }
    time = t;
    render(time);
  }
  requestAnimationFrame(tick);
}

// --- boot ---
// Don't immediately rAF at top level -- start only after fonts loaded
document.fonts.ready.then(() => {
  render(0);                 // Draw initial frame first (fonts ready)
  playing = true;
  requestAnimationFrame(tick);  // First tick will pair __ready + t=0
});

// --- seek interface (for render-video defensive correction) ---
window.__seek = (t) => { fired.clear(); time = t; lastTick = null; render(t); };
```

**Why this template is correct**:

| Aspect | Why it must be this way |
|------|-------------|
| `lastTick = null` + first frame `return` | Prevents the L seconds from "script load to tick first execution" being counted as animation time |
| `playing = false` default | During font loading, even if `tick` runs it doesn't advance time, preventing render misalignment |
| `__ready` set in tick's first frame | Recording script starts timing at this moment, the corresponding frame is animation's true t=0 |
| `document.fonts.ready.then(...)` before starting tick | Avoids font fallback width measurement, prevents first-frame font jump |
| `window.__seek` exists | Lets `render-video.js` actively correct -- second line of defense |

**Recording script's corresponding defense**:
1. `addInitScript` injects `window.__recording = true` (before page goto)
2. `waitForFunction(() => window.__ready === true)`, records this moment's offset as ffmpeg trim
3. **Additionally**: After `__ready`, actively `page.evaluate(() => window.__seek && window.__seek(0))`, force-resetting any time offset in the HTML -- second line of defense against HTMLs that don't strictly follow the starter template

**Verification method**: After exporting MP4
```bash
ffmpeg -i video.mp4 -ss 0 -vframes 1 frame-0.png
ffmpeg -i video.mp4 -ss $DURATION-0.1 -vframes 1 frame-end.png
```
First frame must be animation's t=0 initial state (not mid-point, not black), last frame must be animation's final state (not a point from the second loop).

**Reference implementation**: `assets/animations.jsx`'s Stage component and `scripts/render-video.js` both implement this protocol. Hand-written HTML must use the starter tick template -- every line guards against a specific bug.

## 13. No Loop During Recording -- `window.__recording` Signal

**The bug**: Animation Stage defaults to `loop=true` (convenient for browser viewing). `render-video.js` waits 300ms buffer after recording duration seconds before stopping, this 300ms lets Stage enter the next loop. ffmpeg `-t DURATION` truncates, but the last 0.5-1s falls into the next loop -- video suddenly jumps back to frame 1 (Scene 1), audience thinks the video is broken.

**Root cause**: No "I'm being recorded" handshake between recording script and HTML. HTML doesn't know it's being recorded, still loops as in browser interaction mode.

**Rule**:

1. **Recording script**: Inject `window.__recording = true` in `addInitScript` (before page goto):
   ```js
   await recordCtx.addInitScript(() => { window.__recording = true; });
   ```

2. **Stage component**: Detect this signal, force loop=false:
   ```js
   const effectiveLoop = (typeof window !== 'undefined' && window.__recording) ? false : loop;
   // ...
   if (next >= duration) return effectiveLoop ? 0 : duration - 0.001;
   //                                                       ^ keep 0.001 to prevent Sprite end=duration from turning off
   ```

3. **Final Sprite's fadeOut**: In recording scenarios should be `fadeOut={0}`, otherwise the video ending will fade to transparent/dark -- users expect to stop on a clear final frame, not fade out. For hand-written HTML, recommend all final Sprites use `fadeOut={0}`.

**Reference implementation**: `assets/animations.jsx`'s Stage and `scripts/render-video.js` both have built-in handshake. Hand-written Stage must implement `__recording` detection -- otherwise recording will hit this bug.

**Verification**: After exporting MP4, `ffmpeg -ss 19.8 -i video.mp4 -frames:v 1 end.png`, check if 0.2s before the end is still the expected final frame, without a sudden switch to another scene.

## 14. 60fps Video Uses Frame Duplication by Default -- minterpolate Has Poor Compatibility

**The bug**: `convert-formats.sh` generated 60fps MP4 using `minterpolate=fps=60:mi_mode=mci...`, which couldn't open in some versions of macOS QuickTime / Safari (black screen or refused to play). VLC / Chrome could open it.

**Root cause**: minterpolate outputs an H.264 elementary stream containing SEI / SPS fields that some players have trouble parsing.

**Rule**:

- Default 60fps uses simple `fps=60` filter (frame duplication), wide compatibility (QuickTime/Safari/Chrome/VLC all work)
- High-quality interpolation uses `--minterpolate` flag to explicitly enable -- but **must test locally** on target player before delivery
- 60fps label value is **platform algorithm recognition** (Bilibili / YouTube prioritize streaming for 60fps-tagged content), actual perceived smoothness improvement for CSS animations is minimal
- Add `-profile:v high -level 4.0` to improve H.264 general compatibility

**`convert-formats.sh` has switched to compatibility mode by default**. If you need high-quality interpolation:
```bash
bash convert-formats.sh input.mp4 --minterpolate
```

## 15. `file://` + External `.jsx` CORS Trap -- Single-File Delivery Must Inline the Engine

**The bug**: Animation HTML used `<script type="text/babel" src="animations.jsx"></script>` to load the engine externally. Double-click to open locally (`file://` protocol) -> Babel Standalone uses XHR to fetch `.jsx` -> Chrome reports `Cross origin requests are only supported for protocol schemes: http, https, chrome, chrome-extension...` -> entire page is black screen, no `pageerror` reported only console error, easy to misdiagnose as "animation didn't trigger".

Even starting an HTTP server may not help -- with a global proxy, `localhost` can get proxied too, returning 502 / connection failure.

**Rule**:

- **Single-file delivery (double-click to open HTML)** -> `animations.jsx` must be **inlined** into a `<script type="text/babel">...</script>` tag, don't use `src="animations.jsx"`
- **Multi-file project (running HTTP server for demo)** -> External loading is fine, but clearly document the `python3 -m http.server 8000` command
- Decision criterion: Is the deliverable an "HTML file" or "a project directory with a server"? Former uses inline
- Stage component / animations.jsx is often 200+ lines -- pasting into HTML `<script>` block is perfectly acceptable, don't worry about file size

**Minimum verification**: Double-click your generated HTML, **don't** use any server to open it. If Stage displays the animation's first frame correctly, it passes.

## 16. Cross-Scene Inverted Color Context -- Don't Hardcode Colors on In-Canvas Elements

**The bug**: In a multi-scene animation, `ChapterLabel` / `SceneNumber` / `Watermark` etc. (elements that **appear across all scenes**) had hardcoded `color: '#1A1A1A'` (dark text) in the component. First 4 scenes with light backgrounds were fine, but at scene 5 with a dark background, "05" and the watermark completely disappeared -- no error, no check triggered, critical information invisible.

**Rule**:

- **Cross-scene reusable in-canvas elements** (chapter labels / scene numbers / timecodes / watermarks / copyright strips) **must not hardcode color values**
- Use one of three approaches instead:
  1. **`currentColor` inheritance**: Element only sets `color: currentColor`, parent scene container sets `color: calculated-value`
  2. **invert prop**: Component accepts `<ChapterLabel invert />` to manually switch light/dark
  3. **Auto-calculate based on background**: `color: contrast-color(var(--scene-bg))` (CSS 4 new API, or JS detection)
- Before delivery, use Playwright to capture **a representative frame from each scene**, visually check that cross-scene elements are all visible

The insidiousness of this bug is that **there are no error reports**. Only human eyes or OCR can catch it.

## Quick Self-Check List (5 Seconds Before Starting)

- [ ] Every `position: absolute`'s parent has `position: relative`?
- [ ] Special characters in animation (`␣` `⌘` `emoji`) exist in chosen fonts?
- [ ] Grid/Flex template count matches JS data length?
- [ ] Scene transitions have cross-fade, no >0.3s pure blank?
- [ ] DOM measurement code wrapped in `document.fonts.ready.then()`?
- [ ] `render(t)` is pure, or has explicit reset mechanism?
- [ ] Frame 0 is a complete initial state, not blank?
- [ ] No "fake chrome" decorations in canvas (progress bar/timecode/bottom attribution strip clashing with Stage scrubber)?
- [ ] Animation tick's first frame synchronously sets `window.__ready = true`? (Built into animations.jsx; hand-written HTML add yourself)
- [ ] Stage detects `window.__recording` to force loop=false? (Hand-written HTML must add)
- [ ] Final Sprite's `fadeOut` set to 0 (video end stops on clear frame)?
- [ ] 60fps MP4 uses frame duplication mode by default (compatible), only add `--minterpolate` for high-quality interpolation?
- [ ] After export, extract frame 0 + last frame to verify they are animation's initial/final states?
- [ ] For specific brands (Stripe/Anthropic/etc.): Completed the brand asset protocol (SKILL.md section 1.a five steps)? Have you written `brand-spec.md`?
- [ ] Single-file deliverable HTML: `animations.jsx` is inlined, not `src="..."`? (External .jsx under file:// causes CORS black screen)
- [ ] Cross-scene elements (chapter labels/watermark/scene numbers) don't have hardcoded colors? Visible against every scene's background?
