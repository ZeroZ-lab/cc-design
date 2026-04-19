#!/usr/bin/env node
/**
 * gen_pptx.js — Export HTML slide deck to PPTX
 *
 * Modes:
 *   --mode editable    → Parse HTML for text/shapes, create native PPTX elements
 *   --mode screenshots → Headless browser screenshots per slide, embed as images
 *
 * Usage:
 *   node gen_pptx.js --input slides.html --output deck.pptx
 *   node gen_pptx.js --input slides.html --output deck.pptx --mode screenshots
 */

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

function parseArgs(args) {
  const opts = { input: '', output: 'output.pptx', mode: 'editable' };
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) opts.input = args[++i];
    else if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
    else if (args[i] === '--mode' && args[i + 1]) opts.mode = args[++i];
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv);

  if (!opts.input) {
    console.error('Usage: node gen_pptx.js --input slides.html --output deck.pptx [--mode editable|screenshots]');
    process.exit(1);
  }

  const inputPath = path.resolve(opts.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)

  const html = fs.readFileSync(inputPath, 'utf-8');

  // Extract slides from <section> elements
  const slideRegex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
  const slides = [];
  let match;
  while ((match = slideRegex.exec(html)) !== null) {
    slides.push(match[1]);
  }

  if (slides.length === 0) {
    console.error('No <section> elements found in HTML. Make sure slides are wrapped in <section> tags.');
    process.exit(1);
  }

  if (opts.mode === 'screenshots') {
    await exportScreenshots(pptx, slides, inputPath, html);
  } else {
    exportEditable(pptx, slides);
  }

  const outputPath = path.resolve(opts.output);
  await pptx.writeFile({ fileName: outputPath });
  console.log(`PPTX saved to: ${outputPath}`);
}

function exportEditable(pptx, slides) {
  for (const slideHtml of slides) {
    const slide = pptx.addSlide();

    // Extract text content
    const textRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    const bodyTextRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    const bgRegex = /background(?:-color)?:\s*([^;]+)/i;

    // Try to extract background
    const bgMatch = slideHtml.match(bgRegex);
    if (bgMatch) {
      const bgColor = bgMatch[1].trim();
      slide.background = { color: bgColor.replace('#', '') };
    }

    // Extract headings
    let y = 0.5;
    let hMatch;
    const textRegex2 = /<h(\d)[^>]*>([\s\S]*?)<\/h\1>/gi;
    while ((hMatch = textRegex2.exec(slideHtml)) !== null) {
      const level = parseInt(hMatch[1]);
      const text = hMatch[2].replace(/<[^>]*>/g, '').trim();
      if (!text) continue;

      const fontSize = Math.max(18, 44 - (level - 1) * 6);
      slide.addText(text, {
        x: 0.5, y, w: '90%', h: 1,
        fontSize, bold: level <= 2,
        color: '333333',
        fontFace: 'system-ui',
      });
      y += 0.8;
    }

    // Extract paragraphs
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(slideHtml)) !== null) {
      const text = pMatch[1].replace(/<[^>]*>/g, '').trim();
      if (!text) continue;

      slide.addText(text, {
        x: 0.5, y, w: '90%', h: 0.6,
        fontSize: 18, color: '555555',
        fontFace: 'system-ui',
      });
      y += 0.5;
    }
  }
}

async function exportScreenshots(pptx, slides, inputPath, html) {
  // Check if playwright is available
  let chromium;
  try {
    const { chromium: pw } = require('playwright');
    chromium = pw;
  } catch {
    console.error('Screenshots mode requires Playwright. Install with: npm install playwright && npx playwright install chromium');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`file://${inputPath}`);

  // Get all section elements
  const sections = await page.$$eval('section', (els) => els.length);
  if (sections === 0) {
    console.error('No <section> elements found.');
    await browser.close();
    process.exit(1);
  }

  // Navigate through slides and screenshot each
  for (let i = 0; i < sections; i++) {
    await page.evaluate((idx) => {
      const secs = document.querySelectorAll('section');
      secs.forEach((s, j) => s.style.display = j === idx ? '' : 'none');
    }, i);

    await page.waitForTimeout(200);
    const screenshot = await page.screenshot({ type: 'png' });

    const slide = pptx.addSlide();
    slide.addImage({ data: `image/png;base64,${screenshot.toString('base64')}`, x: 0, y: 0, w: '100%', h: '100%' });
  }

  await browser.close();
}

main().catch(console.error);
