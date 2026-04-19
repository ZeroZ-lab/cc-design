# Platform Tool Reference (Claude Code)

This reference documents the tools available in the Claude Code environment for design work.

## File Operations

| Need | Tool | Notes |
|---|---|---|
| Read file | `Read` | Up to 2000 lines; use offset/limit to paginate. Supports images, PDFs, HTML. |
| Write file | `Write` | Creates or overwrites. For edits to existing files, prefer `Edit`. |
| Edit file | `Edit` | Replaces unique strings. Always prefer over `Write` for modifications. |
| List files | `Glob` | Pattern matching (e.g., `**/*.html`, `templates/*.js`) |
| Find in files | `Grep` | Regex search across files. Supports glob filters. |
| Copy files | `Bash` | `cp <src> <dst>` for files, `cp -r <src> <dst>` for directories |
| Delete files | `Bash` | `rm <file>` for files, `rm -rf <dir>` for directories |
| Move/rename | `Bash` | `mv <src> <dst>` |
| Run commands | `Bash` | Shell commands, Node.js scripts, npm, etc. |

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

## Starter Components

Templates live in the skill's `templates/` directory. Copy to your project:

```bash
# Copy a single template
cp templates/deck_stage.js ./deck_stage.js

# Or read and write for customization
# Read templates/deck_stage.js, then Write to your project with modifications
```

See `references/starter-components.md` for the full catalog.

## Export Scripts

Scripts live in the skill's `scripts/` directory. First run requires `npm install`:

```bash
cd scripts && npm install && cd ..
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

## Image Operations

| Need | Tool | Notes |
|---|---|---|
| View image | `Read` | Supports PNG, JPG, JPEG natively |
| Image metadata | `Bash` | `file <path>` for type/dims; `sips -g all <path>` on macOS |
