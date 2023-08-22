#!/usr/bin/env sh

# docs: https://cli.github.com/manual/gh_release_view

CURR_VERSION=$(node .scripts/get-semver.cjs current)
gh release view v${CURR_VERSION} --jq .body --json body >> CHANGELOG.md
