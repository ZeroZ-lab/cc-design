import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const rootDir = path.resolve(scriptDir, "..");
const manifestPath = path.join(rootDir, "load-manifest.json");
const skillPath = path.join(rootDir, "SKILL.md");

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const skillText = await fs.readFile(skillPath, "utf8");

function collectPaths(node, acc = new Set()) {
  if (typeof node === "string") {
    if (
      node.startsWith("references/") ||
      node.startsWith("templates/") ||
      node.startsWith("scripts/")
    ) {
      acc.add(node);
    }
    return acc;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectPaths(item, acc);
    }
    return acc;
  }

  if (!node || typeof node !== "object") {
    return acc;
  }

  for (const value of Object.values(node)) {
    collectPaths(value, acc);
  }

  return acc;
}

async function walkFiles(relativeDir) {
  const dir = path.join(rootDir, relativeDir);
  const results = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, absolutePath);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      results.push(relativePath);
    }
  }

  await walk(dir);
  return results.sort();
}

function collectSkillPathReferences(text) {
  const candidates = new Set();
  const backtickPattern = /`([^`]+)`/g;

  for (const match of text.matchAll(backtickPattern)) {
    const value = match[1].trim();
    if (
      !value ||
      value.includes("<") ||
      value.includes(">") ||
      value.includes("://") ||
      value.startsWith("__")
    ) {
      continue;
    }

    if (
      /(^|\/)[A-Za-z0-9._-]+\.(md|jsx|js|css|mjs|sh|yaml|json)$/.test(value)
    ) {
      candidates.add(value);
    }
  }

  return [...candidates].sort();
}

const manifestPaths = collectPaths(manifest);
const referencePaths = (await walkFiles("references")).filter((file) =>
  file.endsWith(".md")
);
const templatePaths = await walkFiles("templates");

const missingPaths = [];
for (const relativePath of manifestPaths) {
  try {
    await fs.access(path.join(rootDir, relativePath));
  } catch {
    missingPaths.push(relativePath);
  }
}

const coveredRuntimePaths = new Set(
  [...manifestPaths].filter(
    (file) => file.startsWith("references/") || file.startsWith("templates/")
  )
);

const skillPathReferences = collectSkillPathReferences(skillText);
const invalidSkillReferences = [];
for (const relativePath of skillPathReferences) {
  try {
    await fs.access(path.join(rootDir, relativePath));
  } catch {
    invalidSkillReferences.push(relativePath);
  }
}

const undocumentedCheckpoints = Object.keys(manifest.checkpoints ?? {}).filter(
  (checkpoint) => !skillText.includes(checkpoint)
);

const missingDescriptions = [];
for (const group of ["taskTypes", "checkpoints", "optionalInspirations"]) {
  for (const [name, config] of Object.entries(manifest[group] ?? {})) {
    if (!config.description) {
      missingDescriptions.push(`${group}.${name}`);
    }
  }
}

const uncoveredReferences = referencePaths.filter(
  (file) => !coveredRuntimePaths.has(file)
);
const uncoveredTemplates = templatePaths.filter(
  (file) => !coveredRuntimePaths.has(file)
);

if (
  missingPaths.length === 0 &&
  uncoveredReferences.length === 0 &&
  uncoveredTemplates.length === 0 &&
  invalidSkillReferences.length === 0 &&
  undocumentedCheckpoints.length === 0 &&
  missingDescriptions.length === 0
) {
  console.log("load-manifest OK");
  process.exit(0);
}

if (missingPaths.length > 0) {
  console.error("Missing manifest paths:");
  for (const file of missingPaths) {
    console.error(`- ${file}`);
  }
}

if (uncoveredReferences.length > 0) {
  console.error("Untracked reference files:");
  for (const file of uncoveredReferences) {
    console.error(`- ${file}`);
  }
}

if (uncoveredTemplates.length > 0) {
  console.error("Untracked template files:");
  for (const file of uncoveredTemplates) {
    console.error(`- ${file}`);
  }
}

if (invalidSkillReferences.length > 0) {
  console.error("Invalid SKILL.md file references:");
  for (const file of invalidSkillReferences) {
    console.error(`- ${file}`);
  }
}

if (undocumentedCheckpoints.length > 0) {
  console.error("Checkpoint reasons missing from SKILL.md:");
  for (const checkpoint of undocumentedCheckpoints) {
    console.error(`- ${checkpoint}`);
  }
}

if (missingDescriptions.length > 0) {
  console.error("Bundles missing description field:");
  for (const key of missingDescriptions) {
    console.error(`- ${key}`);
  }
}

process.exit(1);
