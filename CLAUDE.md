# CLAUDE.md

## Release Rules

When publishing a new `cc-design` release, always update the root `VERSION` file in the same change.

Minimum release checklist:

1. Update `VERSION`
2. Sync version in `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `plugins/cc-design/.claude-plugin/plugin.json`, and `plugins/cc-design/.codex-plugin/plugin.json` with `VERSION`
3. Follow [docs/plugin-publishing.md](/Users/zhengjianqiao/workspace/cc-design/docs/plugin-publishing.md) for marketplace target and release package structure
4. Update user-facing docs if the install or upgrade flow changed
5. If first-turn behavior changed, keep `SKILL.md`, `README.md`, and `references/workflow.md` aligned in the same change
6. If the release checklist itself changed, update `CLAUDE.md` in the same change
7. Merge the release change so `ccdesign-update-check` can see the new remote version

If `VERSION` is not bumped, users will not see an upgrade prompt even if the repository changed.

Behavior-change gate:

Run this before merging any PR that changes first-turn behavior:

```bash
./scripts/check-behavior-contract.sh <base-ref>
```

It must fail if behavior-contract files change without a `VERSION` bump.
