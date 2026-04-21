#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-origin/master}"

if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  echo "ERROR: base ref '$BASE_REF' does not exist" >&2
  exit 1
fi

changed_files="$(git diff --name-only "$BASE_REF"...HEAD)"

if [ -z "$changed_files" ]; then
  exit 0
fi

behavior_changed=false
for path in SKILL.md README.md references/workflow.md; do
  if printf '%s\n' "$changed_files" | rg -qx "$path"; then
    behavior_changed=true
    break
  fi
done

if [ "$behavior_changed" = false ]; then
  exit 0
fi

if ! printf '%s\n' "$changed_files" | rg -qx 'VERSION'; then
  echo "ERROR: VERSION must change when behavior-contract files change" >&2
  exit 1
fi

required_contract_files=(
  "SKILL.md"
  "README.md"
  "references/workflow.md"
)

missing_files=()
for path in "${required_contract_files[@]}"; do
  if ! printf '%s\n' "$changed_files" | rg -qx "$path"; then
    missing_files+=("$path")
  fi
done

if [ "${#missing_files[@]}" -gt 0 ]; then
  printf 'ERROR: behavior-contract changes must update all contract files together. Missing:%s\n' "" >&2
  for path in "${missing_files[@]}"; do
    printf '  - %s\n' "$path" >&2
  done
  exit 1
fi

exit 0
