/**
 * parse_args.js — Shared CLI argument parser for export scripts.
 *
 * Usage:
 *   const parseArgs = require('./lib/parse_args');
 *   const opts = parseArgs(process.argv, {
 *     input: '', output: 'output.pptx', mode: 'editable'
 *   });
 */

function parseArgs(args, defaults = {}) {
  const opts = { ...defaults };
  for (let i = 2; i < args.length; i++) {
    if (args[i].startsWith('--') && args[i + 1]) {
      const key = args[i].replace(/^--/, '');
      opts[key] = args[++i];
    }
  }
  return opts;
}

module.exports = parseArgs;