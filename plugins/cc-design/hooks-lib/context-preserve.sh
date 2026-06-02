#!/usr/bin/env bash
# hooks-lib/context-preserve.sh — Extract design tokens from HTML files
#
# Scans active HTML files in the project directory for:
# - CSS custom properties (--var: value)
# - Color values (hex, rgb, hsl)
# - Font families and sizes
# - Active file paths
#
# Saves to .claude/design-context.json (overwrite, max 2KB, permissions 0600).
# Includes recovery instruction for post-compact model.
#
# Usage:
#   hooks-lib/context-preserve.sh                          # auto-detect project dir
#   hooks-lib/context-preserve.sh --project-dir /path      # explicit project dir
#   hooks-lib/context-preserve.sh --help                   # show help
set -euo pipefail

# ── Help ──────────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--help" ]; then
  cat <<'HELP'
cc-design context preservation

Scans HTML files in the project directory for design tokens (CSS vars,
colors, fonts) and saves them to .claude/design-context.json.

Usage:
  context-preserve.sh                   Auto-detect project dir
  context-preserve.sh --project-dir /p  Explicit project directory
  context-preserve.sh --help            Show this help

Output:
  Writes .claude/design-context.json (overwrite, max 2KB, 0600 permissions)

Environment variables:
  CLAUDE_PROJECT_DIR   Project directory (auto-set by Claude Code / Codex)
  CLAUDE_PLUGIN_ROOT   Plugin root (used to locate fallback dirs)
HELP
  exit 0
fi

# ── Resolve project directory ─────────────────────────────────────────────────
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
if [ "${1:-}" = "--project-dir" ]; then
  PROJECT_DIR="${2:-.}"
fi

# Validate: reject .. in path, must resolve to absolute
RESOLVED="$(cd "$PROJECT_DIR" 2>/dev/null && pwd)" || RESOLVED="$PROJECT_DIR"
case "$RESOLVED" in
  *..*) exit 0 ;;  # reject path traversal
esac
PROJECT_DIR="$RESOLVED"

# ── Find HTML files (max 10 most recent, within project dir) ──────────────────
HTML_FILES=""
HTML_FILES="$(find "$PROJECT_DIR" -maxdepth 3 -name '*.html' -o -name '*.htm' 2>/dev/null \
  | head -10)" || true

if [ -z "$HTML_FILES" ]; then
  exit 0
fi

# ── Extract design tokens via python3 ─────────────────────────────────────────
# python3 is required; if missing, skip silently (hooks handle this check)
if ! command -v python3 >/dev/null 2>&1; then
  exit 0
fi

RESULT="$(python3 - "$PROJECT_DIR" "$HTML_FILES" <<'PY'
import json
import os
import re
import sys

project_dir = sys.argv[1]
html_files_raw = sys.argv[2]  # newline-separated string from find output

MAX_SIZE = 2048  # 2KB cap

colors = set()
fonts = set()
css_vars = {}
active_files = []

for fpath in html_files_raw.split('\n'):
    fpath = fpath.strip()
    if not fpath or not os.path.isfile(fpath):
        continue

    # Security: verify file is within project dir, reject ..
    abs_path = os.path.abspath(fpath)
    abs_project = os.path.abspath(project_dir)
    if not abs_path.startswith(abs_project):
        continue
    if '..' in os.path.relpath(abs_path, abs_project):
        continue

    active_files.append(os.path.relpath(abs_path, abs_project))

    try:
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read(50000)  # read max 50KB per file
    except Exception:
        continue

    # Extract hex colors
    for m in re.finditer(r'#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])', content):
        colors.add(m.group(0))

    # Extract rgb/hsl colors
    for m in re.finditer(r'(rgb|hsl|oklch)\([^)]+\)', content):
        colors.add(m.group(0))

    # Extract font-family values
    for m in re.finditer(r'font-family:\s*([^;}{]+)', content):
        fonts.add(m.group(1).strip())

    # Extract CSS custom properties
    for m in re.finditer(r'--([a-zA-Z0-9_-]+):\s*([^;}{]+)', content):
        css_vars[m.group(1)] = m.group(2).strip()

# Sort and limit to fit 2KB
sorted_colors = sorted(colors)[:20]
sorted_fonts = sorted(fonts)[:10]
sorted_vars = dict(sorted(css_vars.items())[:15])
sorted_files = sorted(active_files)[:10]

output = {
    "active_files": sorted_files,
    "colors": sorted_colors,
    "fonts": sorted_fonts,
    "css_vars": sorted_vars,
    "workflow_step_hint": "Verify",
    "recovery_instruction": "Context was compressed. Resume from workflow_step_hint with these confirmed design decisions. Re-read active_files to restore visual state."
}

# Detect workflow step: check if any active file has data-screen-label
for f in sorted_files[:3]:
    try:
        with open(os.path.join(project_dir, f), 'r', errors='ignore') as fh:
            if "data-screen-label" in fh.read(1000):
                output["workflow_step_hint"] = "Build"
                break
    except Exception:
        pass

# Cap to 2KB
json_str = json.dumps(output, ensure_ascii=False, separators=(',', ':'))
if len(json_str) > MAX_SIZE:
    # Progressive truncation: drop css_vars, then fonts, then colors
    output.pop("css_vars", None)
    json_str = json.dumps(output, ensure_ascii=False, separators=(',', ':'))
    if len(json_str) > MAX_SIZE:
        output.pop("fonts", None)
        json_str = json.dumps(output, ensure_ascii=False, separators=(',', ':'))
        if len(json_str) > MAX_SIZE:
            output["colors"] = output["colors"][:5]
            json_str = json.dumps(output, ensure_ascii=False, separators=(',', ':'))

print(json_str)
PY
)" || RESULT="{}"

# ── Write design-context.json ─────────────────────────────────────────────────
CLAUDE_DIR="$PROJECT_DIR/.claude"
mkdir -p "$CLAUDE_DIR"

CONTEXT_FILE="$CLAUDE_DIR/design-context.json"
printf '%s' "$RESULT" > "$CONTEXT_FILE"
chmod 0600 "$CONTEXT_FILE" 2>/dev/null || true

# ── Output for hook consumption ───────────────────────────────────────────────
# Hooks will read this file and inject into additionalContext
printf '%s' "$RESULT"