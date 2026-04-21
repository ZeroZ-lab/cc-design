# Video Export: HTML Animation to MP4/GIF

After completing an animation HTML, users often want to export it as video. This guide covers the complete pipeline.

## When to Export

**Export timing**:
- Animation runs correctly end-to-end, visually verified (Playwright screenshots confirm each keyframe)
- User has watched it in the browser at least once and confirmed it looks good
- **Do not** export while animation bugs are still being fixed -- fixing issues after video export is more expensive

**Trigger phrases users may say**:
- "Can you export this as video?"
- "Convert to MP4"
- "Make a GIF"
- "60fps"

## Output Specs

By default, deliver three formats and let the user choose:

| Format | Spec | Best for | Typical size (30s) |
|---|---|---|---|
| MP4 25fps | 1920x1080, H.264, CRF 18 | Social media embeds, video platforms, YouTube | 1-2 MB |
| MP4 60fps | 1920x1080, minterpolate frame interpolation, H.264, CRF 18 | High-framerate showcases, portfolios | 1.5-3 MB |
| GIF | 960x540, 15fps, palette optimized | Twitter/X, README, Slack previews | 2-4 MB |

## Toolchain

Two scripts in `scripts/`:

### 1. `render-video.js` -- HTML to MP4

Records a 25fps MP4 base version. Requires global playwright.

```bash
NODE_PATH=$(npm root -g) node /path/to/cc-design/scripts/render-video.js <html-file>
```

Optional parameters:
- `--duration=30` Animation duration (seconds)
- `--width=1920 --height=1080` Resolution
- `--trim=2.2` Seconds to trim from start (removes reload + font load time)
- `--fontwait=1.5` Font load wait time (seconds), increase when using many fonts

Output: Same directory as HTML, same name with `.mp4`.

### 2. `add-music.sh` -- MP4 + BGM to MP4

Mixes background music into a silent MP4. Selects from built-in BGM library by mood, or accepts custom audio. Auto-matches duration, adds fade in/out.

```bash
bash add-music.sh <input.mp4> [--mood=<name>] [--music=<path>] [--out=<path>]
```

**Built-in BGM library** (in `assets/bgm-<mood>.mp3`):

| `--mood=` | Style | Best for |
|-----------|-------|---------|
| `tech` (default) | Apple Silicon / Apple keynote vibe, minimal synth + piano | Product launches, AI tools, skill promos |
| `ad` | Upbeat modern electronic, has build + drop | Social media ads, product teasers, promos |
| `educational` | Warm, bright, light guitar/electric piano, inviting | Science communication, tutorial intros, course previews |
| `educational-alt` | Alternative option for the same mood | Same as above |
| `tutorial` | Lo-fi ambient, barely noticeable | Software demos, coding tutorials, long walkthroughs |
| `tutorial-alt` | Alternative option | Same as above |

**Behavior**:
- Music trimmed to video duration
- 0.3s fade in + 1s fade out (avoids hard cuts)
- Video stream `-c:v copy` (no re-encode), audio AAC 192k
- `--music=<path>` takes priority over `--mood`, use any external audio file
- Invalid mood name lists all available options instead of failing silently

**Typical pipeline** (animation export trio + music):
```bash
node render-video.js animation.html                        # Screen record
bash convert-formats.sh animation.mp4                      # Derive 60fps + GIF
bash add-music.sh animation-60fps.mp4                      # Add default tech BGM
# Or for different moods:
bash add-music.sh tutorial-demo.mp4 --mood=tutorial
bash add-music.sh product-promo.mp4 --mood=ad --out=promo-final.mp4
```

### 3. `convert-formats.sh` -- MP4 to 60fps MP4 + GIF

Generates 60fps version and GIF from an existing MP4.

```bash
bash /path/to/cc-design/scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

Output (same directory as input):
- `<name>-60fps.mp4` -- Default uses `fps=60` frame duplication (wide compatibility); add `--minterpolate` for high-quality frame interpolation
- `<name>.gif` -- Palette-optimized GIF (default 960 wide, configurable)

**60fps mode selection**:

| Mode | Command | Compatibility | Use case |
|---|---|---|---|
| Frame duplication (default) | `convert-formats.sh in.mp4` | QuickTime/Safari/Chrome/VLC all work | General delivery, platform uploads, social media |
| minterpolate interpolation | `convert-formats.sh in.mp4 --minterpolate` | macOS QuickTime/Safari may refuse to open | Platforms that need true interpolated frames. **Must test locally** before delivery |

Why frame duplication is now the default: minterpolate outputs an H.264 elementary stream with a known compat bug -- previous default of minterpolate hit "macOS QuickTime won't open" repeatedly. See `animation-pitfalls.md` rule 14.

`gif_width` parameter:
- 960 (default) -- General social platform use
- 1280 -- Sharper but larger file
- 600 -- Twitter/X priority loading

## Complete Pipeline (Standard Recommended)

After the user says "export video":

```bash
cd <project-directory>

