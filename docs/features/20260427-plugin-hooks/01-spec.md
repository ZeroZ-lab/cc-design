# Spec: cc-design Plugin Architecture + Hooks (v0.5.0)

**artifact_type:** software
**priority:** P1
**version_target:** 0.5.0

## Problem

cc-design v0.4.0 has zero hooks. Critical workflow gaps rely entirely on SKILL.md instructions:

1. **Update check** embedded in SKILL.md as inline bash — runs only when skill activates, not on session start
2. **Design context loss** — long sessions lose design tokens and workflow state after context compression
3. **Temp files** (`.playwright-mcp/` console logs) accumulate across sessions — no cleanup

Deferred to v0.6.0:
- PostToolUse Write screenshot hook (bash cannot call Playwright MCP; every-write trigger too slow/noisy)

## Solution

Upgrade cc-design from skill-only to **plugin architecture** with 3 targeted hooks + shared `hooks-lib/` scripts. Both Claude Code and Codex support the same hooks mechanism — hooks fire automatically on both platforms.

### Architecture

```
.claude-plugin/
  plugin.json                    ← Plugin metadata
hooks/
  hooks.json                     ← Hook registration (both platforms read this)
  session-start.sh               ← SessionStart: update check + inject design constraints
  pre-compact-preserve.sh        ← PreCompact: save design context for recovery
  stop-cleanup.sh                ← Stop: cleanup stale temp files
hooks-lib/                       ← Shared logic (both hooks and SKILL.md call these)
  update-check.sh                ← Version check (replaces bin/ccdesign-update-check)
  context-preserve.sh            ← Extract design tokens + workflow state from HTML files
  cleanup.sh                     ← Safe temp file cleanup
```

