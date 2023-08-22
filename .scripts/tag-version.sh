#!/usr/bin/env sh

# Check if there are changes in package.json & **/package.json
if git diff --quiet --exit-code -- package.json '**/package.json'; then
  echo "Error: None of the package.json files have been changed."
  exit 1
fi

CURRENT_VERSION=$(node .scripts/get-semver.cjs current)
# FIRST_TAG=$(git tag | sort -V | head -n 1)

echo "Current Version: ${CURRENT_VERSION}"

# Prepend content to CHANGELOG.md
existing_CHANGELOG=$(cat CHANGELOG.md)
new_CHANGELOG=$(pnpm exec changelogen -r "${CURRENT_VERSION}")

echo "${new_CHANGELOG}\n${existing_CHANGELOG}" > CHANGELOG.md

# Create a new commit and tag with the current version
git add CHANGELOG.md package.json **/package.json pnpm-lock.yaml
git commit -m "chore(release): bump version to v${CURRENT_VERSION}" || exit 1
git tag -a "v${CURRENT_VERSION}" -m "v${CURRENT_VERSION}" || exit 1
