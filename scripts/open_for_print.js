#!/usr/bin/env node
/**
 * open_for_print.js — Render HTML and export as PDF via Playwright
 *
 * Usage:
 *   node open_for_print.js --input page.html --output page.pdf
 */

const fs = require('fs');
const path = require('path');

function parseArgs(args) {
  const opts = { input: '', output: 'output.pdf' };
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) opts.input = args[++i];
    else if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!opts.input) {
    console.error('Usage: node open_for_print.js --input page.html --output page.pdf');
    process.exit(1);
  }

  const inputPath = path.resolve(opts.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  let chromium;
  try {
    const { chromium: pw } = require('playwright');
    chromium = pw;
  } catch {
    console.error('PDF export requires Playwright. Install with: npm install playwright && npx playwright install chromium');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle' });

  // Check if it's a slide deck — if so, show all slides for printing
  const isDeck = await page.evaluate(() => {
    const stage = document.querySelector('deck-stage');
    if (stage) {
      stage.querySelectorAll('section').forEach(s => {
        s.style.display = '';
        s.style.pageBreakAfter = 'always';
      });
      return true;
    }
    return false;
  });

  const outputPath = path.resolve(opts.output);

  await page.pdf({
    path: outputPath,
    format: isDeck ? undefined : 'A4',
    width: isDeck ? '1920px' : undefined,
    height: isDeck ? '1080px' : undefined,
    printBackground: true,
    margin: isDeck ? { top: 0, right: 0, bottom: 0, left: 0 } : undefined,
  });

  await browser.close();
  console.log(`PDF saved to: ${outputPath}`);
}

main().catch(console.error);
