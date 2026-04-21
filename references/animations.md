# Animations: Timeline Animation Engine

Read this when building animation/motion design HTML. Principles, usage, common patterns.

## Core Pattern: Stage + Sprite

Our animation system (`assets/animations.jsx`) provides a timeline-driven engine:

- **`<Stage>`**: Container for the entire animation, auto-provides auto-scale (fit viewport) + scrubber + play/pause/loop controls
- **`<Sprite start end>`**: Time segment. A Sprite is only visible from `start` to `end`. Internally reads its local progress `t` (0→1) via the `useSprite()` hook
- **`useTime()`**: Read current global time (seconds)
- **`Easing.easeInOut` / `Easing.easeOut` / ...**: Easing functions
- **`interpolate(t, from, to, easing?)`**: Interpolate based on t

This pattern borrows from Remotion/After Effects concepts, but is lightweight and zero-dependency.

## Getting Started

```html
<script type="text/babel" src="animations.jsx"></script>
<script type="text/babel">
  const { Stage, Sprite, useTime, useSprite, Easing, interpolate } = window.Animations;

  function Title() {
    const { t } = useSprite();  // Local progress 0→1
    const opacity = interpolate(t, [0, 1], [0, 1], Easing.easeOut);
    const y = interpolate(t, [0, 1], [40, 0], Easing.easeOut);
    return (
      <h1 style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize: 120,
        fontWeight: 900,
      }}>
        Hello.
      </h1>
    );
  }

  function Scene() {
    return (
      <Stage duration={10}>  {/* 10-second animation */}
        <Sprite start={0} end={3}>
          <Title />
        </Sprite>
        <Sprite start={2} end={5}>
          <SubTitle />
        </Sprite>
        {/* ... */}
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Scene />);
</script>
```

## Common Animation Patterns

### 1. Fade In / Fade Out

```jsx
function FadeIn({ children }) {
  const { t } = useSprite();
  const opacity = interpolate(t, [0, 0.3], [0, 1], Easing.easeOut);
  return <div style={{ opacity }}>{children}</div>;
}
```

**Note on ranges**: `[0, 0.3]` means the fade-in completes in the first 30% of the sprite's time, then stays at opacity=1.

### 2. Slide In

```jsx
function SlideIn({ children, from = 'left' }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, 0.4], [0, 1], Easing.easeOut);
  const offset = (1 - progress) * 100;
  const directions = {
    left: `translateX(-${offset}px)`,
    right: `translateX(${offset}px)`,
    top: `translateY(-${offset}px)`,
    bottom: `translateY(${offset}px)`,
  };
  return (
    <div style={{
      transform: directions[from],
      opacity: progress,
    }}>
      {children}
    </div>
  );
}
```

### 3. Character-by-Character Typewriter

```jsx
function Typewriter({ text }) {
  const { t } = useSprite();
  const charCount = Math.floor(text.length * Math.min(t * 2, 1));
  return <span>{text.slice(0, charCount)}</span>;
}
```

### 4. Number Counter

```jsx
function CountUp({ from = 0, to = 100, duration = 0.6 }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, duration], [0, 1], Easing.easeOut);
  const value = Math.floor(from + (to - from) * progress);
  return <span>{value.toLocaleString()}</span>;
}
```

### 5. Segmented Explanation (Typical Educational Animation)

```jsx
function Scene() {
  return (
    <Stage duration={20}>
      {/* Phase 1: Present the problem */}
      <Sprite start={0} end={4}>
        <Problem />
      </Sprite>

      {/* Phase 2: Show the approach */}
      <Sprite start={4} end={10}>
        <Approach />
      </Sprite>

      {/* Phase 3: Show the result */}
      <Sprite start={10} end={16}>
        <Result />
      </Sprite>

      {/* Caption visible throughout */}
      <Sprite start={0} end={20}>
        <Caption />
      </Sprite>
    </Stage>
  );
}
```

## Easing Functions

Built-in easing curves:

