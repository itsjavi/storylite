# Contributing Guide

Thanks for your interest to contribute to this project. Please take a moment and read through this
guide:

## Repository

- We use Node v18 or v20 and the `pnpm` package manager.
- This project is a monorepo using `pnpm` workspaces.
- We use [Convention Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit
  messages.

## Developing

The different packages can be found in `packages/*`, and that's where you'll be mainly working.

### Quick Start

Here are the basic commands you'll need to get started:

```sh

# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Build dist files
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint
pnpm lint

# Format (format + lint --fix)
pnpm format

# Type check
pnpm type-check

# Run all quality checks (formatter-check, type-check, lint, build, publint, test)
pnpm quality-checks

```

## Testing

We use `jest` to run tests. You can run all tests with:

```sh
pnpm test
```

Tests ending with `*.test.tsx` or `*.dom.test.ts` are considered browser tests and will be run in a
browser-like environment using `jsdom`.

Tests ending with `*.test.ts` (except `*.dom.test.ts`) are considered universal tests and will be
run in both `node` and `jsdom` environments.
