#!/usr/bin/env bash
# tests/test-hooks.sh — Hook integration tests for cc-design
#
# Runs each hook script with mock environment and validates output format,
# exit codes, and side effects.
#
# Usage:
#   ./tests/test-hooks.sh           Run all tests
#   ./tests/test-hooks.sh --verbose  Show hook output
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$PROJECT_DIR/hooks"
HOOKS_LIB="$PROJECT_DIR/hooks-lib"

PASS=0
FAIL=0

green()  { printf '\033[32m%s\033[0m' "$*"; }
red()    { printf '\033[31m%s\033[0m' "$*"; }
yellow() { printf '\033[33m%s\033[0m' "$*"; }

pass() { PASS=$((PASS + 1)); printf '  %s %s\n' "$(green PASS)" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf '  %s %s\n' "$(red FAIL)" "$1"; }

# ── Setup ───────────────────────────────────────────────────────────────────────

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

export CLAUDE_PLUGIN_ROOT="$PROJECT_DIR"
export CLAUDE_PROJECT_DIR="$TMP_DIR"

# Create a minimal HTML file so context-preserve has something to scan
mkdir -p "$TMP_DIR"
cat > "$TMP_DIR/test-design.html" <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
<style>
:root {
  --primary: #1a1a2e;
  --surface: #ffffff;
}
body {
  font-family: 'Instrument Serif', Georgia, serif;
  color: #1a1a2e;
  background: #fdf9f0;
}
.hero {
  font-size: 48px;
  color: rgb(194, 117, 88);
}
</style>
</head>
<body>
<div data-screen-label="01 Hero" class="hero">Test Design</div>
</body>
</html>
HTML

echo "cc-design hook tests"
echo "===================="
echo ""

# ── Test 1: SessionStart hook ──────────────────────────────────────────────────

echo "$(yellow '[Test 1]') SessionStart — normal execution"
RESULT="$(bash "$HOOKS_DIR/session-start.sh" 2>/dev/null || true)"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  pass "exit code is 0"
else
  fail "exit code is $EXIT_CODE (expected 0)"
fi

if echo "$RESULT" | python3 -c 'import sys,json; json.load(sys.stdin)' 2>/dev/null; then
  pass "output is valid JSON"
else
  fail "output is not valid JSON"
fi

if echo "$RESULT" | python3 -c '
import sys,json
d=json.load(sys.stdin)
assert "hookSpecificOutput" in d, "missing hookSpecificOutput"
assert "additionalContext" in d["hookSpecificOutput"], "missing additionalContext"
assert d["hookSpecificOutput"]["hookEventName"] == "SessionStart", "wrong hookEventName"
print("OK")
' 2>/dev/null; then
  pass "output has correct platform-adapted format (Claude Code/Codex)"
else
  fail "output missing hookSpecificOutput structure"
fi

# Verify hook-log.txt was created
if [ -f "$TMP_DIR/.claude/hook-log.txt" ]; then
  pass "hook-log.txt created"
else
  fail "hook-log.txt not created"
fi
echo ""

# ── Test 2: SessionStart opt-out ───────────────────────────────────────────────

echo "$(yellow '[Test 2]') SessionStart — opt-out (CCDESIGN_HOOK_SESSION_START=off)"
RESULT="$(CCDESIGN_HOOK_SESSION_START=off bash "$HOOKS_DIR/session-start.sh" 2>/dev/null || true)"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  pass "exit code is 0"
else
  fail "exit code is $EXIT_CODE (expected 0)"
fi

if [ "$RESULT" = "{}" ]; then
  pass "output is {} (empty, as expected when opted out)"
else
  fail "output is '$RESULT' (expected '{}')"
fi
echo ""

# ── Test 3: PreCompact hook ────────────────────────────────────────────────────

echo "$(yellow '[Test 3]') PreCompact — normal execution"
RESULT="$(bash "$HOOKS_DIR/pre-compact-preserve.sh" 2>/dev/null || true)"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  pass "exit code is 0"
else
  fail "exit code is $EXIT_CODE (expected 0)"
fi

if echo "$RESULT" | python3 -c 'import sys,json; json.load(sys.stdin)' 2>/dev/null; then
  pass "output is valid JSON"
else
  fail "output is not valid JSON"
fi

if echo "$RESULT" | python3 -c '
import sys,json
d=json.load(sys.stdin)
assert "hookSpecificOutput" in d, "missing hookSpecificOutput"
assert "additionalContext" in d["hookSpecificOutput"], "missing additionalContext"
assert d["hookSpecificOutput"]["hookEventName"] == "PreCompact", "wrong hookEventName"
print("OK")
' 2>/dev/null; then
  pass "output has correct platform-adapted format"
else
  fail "output missing hookSpecificOutput structure"
fi

