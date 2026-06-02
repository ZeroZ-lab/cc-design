import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const rootDir = path.resolve(scriptDir, "..");
const manifestPath = path.join(rootDir, "load-manifest.json");

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

function printGroup(title, entries) {
  if (!entries || Object.keys(entries).length === 0) {
    return;
  }

  console.log(`# ${title}`);

  for (const [name, config] of Object.entries(entries)) {
    const description = config.description ?? "(no description)";
    console.log(`${name} | ${description}`);
  }

  console.log("");
}

printGroup("defaults", manifest.defaults);
printGroup("taskTypes", manifest.taskTypes);
printGroup("checkpoints", manifest.checkpoints);
printGroup("optionalInspirations", manifest.optionalInspirations);
