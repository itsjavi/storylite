# Contributing Guide

Thanks for your interest to contribute to this project. Please take a moment and read through this guide:

## Repository

This project is a monorepo using turbo and pnpm workspaces. We use Node v18 or v20.
The package manager used to install and link dependencies must be [pnpm v8](https://pnpm.io/).

It can be installed as:

```sh
npm install -g pnpm@8
```

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

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check

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
