# Audio Design Rules

> Audio application recipes for all animation demos. Use with `sfx-library.md` (asset catalog).
> Battle-tested through 9 hero animation iterations + deep analysis of 3 official Anthropic product videos + 8000+ A/B comparisons.

---

## Core Principle: Dual-Track Audio System (Iron Rule)

Animation audio **must be designed in two independent layers**, not just one:

| Layer | Purpose | Time scale | Visual relationship | Frequency range |
|---|---|---|---|---|
| **SFX (Beat Layer)** | Marks each visual beat | 0.2-2 second stabs | **Strong sync** (frame-level alignment) | **High frequency 800Hz+** |
| **BGM (Atmosphere Layer)** | Emotional bed, soundstage | Continuous 20-60 seconds | Weak sync (section-level) | **Mid-low frequency <4kHz** |

**Animation with only BGM is incomplete** -- the audience subconsciously senses "things are moving but there's no sonic response", which is the root cause of the "cheap" feeling.

---

## Gold Standard: Optimal Ratios

These values are derived from analyzing 3 official Anthropic product videos + the v9 final version through extensive A/B testing. Use directly:

### Volume
- **BGM volume**: `0.40-0.50` (relative to full scale 1.0)
- **SFX volume**: `1.00`
- **Loudness difference**: BGM peak is **-6 to -8 dB below** SFX peak (SFX stands out via loudness difference, not absolute volume)
- **amix parameter**: `normalize=0` (never use normalize=1, it flattens dynamic range)

### Frequency Isolation (P1 Optimization)

The secret isn't "loud SFX" -- it's **frequency layering**:

```bash
[bgm_raw]lowpass=f=4000[bgm]      # BGM limited to <4kHz mid-low range
[sfx_raw]highpass=f=800[sfx]      # SFX pushed to 800Hz+ mid-high range
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

Why: The human ear is most sensitive to the 2-5kHz range (the "presence band"). If SFX is in this range and BGM covers the full spectrum, **SFX gets masked by BGM's high frequencies**. Using highpass to push SFX up + lowpass to push BGM down separates them in the frequency spectrum, making SFX clarity jump up a level.

### Fades
- BGM in: `afade=in:st=0:d=0.3` (0.3s, avoids hard cut)
- BGM out: `afade=out:st=N-1.5:d=1.5` (1.5s tail, sense of closure)
- SFX has built-in envelopes, no additional fade needed

---

## SFX Cue Design Rules

### Density (SFX per 10 seconds)

Analyzed SFX density from 3 official Anthropic videos, three tiers:

| Video | SFX per 10s | Product personality | Use case |
|---|---|---|---|
| Artifacts (ref-1) | **~9/10s** | Feature-dense, lots of info | Complex tool demos |
| Code Desktop (ref-2) | **0** | Pure atmosphere, meditative | Developer tool focus state |
| Word (ref-3) | **~4/10s** | Balanced, office pace | Productivity tools |

**Heuristic**:
- Calm/focused product personality -- low SFX density (0-3/10s), BGM-driven
- Lively/information-heavy personality -- high SFX density (6-9/10s), SFX drives rhythm
- **Don't fill every visual beat** -- silence is more sophisticated than density. **Removing 30-50% of cues makes the remaining ones more dramatic**.

### Cue Selection Priority

Not every visual beat needs SFX. Prioritize by:

**P0 Must-have** (omission feels wrong):
- Typing (terminal/input)
- Click/select (user decision moment)
- Focus switch (visual protagonist changes)
- Logo reveal (brand convergence)

**P1 Recommended**:
- Element enter/exit (modal / card)
- Completion/success feedback
- AI generation start/end
- Major transitions (scene changes)

**P2 Optional** (too many = clutter):
- Hover / focus-in
- Progress ticks
- Decorative ambient

### Timestamp Alignment Precision
- **Same-frame alignment** (0ms error): Click / focus switch / logo settles
- **Lead 1-2 frames** (-33ms): Fast whoosh (gives audience psychological anticipation)
- **Lag 1-2 frames** (+33ms): Object landing/impact (matches real physics)

---

## BGM Selection Decision Tree

cc-design ships with 6 BGM tracks (`assets/bgm-*.mp3`):

```
What's the animation's personality?
|-- Product launch / tech demo --> bgm-tech.mp3 (minimal synth + piano)
|-- Tutorial walkthrough / tool usage --> bgm-tutorial.mp3 (warm, instructional)
|-- Educational / concept explanation --> bgm-educational.mp3 (curious, thoughtful)
|-- Marketing ad / brand promo --> bgm-ad.mp3 (upbeat, promotional)
`-- Same style needs variety --> bgm-*-alt.mp3 (alternates for each)
```

### When to Skip BGM

Reference: Anthropic Code Desktop (ref-2): **0 SFX + pure Lo-fi BGM** can feel premium.