**Hook path (both platforms)**: hooks.json → hook scripts → hooks-lib/
**SKILL.md path (fallback)**: SKILL.md instructions → hooks-lib/ (for environments where hooks don't fire)

### Hook Details

#### 1. SessionStart (session-start.sh)

**Trigger**: Session start, clear, compact (matcher: `"startup|clear|compact"`)
**Behavior**:
- Call `hooks-lib/update-check.sh` — if upgrade available, include in `additionalContext`
- Read `references/design-iron-law.md`, extract Article 1-3 summaries (compressed: 1-line per article + "See references/design-iron-law.md for full text")
- Inject as `additionalContext` (max 2KB)
- Check `.claude/design-context.json` — if exists (from previous PreCompact), re-inject preserved context
- **Platform parity**: Works identically on Claude Code and Codex (both support SessionStart)

#### 2. PreCompact (pre-compact-preserve.sh)

**Trigger**: Before context compression
**Behavior**:
- Call `hooks-lib/context-preserve.sh`:
  - Scan active HTML files for: CSS custom properties, color values (hex/rgb/hsl), font families, active file paths
  - Detect current workflow step (look for markers in `.claude/` or active file names)
  - Output: `{active_files, colors, fonts, css_vars, workflow_step_hint}`
- Save to `.claude/design-context.json` (overwrite, not append — always reflects current session state)
- Output preserved context via `additionalContext` with recovery instruction: "Context was compressed. Resume from workflow_step_hint with these confirmed design decisions."
- **Platform parity**: Works on both platforms (Codex v0.125.0+ supports PreCompact)

#### 3. Stop (stop-cleanup.sh)

**Trigger**: Session end / stop
**Behavior**:
- Call `hooks-lib/cleanup.sh` — remove `.playwright-mcp/console-*.log` files older than 7 days
- Cleanup only operates within `$CLAUDE_PROJECT_DIR/.playwright-mcp/`; skips if env var unset
- Only deletes files matching safe patterns (`console-*.log`); never deletes unknown file types
- Resolve symlinks before deletion; refuse to delete symlink targets outside project dir
- Silent output (no `additionalContext` required)

### Security Requirements (from 4-role review)

1. **Input validation**: All hook scripts parse stdin JSON via `python3` (never bash string interpolation). Validate `file_path` fields are within `$CLAUDE_PROJECT_DIR`, reject `..` components.
2. **`CLAUDE_PLUGIN_ROOT` validation**: Each hook verifies `CLAUDE_PLUGIN_ROOT` contains `plugin.json`; falls back to `dirname "$0"/..` if mismatch.
3. **No `set -e`**: Hook scripts use `set -uo pipefail` (not `-e`), with explicit error catching. `hooks-lib/` scripts may use `set -euo pipefail`.
4. **Opt-out**: Each hook reads env vars (`CCDESIGN_HOOK_SESSION_START=off`, `CCDESIGN_HOOK_PRE_COMPACT=off`, `CCDESIGN_HOOK_STOP=off`).
5. **Output length cap**: `additionalContext` max 2KB per hook.
6. **File permissions**: Scripts 0755; `.claude/design-context.json` 0600.
7. **Update check**: Validate remote VERSION ≤32 chars; warn on `CCDESIGN_REMOTE_URL` override.
8. **Logging**: Each hook appends one line to `.claude/hook-log.txt`.
9. **JSON escaping**: `additionalContext` values are JSON-string-escaped via python3, never raw text.

### Platform Parity

| Hook | Claude Code | Codex |
|---|---|---|
| SessionStart | Automatic | Automatic (Codex v0.125.0+ supports hooks) |
| PreCompact | Automatic | Automatic |
| Stop | Automatic | Automatic |

Both platforms share the same `hooks/hooks.json` and hook scripts. `hooks-lib/` provides shared logic that works identically regardless of platform.

**SKILL.md fallback**: For environments where hooks don't fire (older Codex versions, custom setups), SKILL.md includes instructions to call `hooks-lib/` scripts manually. This is a degraded mode, not the primary path.

### Files Changed

| File | Action | Description |
|---|---|---|
| `.claude-plugin/plugin.json` | Create | Plugin metadata |
| `hooks/hooks.json` | Create | Hook registrations (3 hooks) |
| `hooks/session-start.sh` | Create | SessionStart hook |
| `hooks/pre-compact-preserve.sh` | Create | PreCompact hook |
| `hooks/stop-cleanup.sh` | Create | Stop hook |
| `hooks-lib/update-check.sh` | Create | Replace `bin/ccdesign-update-check` |
| `hooks-lib/context-preserve.sh` | Create | Design token + workflow state extraction |
| `hooks-lib/cleanup.sh` | Create | Safe temp file cleanup |
| `bin/ccdesign-update-check` | Delete | Replaced by `hooks-lib/update-check.sh` |
| `SKILL.md` | Modify | Remove inline update check; add hooks-lib fallback instructions |
| `VERSION` | Modify | Bump to 0.5.0 |
| `README.md` | Modify | Document hooks architecture |
| `.gitignore` | Modify | Add `.claude/hook-log.txt`, `.claude/` |

### Constraints

- Hooks use `command` type only
- Hook scripts are bash; depend on `python3` for JSON I/O (graceful degradation if missing)
- `hooks-lib/` scripts work standalone
- Must not break Codex `agents/openai.yaml` integration
- VERSION must bump to 0.5.0

### Success Criteria

1. Plugin installs with hooks via `npx skills install cc-design`
2. SessionStart auto-checks updates + injects design constraints + recovers previous context
3. PreCompact saves design context to `.claude/design-context.json` with recovery instructions
4. Stop hook cleans stale console logs (7+ days old)
5. Hooks work on both Claude Code and Codex
6. Each hook has opt-out env var
7. Each hook logs activity to `.claude/hook-log.txt`
8. Hook scripts handle missing `python3` gracefully (output `{}`, exit 0)
9. `CLAUDE_PLUGIN_ROOT` validated in each hook script

### Deferred to v0.6.0

- PostToolUse Write screenshot hook (needs: decide hint vs CLI path for Playwright; debounce mechanism)