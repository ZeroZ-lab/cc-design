# cc-design

**High-fidelity HTML design for Claude Code & Codex.**

Slide decks, landing pages, interactive prototypes, animations, design systems, and more — powered by structured design thinking and built-in quality guardrails.

[Demo](https://cc-design-demo.vercel.app) · [Examples](./EXAMPLES.md) · [Report Bug](https://github.com/ZeroZ-lab/cc-design/issues)

---

## Quick Start

### Claude Code

```bash
# 1. Clone the plugin
git clone https://github.com/ZeroZ-lab/cc-design.git ~/.claude/plugins/cc-design

# 2. Install export dependencies (optional)
cd ~/.claude/plugins/cc-design/scripts && npm install && cd -

# 3. Start designing — cc-design activates via /design command
```

### Codex

```bash
# 1. Clone the plugin
git clone https://github.com/ZeroZ-lab/cc-design.git ~/.codex/skills/cc-design

# 2. Start designing — cc-design activates via $cc-design
```

### Example prompts

```
"Design a landing page for our SaaS product"
"Create a 10-slide pitch deck for the Q3 board meeting"
"Build an interactive prototype of the checkout flow"
"Animate this logo reveal with the Pentagram style"
"Export the deck as editable PPTX"
```

cc-design handles context gathering, design planning, quality checks, and verification — you approve the plan, it builds.

## Showcase

[![Demo Gallery](./screenshots/previews/cc-design-home-preview.png)](./screenshots/previews/cc-design-home-preview.png)

<p align="center">
  <a href="./screenshots/previews/cc-design-enterprise-preview.png"><img src="./screenshots/previews/cc-design-enterprise-preview.png" alt="Enterprise Hero" width="32%"></a>
  <a href="./screenshots/previews/cc-design-scifi-preview.png"><img src="./screenshots/previews/cc-design-scifi-preview.png" alt="Sci-Fi Website" width="32%"></a>
  <a href="./screenshots/previews/cc-design-tesla-preview.png"><img src="./screenshots/previews/cc-design-tesla-preview.png" alt="Tesla 3D" width="32%"></a>
</p>
<p align="center">
  <a href="./screenshots/previews/cc-design-aether-preview.png"><img src="./screenshots/previews/cc-design-aether-preview.png" alt="AETHER" width="32%"></a>
  <a href="./screenshots/previews/cc-design-glass-preview.png"><img src="./screenshots/previews/cc-design-glass-preview.png" alt="Glass Dashboard" width="32%"></a>
  <a href="./screenshots/previews/cc-design-banking-preview.png"><img src="./screenshots/previews/cc-design-banking-preview.png" alt="Banking App" width="32%"></a>
</p>

## Capabilities

| Category | What you get |
|---|---|
| **Design outputs** | Landing pages, slide decks, interactive prototypes, wireframes, animations, design systems, motion studies |
| **Design thinking** | 8-layer framework (Goal → Validation), 10 core principles, 20 philosophy schools |
| **Brand cloning** | Progressive loading of 68+ brand design systems from [getdesign.md](https://getdesign.md) |
| **Quality guardrails** | Anti-AI slop rules, typography system, spacing scale, mandatory screenshot verification |
| **Variations** | 3+ design directions across layout, interaction, visual intensity, and motion |
| **Export** | PDF (multi-file + single-file), PPTX (image + editable), MP4 video, inline HTML |
| **Audio** | Dual-track audio (SFX + BGM), 37 SFX catalog, ffmpeg mixing |
| **Design review** | 5-dimension scoring: philosophy, hierarchy, craft, functionality, originality |
| **Animation** | Stage+Sprite timeline engine, easing library, signal protocol, pitfall guardrails |
| **Prototyping** | React + Babel inline JSX, device frames (iOS, Android, macOS, browser) |

## Design Styles

Mention a philosophy school to set the direction:

```
"Use the Pentagram style for this infographic"
"Apply Experimental Jetset minimalism to this poster"
"Mix Takram restraint with Locomotive motion for the hero"
```

20 schools across 5 traditions — Information Architects, Motion Poets, Minimalists, Experimental Vanguard, Eastern Philosophy. See `references/design-styles.md`.

### Brand Style Cloning

Mention a brand name to load its design system:

```
"Create a pricing page with Stripe's aesthetic"
"Notion-style kanban board"
"Mix Vercel's minimalism with Linear's purple accents"
```

## How It Works

```
Understand → Route → Plan → Approve → Build → Verify → Deliver
```

1. **Understand** — cc-design asks targeted questions to lock the output type, audience, and constraints
2. **Plan** — presents a visible execution plan with goals, facts, and assumptions
3. **Approve** — you approve before any code is written
4. **Build** — per-section preview pattern; you approve section by section
5. **Verify** — three-phase self-check (structural, visual, design excellence)
6. **Deliver** — screenshot-verified artifact ready to use

Key behavioral guarantees:
- Never builds without an approved plan
- Never delivers without screenshot verification
- Never uses AI slop patterns (banned gradients, emoji spam, generic layouts)
- Follow-ups and minor edits skip the full discovery flow

## Optional Dependencies

Core installation has no extra dependencies. For export features:

```bash
# Playwright browser (for export and verification)
npx playwright install chromium

# Video and audio export
brew install ffmpeg          # macOS
sudo apt install ffmpeg      # Ubuntu/Debian
choco install ffmpeg         # Windows
```

## Platform Integration

| Platform | Activation | Integration |
|---|---|---|
| **Claude Code** | `/design` command | Commands + hooks + SKILL.md |
| **Codex / OpenAI** | `$cc-design` reference | `agents/openai.yaml` |

## Plugin Hooks (v0.5.0)

cc-design includes 3 lifecycle hooks that fire automatically on both **Claude Code** and **Codex** (v0.125.0+):

| Hook | Trigger | Behavior |
|------|---------|----------|
| **SessionStart** | Session start, clear, compact | Auto update check + design context recovery + Iron Law injection |
| **PreCompact** | Before context compression | Preserves design tokens (colors, fonts, CSS vars) to `.claude/design-context.json` |
| **Stop** | Session end | Cleans stale `.playwright-mcp/console-*.log` files (>7 days) |

**Opt-out**: Set any of these env vars to `off` to disable individual hooks:

```bash
export CCDESIGN_HOOK_SESSION_START=off
export CCDESIGN_HOOK_PRE_COMPACT=off
export CCDESIGN_HOOK_STOP=off
```

All hooks log activity to `.claude/hook-log.txt` and gracefully degrade if `python3` is unavailable.

## Contributing

1. Fork the repo, create a feature branch
2. Keep `SKILL.md` under 200 lines — move technical content to `references/`
3. Add new references to `load-manifest.json` and the routing table in `SKILL.md`
4. Run `node scripts/lint-load-manifest.mjs` and `node scripts/generate-bundle-catalog.mjs`
5. If changing first-turn behavior: update `VERSION`, `SKILL.md`, `README.md`, `references/workflow.md`, then run `./scripts/check-behavior-contract.sh <base-ref>`

## License

MIT
