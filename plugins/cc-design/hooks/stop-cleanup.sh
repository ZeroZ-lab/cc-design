#!/usr/bin/env bash
# hooks/stop-cleanup.sh — Stop hook for cc-design
#
# Fires on session end / stop.
# Behavior:
#   1. Call hooks-lib/cleanup.sh to remove stale console logs
#   2. Log action to .claude/hook-log.txt
#   3. Silent output (no additionalContext required)
#
# Security: set -uo pipefail (no -e), validate CLAUDE_PLUGIN_ROOT, opt-out env var
set -uo pipefail

# ── Opt-out check ─────────────────────────────────────────────────────────────
if [ "${CCDESIGN_HOOK_STOP:-}" = "off" ]; then
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
printf '%s [%s] stop: fired, running cleanup\n' "$LOG_TS" "cc-design" >> "$LOG_FILE" 2>/dev/null || true

# ── Run cleanup ───────────────────────────────────────────────────────────────
bash "$PLUGIN_ROOT/hooks-lib/cleanup.sh" --project-dir "$PROJECT_DIR" 2>/dev/null || true

# ── Silent exit ────────────────────────────────────────────────────────────────
# Stop hooks do not need to output additionalContext
exit 0