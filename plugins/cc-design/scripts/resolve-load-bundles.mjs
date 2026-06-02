import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const rootDir = path.resolve(scriptDir, "..");
const manifestPath = path.join(rootDir, "load-manifest.json");

function printHelp() {
  console.log(`Usage:
  node scripts/resolve-load-bundles.mjs --prompt "<user request>" [options]

Options:
  --prompt <text>                Prompt text used for auto-detection
  --task-type <name>            Force-include a task type from load-manifest.json
  --checkpoint <name>           Force-include a checkpoint from load-manifest.json
  --optional <name>             Force-include an optional inspiration bundle
  --format <json|lines>         Output JSON (default) or Load: lines
  --help                        Show this help
`);
}

function parseArgs(argv) {
  const options = {
    prompt: "",
    taskTypes: [],
    checkpoints: [],
    optionalInspirations: [],
    format: "json",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help") {
      printHelp();
      process.exit(0);
    }

    const value = argv[index + 1];
    if (!arg.startsWith("--")) {
      throw new Error(`Unknown positional argument: ${arg}`);
    }

    switch (arg) {
      case "--prompt":
        options.prompt = value ?? "";
        index += 1;
        break;
      case "--task-type":
        if (!value) {
          throw new Error("--task-type requires a value");
        }
        options.taskTypes.push(value);
        index += 1;
        break;
      case "--checkpoint":
        if (!value) {
          throw new Error("--checkpoint requires a value");
        }
        options.checkpoints.push(value);
        index += 1;
        break;
      case "--optional":
        if (!value) {
          throw new Error("--optional requires a value");
        }
        options.optionalInspirations.push(value);
        index += 1;
        break;
      case "--format":
        if (!value || !["json", "lines"].includes(value)) {
          throw new Error("--format must be one of: json, lines");
        }
        options.format = value;
        index += 1;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesDetect(detect, promptText, rawPrompt) {
  if (!detect) {
    return false;
  }

  if (
    Array.isArray(detect.anyKeywords) &&
    detect.anyKeywords.some((keyword) => promptText.includes(normalize(keyword)))
  ) {
    return true;
  }

  if (
    Array.isArray(detect.allKeywords) &&
    detect.allKeywords.length > 0 &&
    detect.allKeywords.every((keyword) => promptText.includes(normalize(keyword)))
  ) {
    return true;
  }

  if (
    Array.isArray(detect.regexAny) &&
    detect.regexAny.some((pattern) => new RegExp(pattern, "i").test(rawPrompt))
  ) {
    return true;
  }

  if (
    Array.isArray(detect.regexAll) &&
    detect.regexAll.length > 0 &&
    detect.regexAll.every((pattern) => new RegExp(pattern, "i").test(rawPrompt))
  ) {
    return true;
  }

  return false;
}

function ensureKnown(name, group, source) {
  if (!(name in source)) {
    throw new Error(`Unknown ${group}: ${name}`);
  }
}

function buildBundle(because, config) {
  return {
    because,
    references: [...new Set(config.references ?? [])],
    templates: [...new Set(config.templates ?? [])],
    scripts: [...new Set(config.scripts ?? [])],
  };
}

const options = parseArgs(process.argv.slice(2));
const rawPrompt = options.prompt ?? "";
const promptText = normalize(rawPrompt);
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

const selectedTaskTypes = new Set(options.taskTypes);
for (const name of selectedTaskTypes) {
  ensureKnown(name, "task type", manifest.taskTypes ?? {});
}

const selectedCheckpoints = new Set(options.checkpoints);
for (const name of selectedCheckpoints) {
  ensureKnown(name, "checkpoint", manifest.checkpoints ?? {});
}

const selectedOptionalInspirations = new Set(options.optionalInspirations);
for (const name of selectedOptionalInspirations) {
  ensureKnown(name, "optional inspiration", manifest.optionalInspirations ?? {});
}

for (const [name, config] of Object.entries(manifest.taskTypes ?? {})) {
  if (matchesDetect(config.detect, promptText, rawPrompt)) {
    selectedTaskTypes.add(name);
  }
}

for (const [name, config] of Object.entries(manifest.checkpoints ?? {})) {
  if (matchesDetect(config.detect, promptText, rawPrompt)) {
    selectedCheckpoints.add(name);
  }
}

for (const [name, config] of Object.entries(manifest.optionalInspirations ?? {})) {
  if (matchesDetect(config.detect, promptText, rawPrompt)) {
    selectedOptionalInspirations.add(name);
  }
}

const bundles = [];
for (const [name, config] of Object.entries(manifest.defaults ?? {})) {
  bundles.push(buildBundle(name, config));
}

for (const name of [...selectedTaskTypes].sort()) {
  bundles.push(buildBundle(name, manifest.taskTypes[name]));
}

for (const name of [...selectedCheckpoints].sort()) {
  bundles.push(buildBundle(name, manifest.checkpoints[name]));
}

for (const name of [...selectedOptionalInspirations].sort()) {
  bundles.push(buildBundle(name, manifest.optionalInspirations[name]));
}

if (options.format === "lines") {
  for (const bundle of bundles) {
    const loaded = [...bundle.references, ...bundle.templates, ...bundle.scripts];
    console.log(`Load: because=${bundle.because} loaded=${loaded.join(",")}`);
  }
  process.exit(0);
}

console.log(
  JSON.stringify(
    {
      prompt: rawPrompt,
      defaults: Object.keys(manifest.defaults ?? {}),
      taskTypes: [...selectedTaskTypes].sort(),
      checkpoints: [...selectedCheckpoints].sort(),
      optionalInspirations: [...selectedOptionalInspirations].sort(),
      bundles,
    },
    null,
    2
  )
);
