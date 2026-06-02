# Motion Contract — Numerical Constraints for Animation Verification

This reference defines the Motion Contract concept: numerical constraints that AI agents use to verify animation quality through `__seek` + `getComputedStyle`, replacing screenshot-only verification for Stage+Sprite animations.

## Verification Flow (2-Node)

### Node 1: Seek-and-Read

```js
// In Playwright
page.evaluate(() => __seek(t));  // Seek to key timestamp, pause playback
page.evaluate(() => {
  const el = document.querySelector('[data-sprite="title"]');
  return {
    opacity: parseFloat(getComputedStyle(el.querySelector('div')).opacity),
    visibility: getComputedStyle(el.querySelector('div')).visibility,
  };
});
```

### Node 2: Brief-Comparison

Compare numerical values against brief expectations using **qualitative bounds** (not exact targets):

| Brief expectation | Assertion | Example |
|---|---|---|
| "Title visible at t=2" | opacity > 0.8 | `opacity=1.0` ✓ |
| "Title faded out by t=5" | opacity < 0.1 | `opacity=0` ✓ (Sprite ended) |
| "Entry easing expoOut-family" | opacity rising curve matches expoOut pattern | Gradual rise at start, fast settle |

**Key time points**: Check 3-5 timestamps — t=0, first transition, midpoint, last transition, t=duration.

If `__seek_sync === false`, add `page.waitForTimeout(100)` after each seek before reading state.

## Constraint Types

| Constraint | Format | Example | How to verify |
|---|---|---|---|
| Duration range | `{ min_ms, max_ms }` | `{ min_ms: 5000, max_ms: 60000 }` | `__seek(duration)` completes within range |
| Easing family | enum whitelist | `["expoOut", "easeIn", "overshoot", "spring", "linear"]` | Shape of opacity curve matches family |
| Opacity bound | `{ min, max }` | `{ min: 0, max: 1 }` | `getComputedStyle(el).opacity` within bounds |
| Cross-fade gap | max seconds | `0.3` | Sprites with overlapping time + fade have ≤0.3s overlap |
| Final frame rule | boolean | `fadeOut: false` | Last Sprite not fading out at t=duration |

## Anti-Patterns (Banned)

These patterns are **wrong** for Motion Contract assertions:

| Anti-pattern | Why banned | Correct alternative |
|---|---|---|
| `"smooth"` or `"nice"` as easing values | Not measurable, subjective | Use easing family enum: `expoOut`, `easeIn` |
| `easeInOut` as contract easing | Ambiguous — which half? | Split into `easeIn` (exit) + `expoOut` (enter) |
| Exact numerical targets (e.g., `opacity=0.87`) | Browser rounding, timing jitter | Use qualitative bounds: `opacity > 0.8` |
| Proactive contract-first flow | High cognitive load, premature | Retroactive: build first, then verify with seek-and-read |
| Asserting transform values | `getComputedStyle` returns `matrix(...)` string | Use opacity/visibility; transform verification not yet supported |

## Scope

**MVP covers Stage+Sprite animations only.**

| Animation type | Verification method |
|---|---|
| Stage+Sprite | `__seek(t)` + `getComputedStyle` (numerical) |
| Hand-written CSS/JS animation | Screenshot verification (unchanged) |
| CSS transition (hover/tap) | Screenshot verification (unchanged) |
| View Transitions API | Screenshot verification (unchanged) |

Stage+Sprite is a deterministic system — `render(t)` is effectively a pure function. Hand-written animations cannot guarantee this property, so numerical verification is not applicable.

## Playwright Code Examples

### Full seek-and-read workflow

```js
// 1. Seek to key time points
const timestamps = [0, 2, 4, 7, 10];
const results = {};

for (const t of timestamps) {
  await page.evaluate((time) => __seek(time), t);
  // If __seek_sync === false, add wait:
  // if (!await page.evaluate(() => __seek_sync)) await page.waitForTimeout(100);
  
  results[t] = await page.evaluate(() => {
    const title = document.querySelector('[data-sprite="title"]');
    const subtitle = document.querySelector('[data-sprite="subtitle"]');
    return {
      titleVisible: title !== null,
      subtitleVisible: subtitle !== null,
      titleOpacity: title ? parseFloat(getComputedStyle(title.querySelector('div')).opacity) : null,
      subtitleOpacity: subtitle ? parseFloat(getComputedStyle(subtitle.querySelector('div')).opacity) : null,
    };
  });
}

// 2. Brief-comparison
// "Title visible at t=2" → results[2].titleVisible === true && results[2].titleOpacity > 0.8
// "Title gone by t=7" → results[7].titleVisible === false
// "Subtitle fading in at t=4" → results[4].subtitleOpacity > 0 && results[4].subtitleOpacity < 1
```