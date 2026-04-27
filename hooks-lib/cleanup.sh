#!/usr/bin/env bash
# hooks-lib/cleanup.sh — Safe temp file cleanup for cc-design
#
# Removes .playwright-mcp/console-*.log files older than 7 days.
# Only operates within CLAUDE_PROJECT_DIR. Resolves symlinks.
# Skips unknown file types. Skips if CLAUDE_PROJECT_DIR unset.
#
# Usage:
#   hooks-lib/cleanup.sh              # auto-detect project dir
#   hooks-lib/cleanup.sh --project-dir /path
#   hooks-lib/cleanup.sh --help
set -euo pipefail

# ── Help ──────────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--help" ]; then
  cat <<'HELP'
cc-design temp file cleanup

Removes stale .playwright-mcp/console-*.log files older than 7 days.

Usage:
  cleanup.sh                   Auto-detect project dir
  cleanup.sh --project-dir /p  Explicit project directory
  cleanup.sh --help            Show this help

Safety:
  - Only deletes files matching console-*.log pattern
  - Only operates within CLAUDE_PROJECT_DIR/.playwright-mcp/
  - Resolves symlinks before deletion
  - Refuses to delete symlink targets outside project dir
  - Skips entirely if CLAUDE_PROJECT_DIR is unset

Environment variables:
  CLAUDE_PROJECT_DIR   Project directory (auto-set by Claude Code / Codex)
HELP
  exit 0
fi

# ── Resolve project directory ─────────────────────────────────────────────────
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-}"
if [ "${1:-}" = "--project-dir" ]; then
  PROJECT_DIR="${2:-}"
fi

# Skip if no project directory
if [ -z "$PROJECT_DIR" ]; then
  exit 0
fi

# Validate project dir exists
if [ ! -d "$PROJECT_DIR" ]; then
  exit 0
fi

MCP_DIR="$PROJECT_DIR/.playwright-mcp"
if [ ! -d "$MCP_DIR" ]; then
  exit 0
fi

# ── Find and delete stale console logs ────────────────────────────────────────
# Only target console-*.log pattern, never other files
STALE_FILES="$(find "$MCP_DIR" -maxdepth 1 -name 'console-*.log' -mtime +7 2>/dev/null)" || true

if [ -z "$STALE_FILES" ]; then
  exit 0
fi

DELETED=0
SKIPPED=0

for file in $STALE_FILES; do
  # Resolve symlinks
  if [ -L "$file" ]; then
    TARGET="$(readlink "$file" 2>/dev/null || true)"
    if [ -z "$TARGET" ]; then
      SKIPPED=$((SKIPPED + 1))
      continue
    fi

    # Resolve relative symlinks
    case "$TARGET" in
      /*) RESOLVED="$TARGET" ;;
      *)  RESOLVED="$(cd "$(dirname "$file")" && cd "$TARGET" 2>/dev/null && pwd)" || RESOLVED="$TARGET" ;;
    esac

    # Refuse if target is outside project dir
    case "$RESOLVED" in
      "$PROJECT_DIR"/*) ;;
      *) SKIPPED=$((SKIPPED + 1)); continue ;;
    esac
  fi

  # Delete the file (symlink or regular)
  rm -f "$file" 2>/dev/null && DELETED=$((DELETED + 1)) || SKIPPED=$((SKIPPED + 1))
done

printf '[cc-design] Cleanup: deleted %d stale console logs, skipped %d\n' "$DELETED" "$SKIPPED" >&2