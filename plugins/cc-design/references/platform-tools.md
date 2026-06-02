# Platform Tool Reference

> **Load when:** Needing to export output (PPTX/PDF/inline HTML), confirming exact Playwright MCP tool names, or verifying the preview workflow
> **Skip when:** Only building and previewing designs — no export needed
> **Why it matters:** Tool names are non-obvious and export scripts require specific setup; wrong tool names break the verification flow
> **Typical failure it prevents:** Using wrong Playwright tool names, missing `npm install` for export scripts, failing to verify console errors

## Tool Mapping

Claude Code is the primary target and uses Playwright MCP directly. Codex-style hosts may expose differently named tools for the same jobs.

| Need | Claude Code Path | Codex-Style Equivalent |
|---|---|---|
| Copy a starter scaffold | `Bash` + `cp` from `templates/` | Host scaffold-copy tool if provided, otherwise file read/write or shell copy |
| Open preview | Playwright navigate to `file://...` | Host HTML preview/open tool |
| Check console output | Playwright console messages | Host preview log tool |
| Capture screenshots | Playwright screenshot | Host screenshot tool |
| Export PPTX / PDF / self-contained HTML | Local scripts in `scripts/` | Equivalent built-in export tools, or the local scripts |

## Preview & Screenshots (Playwright MCP)

| Need | Tool | Notes |
|---|---|---|
| Open HTML for preview | `mcp__playwright__browser_navigate` | Use `file:///absolute/path/to/file.html` |
| Take screenshot | `mcp__playwright__browser_take_screenshot` | PNG or JPEG. Supports full-page and element-level. |
| Check console errors | `mcp__playwright__browser_console_messages` | Returns log/warn/error/debug messages |
| Execute JS in page | `mcp__playwright__browser_evaluate` | Run JS in the live page and get results |
| Get page snapshot | `mcp__playwright__browser_snapshot` | Accessibility tree — better than screenshot for understanding structure |
| Run multi-step browser code | `mcp__playwright__browser_run_code` | Complex automation sequences |
| Click element | `mcp__playwright__browser_click` | Click by element reference from snapshot |
| Type text | `mcp__playwright__browser_type` | Type into input fields |
| Press key | `mcp__playwright__browser_press_key` | Keyboard shortcuts, Enter, Tab, etc. |
| Wait for content | `mcp__playwright__browser_wait_for` | Wait for text to appear/disappear |
| Manage tabs | `mcp__playwright__browser_tabs` | List, create, close, select tabs |
| Open in system browser | `Bash` | macOS: `open <file>`, Linux: `xdg-open <file>` |

### Typical verification flow

```
1. browser_navigate → file:///path/to/design.html
2. browser_console_messages → check for errors
3. browser_take_screenshot → visually verify
4. Fix any issues, repeat
```

## Export Scripts

Scripts live in the skill's `scripts/` directory. First run requires `npm install`:

```bash
cd scripts && npm install && cd ..
```

For Playwright-backed export flows, also install the browser binary:

```bash
npx playwright install chromium
```

### PPTX export

```bash
node scripts/gen_pptx.js --input slides.html --output deck.pptx --mode screenshots
# --mode editable   → native text & shapes
# --mode screenshots → flat images, pixel-perfect (requires Playwright)
```

### Inline HTML

```bash
node scripts/super_inline_html.js --input page.html --output page-inline.html
# Bundles HTML + all linked CSS/JS/images into a single self-contained file
```

### Print to PDF

```bash
node scripts/open_for_print.js --input page.html --output page.pdf
# Uses Playwright to render and export as PDF
```