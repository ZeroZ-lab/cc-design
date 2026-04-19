# Starter Components

Starter components are ready-made scaffolds in the `templates/` directory. Copy them to your project instead of hand-drawing device bezels, deck shells, or presentation grids.

Kinds include the file extension — some are plain JS (load with `<script src>`), some are JSX (load with `<script type="text/babel" src>`).

## How to use

```bash
# Copy a template to your project
cp templates/<component>.<ext> ./<component>.<ext>
```

Or use `Read` to read the template, then `Write` to create a customized version in your project.

| Component | File | Type | When to Use |
|---|---|---|---|
| `deck_stage` | `templates/deck_stage.js` | Plain JS | ANY slide presentation — handles scaling, keyboard nav, slide-count overlay, speaker-notes postMessage, localStorage persistence, print-to-PDF |
| `design_canvas` | `templates/design_canvas.jsx` | JSX (React) | Presenting 2+ static options side-by-side — a grid layout with labeled cells for variations |
| `ios_frame` | `templates/ios_frame.jsx` | JSX (React) | Design needs to look like a real iPhone screen — includes device bezel with status bar and keyboard |
| `android_frame` | `templates/android_frame.jsx` | JSX (React) | Design needs to look like a real Android phone screen — includes device bezel with status bar and keyboard |
| `macos_window` | `templates/macos_window.jsx` | JSX (React) | Desktop window chrome with traffic lights |
| `browser_window` | `templates/browser_window.jsx` | JSX (React) | Desktop window chrome with tab bar |
| `animations` | `templates/animations.jsx` | JSX (React) | Timeline-based animation engine (Stage + Sprite + scrubber + Easing) — for animated video or motion-design output |

## Animations Detail

When using `animations.jsx`, you get: `<Stage>` (auto-scale + scrubber + play/pause), `<Sprite start end>`, `useTime()`/`useSprite()` hooks, `Easing`, `interpolate()`, and entry/exit primitives. Build scenes by composing Sprites inside a Stage.

Only fall back to Popmotion (`https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js`) if the starter genuinely can't cover the use case.

## Deck Stage Detail

For slide decks, do not hand-roll scaling — copy `templates/deck_stage.js` to your project and put each slide as a direct child `<section>` of the `<deck-stage>` element. The component handles:
- Scaling (fixed 1920x1080 canvas letterboxed on black via `transform: scale()`)
- Keyboard/tap navigation
- Slide-count overlay
- localStorage persistence
- Print-to-PDF (one page per slide)
- Auto-tags every slide with `data-screen-label` and `data-om-validate`
- Posts `{slideIndexChanged: N}` to parent for speaker notes sync

Prev/next controls must be **outside** the scaled element so they stay usable on small screens.

## Speaker Notes

When adding speaker notes for slides (only when explicitly asked), add to `<head>`:

```html
<script type="application/json" id="speaker-notes">
[
    "Slide 0 notes",
    "Slide 1 notes"
]
</script>
```

The page MUST call `window.postMessage({slideIndexChanged: N})` on init and on every slide change. `deck_stage.js` handles this automatically.
