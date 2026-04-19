# CC Design

A Claude Code skill that provides high-fidelity HTML design and prototype creation capabilities — covering slide decks, interactive prototypes, landing pages, UI mockups, animations, and visual design explorations.

Adapted from the Claude Artifacts design environment to work in Claude Code and Codex-style coding agents, using Playwright MCP where available and local scripts for export fallback paths.

## Overview

CC Design embeds a structured design workflow into Claude Code, enabling it to operate as an expert product designer. It guides the full lifecycle: from clarifying requirements and acquiring design context, through building progressively with real UI kits and design systems, to delivering polished HTML artifacts with Playwright-based verification.

The skill is designed around two core principles:

- **Context-first design** — Never design from scratch when existing brand systems, component libraries, or product code is available. Actively acquire and reuse design vocabulary before creating new visual directions.
- **Progressive disclosure** — The main skill definition stays concise while technical references are loaded on demand, keeping context window usage minimal.

## Features

| Category | Capabilities |
|---|---|
| **Output formats** | Interactive prototypes, slide decks, landing pages, UI mockups, animated motion studies, design explorations |
| **Brand style cloning** | Progressive loading of 68+ brand design systems from [getdesign.md](https://getdesign.md) (Stripe, Vercel, Notion, Linear, Apple, etc.) |
| **Design systems** | Auto-discovers and reuses existing tokens, components, typography, spacing, and color patterns |
| **Variations** | Generates 3+ design directions across layout, interaction, visual intensity, and motion axes |
| **Prototyping** | React + Babel inline JSX with pinned versions, component scope management, starter scaffolds |
| **Tweaks system** | Self-contained in-page design controls with real-time preview and localStorage persistence |
| **Verification** | Playwright-based verification in Claude Code; equivalent preview/screenshot flows in Codex-style hosts |
| **Export** | Local PPTX/PDF/inline export scripts, or equivalent host-provided export tools |

## Installation

Clone this repository into your Claude Code skills directory:

```bash
git clone https://github.com/ZeroZ-lab/cc-design.git ~/.claude/skills/cc-design
```

Or add it as a submodule within an existing skill collection:

```bash
git submodule add https://github.com/ZeroZ-lab/cc-design.git skills/cc-design
```

### Export script setup

For PPTX, PDF, and inline HTML export features:

```bash
cd ~/.claude/skills/cc-design/scripts && npm install && cd -
```

This installs both `pptxgenjs` and `playwright`. Playwright-backed export paths may also require:

```bash
npx playwright install chromium
```

## Project Structure

```
cc-design/
├── SKILL.md                          # Skill definition with YAML frontmatter
├── EXAMPLES.md                       # Usage examples including brand style cloning
├── agents/
│   └── openai.yaml                   # Interface configuration for Codex-compatible platforms
├── references/
│   ├── getdesign-loader.md           # Brand style loading from getdesign.md
│   ├── platform-tools.md             # Claude Code + Playwright tool reference
│   ├── react-babel-setup.md          # React/Babel pinned versions and scope rules
│   ├── starter-components.md         # Starter component catalog and usage
│   └── tweaks-system.md              # In-page tweak controls (self-contained)
├── templates/                        # Starter component files
│   ├── deck_stage.js                 # Slide presentation stage
│   ├── design_canvas.jsx             # Side-by-side option grid
│   ├── ios_frame.jsx                 # iPhone device frame
│   ├── android_frame.jsx             # Android device frame
│   ├── macos_window.jsx              # macOS window chrome
│   ├── browser_window.jsx            # Browser window chrome
│   └── animations.jsx                # Timeline animation engine
└── scripts/                          # Export utility scripts
    ├── package.json                  # Node.js dependencies
    ├── gen_pptx.js                   # HTML → PPTX export
    ├── super_inline_html.js          # HTML + assets → single file
    └── open_for_print.js             # HTML → PDF via Playwright
```

### Architecture

```
┌─────────────────────────────────────┐
│           SKILL.md                  │  ← Always loaded into context
│  Core workflow, design rules,       │
│  content guidelines, verification   │
└──────────────┬──────────────────────┘
               │  Referenced on demand
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│ references/  │  │ templates/   │
│ (loaded as   │  │ (copied to   │
│  needed)     │  │  project)    │
└──────────────┘  └──────────────┘
                        │
                ┌───────┴────────┐
                ▼                ▼
         ┌──────────────┐  ┌──────────────┐
         │  scripts/    │  │  agents/     │
         │  (export     │  │  (platform   │
         │   tools)     │  │   config)    │
         └──────────────┘  └──────────────┘
```

## Usage

Once installed, the skill activates automatically when Claude Code encounters design-related requests. Example prompts:

```
"Design a landing page for our SaaS product"
"Create a 10-slide pitch deck for the Q3 board meeting"
"Build an interactive prototype of the checkout flow"
"Explore 3 visual directions for the new dashboard"
"Make the onboarding screens look good on mobile"
```

### Brand Style Cloning (New)

Mention a brand name to automatically load its design system from [getdesign.md](https://getdesign.md):

```
"Create a pricing page with Stripe's aesthetic"
"Notion-style kanban board"
"Mix Vercel's minimalism with Linear's purple accents"
"Show me this dashboard in Apple style vs Tesla style"
```

Supports 68+ brands including Stripe, Vercel, Notion, Linear, Apple, Tesla, Figma, GitHub, Airbnb, and more.

See [EXAMPLES.md](./EXAMPLES.md) for detailed usage patterns and advanced workflows.

## Design Workflow

```
Understand → Explore → Plan → Build → Verify → Deliver
    │           │        │       │        │         │
    ▼           ▼        ▼       ▼        ▼         ▼
 Clarify    Read      Todo    HTML +   Playwright  File
 questions  design    list    React    console +   delivered
            context          comps    screenshot

```

## Compatibility

| Platform | Status | Notes |
|---|---|---|
| Claude Code (CLI) | **Primary target** | Playwright MCP plus local scripts |
| Codex / OpenAI-compatible | Supported | Prompt metadata is included; exact tool mapping depends on the host |

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes — keep SKILL.md under 200 lines; move new technical content to `references/`
4. Test with representative design prompts
5. Open a pull request

When adding new reference documents, include a clear pointer in SKILL.md so the model knows when to load it.

## License

MIT