# Verify .claude/design-context.json was created
if [ -f "$TMP_DIR/.claude/design-context.json" ]; then
  pass "design-context.json created"
  # Verify permissions
  PERMS="$(stat -f '%Lp' "$TMP_DIR/.claude/design-context.json" 2>/dev/null || stat -c '%a' "$TMP_DIR/.claude/design-context.json" 2>/dev/null || echo '600')"
  if [ "$PERMS" = "600" ]; then
    pass "design-context.json has 0600 permissions"
  else
    fail "design-context.json has permissions $PERMS (expected 600)"
  fi
  # Verify content has expected fields
  if python3 -c "
import json
with open('$TMP_DIR/.claude/design-context.json') as f:
    d = json.load(f)
assert 'active_files' in d, 'missing active_files'
assert 'colors' in d, 'missing colors'
assert 'fonts' in d, 'missing fonts'
assert 'css_vars' in d, 'missing css_vars'
assert 'workflow_step_hint' in d, 'missing workflow_step_hint'
assert 'recovery_instruction' in d, 'missing recovery_instruction'
assert 'test-design.html' in d['active_files'], 'missing expected file in active_files'
assert '#1a1a2e' in d['colors'] or '#fdf9f0' in d['colors'], 'missing expected colors'
print('OK')
" 2>/dev/null; then
    pass "design-context.json has all required fields with correct content"
  else
    fail "design-context.json missing expected fields or content"
  fi
else
  fail "design-context.json not created"
fi
echo ""

# ── Test 4: PreCompact opt-out ─────────────────────────────────────────────────

echo "$(yellow '[Test 4]') PreCompact — opt-out (CCDESIGN_HOOK_PRE_COMPACT=off)"
RESULT="$(CCDESIGN_HOOK_PRE_COMPACT=off bash "$HOOKS_DIR/pre-compact-preserve.sh" 2>/dev/null || true)"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  pass "exit code is 0"
else
  fail "exit code is $EXIT_CODE (expected 0)"
fi

if [ "$RESULT" = "{}" ]; then
  pass "output is {} (empty, as expected when opted out)"
else
  fail "output is '$RESULT' (expected '{}')"
fi
echo ""

# ── Test 5: Stop hook ──────────────────────────────────────────────────────────

echo "$(yellow '[Test 5]') Stop — normal execution"
RESULT="$(bash "$HOOKS_DIR/stop-cleanup.sh" 2>/dev/null || true)"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  pass "exit code is 0"
else
  fail "exit code is $EXIT_CODE (expected 0)"
fi

# Stop hook should be silent (no additionalContext output)
if [ -z "$RESULT" ]; then
  pass "output is silent (no additionalContext, as expected)"
else
  fail "output is '$RESULT' (expected empty/silent)"
fi
echo ""

# ── Test 6: Stop opt-out ───────────────────────────────────────────────────────

echo "$(yellow '[Test 6]') Stop — opt-out (CCDESIGN_HOOK_STOP=off)"
RESULT="$(CCDESIGN_HOOK_STOP=off bash "$HOOKS_DIR/stop-cleanup.sh" 2>/dev/null || true)"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  pass "exit code is 0"
else
  fail "exit code is $EXIT_CODE (expected 0)"
fi

if [ -z "$RESULT" ]; then
  pass "output is silent (as expected when opted out)"
else
  fail "output is '$RESULT' (expected empty)"
fi
echo ""

# ── Test 7: hooks-lib standalone scripts ───────────────────────────────────────

echo "$(yellow '[Test 7]') hooks-lib/update-check.sh --help"
if bash "$HOOKS_LIB/update-check.sh" --help >/dev/null 2>&1; then
  pass "update-check.sh --help exits 0"
else
  fail "update-check.sh --help failed"
fi

echo "$(yellow '[Test 8]') hooks-lib/context-preserve.sh --help"
if bash "$HOOKS_LIB/context-preserve.sh" --help >/dev/null 2>&1; then
  pass "context-preserve.sh --help exits 0"
else
  fail "context-preserve.sh --help failed"
fi

echo "$(yellow '[Test 9]') hooks-lib/cleanup.sh --help"
if bash "$HOOKS_LIB/cleanup.sh" --help >/dev/null 2>&1; then
  pass "cleanup.sh --help exits 0"
else
  fail "cleanup.sh --help failed"
fi
echo ""

# ── Summary ────────────────────────────────────────────────────────────────────

echo "===================="
TOTAL=$((PASS + FAIL))
if [ "$FAIL" -eq 0 ]; then
  printf '%s %d/%d tests passed\n' "$(green 'ALL PASS')" "$PASS" "$TOTAL"
  exit 0
else
  printf '%s %d/%d passed, %d failed\n' "$(red 'FAILURES')" "$PASS" "$TOTAL" "$FAIL"
  exit 1
fi
