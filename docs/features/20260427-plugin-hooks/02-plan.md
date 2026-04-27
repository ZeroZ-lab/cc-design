# Plan: cc-design Plugin Architecture + Hooks (v0.5.0)

**Version:** 0.5.0
**Feature:** 20260427-plugin-hooks
**Status:** final (post-review + Codex discovery revision)

## Review Summary

4-role review completed + Codex hooks discovery. Key changes from draft:

- **Scope**: 4 hooks → 3 hooks (PostToolUse Write deferred; PreCompact added back with complete consumption chain)
- **Codex compatibility**: Codex v0.125+ supports hooks — same `hooks/hooks.json` schema, same `CLAUDE_PLUGIN_ROOT`. No "asymmetric design" needed.
- **lib/ → hooks-lib/**: renamed to avoid collision with existing `scripts/lib/`
- **bin/ccdesign-update-check → deleted**: replaced by `hooks-lib/update-check.sh`
- **PreCompact consumption chain**: SessionStart re-injects `.claude/design-context.json` after compression (closing the loop flagged in review)
- **Security hardening**: input validation, CLAUDE_PLUGIN_ROOT verification, no `set -e`, opt-out env vars, logging
- **Cross-platform output**: session-start.sh detects platform and outputs correct JSON format (following superpowers pattern)

## Task Breakdown

### T1: Create .claude-plugin/ structure
**Priority:** P0 | **Complexity:** S | **Depends:** none | **Parallel-safe:** yes

**Acceptance:**
- [ ] `plugin.json` has valid JSON with name, description, version (0.5.0), author, compatibility
- [ ] `compatibility.claude-code` specified (e.g., `>=1.0.0`)
- [ ] `compatibility.codex` specified (e.g., `>=0.125.0`)

**Files:** `.claude-plugin/plugin.json`

---

### T2: Create hooks-lib/ shared scripts
**Priority:** P0 | **Complexity:** M | **Depends:** none | **Parallel-safe:** yes

**Subtasks:**
- **T2a:** `hooks-lib/update-check.sh` — Replace `bin/ccdesign-update-check`; add `CLAUDE_PLUGIN_ROOT` env var support; validate remote VERSION ≤32 chars; warn on `CCDESIGN_REMOTE_URL` override
- **T2b:** `hooks-lib/context-preserve.sh` — Scan project-dir HTML files; extract CSS custom properties, colors, fonts; record active file paths (within project only, reject `..`); save to `.claude/design-context.json` (overwrite, not append, max 2KB, permissions 0600); include recovery instruction
- **T2c:** `hooks-lib/cleanup.sh` — Remove `.playwright-mcp/console-*.log` files older than 7 days; only within `$CLAUDE_PROJECT_DIR`; resolve symlinks; skip unknown file types; skip if `CLAUDE_PROJECT_DIR` unset

**Acceptance:**
- [ ] Each script is standalone (`set -euo pipefail` allowed for hooks-lib since hooks catch errors)
- [ ] Each script has `--help` flag
- [ ] Scripts work with both absolute and relative paths
- [ ] `update-check.sh` completes in under 5 seconds (preserves existing caching logic)
- [ ] `context-preserve.sh` only extracts content from HTML files within `$CLAUDE_PROJECT_DIR`; rejects `..` in paths
- [ ] `context-preserve.sh` creates `.claude/design-context.json` with 0600 permissions
- [ ] `context-preserve.sh` output max 2KB; priority: recent files > older files
- [ ] `cleanup.sh` only deletes `console-*.log` pattern, never other files
- [ ] `cleanup.sh` resolves symlinks and refuses to delete targets outside project dir
- [ ] `cleanup.sh` skips entirely if `CLAUDE_PROJECT_DIR` unset

**Files:** `hooks-lib/update-check.sh`, `hooks-lib/context-preserve.sh`, `hooks-lib/cleanup.sh`

---

### T3: Create hooks/ registration + hook scripts
**Priority:** P0 | **Complexity:** M | **Depends:** T1, T2 | **Parallel-safe:** no

**Subtasks:**
- **T3a:** `hooks/hooks.json` — Register 3 hooks: SessionStart (matcher `"startup|clear|compact"`), PreCompact (no matcher), Stop (no matcher)
- **T3b:** `hooks/session-start.sh` — Call `hooks-lib/update-check.sh`; check `.claude/design-context.json` for preserved context (re-inject if exists); inject compressed Iron Law; output via platform-adapted `additionalContext`; max 2KB total; priority order: preserved context > update check > Iron Law
- **T3c:** `hooks/pre-compact-preserve.sh` — Call `hooks-lib/context-preserve.sh`; output preserved context via `additionalContext`; include recovery instruction
- **T3d:** `hooks/stop-cleanup.sh` — Call `hooks-lib/cleanup.sh`; silent output

**Acceptance:**
- [ ] `hooks.json` registers exactly 3 hooks with correct event names and matchers
- [ ] SessionStart outputs correct platform JSON format (Claude Code: `hookSpecificOutput.additionalContext`; Cursor: `additional_context`)
- [ ] `additionalContext` is a valid JSON string with proper escaping (quotes, newlines, HTML tags)
- [ ] `additionalContext` max 2KB; truncated with priority if exceeded
- [ ] SessionStart re-injects `.claude/design-context.json` content if file exists (consumption chain)
- [ ] SessionStart skips Iron Law injection if `CCDESIGN_HOOK_SESSION_START=off`
- [ ] PreCompact skips if `CCDESIGN_HOOK_PRE_COMPACT=off`
- [ ] Stop skips cleanup if `CCDESIGN_HOOK_STOP=off`
- [ ] Each hook validates `CLAUDE_PLUGIN_ROOT` contains `plugin.json`; falls back to `dirname "$0"/..`
- [ ] Each hook uses `set -uo pipefail` (NOT `set -e`), with explicit error catching
- [ ] Each hook checks `python3` availability; outputs `{}` and exits 0 if missing
- [ ] Each hook logs one line to `$CLAUDE_PROJECT_DIR/.claude/hook-log.txt` (timestamp, hook name, action)
- [ ] Stop hook is silent (no `additionalContext` required)

**Files:** `hooks/hooks.json`, `hooks/session-start.sh`, `hooks/pre-compact-preserve.sh`, `hooks/stop-cleanup.sh`

---

### T4: Update SKILL.md + delete bin/ccdesign-update-check
**Priority:** P1 | **Complexity:** S | **Depends:** T2 | **Parallel-safe:** yes

**Subtasks:**
- **T4a:** Remove inline update check bash block (lines 32-46); replace with note that hooks handle this automatically
- **T4b:** Add note: if hooks are unavailable, `hooks-lib/update-check.sh` can be called manually
- **T4c:** Delete `bin/ccdesign-update-check` (replaced by `hooks-lib/update-check.sh`)

**Acceptance:**
- [ ] Inline update check removed
- [ ] SKILL.md notes that update check is now handled by SessionStart hook
- [ ] `bin/ccdesign-update-check` deleted
- [ ] SKILL.md still works as standalone skill (hooks are optional enhancement)

**Files:** `SKILL.md`, `bin/ccdesign-update-check` (deleted)

---

### T5: Update VERSION + README + .gitignore
**Priority:** P0 | **Complexity:** S | **Depends:** T1, T3, T4 | **Parallel-safe:** no

**Subtasks:**
- **T5a:** Bump `VERSION` to `0.5.0`
- **T5b:** Update README: 3-hook architecture, cross-platform support (Claude Code + Codex + Cursor), opt-out env vars
- **T5c:** Add `.claude/hook-log.txt`, `.claude/design-context.json`, `.claude/` to `.gitignore`
- **T5d:** Run `scripts/check-behavior-contract.sh` to verify behavior-contract compliance

**Acceptance:**
- [ ] VERSION is `0.5.0`
- [ ] README documents 3-hook architecture, cross-platform support, opt-out env vars
- [ ] `.gitignore` includes `.claude/hook-log.txt`, `.claude/design-context.json`, `.claude/`
- [ ] `check-behavior-contract.sh` passes (or VERSION bump verified per CLAUDE.md)

**Files:** `VERSION`, `README.md`, `.gitignore`

---

### T6: Hook testing infrastructure
**Priority:** P1 | **Complexity:** S | **Depends:** T2, T3 | **Parallel-safe:** yes

**Subtasks:**
- **T6a:** Create `tests/fixtures/` with mock stdin JSON for SessionStart, PreCompact, Stop
- **T6b:** Create `tests/test-hooks.sh` that pipes fixtures into hook scripts and validates output format + exit code

**Acceptance:**
- [ ] Mock fixtures exist for SessionStart, PreCompact, and Stop hooks
- [ ] `test-hooks.sh` runs all fixtures and reports pass/fail
- [ ] SessionStart fixture produces valid JSON with platform-adapted format
- [ ] PreCompact fixture produces valid JSON with `additionalContext`
- [ ] Stop fixture exits 0 silently
- [ ] `CCDESIGN_HOOK_SESSION_START=off` causes hook to output `{}` and exit 0
- [ ] `.claude/design-context.json` exists after PreCompact fixture run

**Files:** `tests/fixtures/`, `tests/test-hooks.sh`

## Dependency Graph

```
T1 (.claude-plugin/) ──┐
                       ├── T3 (hooks) ──┐
T2 (hooks-lib/) ───────┘                ├── T5 (VERSION + README)
                       │                │
T2 (hooks-lib/) ────── T4 (SKILL.md) ──┘
                                            │
T2 + T3 ─────────────────── T6 (tests) ────┘
```

## Parallelization

- **Phase 1 (parallel):** T1, T2, T6a (fixtures)
- **Phase 2 (sequential, depends on T1+T2):** T3, T4
- **Phase 3 (sequential, depends on all):** T5, T6b (final test run)

## Risks

| Risk | Mitigation |
|---|---|
| python3 unavailable on user machine | Hook outputs `{}`, exits 0 — graceful degradation |
| CLAUDE_PLUGIN_ROOT points to wrong dir | Validate plugin.json presence; fall back to dirname |
| SessionStart blocks startup on slow network | update-check.sh has 60-min cache TTL + 5s curl timeout |
| Iron Law injection duplicates SKILL.md content | Compressed format (1-line per article) + reference path; skip if skill already active |
| Hook script crashes | `set -uo pipefail` (no `-e`), explicit error catching |
| Cleanup deletes active session files | 7-day threshold (not 24h); only console-*.log pattern |
| PreCompact fires multiple times in one session | Overwrite design-context.json (not append); each save reflects current state |
| design-context.json grows stale across sessions | SessionStart checks file age; warns if >24h old |
| Codex hooks format differs from Claude Code | Platform detection via env vars; same hooks.json schema confirmed |

## Deferred to v0.6.0

| Feature | Blocker |
|---|---|
| PostToolUse Write screenshot hook | bash cannot call Playwright MCP; need to decide hint vs CLI path; debounce needed |