# CC Design

A Claude Code skill that provides high-fidelity HTML design and prototype creation capabilities — covering slide decks, interactive prototypes, landing pages, UI mockups, animations, and visual design explorations.

## Overview

CC Design embeds a structured design workflow into Claude Code, enabling it to operate as an expert product designer. It guides the full lifecycle: from clarifying requirements and acquiring design context, through building progressively with real UI kits and design systems, to delivering polished HTML artifacts with verification.

The skill is designed around two core principles:

- **Context-first design** — Never design from scratch when existing brand systems, component libraries, or product code is available. Actively acquire and reuse design vocabulary before creating new visual directions.
- **Progressive disclosure** — The main skill definition stays concise (under 170 lines) while technical references are loaded on demand, keeping context window usage minimal.

## Features

| Category | Capabilities |
|---|---|
| **Output formats** | Interactive prototypes, slide decks, landing pages, UI mockups, animated motion studies, design explorations |
| **Design systems** | Auto-discovers and reuses existing tokens, components, typography, spacing, and color patterns |
| **Variations** | Generates 3+ design directions across layout, interaction, visual intensity, and motion axes |
| **Prototyping** | React + Babel inline JSX with pinned versions, component scope management, starter scaffolds |
| **Tweaks system** | In-page design controls with real-time preview and persistent state |
| **Verification** | Automated console error checks, layout validation, and screenshot-based regression via background subagents |
| **Export** | PPTX (editable or screenshot mode), PDF, standalone HTML, Canva import, developer handoff packages |

## Installation

Clone this repository into your Claude Code skills directory:

```bash
git clone https://github.com/ZeroZ-lab/cc-design.git ~/.claude/skills/cc-design
```

Or add it as a submodule within an existing skill collection:

```bash
git submodule add https://github.com/ZeroZ-lab/cc-design.git skills/cc-design
```

## Project Structure

```
cc-design/
├── SKILL.md                          # Skill definition with YAML frontmatter
├── agents/
│   └── openai.yaml                   # Interface configuration for Codex-compatible platforms
└── references/
    ├── platform-tools.md             # Platform tool reference (file ops, preview, export)
    ├── react-babel-setup.md          # React/Babel pinned versions and scope rules
    ├── starter-components.md         # Starter component catalog and usage
    └── tweaks-system.md              # In-page tweak controls protocol
```

### Architecture

```
┌─────────────────────────────────────┐
│           SKILL.md (168 lines)      │  ← Always loaded into context
│  Core workflow, design rules,       │
│  content guidelines, verification   │
└──────────────┬──────────────────────┘
               │  Referenced on demand
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│ references/  │  │  agents/     │
│ (loaded as   │  │  (platform   │
│  needed)     │  │   config)    │
└──────────────┘  └──────────────┘
```

The three-tier loading system keeps the skill responsive across diverse conversation contexts:

1. **Metadata** — name + description (~40 words), always present for trigger matching
2. **SKILL.md body** — core instructions (~168 lines), loaded when the skill is activated
3. **References** — technical details loaded only when the relevant topic arises (React setup, component catalog, tool API, tweak protocol)

## Usage

Once installed, the skill activates automatically when Claude Code encounters design-related requests. Example prompts that trigger the skill:

```
"Design a landing page for our SaaS product"
"Create a 10-slide pitch deck for the Q3 board meeting"
"Build an interactive prototype of the checkout flow"
"Explore 3 visual directions for the new dashboard"
"Make the onboarding screens look good on mobile"
```

For programmatic invocation in Codex-compatible environments:

```yaml
default_prompt: "Use $cc-design to explore three strong HTML-based design directions for this feature, grounded in the existing product style."
```

## Design Workflow

```
Understand → Explore → Plan → Build → Verify → Deliver
    │           │        │       │        │         │
    ▼           ▼        ▼       ▼        ▼         ▼
 Clarify    Read      Todo    HTML +    Console   `done`
 questions  design    list    React     errors    + verify
            context          comps     + visual    agent
                                        checks
```

1. **Understand** — Clarify output format, fidelity, audience, variations, and constraints
2. **Explore** — Read design systems, copy relevant components, inspect existing UI
3. **Plan** — Create a structured approach with a todo list
4. **Build** — Write HTML/React with starter components and design system assets
5. **Verify** — Automated error detection and visual regression via background agents
6. **Deliver** — Surface the artifact with `done`, export to target format

## Compatibility

| Platform | Status | Notes |
|---|---|---|
| Claude Code (CLI) | Supported | Primary target |
| Claude.ai (Web) | Supported | No subagents; runs inline |
| Codex / OpenAI-compatible | Supported | Via `agents/openai.yaml` |

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes — keep SKILL.md under 200 lines; move new technical content to `references/`
4. Test with representative design prompts
5. Open a pull request

When adding new reference documents, include a clear pointer in SKILL.md so the model knows when to load it.

## License

MIT
