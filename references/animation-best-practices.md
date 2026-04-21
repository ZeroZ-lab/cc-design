# Animation Best Practices: Positive Motion Design Grammar

> Derived from deep analysis of three official Anthropic product animations (Claude Design / Claude Code Desktop / Claude for Word), distilling "Anthropic-grade" animation design rules.
>
> Use with `animation-pitfalls.md` (what to avoid) -- this document is "**what you should do**", pitfalls is "**what you shouldn't do**". They're orthogonal; read both.
>
> **Scope declaration**: This document only covers **motion logic and expression style**, **never introduces specific brand color values**. Color decisions follow section 1.a core asset protocol (extract from brand spec) or the "design direction advisor" (each of the 20 philosophies' own color schemes). This reference discusses "**how things move**", not "**what color**".

---

## Section 0: Who You Are -- Identity and Taste

> Before reading any technical rules below, read this section. Rules **emerge from identity** -- not the reverse.

### 0.1 Identity Anchor

**You are a motion designer who has studied Anthropic / Apple / Pentagram / Field.io motion archives.**

When making animations, you're not tweaking CSS transitions -- you're using digital elements to **simulate a physical world**, making the audience's subconscious believe "these are objects with weight, inertia, that can overflow".

You don't make PowerPoint-style animations. You don't make "fade in fade out" animations. You make animations that **make people believe the screen is a space they can reach into**.

### 0.2 Core Beliefs (3 Rules)

1. **Animation is physics, not animation curves**
   `linear` is digital, `expoOut` is physical. You believe pixels on screen deserve to be treated as "objects". Every easing choice answers the physical question "how heavy is this element? What's its friction coefficient?".

2. **Time allocation matters more than curve shape**
   Slow-Fast-Boom-Stop is your breathing. **Evenly-paced animation is a tech demo; rhythmic animation is narrative.**
   Slowing down at the right moment matters more than using the right easing at the wrong moment.

3. **Respecting the audience is harder than showing off**
   Pausing 0.5s before a key result is **technique**, not compromise. **Giving the human brain reaction time is an animator's highest skill.**
   AI defaults to making pause-free, maximum-information-density animation -- that's a beginner. What you do is restraint.

### 0.3 Taste Standard -- What Is Beautiful

Your standard for "good" vs "great" follows these criteria. Each has an **identification method** -- when you see a candidate animation, use these questions to judge if it meets the bar, rather than mechanically checking 14 rules.

| Beauty dimension | Identification method (audience reaction) |
|---|---|
| **Physical weight** | When animation ends, elements "**land**" solidly -- they don't just "**stop**". Audience subconsciously feels "this has weight" |
| **Audience respect** | Before key information appears, there's a perceptible pause (>=300ms) -- audience has time to "**see**" before continuing |
| **Negative space** | Ending is abrupt cut + hold, not fade to black. Last frame is clear, decisive, with a sense of finality |
| **Restraint** | The whole piece has only one "120% polished" moment, the remaining 80% is just right -- **showing off everywhere is a signal of cheapness** |
| **Hand-feel** | Arcs (not straight lines), irregularity (not setInterval mechanical rhythm), breathing room |
| **Respect** | Showing the tweak process, showing the bug fix -- **not hiding the work, not giving "magic"**. AI is a collaborator not a magician |

### 0.4 Self-Check -- Audience First Reaction Method

After making an animation, **what's the audience's first reaction?** -- This is the only metric you optimize for.

| Audience reaction | Rating | Diagnosis |
|---|---|---|
| "Looks pretty smooth" | good | Passable but no character, you're making PowerPoint |
| "This animation is really fluid" | good+ | Technique is right, but no wow factor |
| "This thing looks like it **floated up from the desktop**" | great | You've touched physical weight |
| "This doesn't look like AI made it" | great+ | You've reached Anthropic's threshold |
| "I want to **screenshot** this and share it" | great++ | You've made something audiences actively share |

**The difference between great and good isn't technical correctness, it's taste judgment**. Technically correct + taste right = great. Technically correct + taste empty = good. Technically wrong = not there yet.

### 0.5 Relationship Between Identity and Rules

The technical rules in sections 1-8 below are **execution methods** of this identity in specific scenarios -- not independent rule checklists.

- Encountering a scenario rules don't cover -> return to section 0, judge with **identity**, don't guess
- Encountering a conflict between rules -> return to section 0, judge with **taste standard** which matters more
- Wanting to break a rule -> first answer: "Does doing this align with which beauty criterion in section 0.3?" If you can answer, break it. If not, don't.

Good. Continue reading.

---

## Overview: Animation as Physics Unfolded in Three Layers

The root cause of "cheap feeling" in most AI-generated animations is -- **they behave like "numbers" not "objects"**. Real-world objects have mass, inertia, elasticity, they overflow. The "premium feeling" in Anthropic's three videos comes from giving digital elements a set of **physical-world motion rules**.

These rules have 3 layers:

1. **Narrative rhythm layer**: Slow-Fast-Boom-Stop time allocation
2. **Motion curve layer**: Expo Out / Overshoot / Spring, rejecting linear
3. **Expression language layer**: Showing process, mouse arcs, logo morph convergence

---

## 1. Narrative Rhythm: Slow-Fast-Boom-Stop 5-Phase Structure

All three Anthropic videos follow this structure without exception:

| Phase | Proportion | Rhythm | Purpose |
|---|---|---|---|
| **S1 Trigger** | ~15% | Slow | Give human reaction time, establish realism |
| **S2 Generation** | ~15% | Medium | Visual wow moment appears |
| **S3 Process** | ~40% | Fast | Show controllability/density/detail |
| **S4 Burst** | ~20% | Boom | Camera pull-back / 3D pop-out / multi-panel emergence |
| **S5 Landing** | ~10% | Still | Brand Logo + abrupt stop |

**Duration mapping** (15-second animation example):
S1 Trigger 2s, S2 Generation 2s, S3 Process 6s, S4 Burst 3s, S5 Landing 2s

**Forbidden**:
- Even rhythm (same information density per second) -- audience fatigue
- Sustained high density -- no peak, no memorable moment
- Fade-out ending (fading to transparent) -- should **stop abruptly**

**Self-check**: Draw 5 thumbnails, each representing one phase's climax frame. If the 5 images look similar, the rhythm hasn't been achieved.

---

## 2. Easing Philosophy: Reject Linear, Embrace Physics

All motion effects in Anthropic's three videos use bezier curves with "damping feel". The default cubic easeOut (`1-(1-t)^3`) **isn't sharp enough** -- too slow to start, too loose to stop.

### Three Core Easings (built into animations.jsx)

```js
// 1. Expo Out -- Fast start, slow brake (most used, default primary easing)
// CSS equivalent: cubic-bezier(0.16, 1, 0.3, 1)
Easing.expoOut(t) // = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

// 2. Overshoot -- Elastic toggle/button pop
// CSS equivalent: cubic-bezier(0.34, 1.56, 0.64, 1)
Easing.overshoot(t)

// 3. Spring physics -- Geometry settling, natural placement
Easing.spring(t)
```

### Usage Mapping

| Scenario | Which Easing |
|---|---|
| Card rise-in / panel entrance / Terminal fade / focus overlay | **`expoOut`** (primary easing, most used) |
| Toggle switch / button pop / emphasis interaction | `overshoot` |
| Preview geometry settling / physical placement / UI element bounce | `spring` |
| Continuous motion (e.g., mouse trajectory interpolation) | `easeInOut` (preserves symmetry) |

### Counterintuitive Insight

Most product promo animations are **too fast and too hard**. `linear` makes digital elements feel like machines, `easeOut` is baseline, `expoOut` is the technical root of "premium feeling" -- it gives digital elements a **physical-world sense of weight**.

---

## 3. Motion Language: 8 Shared Principles

### 3.1 Backgrounds Are Never Pure Black or Pure White

None of Anthropic's three videos use `#FFFFFF` or `#000000` as primary background. **Neutral colors with color temperature** (warm or cool) have a "paper / canvas / desk" material feel, reducing the machine feel.

Specific color value decisions follow section 1.a core asset protocol (extract from brand spec) or the "design direction advisor" (20 philosophies' background color schemes). This reference doesn't give specific color values -- those are **brand decisions**, not motion rules.

### 3.2 Easing Is Never Linear

See section 2.

### 3.3 Slow-Fast-Boom-Stop Narrative

See section 1.

### 3.4 Show "Process" Not "Magic Result"

- Claude Design shows tweaking parameters, dragging sliders (not one-click perfect result)
- Claude Code shows code errors + AI fixes (not first-try success)
- Claude for Word shows Redline red-deletion green-addition editing process (not directly giving final draft)

**Shared subtext**: The product is a **collaborator, pair programmer, senior editor** -- not a one-click magician.
This precisely targets professional users' pain points around "controllability" and "authenticity".

**Anti-AI slop**: AI defaults to making "magic one-click success" animations (one click generate -> perfect result), this is the common denominator. **Doing the opposite** -- showing process, showing tweaks, showing bugs and fixes -- is the source of brand recognizability.

### 3.5 Mouse Trajectories Are Hand-Drawn (Arcs + Perlin Noise)

Real human mouse movement isn't straight lines, it's "accelerate at start -> arc -> decelerate and correct -> click".
AI's directly interpolated mouse trajectories have a **subconscious rejection feel**.

```js
// Quadratic bezier interpolation (start -> control point -> end)
function bezierQuadratic(p0, p1, p2, t) {
  const x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
  const y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
  return [x, y];
}

// Path: start -> offset midpoint -> end (make an arc)
const path = [[100, 100], [targetX - 200, targetY + 80], [targetX, targetY]];

// Add tiny Perlin Noise (+-2px) for "hand shake"
const jitterX = (simpleNoise(t * 10) - 0.5) * 4;
const jitterY = (simpleNoise(t * 10 + 100) - 0.5) * 4;
```

### 3.6 Logo "Morph Convergence"

Logo appearance in Anthropic's three videos **is never simple fade-in**, it's **morphed from the previous visual element**.

**Shared pattern**: The final 1-2 seconds do Morph / Rotate / Converge, making the entire narrative "collapse" onto the brand point.

**Low-cost implementation** (no real morph needed):
Let the previous visual element "collapse" into a color block (scale -> 0.1, translate toward center),
then the color block "expands" into the wordmark. Transition uses 150ms fast cut + motion blur
(`filter: blur(6px)` -> `0`).

```js
<Sprite start={13} end={14}>
  {/* Collapse: previous element scale 0.1, opacity maintained, filter blur increases */}
  const scale = interpolate(t, [0, 0.5], [1, 0.1], Easing.expoOut);
  const blur = interpolate(t, [0, 0.5], [0, 6]);
</Sprite>
<Sprite start={13.5} end={15}>
  {/* Expand: Logo from color block center scale 0.1 -> 1, blur 6 -> 0 */}
  const scale = interpolate(t, [0, 0.6], [0.1, 1], Easing.overshoot);
  const blur = interpolate(t, [0, 0.6], [6, 0]);
</Sprite>
```

### 3.7 Serif + Sans-Serif Dual Typography

- **Brand / narration**: Serif (has "academic / publication / taste" feel)
- **UI / code / data**: Sans-serif + Monospace

**Single typeface is always wrong**. Serif gives "taste", sans-serif gives "function".

Specific font choices follow brand spec (brand-spec.md's Display / Body / Mono triple stack) or the design direction advisor's 20 philosophies. This reference doesn't give specific fonts -- those are **brand decisions**.

### 3.8 Focus Switch = Background Dimming + Foreground Sharpening + Flash Guide

Focus switching **isn't just** lowering opacity. The complete recipe is:

```js
// Non-focus element filter combination
tile.style.filter = `
  brightness(${1 - 0.5 * focusIntensity})
  saturate(${1 - 0.3 * focusIntensity})
  blur(${focusIntensity * 4}px)        // <- Key: add blur to truly "push back"
`;
tile.style.opacity = 0.4 + 0.6 * (1 - focusIntensity);

// After focus completes, 150ms Flash highlight at focus position to guide eye back
focusOverlay.animate([
  { background: 'rgba(255,255,255,0.3)' },
  { background: 'rgba(255,255,255,0)' }
], { duration: 150, easing: 'ease-out' });
```

**Why blur is mandatory**: With only opacity + brightness, out-of-focus elements are still "sharp", visually they haven't "moved to the background". blur(4-8px) makes non-focus elements truly recede one layer of depth.

---

## 4. Specific Motion Techniques (Copy-Ready Code Snippets)

### 4.1 FLIP / Shared Element Transition

A button "expands" into an input field, **not** button disappears + new panel appears. The core is **the same DOM element** transitioning between two states, not two elements cross-fading.

```jsx
// Using Framer Motion layoutId
<motion.div layoutId="design-button">Design</motion.div>
// ↓ After click, same layoutId
<motion.div layoutId="design-button">
  <input placeholder="Describe your design..." />
</motion.div>
```

Native implementation reference: https://aerotwist.com/blog/flip-your-animations/

### 4.2 "Breathing" Expansion (width then height)

Panel expansion **doesn't stretch width and height simultaneously**, instead:
- First 40% of time: only stretch width (keep height small)
- Last 60% of time: width holds, expand height

This simulates the physical-world "spread first, then fill" sensation.

```js
const widthT = interpolate(t, [0, 0.4], [0, 1], Easing.expoOut);
const heightT = interpolate(t, [0.3, 1], [0, 1], Easing.expoOut);
style.width = `${widthT * targetW}px`;
style.height = `${heightT * targetH}px`;
```

### 4.3 Staggered Fade-up (30ms stagger)

Table rows, card columns, list items entering -- **each element delayed 30ms**, `translateY` from 10px back to 0.

```js
rows.forEach((row, i) => {
  const localT = Math.max(0, t - i * 0.03);  // 30ms stagger
  row.style.opacity = interpolate(localT, [0, 0.3], [0, 1], Easing.expoOut);
  row.style.transform = `translateY(${
    interpolate(localT, [0, 0.3], [10, 0], Easing.expoOut)
  }px)`;
});
```

### 4.4 Non-Linear Breathing -- Hover 0.5s Before Key Results

Machines execute fast and continuously, but **hovering 0.5 seconds before a key result** gives the audience's brain reaction time.

```jsx
// Typical scenario: AI generation complete -> hover 0.5s -> result appears
<Sprite start={8} end={8.5}>
  {/* 0.5s pause -- nothing moves, audience stares at loading state */}
  <LoadingState />
</Sprite>
<Sprite start={8.5} end={10}>
  <ResultAppear />
</Sprite>
```

**Anti-pattern**: AI generation completes and immediately cuts to result -- audience has no reaction time, information is lost.

### 4.5 Chunk Reveal -- Simulating Token Streaming

AI-generated text **shouldn't use `setInterval` single-character popping** (like old movie subtitles), use **chunk reveal** -- reveal 2-5 characters at a time, with irregular intervals, simulating real token stream output.

```js
// Split by chunks, not characters
const chunks = text.split(/(\s+|,\s*|\.\s*|;\s*)/);  // Split by word + punctuation
let i = 0;
function reveal() {
  if (i >= chunks.length) return;
  element.textContent += chunks[i++];
  const delay = 40 + Math.random() * 80;  // Irregular 40-120ms
  setTimeout(reveal, delay);
}
reveal();
```

### 4.6 Anticipation -> Action -> Follow-through

3 of Disney's 12 principles. Anthropic uses them explicitly:

- **Anticipation**: Small reverse motion before the action starts (button slightly shrinks before popping)
- **Action**: The main motion itself
- **Follow-through**: After-math after the action ends (card slight bounce after settling)

```js
// Complete three-phase card entrance
const anticip = interpolate(t, [0, 0.2], [1, 0.95], Easing.easeIn);     // Preparation
const action  = interpolate(t, [0.2, 0.7], [0.95, 1.05], Easing.expoOut); // Main
const settle  = interpolate(t, [0.7, 1], [1.05, 1], Easing.spring);       // Settle
// Final scale = three-phase product or segmented application
```

**Anti-pattern**: Animation with only Action and no Anticipation + Follow-through feels like "PowerPoint animation".

### 4.7 3D Perspective + translateZ Layering

For that "tilted 3D + floating cards" feel, add perspective to the container, give individual elements different translateZ:

```css
.stage-wrap {
  perspective: 2400px;
  perspective-origin: 50% 30%;  /* Slightly overhead gaze */
}
.card-grid {
  transform-style: preserve-3d;
  transform: rotateX(8deg) rotateY(-4deg);  /* Golden ratio */
}
.card:nth-child(3n) { transform: translateZ(30px); }
.card:nth-child(5n) { transform: translateZ(-20px); }
.card:nth-child(7n) { transform: translateZ(60px); }
```

**Why rotateX 8deg / rotateY -4deg is the golden ratio**:
- Above 10deg -> elements feel too distorted, look like "falling over"
- Below 5deg -> looks like "shear" not "perspective"
- 8deg x -4deg asymmetric ratio simulates "camera at desk's upper-left corner looking down" natural angle

### 4.8 Diagonal Pan -- Move XY Simultaneously

Camera movement isn't pure vertical or pure horizontal, but **simultaneous XY movement** to simulate diagonal motion:

```js
const panX = Math.sin(flowT * 0.22) * 40;
const panY = Math.sin(flowT * 0.35) * 30;
stage.style.transform = `
  translate(-50%, -50%)
  rotateX(8deg) rotateY(-4deg)
  translate3d(${panX}px, ${panY}px, 0)
`;
```

**Key**: X and Y frequencies differ (0.22 vs 0.35), avoiding Lissajous loop regularization.

---

## 5. Scene Recipes (Three Narrative Templates)

The three reference videos correspond to three product personalities. **Choose the one closest to your product**, don't mix.

### Recipe A: Apple Keynote Dramatic (Claude Design Type)

**Best for**: Major version releases, hero animations, visual wow priority
**Rhythm**: Slow-Fast-Boom-Stop strong arc
**Easing**: All `expoOut` + some `overshoot`
**SFX density**: High (~0.4/s), SFX pitch tuned to BGM scale
**BGM**: IDM / minimal tech electronic, calm + precise
**Convergence**: Camera rapid pull-back -> drop -> Logo morph -> ethereal single tone -> abrupt stop

### Recipe B: Single-Take Tool (Claude Code Type)

**Best for**: Developer tools, productivity apps, flow-state scenes
**Rhythm**: Continuous steady flow, no obvious peaks
**Easing**: `spring` physics + `expoOut`
**SFX density**: **0** (pure BGM-driven editing rhythm)
**BGM**: Lo-fi Hip-hop / Boom-bap, 85-90 BPM
**Core technique**: Key UI actions land on BGM kick/snare transients -- "**music groove IS interaction audio**"

### Recipe C: Office Efficiency Narrative (Claude for Word Type)

**Best for**: Enterprise software, document/spreadsheet/calendar apps, professionalism priority
**Rhythm**: Multi-scene hard cuts + Dolly In/Out
**Easing**: `overshoot` (toggle) + `expoOut` (panels)
**SFX density**: Medium (~0.3/s), UI clicks primarily
**BGM**: Jazzy Instrumental, minor key, BPM 90-95
**Highlight**: One scene must have the "whole-piece climax" -- 3D pop-out / breaking from the plane and floating up

---

## 6. Anti-Patterns: Doing These Is AI Slop

| Anti-pattern | Why it's wrong | Correct approach |
|---|---|---|
| `transition: all 0.3s ease` | `ease` is linear's cousin, all elements same speed | Use `expoOut` + per-element stagger |
| All entrances are `opacity 0->1` | No sense of motion direction | Combine with `translateY 10->0` + Anticipation |
| Logo fades in | No narrative convergence feel | Morph / Converge / collapse-expand |
| Mouse moves in straight lines | Subconscious machine feel | Bezier arcs + Perlin Noise |
| Typing single-character pop (setInterval) | Like old movie subtitles | Chunk Reveal, random intervals |
| No hover before key result | Audience has no reaction time | 0.5s hover before result |
| Focus switch only changes opacity | Non-focus elements are still sharp | opacity + brightness + **blur** |
| Pure black / pure white background | Cyber feel / reflective fatigue | Neutral with color temperature (follow brand spec) |
| All animations same speed | No rhythm | Slow-Fast-Boom-Stop |
| Fade out ending | No sense of finality | Abrupt stop (hold last frame) |

---

## 7. Self-Check List (60 Seconds Before Animation Delivery)

- [ ] Narrative structure is Slow-Fast-Boom-Stop, not even rhythm?
- [ ] Default easing is `expoOut`, not `easeOut` or `linear`?
- [ ] Toggle / button pop uses `overshoot`?
- [ ] Card / list entrance has 30ms stagger?
- [ ] Key result has 0.5s hover before it?
- [ ] Typing uses Chunk Reveal, not setInterval single-character?
- [ ] Focus switch includes blur (not just opacity)?
- [ ] Logo is morph convergence, not fade-in?
- [ ] Background isn't pure black / pure white (has color temperature)?
- [ ] Text has serif + sans-serif layering?
- [ ] Ending is abrupt stop, not fade-out?
- [ ] (If there's a mouse) Mouse trajectory is arc, not straight line?
- [ ] SFX density matches product personality (see recipes A/B/C)?
- [ ] BGM and SFX have 6-8dB loudness difference? (See `audio-design-rules.md`)

---

## 8. Relationship to Other References

| Reference | Position | Relationship |
|---|---|---|
| `animation-pitfalls.md` | Technical pitfall avoidance (16 rules) | "**What not to do**" -- inverse of this file |
| `animations.md` | Stage/Sprite engine usage | Animation **how to write** basics |
| `audio-design-rules.md` | Dual-track audio rules | Animation **audio pairing** rules |
| `sfx-library.md` | 37 SFX catalog | Sound effects **asset library** |
| **This file** | Positive motion design grammar | "**What you should do**" |

**Loading order**:
1. First see SKILL.md workflow Step 3's position questions (determine narrative role and visual temperature)
2. After choosing direction, read this file to determine **motion language** (recipe A/B/C)
3. When writing code, reference `animations.md` and `animation-pitfalls.md`
4. When exporting video, follow `audio-design-rules.md` + `sfx-library.md`
