# CLAUDE.md

## Release Rules

When publishing a new `cc-design` release, always update the root `VERSION` file in the same change.

Minimum release checklist:

1. Update `VERSION`
2. Update user-facing docs if the install or upgrade flow changed
3. Merge the release change so `ccdesign-update-check` can see the new remote version

If `VERSION` is not bumped, users will not see an upgrade prompt even if the repository changed.
