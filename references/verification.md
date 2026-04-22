# Verification: Output Verification Workflow

Some design-agent native environments (like Claude.ai Artifacts) have a built-in `fork_verifier_agent` that spins up a subagent to screenshot-check via iframe. Most agent environments (Claude Code / Codex / Cursor / Trae / etc.) don't have this built-in capability — using Playwright manually covers the same verification scenarios.

## Verification Checklist

Run through this checklist after every HTML output:

**Critical rule:** verification is the maker's job. After the final edit, you must inspect the rendered result yourself. Do not declare completion from code inspection alone.

### 1. Browser Rendering Check (Required)

The most basic check: **can the HTML open?** On macOS:

```bash
open -a "Google Chrome" "/path/to/your/design.html"
```

Or use Playwright screenshots (next section).

### 2. Console Error Check

The most common issue in HTML files is JS errors causing white screens. Run Playwright:

```bash
python ~/.claude/skills/cc-design/scripts/verify.py path/to/design.html
```

This script will:
1. Open HTML in headless Chromium
2. Save a screenshot to the project directory
3. Capture console errors
4. Report status

See `scripts/verify.py` for details.

### 3. Changed-Region Check

For edits to an existing page, the most common failure mode is only checking the hero or first viewport.

After your final edit:
- Capture one full-page screenshot
- Capture targeted screenshots for every section/component you changed
- Review those screenshots yourself before delivery

### 4. Multi-Viewport Check

For responsive designs, capture multiple viewports:

```bash
python verify.py design.html --viewports 1920x1080,1440x900,768x1024,375x667
```

### 5. Interaction Check

Tweaks, animations, button toggles — static screenshots can't capture these. **Recommend users open the browser and click through themselves**, or use Playwright screen recording:

```python
page.video.record('interaction.mp4')
```

### 6. Slide-by-Slide Check

For deck-type HTML, capture each slide:

```bash
python verify.py deck.html --slides 10  # Capture first 10 slides
```

Generates `deck-slide-01.png`, `deck-slide-02.png`... for quick review.

## Playwright Setup

First-time setup:

```bash
# If not yet installed
npm install -g playwright
npx playwright install chromium

# Or Python version
pip install playwright
playwright install chromium
```

If the user already has Playwright installed globally, use it directly.

## Screenshot Best Practices

### Full Page Screenshot

```python
page.screenshot(path='full.png', full_page=True)
```

### Viewport Screenshot

```python
page.screenshot(path='viewport.png')  # Default: only visible area
```

### Specific Element Screenshot

```python
element = page.query_selector('.hero-section')
element.screenshot(path='hero.png')
```

Use this for **changed section verification** on long pages. If you edited `#pricing`, `#prompts`, or a footer block, capture that specific region instead of assuming the full-page screenshot is enough.

### High-DPI Screenshot

```python
page = browser.new_page(device_scale_factor=2)  # retina
```

### Wait for Animation to Settle

```python
page.wait_for_timeout(2000)  # Wait 2s for animation to settle
page.screenshot(...)
```

## Sharing Screenshots with Users

### Local Screenshots

```bash
open screenshot.png
```

Users will view in their Preview/Figma/VSCode/browser.

### Upload for Sharing

If remote collaborators need to see (e.g., Slack/WeChat), let users upload with their own image hosting tools or MCP.

## Troubleshooting Verification Errors

### White Screen

Console will always have errors. Check first:

1. Are the React+Babel script tag integrity hashes correct? (see `react-setup.md`)
2. Is there a `const styles = {...}` naming conflict?
3. Are cross-file components exported to `window`?
4. JSX syntax errors (babel.min.js doesn't report errors — use non-minified babel.js)

### Animation Stuttering

- Record with Chrome DevTools Performance tab
- Look for layout thrashing (frequent reflows)
- Animate `transform` and `opacity` preferentially (GPU-accelerated)

### Wrong Fonts

- Check `@font-face` URL accessibility
- Check fallback fonts
- CJK fonts load slowly: show fallback first, switch when loaded

### Layout Misalignment

- Check `box-sizing: border-box` is applied globally
- Check `* { margin: 0; padding: 0 }` reset
- Open gridlines in Chrome DevTools to see actual layout

## Verification = The Designer's Second Pair of Eyes

**Always review yourself.** AI-generated code frequently has issues like:

- Looks correct but has interaction bugs
- Static screenshot looks good but scroll breaks layout
- Hero looks good but a later section is broken
- Looks great on wide screens but collapses on narrow
- Forgot to test dark mode
- Some components don't respond to Tweaks changes

**One minute of verification saves one hour of rework.**

## Common Verification Script Commands

```bash
# Basic: open + screenshot + capture errors
python verify.py design.html

# Multi-viewport
python verify.py design.html --viewports 1920x1080,375x667

# Multi-slide
python verify.py deck.html --slides 10

# Output to specific directory
python verify.py design.html --output ./screenshots/

# headless=false, open real browser for you to see
python verify.py design.html --show
```
