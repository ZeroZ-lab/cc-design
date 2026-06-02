import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const rootDir = path.resolve(scriptDir, "..");
const pluginName = "cc-design";
const packageDir = `plugins/${pluginName}`;

const checks = [];

async function readJson(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  return JSON.parse(await fs.readFile(absolutePath, "utf8"));
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(rootDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

function assert(condition, message) {
  checks.push({ ok: condition, message });
}

function assertAllSkillsUsePrefix(skills, prefix, label) {
  assert(Array.isArray(skills), `${label} must be an array`);
  if (!Array.isArray(skills)) {
    return;
  }
  for (const skillPath of skills) {
    assert(
      typeof skillPath === "string" && skillPath.startsWith(prefix),
      `${label} entries must start with ${prefix}: ${skillPath}`
    );
  }
}

const rootCodexManifestPath = ".codex-plugin/plugin.json";
const rootClaudeManifestPath = ".claude-plugin/plugin.json";
const codexMarketplacePath = ".agents/plugins/marketplace.json";
const claudeMarketplacePath = ".claude-plugin/marketplace.json";
const packageCodexManifestPath = `plugins/${pluginName}/.codex-plugin/plugin.json`;
const packageClaudeManifestPath = `plugins/${pluginName}/.claude-plugin/plugin.json`;
const packageSkillPath = `plugins/${pluginName}/skills/${pluginName}/SKILL.md`;

assert(await exists(rootCodexManifestPath), `${rootCodexManifestPath} exists`);
assert(await exists(rootClaudeManifestPath), `${rootClaudeManifestPath} exists`);
assert(await exists(codexMarketplacePath), `${codexMarketplacePath} exists`);
assert(await exists(claudeMarketplacePath), `${claudeMarketplacePath} exists`);
assert(await exists(`skills/${pluginName}/SKILL.md`), `skills/${pluginName}/SKILL.md exists`);
assert(await exists(packageDir), `${packageDir} exists`);
assert(await exists(packageCodexManifestPath), `${packageCodexManifestPath} exists`);
assert(await exists(packageClaudeManifestPath), `${packageClaudeManifestPath} exists`);
assert(await exists(packageSkillPath), `${packageSkillPath} exists`);

for (const runtimePath of [
  "VERSION",
  "load-manifest.json",
  "references",
  "templates",
  "scripts",
  "hooks",
  "hooks-lib",
  "assets",
  "agents"
]) {
  assert(
    await exists(`plugins/${pluginName}/${runtimePath}`),
    `plugins/${pluginName}/${runtimePath} exists`
  );
}

const codexMarketplace = await readJson(codexMarketplacePath);
const claudeMarketplace = await readJson(claudeMarketplacePath);
const rootCodexManifest = await readJson(rootCodexManifestPath);
const rootClaudeManifest = await readJson(rootClaudeManifestPath);
const packageCodexManifest = await readJson(packageCodexManifestPath);
const packageClaudeManifest = await readJson(packageClaudeManifestPath);

assert(
  codexMarketplace.plugins?.[0]?.source?.path === "./plugins/cc-design",
  'Codex marketplace source.path must equal "./plugins/cc-design"'
);
assert(
  claudeMarketplace.plugins?.[0]?.source === "./plugins/cc-design",
  'Claude marketplace source must equal "./plugins/cc-design"'
);

assert(rootCodexManifest.skills === "./skills", 'Root Codex manifest skills must equal "./skills"');
assert(packageCodexManifest.skills === "./skills", 'Package Codex manifest skills must equal "./skills"');

assertAllSkillsUsePrefix(rootClaudeManifest.skills, "./skills/", "Root Claude manifest skills");
assertAllSkillsUsePrefix(packageClaudeManifest.skills, "./skills/", "Package Claude manifest skills");

const version = (await fs.readFile(path.join(rootDir, "VERSION"), "utf8")).trim();
assert(rootCodexManifest.version === version, "Root Codex manifest version matches VERSION");
assert(rootClaudeManifest.version === version, "Root Claude manifest version matches VERSION");
assert(packageCodexManifest.version === version, "Package Codex manifest version matches VERSION");
assert(packageClaudeManifest.version === version, "Package Claude manifest version matches VERSION");

const rootSkill = await fs.readFile(path.join(rootDir, "SKILL.md"), "utf8");
const copiedRootSkill = await fs.readFile(path.join(rootDir, `skills/${pluginName}/SKILL.md`), "utf8");
const packagedSkill = await fs.readFile(path.join(rootDir, packageSkillPath), "utf8");

assert(copiedRootSkill === rootSkill, "skills/cc-design/SKILL.md matches root SKILL.md");
assert(packagedSkill === rootSkill, "Packaged SKILL.md matches root SKILL.md");

const failures = checks.filter((check) => !check.ok);
if (failures.length > 0) {
  console.error("Plugin package validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.message}`);
  }
  process.exit(1);
}

console.log(`Plugin package validation passed for ${pluginName}.`);
