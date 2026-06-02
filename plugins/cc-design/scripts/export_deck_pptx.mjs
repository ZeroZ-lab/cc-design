#!/usr/bin/env node
/**
 * export_deck_pptx.mjs — Export multi-file slide deck to PPTX
 *
 * Two modes:
 *   --mode image     Image-based, 100% visual fidelity, text NOT editable
 *   --mode editable  Native text boxes, text editable, requires HTML following 4 hard constraints (see references/editable-pptx.md)
 *
 * Usage:
 *   # Image mode (default)
 *   node export_deck_pptx.mjs --slides <dir> --out <file.pptx>
 *   # Editable mode
 *   node export_deck_pptx.mjs --slides <dir> --out <file.pptx> --mode editable
 *
 * --mode image features:
 *   - Each slide screenshot as PNG, fills one PPTX page
 *   - 100% visual fidelity (it's an image)
 *   - Text not editable
 *   - HTML can be anything, no format requirements
 *
 * --mode editable features:
 *   - Calls scripts/html2pptx.js to translate HTML DOM elements into PowerPoint objects
 *   - Text is real text boxes, double-click to edit in PowerPoint
 *   - HTML must follow 4 hard constraints (see references/editable-pptx.md):
 *     1. Text wrapped in <p>/<h1>-<h6> (no bare text in divs)
 *     2. No CSS gradients
 *     3. <p>/<h*> cannot have background/border/shadow (put on outer div)
 *     4. No background-image on divs (use <img>)
 *   - Body dimensions default 960pt × 540pt (LAYOUT_WIDE, 13.333" × 7.5")
 *   - Visually-driven HTML almost never passes — must follow constraints from the first line
 *
 * Dependencies:
 *   --mode image:    npm install playwright pptxgenjs
 *   --mode editable: npm install playwright pptxgenjs sharp
 *
 * Files sorted by filename (01-xxx.html → 02-xxx.html → ...).
 */

import { chromium } from 'playwright';
import pptxgen from 'pptxgenjs';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = { width: 1920, height: 1080, mode: 'image' };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.slides || !args.out) {
    console.error('Usage: node export_deck_pptx.mjs --slides <dir> --out <file.pptx> [--mode image|editable] [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  if (!['image', 'editable'].includes(args.mode)) {
    console.error(`Unknown --mode: ${args.mode}. Supported: image, editable`);
    process.exit(1);
  }
  return args;
}

async function exportImage({ slidesDir, outFile, files, width, height }) {
  console.log(`[image mode] Rendering ${files.length} slides as PNG...`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'deck-pptx-'));
  const pngs = [];
  for (const f of files) {
    const url = 'file://' + path.join(slidesDir, f);
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
    await page.waitForTimeout(1200);
    const out = path.join(tmpDir, f.replace(/\.html$/, '.png'));
    await page.screenshot({ path: out, fullPage: false });
    pngs.push(out);
    console.log(`  [${pngs.length}/${files.length}] ${f}`);
  }
  await browser.close();

  const pres = new pptxgen();
  pres.defineLayout({ name: 'DECK', width: width / 96, height: height / 96 });
  pres.layout = 'DECK';
  for (const png of pngs) {
    const s = pres.addSlide();
    s.addImage({ path: png, x: 0, y: 0, w: pres.width, h: pres.height });
  }
  await pres.writeFile({ fileName: outFile });

  for (const p of pngs) await fs.unlink(p).catch(() => {});
  await fs.rmdir(tmpDir).catch(() => {});

  console.log(`\n✓ Wrote ${outFile}  (${files.length} slides, image mode, text not editable)`);
}

async function exportEditable({ slidesDir, outFile, files }) {
  console.log(`[editable mode] Converting ${files.length} slides via html2pptx...`);

  // Dynamic require html2pptx.js (CommonJS module)
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  let html2pptx;
  try {
    html2pptx = require(path.join(__dirname, 'html2pptx.js'));
  } catch (e) {
    console.error(`✗ Failed to load html2pptx.js: ${e.message}`);
    console.error(`  This module depends on sharp — run npm install sharp and retry.`);
    process.exit(1);
  }

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, corresponding to HTML body 960 × 540 pt

  const errors = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const fullPath = path.join(slidesDir, f);
    try {
      await html2pptx(fullPath, pres);
      console.log(`  [${i + 1}/${files.length}] ${f} ✓`);
    } catch (e) {
      console.error(`  [${i + 1}/${files.length}] ${f} ✗  ${e.message}`);
      errors.push({ file: f, error: e.message });
    }
  }

  if (errors.length) {
    console.error(`\n⚠️ ${errors.length} slides failed conversion. Common cause: HTML doesn't follow the 4 hard constraints.`);
    console.error(`  See references/editable-pptx.md "Common Errors Quick Reference".`);
    if (errors.length === files.length) {
      console.error(`✗ All failed, no PPTX generated.`);
      process.exit(1);
    }
  }

  await pres.writeFile({ fileName: outFile });
  console.log(`\n✓ Wrote ${outFile}  (${files.length - errors.length}/${files.length} slides, editable mode, text directly editable in PowerPoint)`);
}

async function main() {
  const { slides, out, width, height, mode } = parseArgs();
  const slidesDir = path.resolve(slides);
  const outFile = path.resolve(out);

  const files = (await fs.readdir(slidesDir))
    .filter(f => f.endsWith('.html'))
    .sort();
  if (!files.length) {
    console.error(`No .html files found in ${slidesDir}`);
    process.exit(1);
  }

  if (mode === 'image') {
    await exportImage({ slidesDir, outFile, files, width, height });
  } else {
    await exportEditable({ slidesDir, outFile, files });
  }
}

main().catch(e => { console.error(e); process.exit(1); });