**When to choose no BGM**:
- Animation < 10s (BGM can't establish itself)
- Product personality is "focus/meditation"
- Scene has ambient sound/voiceover
- SFX density is already high (avoid auditory overload)

---

## Scene Recipes (Ready to Use)

### Recipe A: Product Launch Hero

```
Duration: 25 seconds
BGM: bgm-tech.mp3, 45%, frequency < 4kHz
SFX density: ~6/10s

Cues:
  Terminal typing --> type x 4 (0.6s intervals)
  Enter key      --> enter
  Card converge  --> card x 4 (staggered 0.2s)
  Selection      --> click
  Ripple         --> whoosh
  4x focus       --> focus x 4
  Logo           --> thud (1.5s)

Volume: BGM 0.45 / SFX 1.0, amix normalize=0
```

### Recipe B: Tool Feature Demo

```
Duration: 30-45 seconds
BGM: bgm-tutorial.mp3, 50%
SFX density: 0-2/10s (minimal)

Strategy: Let BGM + voiceover drive, SFX only at decisive moments (file save / command execution complete)
```

### Recipe C: AI Generation Demo

```
Duration: 15-20 seconds
BGM: bgm-tech.mp3 or no BGM
SFX density: ~8/10s (high density)

Cues:
  User input       --> type + enter
  AI processing    --> magic/ai-process (1.2s loop)
  Generation done  --> feedback/complete-done
  Result reveal    --> magic/sparkle

Highlight: ai-process can loop 2-3 times through the entire generation phase
```

### Recipe D: Pure Atmosphere Long Shot

```
Duration: 10-15 seconds
BGM: None
SFX: 3-5 carefully designed standalone cues

Strategy: Each SFX is the star, no BGM "muddying" things.
Best for: Single product slow-mo, close-up showcases
```

---

## ffmpeg Mixing Templates

### Template 1: Single SFX Overlay on Video

```bash
ffmpeg -y -i video.mp4 -itsoffset 2.5 -i sfx.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4
```

### Template 2: Multi-SFX Timeline Mix (Aligned to Cue Times)

```bash
ffmpeg -y \
  -i sfx-type.mp3 -i sfx-enter.mp3 -i sfx-click.mp3 -i sfx-thud.mp3 \
  -filter_complex "\
[0:a]adelay=1100|1100[a0];\
[1:a]adelay=3200|3200[a1];\
[2:a]adelay=7000|7000[a2];\
[3:a]adelay=21800|21800[a3];\
[a0][a1][a2][a3]amix=inputs=4:duration=longest:normalize=0[mixed]" \
  -map "[mixed]" -t 25 sfx-track.mp3
```

**Key parameters**:
- `adelay=N|N`: First value is left channel delay (ms), second is right; write both to ensure stereo alignment
- `normalize=0`: Preserve dynamic range, critical!
- `-t 25`: Truncate to specified duration

### Template 3: Video + SFX Track + BGM (With Frequency Isolation)

```bash
ffmpeg -y -i video.mp4 -i sfx-track.mp3 -i bgm.mp3 \
  -filter_complex "\
[2:a]atrim=0:25,afade=in:st=0:d=0.3,afade=out:st=23.5:d=1.5,\
     lowpass=f=4000,volume=0.45[bgm];\
[1:a]highpass=f=800,volume=1.0[sfx];\
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k final.mp4
```

---

## Failure Mode Quick Reference

| Symptom | Root cause | Fix |
|---|---|---|
| SFX inaudible | BGM high frequencies mask SFX | Add `lowpass=f=4000` to BGM + `highpass=f=800` to SFX |
| SFX too harsh/piercing | SFX absolute volume too high | Lower SFX to 0.7, reduce BGM to 0.3, maintain the difference |
| BGM and SFX rhythm clash | Wrong BGM choice (strong beat music) | Switch to ambient / minimal synth BGM |
| Animation ends with BGM hard cut | No fade out | `afade=out:st=N-1.5:d=1.5` |
| SFX overlap into mush | Cues too dense + each SFX too long | Keep SFX duration under 0.5s, cue spacing >= 0.2s |
| MP4 has no sound on some platforms | Some platforms mute auto-play | Users clicking play will hear audio; GIF has no audio by design |

---

## Visual-Audio Linkage (Advanced)

### SFX Timbre Should Match Visual Style
- Warm beige/paper visual --> SFX uses **wooden/soft** timbres (Morse, paper snap, soft click)
- Cold dark tech visual --> SFX uses **metallic/digital** timbres (beep, pulse, glitch)
- Hand-drawn/playful visual --> SFX uses **cartoon/exaggerated** timbres (boing, pop, zap)

### SFX Can Guide Visual Rhythm

Advanced technique: **Design the SFX timeline first, then adjust visual animation to align with SFX** (not the reverse).
Because each SFX cue is a "clock tick", visual animation adapting to SFX rhythm feels very stable -- the reverse (SFX chasing visuals) often has +/-1 frame misalignment that feels off.

---

## Quality Checklist (Pre-Release Self-Check)

- [ ] Loudness difference: SFX peak - BGM peak = -6 to -8 dB?
- [ ] Frequency: BGM lowpass 4kHz + SFX highpass 800Hz?
- [ ] amix normalize=0 (preserving dynamic range)?
- [ ] BGM fade-in 0.3s + fade-out 1.5s?
- [ ] SFX count appropriate (density matches scene personality)?
- [ ] Each SFX frame-aligned with visual beat (within +/-1 frame)?
- [ ] Logo reveal SFX duration sufficient (1.5s recommended)?
- [ ] Listen with BGM muted: Do SFX alone carry enough rhythm?
- [ ] Listen with SFX muted: Does BGM alone have emotional arc?

Each layer should stand on its own. If they only sound good together, the mix isn't done right.

---

## References

- SFX asset catalog: `sfx-library.md`
- Visual style reference: `design-styles.md`
