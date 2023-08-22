#!/usr/bin/env sh

# Check if there are uncommitted changes
if [ -n "$(git status -s)" ]; then
  echo "Error: There are uncommitted changes in the repository."
  exit 1
fi

node .scripts/set-version.cjs "$(node .scripts/get-semver.cjs ${1:-"patch"})" || exit 1
node .scripts/match-versions.cjs || exit 1
