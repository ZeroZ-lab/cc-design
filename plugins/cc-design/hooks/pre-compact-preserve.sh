#!/usr/bin/env bash
# hooks/pre-compact-preserve.sh — PreCompact hook for cc-design
#
# Fires before context compression.
# Behavior:
#   1. Call hooks-lib/context-preserve.sh to extract design tokens
#   2. Output preserved context via additionalContext (with recovery instruction)
#   3. Log action to .claude/hook-log.txt
#
# Security: set -uo pipefail (no -e), validate CLAUDE_PLUGIN_ROOT, opt-out env var,
#           python3 graceful degradation, JSON escaping via python3
set -uo pipefail

# ── Opt-out check ─────────────────────────────────────────────────────────────
if [ "${CCDESIGN_HOOK_PRE_COMPACT:-}" = "off" ]; then
  printf '{}\n'
  exit 0
fi

# ── python3 availability check ────────────────────────────────────────────────
if ! command -v python3 >/dev/null 2>&1; then
  printf '{}\n'
  exit 0
fi

# ── Resolve and validate plugin root ──────────────────────────────────────────
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"

if [ ! -f "$PLUGIN_ROOT/.claude-plugin/plugin.json" ] && [ ! -f "$PLUGIN_ROOT/VERSION" ]; then
  PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fi

# ── Resolve project directory ─────────────────────────────────────────────────
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

# ── Log action ────────────────────────────────────────────────────────────────
LOG_FILE="$PROJECT_DIR/.claude/hook-log.txt"
mkdir -p "$PROJECT_DIR/.claude" 2>/dev/null || true
LOG_TS="$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date 2>/dev/null || echo 'unknown')"
printf '%s [%s] pre-compact: fired, preserving context\n' "$LOG_TS" "cc-design" >> "$LOG_FILE" 2>/dev/null || true

# ── Run context preservation ──────────────────────────────────────────────────
PRESERVED_RESULT="$(bash "$PLUGIN_ROOT/hooks-lib/context-preserve.sh" --project-dir "$PROJECT_DIR" 2>/dev/null || true)"

if [ -z "$PRESERVED_RESULT" ] || [ "$PRESERVED_RESULT" = "{}" ]; then
  # No HTML files found — nothing to preserve
  printf '{}\n'
  exit 0
fi

# ── Build context with recovery instruction ────────────────────────────────────
RECOVERY_MSG="[cc-design] Design context preserved before compression. After context is restored, apply these tokens and resume from the workflow_step_hint. Re-read active_files to restore visual state."

FULL_CONTEXT="${RECOVERY_MSG}\n${PRESERVED_RESULT}"

# ── Cap to 2KB ────────────────────────────────────────────────────────────────
CONTENT_LEN="$(printf '%s' "$FULL_CONTEXT" | wc -c | tr -d '[:space:]')"
if [ "$CONTENT_LEN" -gt 2048 ]; then
  # Drop preserved result details, keep only recovery message
  FULL_CONTEXT="${RECOVERY_MSG}\n[Preserved tokens saved to .claude/design-context.json — model should re-read this file]"
fi

# ── JSON-escape and output ────────────────────────────────────────────────────
ESCAPED_CONTEXT="$(printf '%s' "$FULL_CONTEXT" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')"

# Platform-adapted output
if [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  printf '{\n  "additional_context": %s\n}\n' "$ESCAPED_CONTEXT"
else
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "PreCompact",\n    "additionalContext": %s\n  }\n}\n' "$ESCAPED_CONTEXT"
fi

exit 0