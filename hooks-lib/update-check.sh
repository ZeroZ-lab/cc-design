#!/usr/bin/env bash
# hooks-lib/update-check.sh — Version update check for cc-design
#
# Replaces bin/ccdesign-update-check. Adds CLAUDE_PLUGIN_ROOT support,
# validates remote VERSION length, warns on URL override.
#
# Usage:
#   hooks-lib/update-check.sh              # normal check (uses cache)
#   hooks-lib/update-check.sh --force      # bypass cache
#   hooks-lib/update-check.sh --help       # show help
#
# Output: "UPGRADE_AVAILABLE <old> <new>" or silent (up to date)
set -euo pipefail

# ── Help ──────────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--help" ]; then
  cat <<'HELP'
cc-design update check

Usage:
  update-check.sh           Check for version updates (uses cache)
  update-check.sh --force   Bypass cache, always check remote
  update-check.sh --help    Show this help

Environment variables:
  CLAUDE_PLUGIN_ROOT  Plugin root directory (auto-set by Claude Code / Codex)
  CCDESIGN_DIR        Fallback for plugin root (used by SKILL.md)
  CCDESIGN_REMOTE_URL Override remote VERSION URL (will warn)
  CCDESIGN_STATE_DIR  State directory for cache (default: ~/.ccdesign)

Exit codes:
  0  Check completed (output only if upgrade available)
HELP
  exit 0
fi

# ── Resolve plugin root ───────────────────────────────────────────────────────
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-${CCDESIGN_DIR:-$(cd "$(dirname "$0")/.." && pwd)}}"

# Validate plugin root contains plugin.json or VERSION
if [ ! -f "$PLUGIN_ROOT/VERSION" ] && [ ! -f "$PLUGIN_ROOT/.claude-plugin/plugin.json" ]; then
  # Fallback: use script's own parent directory
  PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fi

STATE_DIR="${CCDESIGN_STATE_DIR:-$HOME/.ccdesign}"
CACHE_FILE="$STATE_DIR/last-update-check"
VERSION_FILE="$PLUGIN_ROOT/VERSION"
REMOTE_URL="${CCDESIGN_REMOTE_URL:-https://raw.githubusercontent.com/ZeroZ-lab/claritas-design/master/VERSION}"

# ── Warn on URL override ─────────────────────────────────────────────────────
DEFAULT_URL="https://raw.githubusercontent.com/ZeroZ-lab/claritas-design/master/VERSION"
if [ "$REMOTE_URL" != "$DEFAULT_URL" ]; then
  printf '[cc-design] Warning: CCDESIGN_REMOTE_URL overridden to %s\n' "$REMOTE_URL" >&2
fi

# ── Force mode ────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--force" ]; then
  rm -f "$CACHE_FILE"
fi

# ── Read local version ────────────────────────────────────────────────────────
LOCAL=""
if [ -f "$VERSION_FILE" ]; then
  LOCAL="$(tr -d '[:space:]' < "$VERSION_FILE" 2>/dev/null || true)"
fi
if [ -z "$LOCAL" ]; then
  exit 0
fi

mkdir -p "$STATE_DIR"

# ── Cache logic (preserved from bin/ccdesign-update-check) ────────────────────
if [ -f "$CACHE_FILE" ]; then
  CACHED="$(cat "$CACHE_FILE" 2>/dev/null || true)"
  case "$CACHED" in
    UP_TO_DATE*) CACHE_TTL=60 ;;
    UPGRADE_AVAILABLE*) CACHE_TTL=720 ;;
    *) CACHE_TTL=0 ;;
  esac

  STALE=$(find "$CACHE_FILE" -mmin +"$CACHE_TTL" 2>/dev/null || true)
  if [ -z "$STALE" ] && [ "$CACHE_TTL" -gt 0 ]; then
    case "$CACHED" in
      UP_TO_DATE*)
        CACHED_VER="$(echo "$CACHED" | awk '{print $2}')"
        if [ "$CACHED_VER" = "$LOCAL" ]; then
          exit 0
        fi
        ;;
      UPGRADE_AVAILABLE*)
        CACHED_OLD="$(echo "$CACHED" | awk '{print $2}')"
        # Always re-verify UPGRADE_AVAILABLE against remote
        ;;
    esac
  fi
fi

# ── Fetch remote version ──────────────────────────────────────────────────────
REMOTE="$(curl -fsSL --max-time 5 "$REMOTE_URL" 2>/dev/null || true)"
REMOTE="$(echo "$REMOTE" | tr -d '[:space:]')"

# ── Validate remote content ───────────────────────────────────────────────────
# Reject if longer than 32 chars (security: prevent injection via VERSION file)
if [ ${#REMOTE} -gt 32 ]; then
  echo "UP_TO_DATE $LOCAL" > "$CACHE_FILE"
  exit 0
fi

if ! echo "$REMOTE" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+([.-][A-Za-z0-9]+)?$'; then
  echo "UP_TO_DATE $LOCAL" > "$CACHE_FILE"
  exit 0
fi

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "UP_TO_DATE $LOCAL" > "$CACHE_FILE"
  exit 0
fi

echo "UPGRADE_AVAILABLE $LOCAL $REMOTE" > "$CACHE_FILE"
echo "UPGRADE_AVAILABLE $LOCAL $REMOTE"