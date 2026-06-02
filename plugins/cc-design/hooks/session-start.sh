#!/usr/bin/env bash
# hooks/session-start.sh — SessionStart hook for cc-design
#
# Fires on session start, clear, compact.
# Behavior:
#   1. Call hooks-lib/update-check.sh for version updates
#   2. Check .claude/design-context.json for preserved context (re-inject)
#   3. Inject compressed Iron Law summaries
#   4. Output via platform-adapted additionalContext (max 2KB)
#   5. Log action to .claude/hook-log.txt
#
# Security: set -uo pipefail (no -e), validate CLAUDE_PLUGIN_ROOT, opt-out env var,
#           python3 graceful degradation, JSON escaping via python3
set -uo pipefail

# ── Opt-out check ─────────────────────────────────────────────────────────────
if [ "${CCDESIGN_HOOK_SESSION_START:-}" = "off" ]; then
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

# Validate: plugin root must contain plugin.json or VERSION
if [ ! -f "$PLUGIN_ROOT/.claude-plugin/plugin.json" ] && [ ! -f "$PLUGIN_ROOT/VERSION" ]; then
  PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fi

# ── Resolve project directory ─────────────────────────────────────────────────
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

# ── Log action ────────────────────────────────────────────────────────────────
LOG_FILE="$PROJECT_DIR/.claude/hook-log.txt"
mkdir -p "$PROJECT_DIR/.claude" 2>/dev/null || true
LOG_TS="$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date 2>/dev/null || echo 'unknown')"
printf '%s [%s] session-start: fired\n' "$LOG_TS" "cc-design" >> "$LOG_FILE" 2>/dev/null || true

# ── Collect context pieces ────────────────────────────────────────────────────
CONTEXT_PARTS=""

# 1. Preserved design context (highest priority — recovery after compression)
CONTEXT_FILE="$PROJECT_DIR/.claude/design-context.json"
if [ -f "$CONTEXT_FILE" ]; then
  # Check file age — warn if >24h old
  if [ "$(find "$CONTEXT_FILE" -mmin +1440 2>/dev/null)" ]; then
    CONTEXT_PARTS="${CONTEXT_PARTS}\n[cc-design] Design context file is over 24 hours old. It may be stale — consider starting fresh."
  else
    PRESERVED="$(cat "$CONTEXT_FILE" 2>/dev/null || true)"
    if [ -n "$PRESERVED" ]; then
      CONTEXT_PARTS="${CONTEXT_PARTS}\n[cc-design] Previous design context recovered from compression:\n${PRESERVED}"
    fi
  fi
fi

# 2. Update check
UPDATE_RESULT="$(bash "$PLUGIN_ROOT/hooks-lib/update-check.sh" 2>/dev/null || true)"
if [ -n "$UPDATE_RESULT" ]; then
  case "$UPDATE_RESULT" in
    UPGRADE_AVAILABLE*)
      OLD_VER="$(echo "$UPDATE_RESULT" | awk '{print $2}')"
      NEW_VER="$(echo "$UPDATE_RESULT" | awk '{print $3}')"
      CONTEXT_PARTS="${CONTEXT_PARTS}\n[cc-design] Update available: ${OLD_VER} -> ${NEW_VER}. Run: npx skills update cc-design"
      printf '%s [%s] session-start: update-check=%s\n' "$LOG_TS" "cc-design" "$UPDATE_RESULT" >> "$LOG_FILE" 2>/dev/null || true
      ;;
    *)
      printf '%s [%s] session-start: update-check=up-to-date\n' "$LOG_TS" "cc-design" >> "$LOG_FILE" 2>/dev/null || true
      ;;
  esac
fi

# 3. Compressed Iron Law (lowest priority)
IRON_LAW_FILE="$PLUGIN_ROOT/references/design-iron-law.md"
if [ -f "$IRON_LAW_FILE" ]; then
  # Extract compressed summaries (1-line per article)
  IRON_SUMMARY="$(sed -n '/^## Article/p' "$IRON_LAW_FILE" | sed 's/^## /- /' | head -3)"
  if [ -n "$IRON_SUMMARY" ]; then
    CONTEXT_PARTS="${CONTEXT_PARTS}\n[cc-design] Iron Law (compressed):\n${IRON_SUMMARY}\nSee references/design-iron-law.md for full text."
  fi
fi

# ── Build final context string ────────────────────────────────────────────────
if [ -z "$CONTEXT_PARTS" ]; then
  printf '{}\n'
  exit 0
fi

# Strip leading newline
CONTEXT_PARTS="$(printf '%s' "$CONTEXT_PARTS" | sed '1{/^$/d}')"

# ── Cap to 2KB ────────────────────────────────────────────────────────────────
# Truncate if over 2KB (rough check: count bytes)
CONTENT_LEN="$(printf '%s' "$CONTEXT_PARTS" | wc -c | tr -d '[:space:]')"
if [ "$CONTENT_LEN" -gt 2048 ]; then
  CONTEXT_PARTS="$(printf '%s' "$CONTEXT_PARTS" | head -c 2048)"
fi

# ── JSON-escape and output ────────────────────────────────────────────────────
# Use python3 for proper JSON escaping (handles quotes, newlines, HTML tags, backslashes)
ESCAPED_CONTEXT="$(printf '%s' "$CONTEXT_PARTS" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')"

# ── Platform-adapted output format ────────────────────────────────────────────
# Claude Code / Codex: hookSpecificOutput.additionalContext
# Cursor (if CURSOR_PLUGIN_ROOT): additional_context (snake_case)
if [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  printf '{\n  "additional_context": %s\n}\n' "$ESCAPED_CONTEXT"
else
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": %s\n  }\n}\n' "$ESCAPED_CONTEXT"
fi

exit 0