# Assuming $SKILL points to this skill's root directory (adjust to your install location)

# 1. Record 25fps base MP4
NODE_PATH=$(npm root -g) node "$SKILL/scripts/render-video.js" my-animation.html

# 2. Derive 60fps MP4 and GIF
bash "$SKILL/scripts/convert-formats.sh" my-animation.mp4

# Output files:
# my-animation.mp4         (25fps, 1-2 MB)
# my-animation-60fps.mp4   (60fps, 1.5-3 MB)
# my-animation.gif         (15fps, 2-4 MB)
```

## Technical Details (For Troubleshooting)

### Playwright recordVideo Gotchas

- Framerate fixed at 25fps, cannot directly record 60fps (Chromium headless compositor limit)
- Recording starts from context creation, must use `trim` to cut front load time
- Default webm format, needs ffmpeg conversion to H.264 MP4 for universal playback

`render-video.js` handles all of these.

### ffmpeg minterpolate Parameters

Current config: `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`

- `mi_mode=mci` -- Motion compensation interpolation
- `mc_mode=aobmc` -- Adaptive overlapped block motion compensation
- `me_mode=bidir` -- Bidirectional motion estimation
- `vsbmc=1` -- Variable-size block motion compensation

Works well for CSS **transform animations** (translate/scale/rotate).
May produce slight ghosting on **pure fade** transitions -- if user complains, fall back to simple frame duplication:

```bash
ffmpeg -i input.mp4 -r 60 -c:v libx264 ... output.mp4
```

### Why GIF Palette Needs Two Passes

GIF supports only 256 colors. A single-pass GIF compresses the entire animation's colors into a generic 256-color palette, which ruins subtle palettes like warm beige + orange accent.

Two-stage approach:
1. `palettegen=stats_mode=diff` -- Scans the entire clip, generates an **optimal palette for this specific animation**
2. `paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle` -- Encodes using this palette, rectangle diff only updates changed regions, dramatically reducing file size

Using `dither=bayer` for fade transitions produces smoother results than `none`, at slightly larger file size.

## Pre-flight Check (Before Export)

30-second self-check before exporting:

- [ ] HTML has played through completely in the browser, no console errors
- [ ] Animation frame 0 is a complete initial state (not a blank loading screen)
- [ ] Animation's last frame is a stable final state (not mid-animation)
- [ ] All fonts/images/emoji render correctly (see `animation-pitfalls.md`)
- [ ] Duration parameter matches the actual animation length in the HTML
- [ ] HTML's Stage detects `window.__recording` to force loop=false (must-check for hand-written Stage; `assets/animations.jsx` includes this)
- [ ] Final Sprite has `fadeOut={0}` (video end frame should not fade out)
- [ ] Remove any attribution watermarks that aren't the user's brand (see SKILL.md for watermark policy)

## Delivery Notes

Standard format to include when delivering exports:

```
**Complete Delivery**

| File | Format | Spec | Size |
|---|---|---|---|
| foo.mp4 | MP4 | 1920x1080, 25fps, H.264 | X MB |
| foo-60fps.mp4 | MP4 | 1920x1080, 60fps (motion interpolation), H.264 | X MB |
| foo.gif | GIF | 960x540, 15fps, palette optimized | X MB |

**Notes**
- 60fps uses minterpolate motion estimation interpolation, works well with transform animations
- GIF uses palette optimization, 30s animation can compress to ~3MB

Let me know if you need different dimensions or framerates.
```

## Common Follow-up Requests

| User says | Response |
|---|---|
| "Too large" | MP4: increase CRF to 23-28; GIF: reduce resolution to 600 or fps to 10 |
| "GIF is too blurry" | Increase `gif_width` to 1280; or suggest MP4 instead (most platforms support it now) |
| "Need vertical 9:16" | Modify HTML source with `--width=1080 --height=1920`, re-record |
| "Add watermark" | Use ffmpeg `-vf "drawtext=..."` or `overlay=` a PNG |
| "Need transparent background" | MP4 doesn't support alpha; use WebM VP9 + alpha or APNG |
| "Need lossless" | Set CRF to 0 + preset veryslow (file will be ~10x larger) |
