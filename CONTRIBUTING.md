# Contributing

Thanks for taking the time to contribute.

## Requirements

- Node.js 24 or newer.
- pnpm 11 or greater. The exact version is recorded in `package.json`.

Install dependencies from the repository root:

```sh
pnpm install
```

## Repository Layout

- `packages/*`: published StoryLite packages and renderer adapters.
- `apps/web`: the StoryLite demo site published to GitHub Pages.
- `apps/e2e`: Playwright end-to-end tests.
- `demos/*`: framework demos for HTML, React, Svelte, Vue, and Solid.

## Common Commands

```sh
# Start every dev server
pnpm dev

# Start only the web demo
pnpm dev:web

# Build everything
pnpm build

# Build packages only
pnpm build:packages

# Build the web demo only
pnpm build:web

# Typecheck all workspaces
pnpm typecheck

# Check formatting
pnpm format:check

# Format files
pnpm format

# Run unit tests
pnpm test

# Run Playwright e2e tests
pnpm test:e2e

# Run the full local QA sequence
pnpm qa
```

## Testing

Unit tests use Vitest. End-to-end tests use Playwright.

Before running e2e tests for the first time, install Chromium:

```sh
pnpm -F @storylite/e2e run e2e:install
```

Run package-specific scripts with pnpm filters when you only need one workspace:

```sh
pnpm -F @storylite/web run test
pnpm -F @storylite/storylite run typecheck
```

## Testing Local Package Changes in Consumer Projects

Use packed tarballs when you need someone to test a branch in their own app before publishing a
StoryLite release. This is closer to the published package shape than `pnpm link` because it uses
the same `files`, `bin`, `exports`, and built `dist` output that npm receives.

From this repository:

```sh
pnpm install
pnpm build:packages

rm -rf /tmp/storylite-local-packages
mkdir -p /tmp/storylite-local-packages

for package in contracts preview-host storylite renderer-react; do
  (cd "packages/$package" && pnpm pack --pack-destination /tmp/storylite-local-packages)
done
```

Pack `renderer-preact`, `renderer-svelte`, `renderer-vue`, or `renderer-solid` instead of
`renderer-react` when the consumer app uses one of those adapters.

In the consumer project, install the tarballs and force StoryLite transitive dependencies to the
same local build. Use absolute `file:` paths. The `<version>` placeholder in this example is the
current version from each package's `package.json`:

```yaml
# pnpm-workspace.yaml
overrides:
  '@storylite/contracts': file:/tmp/storylite-local-packages/storylite-contracts-<version>.tgz
  '@storylite/preview-host': file:/tmp/storylite-local-packages/storylite-preview-host-<version>.tgz
  '@storylite/storylite': file:/tmp/storylite-local-packages/storylite-storylite-<version>.tgz
  '@storylite/renderer-react': file:/tmp/storylite-local-packages/storylite-renderer-react-<version>.tgz
```

Then install and run the consumer project's normal StoryLite commands:

```sh
pnpm install --force
pnpm storylite
pnpm storylite:build
```

If the consumer app does not already depend on the renderer adapter, add the same tarball as a dev
dependency:

```sh
pnpm add -D file:/tmp/storylite-local-packages/storylite-renderer-react-<version>.tgz
```

After changing this repository again, rebuild and repack the tarballs, then rerun
`pnpm install --force` in the consumer project so pnpm refreshes packages with the same version
number.

## Publishing

Create a single release version commit and tag from the root:

```sh
pnpm pkg:version patch
pnpm pkg:version minor
pnpm pkg:version major
pnpm pkg:version 1.2.3
```

The command runs `pnpm version` in `@storylite/storylite`, then syncs the resolved version to the
other public packages before pnpm creates the release commit and tag.

## Commits

Use Conventional Commit messages:

```txt
feat(renderer-react): add static story rendering
fix(cli): preserve configured base path in static output
docs(readme): update install instructions
```