| Easing | Characteristic | Use for |
|--------|---------------|---------|
| `linear` | Constant speed | Scrolling text, continuous animations |
| `easeIn` | Slow→Fast | Exit/disappear animations |
| `easeOut` | Fast→Slow | Entrance/appear animations |
| `easeInOut` | Slow→Fast→Slow | Position changes |
| **`expoOut`** ⭐ | **Exponential ease-out** | **Primary easing for production-grade animation** (physical weight)|
| **`overshoot`** ⭐ | **Elastic overshoot** | **Toggle / button pop / emphasis interactions** |
| `spring` | Spring physics | Interaction feedback, geometry snapping |
| `anticipation` | Reverse first, then forward | Emphasizing actions |

**Default primary easing is `expoOut`** (not `easeOut`) — see `animation-best-practices.md` §2.
Enter with `expoOut`, exit with `easeIn`, toggle with `overshoot` — the basic rhythm of production-grade animation.

## Timing and Duration Guide

### Micro-interactions (0.1-0.3s)
- Button hover
- Card expand
- Tooltip appear

### UI Transitions (0.3-0.8s)
- Page switch
- Modal appear
- List item added

### Narrative Animation (2-10s per segment)
- One phase of a concept explanation
- Data chart reveal
- Scene transition

### Single narrative segment should not exceed 10 seconds
Human attention is limited. 10 seconds per idea, then move to the next.

## Animation Design Thought Process

### 1. Content/Story First, Then Animation

**Wrong**: Start with fancy animation ideas, then shoehorn content in
**Right**: Clarify what information to convey first, then use animation to serve that information

Animation is **signal**, not **decoration**. A fade-in says "this is important, look here" — if everything fades in, the signal is lost.

### 2. Write Timeline by Scene

```
0:00 - 0:03   Problem appears (fade in)
0:03 - 0:06   Problem zooms/expands (zoom+pan)
0:06 - 0:09   Solution appears (slide in from right)
0:09 - 0:12   Solution explained (typewriter)
0:12 - 0:15   Result demo (counter up + chart reveal)
0:15 - 0:18   Summary sentence (static, 3 seconds to read)
0:18 - 0:20   CTA or fade out
```

Write the timeline first, then write components.

### 3. Assets First

Prepare all images/icons/fonts the animation needs **before** starting. Don't break flow to hunt for assets mid-build.

## Common Issues

**Animation stuttering**
→ Usually layout thrashing. Use `transform` and `opacity`, don't animate `top`/`left`/`width`/`height`/`margin`. Browser GPU-accelerates `transform`.

**Animation too fast to read**
→ Reading one CJK character takes 100-150ms, one word takes 300-500ms. If telling a story with text, leave at least 3 seconds per sentence.

**Animation too slow, audience bored**
→ Interesting visual changes need to be frequent. Static frames over 5 seconds feel dull.

**Multiple animations interfering with each other**
→ Use CSS `will-change: transform` to hint the browser that an element will animate, reducing reflows.

**Recording as video**
→ Use the skill's built-in toolchain (one command outputs three formats): see `video-export.md`
- `scripts/render-video.js` — HTML → 25fps MP4 (Playwright + ffmpeg)
- `scripts/convert-formats.sh` — 25fps MP4 → 60fps MP4 + optimized GIF
- Want more precise frame rendering? Make render(t) a pure function, see `animation-pitfalls.md` rule 5

## Integration with Video Tools

This skill produces **HTML animations** (running in the browser). If the final output needs to be video assets:

- **Short animations/concept demos**: Build HTML animation here → screen record
- **Long videos/narratives**: This skill focuses on HTML animation; for long-form video, use AI video generation tools or professional video software
- **Motion graphics**: Professional tools like After Effects/Motion Canvas are more appropriate

## About Popmotion and Other Libraries

If you truly need physics-based animation (spring, decay, keyframes with precise timing), our engine may not handle it. Fall back to Popmotion:

```html
<script src="https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js"></script>
```

But **try our engine first**. It handles 90% of cases.
