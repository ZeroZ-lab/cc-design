#!/usr/bin/env node
/**
 * super_inline_html.js — Bundle HTML + all linked assets into a single self-contained file
 *
 * Inlines: <link> CSS, <script src> JS, <img src> as data URLs
 *
 * Usage:
 *   node super_inline_html.js --input page.html --output page-inline.html
 */

const fs = require('fs');
const path = require('path');

function parseArgs(args) {
  const opts = { input: '', output: '' };
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) opts.input = args[++i];
    else if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
  }
  return opts;
}

function fileToDataUrl(filePath, mimeType) {
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

function getMimeType(ext) {
  const types = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
    '.ico': 'image/x-icon', '.css': 'text/css', '.js': 'text/javascript',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  };
  return types[ext.toLowerCase()] || 'application/octet-stream';
}

function inlineHtml(html, baseDir) {
  let result = html;

  // Inline <link rel="stylesheet" href="...">
  result = result.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi, (match, href) => {
    if (href.startsWith('http') || href.startsWith('data:')) return match;
    const filePath = path.resolve(baseDir, href);
    if (!fs.existsSync(filePath)) return match;
    const css = fs.readFileSync(filePath, 'utf-8');
    return `<style>\n${css}\n</style>`;
  });

  // Inline <script src="...">
  result = result.replace(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi, (match, href) => {
    if (href.startsWith('http') || href.startsWith('data:')) return match;
    // Skip external CDN scripts
    if (href.includes('unpkg.com') || href.includes('cdn.')) return match;
    const filePath = path.resolve(baseDir, href);
    if (!fs.existsSync(filePath)) return match;
    const js = fs.readFileSync(filePath, 'utf-8');
    return `<script>\n${js}\n</script>`;
  });

  // Inline <img src="...">
  result = result.replace(/<img\s+[^>]*src=["']([^"']+)["']/gi, (match, src) => {
    if (src.startsWith('http') || src.startsWith('data:')) return match;
    const filePath = path.resolve(baseDir, src);
    if (!fs.existsSync(filePath)) return match;
    const ext = path.extname(filePath);
    const dataUrl = fileToDataUrl(filePath, getMimeType(ext));
    return match.replace(src, dataUrl);
  });

  // Inline url() in style attributes and <style> blocks
  result = result.replace(/url\(["']?([^"')]+)["']?\)/gi, (match, urlPath) => {
    if (urlPath.startsWith('http') || urlPath.startsWith('data:')) return match;
    const filePath = path.resolve(baseDir, urlPath);
    if (!fs.existsSync(filePath)) return match;
    const ext = path.extname(filePath);
    const dataUrl = fileToDataUrl(filePath, getMimeType(ext));
    return `url("${dataUrl}")`;
  });

  return result;
}

function main() {
  const opts = parseArgs(process.argv);
  if (!opts.input) {
    console.error('Usage: node super_inline_html.js --input page.html --output page-inline.html');
    process.exit(1);
  }

  const inputPath = path.resolve(opts.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(inputPath, 'utf-8');
  const baseDir = path.dirname(inputPath);
  const inlined = inlineHtml(html, baseDir);

  if (opts.output) {
    const outputPath = path.resolve(opts.output);
    fs.writeFileSync(outputPath, inlined, 'utf-8');
    console.log(`Inlined HTML saved to: ${outputPath}`);
  } else {
    process.stdout.write(inlined);
  }
}

main();
