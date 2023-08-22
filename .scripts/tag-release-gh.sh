#!/usr/bin/env sh

# docs: https://cli.github.com/manual/gh_release_create

# CURR_VERSION=$(node .scripts/get-semver.cjs current)
# gh release create v${CURR_VERSION} --generate-notes --verify-tag --title "v${CURR_VERSION}" --draft

pnpm exec changelogen gh release
